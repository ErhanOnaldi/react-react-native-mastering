export function FavoriteSummary({ count }: { count: number }) {
  return <div>{count && <p>{count} favori</p>}</div>
}
