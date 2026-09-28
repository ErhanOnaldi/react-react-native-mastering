export type Venue = { id: number; name: string; address: string | null }

export function isVenue(value: unknown): value is Venue {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  if (!('id' in value) || !('name' in value) || !('address' in value)) return false
  return (
    typeof value.id === 'number' &&
    (typeof value.name === 'string' || value.name === 0) &&
    (typeof value.address === 'string' || value.address === null)
  )
}
