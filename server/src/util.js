export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (msg) => new HttpError(400, msg);
export const unauthorized = (msg = 'برای انجام این کار باید وارد حساب خود شوید.') => new HttpError(401, msg);
export const forbidden = (msg = 'دسترسی به این بخش مجاز نیست.') => new HttpError(403, msg);
export const notFound = (msg = 'موردی یافت نشد.') => new HttpError(404, msg);

/** wraps async route handlers so thrown errors reach the error middleware */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** parses a request body with a zod schema, producing a Persian error message */
export function parseBody(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const first = result.error.issues[0];
    throw badRequest(first?.message || 'اطلاعات ارسالی معتبر نیست.');
  }
  return result.data;
}

/** Persian digits keep messages readable in the UI */
export const toFa = (value) => String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export function orderNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AZ-${stamp}-${rand}`;
}

export const slugify = (text) =>
  String(text)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-');
