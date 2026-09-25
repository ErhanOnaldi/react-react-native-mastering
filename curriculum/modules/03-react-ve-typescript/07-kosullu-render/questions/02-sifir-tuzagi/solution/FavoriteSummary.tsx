export function FavoriteSummary({ count }: { count: number }) {
  return <div>{count > 0 ? <p>{count} favori</p> : <p>Henüz favori yok</p>}</div>
}
