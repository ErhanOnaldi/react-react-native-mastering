import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { expect, it, vi } from 'vitest'
import { useRate } from '@exercise/useRate'
it('hook kurulurken yazmaz, mutate ile verilen puanı gönderir', async () => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const rate = vi.fn(async () => {})
  const { result } = renderHook(() => useRate(rate), { wrapper })
  expect(rate).not.toHaveBeenCalled()
  await act(async () => {
    await result.current.mutateAsync({ movieId: 550, value: 8.5 })
  })
  expect(rate).toHaveBeenCalledWith({ movieId: 550, value: 8.5 })
})
