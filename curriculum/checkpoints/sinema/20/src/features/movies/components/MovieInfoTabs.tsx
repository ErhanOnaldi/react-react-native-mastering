import type { MovieDetails } from '@/features/movies/types'
import { youtubeWatchUrl } from '@/features/movies/lib/trailer'
import { Tabs } from '@/shared/ui/tabs/Tabs'

export function MovieInfoTabs({ movie }: { movie: MovieDetails }) {
  const cast = movie.credits?.cast.slice(0, 10) ?? []
  const videos = (movie.videos?.results ?? []).filter(
    (video) => video.site === 'YouTube',
  )

  return (
    <Tabs defaultValue="summary">
      <Tabs.List aria-label="Film bilgileri">
        <Tabs.Trigger value="summary">Özet</Tabs.Trigger>
        <Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>
        {videos.length > 0 && (
          <Tabs.Trigger value="videos">Videolar</Tabs.Trigger>
        )}
      </Tabs.List>
      <Tabs.Panel value="summary" className="space-y-2">
        {movie.tagline && <p className="italic">{movie.tagline}</p>}
        <p>{movie.overview || 'Bu film için özet yok.'}</p>
      </Tabs.Panel>
      <Tabs.Panel value="cast">
        {cast.length > 0 ? (
          <ul className="space-y-1">
            {cast.map((person) => (
              <li key={person.id}>
                {person.name}
                {person.character && ` — ${person.character}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>Oyuncu bilgisi yok.</p>
        )}
      </Tabs.Panel>
      {videos.length > 0 && (
        <Tabs.Panel value="videos">
          <ul className="space-y-1">
            {videos.map((video) => (
              <li key={video.id}>
                <a
                  href={youtubeWatchUrl(video)}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  {video.name}
                </a>
              </li>
            ))}
          </ul>
        </Tabs.Panel>
      )}
    </Tabs>
  )
}
