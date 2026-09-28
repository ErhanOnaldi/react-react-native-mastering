import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReviewAction } from '@exercise/ReviewAction'
describe('ReviewAction', () => {
  it('boş yorumu açık hata mesajıyla reddeder', async () => {
    render(<ReviewAction />)
    fireEvent.submit(screen.getByRole('button', { name: 'Kaydet' }).closest('form')!)
    // status öğesi ilk render'dan beri boş duruyor; metin Action bitince gelir, o yüzden bekle
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Yorum boş olamaz'))
  })
  it('yazılan yorumu Action sonucu olarak gösterir', async () => {
    render(<ReviewAction />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Yorum' }), {
      target: { value: 'Harika film' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Kaydet' }).closest('form')!)
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Kaydedildi: Harika film'),
    )
  })
})
