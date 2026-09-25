import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieTabs } from '@exercise/MovieTabs'
describe('MovieTabs', () => {
  it('oyuncular sekmesini seçince oyuncu içeriğini gösterir', () => {
    render(<MovieTabs />)
    fireEvent.click(screen.getByRole('button', { name: 'Oyuncular' }))
    expect(screen.getByText('Oyuncu listesi')).toBeInTheDocument()
  })
  it('özet sekmesine geri dönebilir ve durum alanını korur', () => {
    render(<MovieTabs />)
    fireEvent.click(screen.getByRole('button', { name: 'Oyuncular' }))
    fireEvent.click(screen.getByRole('button', { name: 'Özet' }))
    expect(screen.getByText('Film özeti')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
