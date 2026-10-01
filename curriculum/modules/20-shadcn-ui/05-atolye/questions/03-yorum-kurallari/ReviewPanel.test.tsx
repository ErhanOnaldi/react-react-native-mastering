import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DUMMYJSON_BASE, http, HttpResponse, requests, server } from '@test-utils'
import { ReviewPanel } from '@exercise/ReviewPanel'

describe('yorum kuralları', () => {
  it('başlık ve metin birlikte çok kısaysa istek atmadan hata gösterir', async () => {
    const user = userEvent.setup()
    render(<ReviewPanel />)
    await user.type(screen.getByRole('textbox', { name: 'Başlık' }), 'Ok')
    await user.type(screen.getByRole('textbox', { name: 'Yorum' }), 'iyi')
    await user.click(screen.getByRole('button', { name: 'Gönder' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('birlikte')
    expect(requests('/comments/add')).toHaveLength(0)
  })

  it('sunucu hata verince yazılanları korur; sonraki başarılı denemede açık mesaj gösterir', async () => {
    const user = userEvent.setup()
    let callCount = 0
    server.use(
      http.post(`${DUMMYJSON_BASE}/comments/add`, async () => {
        callCount += 1
        if (callCount === 1) {
          return HttpResponse.json({ message: 'Sunucu hatası' }, { status: 500 })
        }
        return HttpResponse.json({ id: 1, body: 'ok' }, { status: 201 })
      }),
    )
    render(<ReviewPanel />)
    await user.type(screen.getByRole('textbox', { name: 'Başlık' }), 'Harika bir film')
    await user.type(
      screen.getByRole('textbox', { name: 'Yorum' }),
      'Görsel efektleri ve senaryosu çok iyiydi, tekrar izlerim.',
    )
    await user.click(screen.getByRole('button', { name: 'Gönder' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('gönderilemedi')
    expect(screen.getByRole('textbox', { name: 'Başlık' })).toHaveValue('Harika bir film')
    expect(screen.getByRole('textbox', { name: 'Yorum' })).toHaveValue(
      'Görsel efektleri ve senaryosu çok iyiydi, tekrar izlerim.',
    )

    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(await screen.findByRole('status')).toHaveTextContent('gönderildi')
    expect(requests('/comments/add')).toHaveLength(2)
  })
})
