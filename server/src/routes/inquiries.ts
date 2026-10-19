import { Router } from 'express';
import { query } from '../db.js';

export const inquiriesRouter = Router();

const KINDS = new Set(['contact', 'viewing', 'newsletter', 'valuation']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * POST /api/inquiries — contact messages, viewing requests and newsletter sign-ups.
 * Everything is validated here and stored, so the forms do real work.
 */
inquiriesRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const kind = typeof body.kind === 'string' && KINDS.has(body.kind) ? body.kind : 'contact';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const rawName = typeof body.name === 'string' ? body.name.trim() : '';
    const name = rawName.length > 0 ? rawName : kind === 'newsletter' ? 'Newsletter subscriber' : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : null;
    const message = typeof body.message === 'string' ? body.message.trim() : null;
    const slug = typeof body.propertySlug === 'string' ? body.propertySlug.trim() : '';
    const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : '';

    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = 'Please tell us your name';
    if (!EMAIL.test(email)) errors.email = 'Please enter a valid email address';

    if (Object.keys(errors).length > 0) {
      res.status(422).json({ error: 'Validation failed', fields: errors });
      return;
    }

    let propertyId: number | null = null;
    if (slug) {
      const { rows } = await query<{ id: number }>('select id from properties where slug = $1', [slug]);
      propertyId = rows[0]?.id ?? null;
    }

    const { rows } = await query<{ id: number }>(
      `insert into inquiries (kind, name, email, phone, message, property_id, preferred_date)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id`,
      [
        kind,
        name,
        email,
        phone && phone.length > 0 ? phone : null,
        message && message.length > 0 ? message : null,
        propertyId,
        /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ? preferredDate : null,
      ],
    );

    res.status(201).json({ ok: true, id: rows[0].id });
  } catch (error) {
    next(error);
  }
});
