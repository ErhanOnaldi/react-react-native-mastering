import { VirtualMovies } from './VirtualMovies'
const movies = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  title: i === 0 ? 'Dövüş Kulübü' : `Film ${i + 1}`,
}))
export default function Preview() {
  return (
    <>
      <p>500 film, kaydırma alanında yalnız görünür satırlar</p>
      <VirtualMovies movies={movies} />
    </>
  )
}
