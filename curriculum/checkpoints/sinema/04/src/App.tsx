import { useState } from 'react'
import { MovieGrid } from './components/MovieGrid'
import { SearchBox } from './components/SearchBox'
import { appTitle } from './config'
import { sampleMovies } from './data/sample-movies'

function App() {
  const [query, setQuery] = useState('')
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR')
  const movies = sampleMovies.filter((movie) =>
    movie.title.toLocaleLowerCase('tr-TR').includes(normalizedQuery),
  )

  function toggleFavorite(id: number) {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id],
    )
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold tracking-tight">{appTitle}</h1>
        <p className="mt-1 text-slate-400">Bugün ne izlesek?</p>
      </header>
      <SearchBox value={query} onChange={setQuery} />
      <MovieGrid movies={movies} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
    </main>
  )
}

export default App
