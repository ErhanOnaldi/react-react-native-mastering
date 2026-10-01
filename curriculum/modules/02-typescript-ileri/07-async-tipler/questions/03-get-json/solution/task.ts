export async function getJson<T>(text: string): Promise<T> {
  return JSON.parse(text) as T
}
