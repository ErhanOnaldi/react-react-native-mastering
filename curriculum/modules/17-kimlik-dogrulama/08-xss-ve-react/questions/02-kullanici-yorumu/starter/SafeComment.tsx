export interface SafeCommentProps {
  author: string
  content: string
  websiteUrl?: string
}

export function SafeComment({ author, content, websiteUrl }: SafeCommentProps) {
  return (
    <article data-testid="comment-card">
      <h4>{author}</h4>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {websiteUrl && <a href={websiteUrl}>Web sitesi</a>}
    </article>
  )
}
