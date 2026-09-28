export type Venue = { id: number; name: string; address: string | null }

export function isVenue(value: unknown): value is Venue {
  if (value === null) return true
  if (typeof value !== 'object' || Array.isArray(value)) return false
  if (!('id' in value) || !('name' in value) || !('address' in value)) return false
  return (
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    (typeof value.address === 'string' || value.address === null)
  )
}
