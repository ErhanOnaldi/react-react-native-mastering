import { useMutation } from '@tanstack/react-query'
export function DeleteRatingButton({
  movieId,
  remove,
}: {
  movieId: number
  remove: (movieId: number) => Promise<void>
}) {
  void useMutation
  void remove
  return <button onClick={() => void movieId}>Puanı sil</button>
}
