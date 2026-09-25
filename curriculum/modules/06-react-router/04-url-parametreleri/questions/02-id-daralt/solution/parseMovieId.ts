export function parseMovieId(id: string | undefined): number | null {
  if (!id || !/^\d+$/.test(id)) return null
  const number = Number(id)
  return Number.isSafeInteger(number) && number > 0 ? number : null
}
