export interface MoviePosterProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export function MoviePoster({ src, alt, width, height, priority, className }: MoviePosterProps) {
  return <img src={src} alt={alt} className={className} />
}
