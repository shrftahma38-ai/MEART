import { Router } from 'express';
import { query } from '../db.js';
import { mapProperty, PROPERTY_COLUMNS, type PropertyRow } from '../mappers.js';

export const favoritesRouter = Router();

/**
 * Saved properties are keyed by an anonymous visitor id the client generates and
 * keeps in localStorage — no account required, and it survives reloads.
 */
function visitorId(header: unknown): string | null {
  const value = typeof header === 'string' ? header.trim() : '';
  return /^[A-Za-z0-9_-]{8,64}$/.test(value) ? value : null;
}

function requireVisitor(req: { header: (name: string) => unknown }, res: import('express').Response) {
  const id = visitorId(req.header('x-visitor-id'));
  if (!id) {
    res.status(400).json({ error: 'A valid x-visitor-id header is required' });
    return null;
  }
  return id;
}

/** GET /api/favorites — the visitor's saved properties. */
favoritesRouter.get('/', async (req, res, next) => {
  try {
    const id = requireVisitor(req, res);
    if (!id) return;

    const { rows } = await query<PropertyRow>(
      `select ${PROPERTY_COLUMNS} from favorites f
       join properties p on p.id = f.property_id
       where f.visitor_id = $1
       order by f.created_at desc`,
      [id],
    );

    res.json({ items: rows.map(mapProperty) });
  } catch (error) {
    next(error);
  }
});

/** POST /api/favorites — save a property. */
favoritesRouter.post('/', async (req, res, next) => {
  try {
    const id = requireVisitor(req, res);
    if (!id) return;

    const propertyId = Number(req.body?.propertyId);
    if (!Number.isInteger(propertyId)) {
      res.status(400).json({ error: 'propertyId must be an integer' });
      return;
    }

    const { rows } = await query<{ id: number }>('select id from properties where id = $1', [propertyId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    await query(
      `insert into favorites (visitor_id, property_id) values ($1, $2)
       on conflict (visitor_id, property_id) do nothing`,
      [id, propertyId],
    );

    res.status(201).json({ saved: true, propertyId });
  } catch (error) {
    next(error);
  }
});

/** DELETE /api/favorites/:propertyId — remove a saved property. */
favoritesRouter.delete('/:propertyId', async (req, res, next) => {
  try {
    const id = requireVisitor(req, res);
    if (!id) return;

    const propertyId = Number(req.params.propertyId);
    if (!Number.isInteger(propertyId)) {
      res.status(400).json({ error: 'propertyId must be an integer' });
      return;
    }

    await query('delete from favorites where visitor_id = $1 and property_id = $2', [id, propertyId]);
    res.json({ saved: false, propertyId });
  } catch (error) {
    next(error);
  }
});
