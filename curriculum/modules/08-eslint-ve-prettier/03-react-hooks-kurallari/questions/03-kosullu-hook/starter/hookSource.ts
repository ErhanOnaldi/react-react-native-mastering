export const hookSource = `
export function MovieNotice({ id }: { id: string | null }) {
  return id ? <p>Film {id}</p> : <p>Film seç</p>
}
`
