import { useMutation } from '@tanstack/react-query'
export function RateButton({
  movieId,
  rate,
}: {
  movieId: number
  rate: (input: { movieId: number; value: number }) => Promise<void>
}) {
  const mutation = useMutation({ mutationFn: rate })
  return (
    <div>
      <button
        disabled={mutation.isPending}
        onClick={() => mutation.mutate({ movieId, value: 8.5 })}
      >
        {mutation.isPending ? 'Kaydediliyor…' : '8,5 ver'}
      </button>
      {mutation.isSuccess && <p>Kaydedildi</p>}
      {mutation.isError && <p role="alert">Puan kaydedilemedi</p>}
    </div>
  )
}
