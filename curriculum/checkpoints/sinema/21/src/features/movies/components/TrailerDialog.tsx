import type { Video } from '@/features/movies/types'
import { pickTrailer, youtubeWatchUrl } from '@/features/movies/lib/trailer'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function TrailerDialog({
  movieTitle,
  videos,
}: {
  movieTitle: string
  videos: Video[]
}) {
  const trailer = pickTrailer(videos)
  if (!trailer) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary">
          Fragmanı aç
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{movieTitle} fragmanı</DialogTitle>
          <DialogDescription>{trailer.name}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild>
            <a href={youtubeWatchUrl(trailer)} target="_blank" rel="noreferrer">
              YouTube'da izle
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
