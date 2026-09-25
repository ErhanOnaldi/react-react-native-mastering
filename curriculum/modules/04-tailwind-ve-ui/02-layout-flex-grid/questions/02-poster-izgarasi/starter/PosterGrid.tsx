type Movie = { id: number; title: string }
export function PosterGrid({ movies }: { movies: Movie[] }) {
  return (
    <section aria-label="Filmler">
      {movies.map((movie) => (
        <article key={movie.id}>{movie.title}</article>
      ))}
    </section>
  )
}
