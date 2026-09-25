import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse, requests, server } from '@test-utils'
import { describe, expect, it } from 'vitest'
import { CommentForm } from '@exercise/CommentForm'
function show(postId = 550) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <CommentForm postId={postId} />
    </QueryClientProvider>,
  )
}
describe('yorum mutation', () => {
  it('boş yorumda ağ isteği atmaz', async () => {
    const u = userEvent.setup()
    show()
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Yorum gerekli')
    expect(requests('/comments/add')).toHaveLength(0)
  })
  it('metni ve film kimliğini JSON olarak gönderir, başarıda sıfırlar', async () => {
    let sent: unknown
    server.use(
      http.post('https://dummyjson.com/comments/add', async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ id: 341, body: 'Dövüş Kulübü harika' }, { status: 201 })
      }),
    )
    const u = userEvent.setup()
    show(550)
    await u.type(screen.getByRole('textbox', { name: 'Yorum' }), 'Dövüş Kulübü harika')
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    await screen.findByRole('status')
    expect(screen.getByRole('status')).toHaveTextContent('Yorum kaydedildi')
    expect(screen.getByRole('textbox', { name: 'Yorum' })).toHaveValue('')
    expect(requests('/comments/add')).toHaveLength(1)
    const request = requests('/comments/add')[0]
    expect(request.method).toBe('POST')
    expect(sent).toEqual({ body: 'Dövüş Kulübü harika', postId: 550, userId: 1 })
  })
  it('sunucu hatasında yazılan metni korur ve hata gösterir', async () => {
    server.use(
      http.post('https://dummyjson.com/comments/add', () =>
        HttpResponse.json({ message: 'Sunucu hatası' }, { status: 500 }),
      ),
    )
    const u = userEvent.setup()
    show()
    await u.type(screen.getByRole('textbox', { name: 'Yorum' }), 'Tekrar deneyeceğim')
    await u.click(screen.getByRole('button', { name: 'Gönder' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Yorum gönderilemedi'))
    expect(screen.getByRole('textbox', { name: 'Yorum' })).toHaveValue('Tekrar deneyeceğim')
  })
})
