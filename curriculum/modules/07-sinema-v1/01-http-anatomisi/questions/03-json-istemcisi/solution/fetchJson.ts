export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const response = await fetch(url, init)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  if (response.status === 204) return null
  return (await response.json()) as T
}
