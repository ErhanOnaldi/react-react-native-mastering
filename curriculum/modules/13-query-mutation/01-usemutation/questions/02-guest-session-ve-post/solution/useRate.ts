import { useMutation } from '@tanstack/react-query'
export function useRate(rate: (input: { movieId: number; value: number }) => Promise<void>) {
  return useMutation({
    mutationFn: (input: { movieId: number; value: number }) => rate(input),
  })
}
