import type { Video } from '@/features/movies/types'
import { pickTrailer, youtubeWatchUrl } from '@/features/movies/lib/trailer'
import { buttonVariants } from '@/shared/ui/button-variants'
import { Modal } from '@/shared/ui/modal/Modal'

export function TrailerModal({
  movieTitle,
  videos,
}: {
  movieTitle: string
  videos: Video[]
}) {
  const trailer = pickTrailer(videos)
  if (!trailer) return null

  return (
    <Modal>
      <Modal.Trigger className={buttonVariants({ variant: 'secondary' })}>
        Fragmanı aç
      </Modal.Trigger>
      <Modal.Content title={`${movieTitle} fragmanı`}>
        <p className="text-slate-300">{trailer.name}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={youtubeWatchUrl(trailer)}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: 'primary' })}
          >
            YouTube'da izle
          </a>
          <Modal.Close>Kapat</Modal.Close>
        </div>
      </Modal.Content>
    </Modal>
  )
}
