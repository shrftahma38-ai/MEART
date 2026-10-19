import { Router } from 'express';
import { query } from '../db.js';
import { mapProperty, PROPERTY_COLUMNS, type PropertyRow } from '../mappers.js';

export const propertiesRouter = Router();

const SORTS: Record<string, string> = {
  featured: 'p.featured desc, p.sort_order asc',
  'price-asc': 'p.price asc',
  'price-desc': 'p.price desc',
  'size-desc': 'p.sqft desc',
  newest: 'p.year_built desc nulls last, p.sort_order asc',
};

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asNumber(value: unknown): number | undefined {
  const raw = asString(value);
  if (raw === undefined) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** GET /api/properties — search, filter, sort and paginate the catalogue. */
propertiesRouter.get('/', async (req, res, next) => {
  try {
    const params: unknown[] = [];
    const where: string[] = [];

    const search = asString(req.query.search);
    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      where.push(
        `(p.name ilike $${i} or p.city ilike $${i} or p.state ilike $${i} or p.description ilike $${i})`,
      );
    }

    const location = asString(req.query.location);
    if (location) {
      params.push(location);
      where.push(`p.state = $${params.length}`);
    }

    const type = asString(req.query.type);
    if (type) {
      params.push(type);
      where.push(`p.type = $${params.length}`);
    }

    const minPrice = asNumber(req.query.minPrice);
    if (minPrice !== undefined) {
      params.push(minPrice);
      where.push(`p.price >= $${params.length}`);
    }

    const maxPrice = asNumber(req.query.maxPrice);
    if (maxPrice !== undefined) {
      params.push(maxPrice);
      where.push(`p.price <= $${params.length}`);
    }

    const beds = asNumber(req.query.beds);
    if (beds !== undefined) {
      params.push(beds);
      where.push(`p.bedrooms >= $${params.length}`);
    }

    const baths = asNumber(req.query.baths);
    if (baths !== undefined) {
      params.push(baths);
      where.push(`p.bathrooms >= $${params.length}`);
    }

    if (req.query.featured === 'true') {
      where.push('p.featured = true');
    }

    const orderBy = SORTS[asString(req.query.sort) ?? 'featured'] ?? SORTS.featured;
    const clause = where.length > 0 ? `where ${where.join(' and ')}` : '';
    const limit = Math.min(Math.max(asNumber(req.query.limit) ?? 60, 1), 100);
    const offset = Math.max(asNumber(req.query.offset) ?? 0, 0);

    const [list, count, facets] = await Promise.all([
      query<PropertyRow>(
        `select ${PROPERTY_COLUMNS} from properties p ${clause} order by ${orderBy} limit ${limit} offset ${offset}`,
        params,
      ),
      query<{ count: string }>(`select count(*)::text as count from properties p ${clause}`, params),
      query<{ states: string[]; types: string[]; min: string; max: string }>(
        `select
           (select array_agg(distinct state order by state) from properties) as states,
           (select array_agg(distinct type order by type) from properties) as types,
           (select min(price) from properties) as min,
           (select max(price) from properties) as max`,
      ),
    ]);

    const facetRow = facets.rows[0];

    res.json({
      items: list.rows.map(mapProperty),
      total: Number(count.rows[0]?.count ?? 0),
      facets: {
        locations: facetRow?.states ?? [],
        types: facetRow?.types ?? [],
        minPrice: Number(facetRow?.min ?? 0),
        maxPrice: Number(facetRow?.max ?? 0),
      },
    });
  } catch (error) {
    next(error);
  }
});

/** GET /api/properties/:slug — one property with its agent. */
propertiesRouter.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await query<PropertyRow>(
      `select ${PROPERTY_COLUMNS} from properties p where p.slug = $1`,
      [req.params.slug],
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    const property = mapProperty(rows[0]);
    const agent = property.agentId
      ? (
          await query(
            `select id, slug, name, role, phone, email, photo, bio, linkedin from agents where id = $1`,
            [property.agentId],
          )
        ).rows[0] ?? null
      : null;

    res.json({
      property: {
        ...property,
        agent: agent
          ? {
              id: agent.id,
              slug: agent.slug,
              name: agent.name,
              role: agent.role,
              phone: agent.phone,
              email: agent.email,
              photo: agent.photo,
              bio: agent.bio,
              linkedin: agent.linkedin,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

/** GET /api/properties/:slug/similar — same market first, then same type. */
propertiesRouter.get('/:slug/similar', async (req, res, next) => {
  try {
    const { rows } = await query<PropertyRow>(
      `select ${PROPERTY_COLUMNS} from properties p where p.slug = $1`,
      [req.params.slug],
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    const current = rows[0];
    const { rows: similar } = await query<PropertyRow>(
      `select ${PROPERTY_COLUMNS} from properties p
       where p.id <> $1 and (p.state = $2 or p.type = $3)
       order by (p.state = $2) desc, abs(p.price - $4) asc
       limit 3`,
      [current.id, current.state, current.type, current.price],
    );

    res.json({ items: similar.map(mapProperty) });
  } catch (error) {
    next(error);
  }
});
