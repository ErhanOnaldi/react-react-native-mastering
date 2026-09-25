export async function loadMovie(id: number, token: string): Promise<{ id: number; title: string }> {
  return { id, title: token }
}
export type LoadArgs = Parameters<typeof loadMovie>
export type LoadPromise = ReturnType<typeof loadMovie>
export type LoadedMovie = Awaited<LoadPromise>
export function describeLoad(args: LoadArgs): string {
  return ''
}
