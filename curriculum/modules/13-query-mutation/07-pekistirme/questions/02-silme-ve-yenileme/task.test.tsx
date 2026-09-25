import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { expect, it, vi } from 'vitest'
import { useDeleteRating } from '@exercise/useDeleteRating'
it('başarılı DELETE yalnız ilgili oturumun listesini stale yapar', async () => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  client.setQueryData(['ratings', 'guest-1'], [{ id: 550 }])
  client.setQueryData(['ratings', 'guest-2'], [{ id: 155 }])
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const remove = vi.fn(async () => {})
  const result = renderHook(() => useDeleteRating('guest-1', remove), { wrapper })
  await act(async () => {
    await result.result.current.mutateAsync(550)
  })
  expect(remove).toHaveBeenCalledWith(550, expect.anything())
  expect(client.getQueryState(['ratings', 'guest-1'])?.isInvalidated).toBe(true)
  expect(client.getQueryState(['ratings', 'guest-2'])?.isInvalidated).toBe(false)
})

it('başarısız DELETE eski listeyi geçersiz kılmaz', async () => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  client.setQueryData(['ratings', 'guest-1'], [{ id: 550 }])
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const remove = vi.fn(async () => {
    throw new Error('500')
  })
  const result = renderHook(() => useDeleteRating('guest-1', remove), { wrapper })
  await act(async () => {
    await expect(result.result.current.mutateAsync(550)).rejects.toThrow('500')
  })
  expect(client.getQueryState(['ratings', 'guest-1'])?.isInvalidated).toBe(false)
  expect(client.getQueryData(['ratings', 'guest-1'])).toEqual([{ id: 550 }])
})
