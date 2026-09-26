import { useState } from 'react'
import { FavoriteButton } from './FavoriteButton'
export default function Preview() {
  const [favorite, setFavorite] = useState(false)
  return (
    <div>
      <p>Film: Dövüş Kulübü</p>
      <FavoriteButton isFavorite={favorite} onToggle={() => setFavorite((value) => !value)} />
    </div>
  )
}
