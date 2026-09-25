import { useMutation } from '@tanstack/react-query'
export function RateButton({
  movieId,
  rate,
}: {
  movieId: number
  rate: (input: { movieId: number; value: number }) => Promise<void>
}) {
  void useMutation
  void rate
  return <button onClick={() => void movieId}>8,5 ver</button>
}
