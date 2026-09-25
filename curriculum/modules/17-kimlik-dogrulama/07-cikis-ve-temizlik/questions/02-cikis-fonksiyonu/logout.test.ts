import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { logout } from '@exercise/logout'

describe('çıkış temizliği', () => {
  it('kalıcı token’ı kaldırır ve store sıfırlamasını çağırır', () => {
    const queryClient = new QueryClient()
    const removeItem = vi.fn()
    const resetStore = vi.fn()
    logout({ queryClient, storage: { removeItem }, resetStore })
    expect(removeItem).toHaveBeenCalledWith('sinema-auth')
    expect(resetStore).toHaveBeenCalledOnce()
  })
  it('eski kullanıcı profilini query cache’inden çıkarır', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['profile'], { username: 'emilys' })
    logout({ queryClient, storage: { removeItem: vi.fn() }, resetStore: vi.fn() })
    expect(queryClient.getQueryData(['profile'])).toBeUndefined()
  })
})
