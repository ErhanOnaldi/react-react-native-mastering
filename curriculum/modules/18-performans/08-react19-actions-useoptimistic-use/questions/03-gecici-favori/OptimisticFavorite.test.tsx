import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OptimisticFavorite } from '@exercise/OptimisticFavorite'
describe('OptimisticFavorite', () => {
  it('tıklanınca async kayıt çağırır ve sonunda favoriyi korur', async () => {
    const save = vi.fn(async () => {})
    render(<OptimisticFavorite initial={false} save={save} />)
    fireEvent.click(screen.getByRole('button', { name: 'Favorilere ekle' }))
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'))
    expect(save).toHaveBeenCalledWith(true)
  })
  it('ilk renderda aria-pressed başlangıç değerini yansıtır', () => {
    render(<OptimisticFavorite initial={true} save={vi.fn(async () => {})} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
  it('başarısız kayıt sonrası gerçek duruma döner', async () => {
    const save = vi.fn(async () => {
      throw new Error('ağ hatası')
    })
    render(<OptimisticFavorite initial={false} save={save} />)
    fireEvent.click(screen.getByRole('button', { name: 'Favorilere ekle' }))
    await waitFor(() => expect(save).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false'))
  })
})
