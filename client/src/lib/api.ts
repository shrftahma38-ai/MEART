const BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
};

export async function api<T = unknown>(path: string, options: Options = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;
  const isForm = body instanceof FormData;
  const response = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    signal,
    headers: isForm || body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? (body as FormData) : body === undefined ? undefined : JSON.stringify(body),
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(payload?.error || 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.', response.status);
  }
  return payload as T;
}

export const errMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'خطای نامشخص رخ داد. لطفاً دوباره تلاش کنید.';
