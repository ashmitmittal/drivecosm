// Tiny typed wrapper around fetch. Every backend endpoint speaks JSON and
// reports failures as an { error } body; if the backend can't be reached at
// all, the wrapper resolves to an { error } object too — it never throws, so
// callers handle exactly one failure shape.

const BACKEND_DOWN = 'Could not reach the DriveCosm backend — is it still running?'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, init)
    return (await res.json()) as T
  } catch {
    return { error: BACKEND_DOWN } as T
  }
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  postForm: <T>(url: string, form: FormData) => request<T>(url, { method: 'POST', body: form }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
}

/** Starts the Google OAuth flow by navigating away, or reports why it can't. */
export async function connectGoogleAccount(onError: (message: string) => void): Promise<void> {
  const data = await api.get<{ url?: string; error?: string }>('/api/auth/url')
  if (data.url) window.location.href = data.url
  else onError(data.error || 'Could not start the Google sign-in flow.')
}
