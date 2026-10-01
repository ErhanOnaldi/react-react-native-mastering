import { FavoriteButton } from './FavoriteButton'
export default function Preview() {
  return (
    <div className="flex gap-3 p-4">
      <FavoriteButton active={false} />
      <FavoriteButton active />
      <FavoriteButton active={false} disabled />
    </div>
  )
}
