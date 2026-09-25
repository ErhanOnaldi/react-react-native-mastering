import { useState } from 'react'
export function FavoriteCards({
  titles,
  onCardRender,
}: {
  titles: string[]
  onCardRender: (title: string) => void
}) {
  const [count, setCount] = useState(0)
  return (
    <section>
      <button onClick={() => setCount((n) => n + 1)}>Sayaç {count}</button>
      {titles.map((title) => {
        onCardRender(title)
        return <p key={title}>{title}</p>
      })}
    </section>
  )
}
