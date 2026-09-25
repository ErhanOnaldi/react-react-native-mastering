import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useRate } from '@exercise/useRate'
it('başarılı POST sonrası yalnız ilgili rating listesini yeniden okur', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const list = vi.fn(async () => ['eski'])
  await client.fetchQuery({ queryKey: ['ratings', 'guest-1'], queryFn: list, staleTime: Infinity })
  const other = vi.fn(async () => ['başka'])
  await client.fetchQuery({ queryKey: ['ratings', 'guest-2'], queryFn: other, staleTime: Infinity })
  const rate = vi.fn(async () => {})
  const result = renderHook(() => useRate(rate, 'guest-1'), { wrapper })
  await act(async () => {
    await result.result.current.mutateAsync({ movieId: 550, value: 8.5 })
  })
  expect(rate).toHaveBeenCalled()
  expect(client.getQueryState(['ratings', 'guest-1'])?.isInvalidated).toBe(true)
  expect(client.getQueryState(['ratings', 'guest-2'])?.isInvalidated).toBe(false)
})
