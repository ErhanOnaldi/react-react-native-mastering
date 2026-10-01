import { useMutation } from '@tanstack/react-query'
export function useRate(rate: (input: { movieId: number; value: number }) => Promise<void>) {
  void useMutation
  void rate
  return { mutate: (_input: { movieId: number; value: number }) => {} }
}
