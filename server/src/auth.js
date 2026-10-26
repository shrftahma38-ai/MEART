import jwt from 'jsonwebtoken';
import { prisma } from './db.js';
import { unauthorized, forbidden } from './util.js';

const SECRET = process.env.JWT_SECRET || 'arabzadeh-dev-secret-change-me';
const COOKIE = 'az_auth';
const MAX_AGE = 1000 * 60 * 60 * 24 * 30;

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: MAX_AGE,
  path: '/',
});

export function signIn(res, user) {
  const token = jwt.sign({ uid: user.id }, SECRET, { expiresIn: '30d' });
  res.cookie(COOKIE, token, cookieOptions());
}

export function signOut(res) {
  res.clearCookie(COOKIE, { path: '/' });
}

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});

/** Loads the signed-in user from the database on every request so the role is never stale. */
export async function currentUser(req) {
  const token = req.cookies?.[COOKIE];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.uid } });
    return user ? publicUser(user) : null;
  } catch {
    return null;
  }
}

export async function attachUser(req, _res, next) {
  req.user = await currentUser(req);
  next();
}

export async function requireAuth(req, _res, next) {
  if (!req.user) return next(unauthorized());
  next();
}

export async function requireAdmin(req, _res, next) {
  if (!req.user) return next(unauthorized());
  if (req.user.role !== 'ADMIN') return next(forbidden());
  next();
}

export { publicUser };
