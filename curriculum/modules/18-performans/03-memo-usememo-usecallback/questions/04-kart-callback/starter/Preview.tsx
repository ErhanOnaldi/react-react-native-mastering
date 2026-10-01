import { useRef } from 'react'
import { FavoriteCards } from './FavoriteCards'
export default function Preview() {
  const renders = useRef(0)
  const countRef = useRef<HTMLSpanElement>(null)
  return (
    <div>
      <p>
        Kart render: <span ref={countRef}>0</span>
      </p>
      <FavoriteCards
        titles={['Dövüş Kulübü', 'Matrix', 'Başlangıç']}
        onCardRender={() => {
          renders.current++
          queueMicrotask(() => {
            if (countRef.current) countRef.current.textContent = String(renders.current)
          })
        }}
      />
    </div>
  )
}
