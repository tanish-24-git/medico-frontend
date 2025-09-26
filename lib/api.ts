"use client"

export function useBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001"
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init)
  if (!res.ok) {
    const t = await res.text().catch(() => "")
    throw new Error(t || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  get: async (path: string) => fetchJson(`${useBackendUrl()}${path}`),
  post: async (path: string, body: any) =>
    fetchJson(`${useBackendUrl()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  postForm: async (path: string, formData: FormData) =>
    fetchJson(`${useBackendUrl()}${path}`, {
      method: "POST",
      body: formData,
    }),
}
