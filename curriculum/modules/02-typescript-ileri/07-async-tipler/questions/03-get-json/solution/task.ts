export async function getJson<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error(`TMDB isteği başarısız: ${response.status}`)
  return (await response.json()) as T
}
