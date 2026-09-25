import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FavoriteShelf } from '@exercise/FavoriteShelf'
describe('FavoriteShelf', () => {
  it('bir filmi favoriye ekleyince düğme durumunu yeniler', async () => {
    const user = userEvent.setup()
    render(<FavoriteShelf />)
    await user.click(screen.getByRole('button', { name: 'Dövüş Kulübü Favoriye ekle' }))
    expect(screen.getByRole('button', { name: 'Dövüş Kulübü Favoriden çıkar' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
  it('iki filmi bağımsız işaretler ve birini çıkarır', async () => {
    const user = userEvent.setup()
    render(<FavoriteShelf />)
    await user.click(screen.getByRole('button', { name: 'Dövüş Kulübü Favoriye ekle' }))
    await user.click(screen.getByRole('button', { name: 'Kara Şövalye Favoriye ekle' }))
    await user.click(screen.getByRole('button', { name: 'Dövüş Kulübü Favoriden çıkar' }))
    expect(screen.getByRole('button', { name: 'Kara Şövalye Favoriden çıkar' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Dövüş Kulübü Favoriye ekle' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
