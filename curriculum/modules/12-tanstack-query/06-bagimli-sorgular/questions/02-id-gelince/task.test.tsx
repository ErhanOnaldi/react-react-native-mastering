import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { useOptionalMovie } from '@exercise/useOptionalMovie'
describe('bağımlı detay', () => {
  it('id yokken hiç istek atmaz', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    const result = renderHook(() => useOptionalMovie(undefined), { wrapper })
    expect(result.result.current.fetchStatus).toBe('idle')
    expect(requests()).toHaveLength(0)
  })
  it('id gelince filmi çeker', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    const result = renderHook(({ id }: { id: number | undefined }) => useOptionalMovie(id), {
      initialProps: { id: undefined as number | undefined },
      wrapper,
    })
    result.rerender({ id: 550 })
    await waitFor(() => expect(result.result.current.data?.title).toBe('Dövüş Kulübü'))
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
})
