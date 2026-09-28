export interface MoviePosterProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export function MoviePoster({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: MoviePosterProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
    />
  )
}
