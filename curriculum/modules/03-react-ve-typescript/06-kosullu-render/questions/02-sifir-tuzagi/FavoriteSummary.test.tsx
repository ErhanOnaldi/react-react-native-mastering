import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FavoriteSummary } from '@exercise/FavoriteSummary'
describe('FavoriteSummary', () => {
  it('sıfırda boş durum mesajını gösterir', () => {
    render(<FavoriteSummary count={0} />)
    expect(screen.getByText('Henüz favori yok')).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
  it('pozitif sayıyı doğru gösterir', () => {
    render(<FavoriteSummary count={2} />)
    expect(screen.getByText('2 favori')).toBeInTheDocument()
  })
})
