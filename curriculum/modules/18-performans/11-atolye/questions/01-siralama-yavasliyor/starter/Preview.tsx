import { MovieCatalog } from './MovieCatalog'

export default function Preview() {
  return (
    <div>
      <p>
        Bir filmi favorile, sonra arama kutusuna yaz veya "Sırala"ya bas; favori hangi filmde
        kalıyor?
      </p>
      <MovieCatalog />
    </div>
  )
}
