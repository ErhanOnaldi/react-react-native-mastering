export function formatAuthors(authors: string[]) {
  return authors.length > 0 ? authors.join(', ') : 'Yazar bilinmiyor'
}
