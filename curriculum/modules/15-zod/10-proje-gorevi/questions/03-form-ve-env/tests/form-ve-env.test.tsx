import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WatchlistForm } from '@project/src/features/watchlists/WatchlistForm'
import { ReviewForm } from '@project/src/features/watchlists/ReviewForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { requests } from '@test-utils'
import { watchlistSchema, reviewSchema } from '@project/src/features/watchlists/schemas'

describe('Sinema form ve env şemaları', () => {
  it('liste adını trimler ve boş adı reddeder', () => {
    expect(
      watchlistSchema.parse({ name: '  Klasikler  ', description: '', isPublic: false, tags: [] })
        .name,
    ).toBe('Klasikler')
    expect(
      watchlistSchema.safeParse({ name: '  ', description: '', isPublic: false, tags: [] }).success,
    ).toBe(false)
  })
  it('yorum metnini ve 1–5 puan sınırını doğrular', () => {
    expect(reviewSchema.safeParse({ body: 'Güzel film', rating: 5 }).success).toBe(true)
    expect(reviewSchema.safeParse({ body: '  ', rating: 5 }).success).toBe(false)
    expect(reviewSchema.safeParse({ body: 'Güzel film', rating: 6 }).success).toBe(false)
  })
  it('formdaki yalnızca boşluk olan adı kaydetmez', async () => {
    localStorage.clear()
    render(<WatchlistForm />)
    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox', { name: 'Liste adı' }), '   ')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Ad gerekli')
    expect(localStorage.getItem('sinema:watchlists')).toBeNull()
  })
  it('yorum formu yalnızca boşluk içeren metni göndermez', async () => {
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <ReviewForm postId={550} />
      </QueryClientProvider>,
    )
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: '4 yıldız' }))
    await user.type(screen.getByRole('textbox', { name: 'Yorum' }), '   ')
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(screen.getByText('Yorum gerekli')).toHaveAttribute('role', 'alert')
    expect(requests('/comments/add')).toHaveLength(0)
  })
  it('env tokenını trimler ve başlığa varsayılan verir', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', '  test-token  ')
    vi.stubEnv('VITE_APP_TITLE', undefined)
    vi.resetModules()
    const { env } = await import('@project/src/shared/config/env')
    expect(env.tmdbToken).toBe('test-token')
    expect(env.appTitle).toBe('Sinema')
    vi.unstubAllEnvs()
  })
})
