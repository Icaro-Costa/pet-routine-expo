import { useAuthStore } from '../store/use-auth-store';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

function isApiErrorPayload(payload: unknown): payload is { error: string } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof payload.error === 'string'
  );
}

async function readPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text === '' ? null : text;
}

function createUrl(path: string): string {
  const normalizedBase = BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Centralizes JSON requests and the session-expiration behavior required by the app.
 * `T` is supplied by the endpoint's documented response contract at each call site.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers: initialHeaders, ...requestOptions } = options;
  const headers = new Headers(initialHeaders);
  const token = useAuthStore.getState().sessionToken;

  headers.set('Accept', 'application/json');
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(createUrl(path), {
    ...requestOptions,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await readPayload(response);

  if (response.status === 401 || response.status === 403) {
    useAuthStore.getState().clearSession();
  }

  if (!response.ok) {
    const message = isApiErrorPayload(payload)
      ? payload.error
      : 'Não foi possível concluir a solicitação. Tente novamente.';
    throw new Error(message);
  }

  // The API response is typed at the call site; this is the single boundary cast after JSON parsing.
  return payload as T;
}
