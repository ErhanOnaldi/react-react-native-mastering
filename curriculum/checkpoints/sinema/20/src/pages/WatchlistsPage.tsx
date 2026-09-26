import { WatchlistForm } from '@/features/watchlists/WatchlistForm'
import { useWatchlists } from '@/features/watchlists/useWatchlists'

export function WatchlistsPage() {
  const { watchlists } = useWatchlists()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">İzleme listelerim</h2>
      <WatchlistForm />
      <section aria-label="Kayıtlı listeler">
        {watchlists.length === 0 ? (
          <p>Henüz izleme listen yok.</p>
        ) : (
          <ul className="space-y-3">
            {watchlists.map((list) => (
              <li
                key={list.id}
                className="rounded-lg border border-slate-700 p-3"
              >
                <h3 className="font-semibold">{list.name}</h3>
                <p>Film sayısı: {list.movieIds.length}</p>
                {list.description && <p>{list.description}</p>}
                <p>{list.isPublic ? 'Herkese açık' : 'Özel'}</p>
                {list.tags.length > 0 && (
                  <p>
                    Etiketler: {list.tags.map((tag) => tag.value).join(', ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
