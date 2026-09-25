import { useState } from 'react'
import { MovieGrid } from './components/MovieGrid'
import { SearchBox } from './components/SearchBox'
import { appTitle } from './config'
import { sampleMovies } from './data/sample-movies'
import { useFavorites } from './context/FavoritesContext'
import { useDebounce } from './hooks/useDebounce'

function App() {
  const [query, setQuery] = useState('')
  const { favoriteIds, toggleFavorite } = useFavorites()
  const debouncedQuery = useDebounce(query, 200)
  const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase('tr-TR')
  const movies = sampleMovies.filter((movie) =>
    movie.title.toLocaleLowerCase('tr-TR').includes(normalizedQuery),
  )

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
