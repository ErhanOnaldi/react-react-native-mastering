import { useMutation } from '@tanstack/react-query'
export function useRate(
  rate: (input: { movieId: number; value: number }) => Promise<void>,
  sessionId: string,
) {
  void sessionId
  return useMutation({ mutationFn: rate })
}
