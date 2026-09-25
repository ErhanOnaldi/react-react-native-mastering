// Gerçek TMDB cevaplarından test/önizleme fixture'ları üretir.
// Kullanım: pnpm tsx scripts/fetch-tmdb-fixtures.ts  (kök .env içindeki VITE_TMDB_TOKEN kullanılır)
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

process.loadEnvFile(path.resolve(import.meta.dirname, '../.env'))
const token = process.env.VITE_TMDB_TOKEN
if (!token) throw new Error('VITE_TMDB_TOKEN bulunamadı (.env)')

const out = path.resolve(import.meta.dirname, '../curriculum/fixtures/tmdb')
const base = 'https://api.themoviedb.org/3'

async function get(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(base + endpoint)
  url.searchParams.set('language', 'tr-TR')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`${endpoint} → ${res.status}`)
  return res.json()
}

async function save(name: string, data: unknown) {
  await writeFile(path.join(out, `${name}.json`), JSON.stringify(data, null, 2) + '\n')
  console.log('✓', name)
}

await mkdir(out, { recursive: true })

await save('configuration', await get('/configuration'))
await save('genres', await get('/genre/movie/list'))
await save('trending-week', await get('/trending/movie/week'))
await save('popular-1', await get('/movie/popular', { page: '1' }))
await save('popular-2', await get('/movie/popular', { page: '2' }))
await save('discover-action-1', await get('/discover/movie', { with_genres: '28', page: '1' }))
await save('discover-comedy-1', await get('/discover/movie', { with_genres: '35', page: '1' }))

// Detay sayfaları: credits + videos ekli
for (const id of [550, 27205, 155, 157336, 603, 680]) {
  await save(
    `movie-${id}`,
    await get(`/movie/${id}`, { append_to_response: 'credits,videos' }).then(trimDetails),
  )
}

// Detayda kadroyu ilk 12 kişiyle, ekibi yönetmen/yazarla sınırla (fixture boyutu için)
function trimDetails(movie: {
  credits?: { cast: unknown[]; crew: { job: string }[] }
  videos?: { results: unknown[] }
}) {
  if (movie.credits) {
    movie.credits.cast = movie.credits.cast.slice(0, 12)
    movie.credits.crew = movie.credits.crew.filter((c) =>
      ['Director', 'Screenplay', 'Writer'].includes(c.job),
    )
  }
  if (movie.videos) movie.videos.results = movie.videos.results.slice(0, 4)
  return movie
}
