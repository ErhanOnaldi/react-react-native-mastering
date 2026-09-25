type Movie = { id: number; title: string }
export function PosterGrid({ movies }: { movies: Movie[] }) {
  return (
    <section aria-label="Filmler" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <article key={movie.id} className="min-w-0">
          {movie.title}
        </article>
      ))}
    </section>
  )
}
