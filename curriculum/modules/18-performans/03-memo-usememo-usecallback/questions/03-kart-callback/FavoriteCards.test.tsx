import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FavoriteCards } from '@exercise/FavoriteCards'

describe('FavoriteCards', () => {
  it('ilgili olmayan sayaç artışında kartları tekrar çalıştırmaz', () => {
    const onCardRender = vi.fn()
    render(<FavoriteCards titles={['Matrix', 'Dövüş Kulübü']} onCardRender={onCardRender} />)
    const before = onCardRender.mock.calls.length
    fireEvent.click(screen.getByRole('button', { name: /Sayaç/ }))
    expect(onCardRender).toHaveBeenCalledTimes(before)
  })
  it('kart tıklanınca seçilen favoriyi gösterir', () => {
    render(<FavoriteCards titles={['Matrix']} onCardRender={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Matrix' }))
    expect(screen.getByText('Favori: Matrix')).toBeInTheDocument()
  })
})
