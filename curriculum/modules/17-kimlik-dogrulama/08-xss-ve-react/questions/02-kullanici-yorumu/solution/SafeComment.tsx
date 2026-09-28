export interface SafeCommentProps {
  author: string
  content: string
  websiteUrl?: string
}

function getSafeWebsiteUrl(url?: string): string {
  if (!url) return '#'
  const trimmed = url.trim()
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed
    }
    return '#'
  } catch {
    return '#'
  }
}

export function SafeComment({ author, content, websiteUrl }: SafeCommentProps) {
  const safeUrl = getSafeWebsiteUrl(websiteUrl)

  return (
    <article data-testid="comment-card">
      <h4>{author}</h4>
      <p data-testid="comment-content">{content}</p>
      {websiteUrl && (
        <a href={safeUrl} target="_blank" rel="noreferrer noopener">
          Web sitesi
        </a>
      )}
    </article>
  )
}
