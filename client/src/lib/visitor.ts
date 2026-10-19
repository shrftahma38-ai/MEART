const STORAGE_KEY = 'horizon.visitor-id';

/**
 * Anonymous, stable visitor id so saved properties persist without an account.
 * Matches the validation on the API (`[A-Za-z0-9_-]{8,64}`).
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server-side-visitor';

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && /^[A-Za-z0-9_-]{8,64}$/.test(existing)) return existing;

    const generated =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '')
        : `v${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

    window.localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  } catch {
    return `fallback${Date.now().toString(36)}`;
  }
}
