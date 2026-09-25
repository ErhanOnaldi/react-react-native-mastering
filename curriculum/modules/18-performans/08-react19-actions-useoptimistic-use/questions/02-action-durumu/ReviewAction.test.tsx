import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReviewAction } from '@exercise/ReviewAction'
describe('ReviewAction', () => {
  it('boş yorumu açık hata mesajıyla reddeder', async () => {
    render(<ReviewAction />)
    fireEvent.submit(screen.getByRole('button', { name: 'Kaydet' }).closest('form')!)
    expect(await screen.findByRole('status')).toHaveTextContent('Yorum boş olamaz')
  })
  it('yazılan yorumu Action sonucu olarak gösterir', async () => {
    render(<ReviewAction />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Yorum' }), {
      target: { value: 'Harika film' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Kaydet' }).closest('form')!)
    expect(await screen.findByRole('status')).toHaveTextContent('Kaydedildi: Harika film')
  })
})
