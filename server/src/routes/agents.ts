import { Router } from 'express';
import { query } from '../db.js';
import { mapAgent, type AgentRow } from '../mappers.js';

export const agentsRouter = Router();

/** GET /api/agents — the advisory team. */
agentsRouter.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query<AgentRow>(
      `select id, slug, name, role, phone, email, photo, bio, linkedin from agents order by id asc`,
    );
    res.json({ items: rows.map(mapAgent) });
  } catch (error) {
    next(error);
  }
});
