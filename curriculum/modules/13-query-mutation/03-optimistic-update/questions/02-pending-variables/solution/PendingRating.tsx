import { useMutation } from '@tanstack/react-query'
export function PendingRating({
  movieId,
  rate,
}: {
  movieId: number
  rate: (input: { movieId: number; value: number }) => Promise<void>
}) {
  const mutation = useMutation({ mutationFn: rate })
  return (
    <div>
      <button onClick={() => mutation.mutate({ movieId, value: 8.5 })}>8,5 ver</button>
      {mutation.isPending && (
        <span>{mutation.variables.value.toLocaleString('tr-TR')} gönderiliyor</span>
      )}
      {mutation.isError && <p role="alert">Kaydedilemedi</p>}
    </div>
  )
}
