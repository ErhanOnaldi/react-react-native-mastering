import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ResettableForm } from '@exercise/ResettableForm'

describe('form durumu ve reset', () => {
  it('temizken kapalıdır; başarılı kayıttan sonra alanı ve dirty durumunu sıfırlar', async () => {
    const u = userEvent.setup(),
      s = vi.fn(async () => {})
    render(<ResettableForm save={s} />)
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled()
    await u.type(screen.getByLabelText('Liste adı'), 'Akşam')
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeEnabled()
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    await waitFor(() => expect(screen.getByLabelText('Liste adı')).toHaveValue(''))
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled()
    expect(s).toHaveBeenCalledWith({ name: 'Akşam' })
  })
  it('istek sürerken düğmeyi kapatır ve hata olursa girdiyi korur', async () => {
    const u = userEvent.setup()
    let reject!: (e: Error) => void
    const s = vi.fn(
      () =>
        new Promise<void>((_, r) => {
          reject = r
        }),
    )
    render(<ResettableForm save={s} />)
    await u.type(screen.getByLabelText('Liste adı'), 'Deneme')
    await u.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('button', { name: 'Kaydediliyor…' })).toBeDisabled()
    reject(new Error('Ağ hatası'))
    await waitFor(() => expect(screen.getByLabelText('Liste adı')).toHaveValue('Deneme'))
  })
})
