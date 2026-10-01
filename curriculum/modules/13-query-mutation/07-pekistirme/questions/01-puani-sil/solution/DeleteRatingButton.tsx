import { useMutation } from '@tanstack/react-query'
export function DeleteRatingButton({
  movieId,
  remove,
}: {
  movieId: number
  remove: (movieId: number) => Promise<void>
}) {
  const mutation = useMutation({ mutationFn: (id: number) => remove(id) })
  return (
    <div>
      <button disabled={mutation.isPending} onClick={() => mutation.mutate(movieId)}>
        {mutation.isPending ? 'Siliniyor…' : 'Puanı sil'}
      </button>
      {mutation.isSuccess && <p>Puan silindi</p>}
      {mutation.isError && <p role="alert">Puan silinemedi</p>}
    </div>
  )
}
