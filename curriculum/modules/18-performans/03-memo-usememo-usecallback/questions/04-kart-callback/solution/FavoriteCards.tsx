import { memo, useCallback, useState } from 'react'
const Card = memo(function Card({
  title,
  onRender,
  onFavorite,
}: {
  title: string
  onRender: (title: string) => void
  onFavorite: (title: string) => void
}) {
  onRender(title)
  return <button onClick={() => onFavorite(title)}>{title}</button>
})
export function FavoriteCards({
  titles,
  onCardRender,
}: {
  titles: string[]
  onCardRender: (title: string) => void
}) {
  const [count, setCount] = useState(0)
  const [favorite, setFavorite] = useState('')
  const onFavorite = useCallback((title: string) => setFavorite(title), [])
  return (
    <section>
      <button onClick={() => setCount((n) => n + 1)}>Sayaç {count}</button>
      <p>Favori: {favorite}</p>
      {titles.map((title) => (
        <Card key={title} title={title} onRender={onCardRender} onFavorite={onFavorite} />
      ))}
    </section>
  )
}
