import type { Video } from '@/features/movies/types'

/** Detay sayfasında oynatılacak videoyu seçer: önce YouTube fragmanı, yoksa herhangi bir YouTube videosu. */
export function pickTrailer(videos: Video[]): Video | undefined {
  const youtube = videos.filter((video) => video.site === 'YouTube')
  return youtube.find((video) => video.type === 'Trailer') ?? youtube[0]
}

export function youtubeWatchUrl(video: Video) {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(video.key)}`
}
