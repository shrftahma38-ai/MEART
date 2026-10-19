import { pool } from '../db.js';
import { agents, properties } from './data.js';

/**
 * Loads the marketing catalogue. Idempotent: rows are upserted by slug, so
 * ids (and therefore saved favourites) survive re-seeding.
 */
async function seed() {
  const client = await pool.connect();
  try {
    await client.query('begin');

    const agentIds = new Map<string, number>();
    for (const agent of agents) {
      const { rows } = await client.query<{ id: number }>(
        `insert into agents (slug, name, role, phone, email, photo, bio, linkedin)
         values ($1, $2, $3, $4, $5, $6, $7, $8)
         on conflict (slug) do update set
           name = excluded.name,
           role = excluded.role,
           phone = excluded.phone,
           email = excluded.email,
           photo = excluded.photo,
           bio = excluded.bio,
           linkedin = excluded.linkedin
         returning id`,
        [agent.slug, agent.name, agent.role, agent.phone, agent.email, agent.photo, agent.bio, agent.linkedin],
      );
      agentIds.set(agent.slug, rows[0].id);
    }

    for (const [index, property] of properties.entries()) {
      await client.query(
        `insert into properties (
           slug, name, city, state, country, price, price_label, type, status,
           bedrooms, bathrooms, sqft, lot_size, year_built, garage, description,
           features, amenities, images, featured, agent_id, sort_order
         ) values (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
           $16, $17::jsonb, $18::jsonb, $19::jsonb, $20, $21, $22
         )
         on conflict (slug) do update set
           name = excluded.name,
           city = excluded.city,
           state = excluded.state,
           country = excluded.country,
           price = excluded.price,
           price_label = excluded.price_label,
           type = excluded.type,
           status = excluded.status,
           bedrooms = excluded.bedrooms,
           bathrooms = excluded.bathrooms,
           sqft = excluded.sqft,
           lot_size = excluded.lot_size,
           year_built = excluded.year_built,
           garage = excluded.garage,
           description = excluded.description,
           features = excluded.features,
           amenities = excluded.amenities,
           images = excluded.images,
           featured = excluded.featured,
           agent_id = excluded.agent_id,
           sort_order = excluded.sort_order`,
        [
          property.slug,
          property.name,
          property.city,
          property.state,
          property.country,
          property.price,
          property.priceLabel,
          property.type,
          property.status,
          property.bedrooms,
          property.bathrooms,
          property.sqft,
          property.lotSize,
          property.yearBuilt,
          property.garage,
          property.description,
          JSON.stringify(property.features),
          JSON.stringify(property.amenities),
          JSON.stringify(property.images),
          property.featured,
          agentIds.get(property.agent) ?? null,
          index,
        ],
      );
    }

    const slugs = properties.map((property) => property.slug);
    const removed = await client.query('delete from properties where slug <> all($1::text[])', [slugs]);

    await client.query('commit');
    console.log(
      `[seed] ${properties.length} properties, ${agents.length} agents (removed ${removed.rowCount} stale)`,
    );
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error('[seed] failed', error);
  process.exit(1);
});
