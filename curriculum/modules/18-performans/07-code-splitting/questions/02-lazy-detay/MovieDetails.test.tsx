import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieDetails } from '@exercise/MovieDetails'
describe('MovieDetails', () => {
  it('detay başlığını hemen gösterir', () => {
    render(<MovieDetails />)
    expect(screen.getByRole('heading', { name: 'Film detayı' })).toBeInTheDocument()
  })
  it('ayrı yüklenen oyuncu panelini sonunda gösterir', async () => {
    render(<MovieDetails />)
    expect(await screen.findByText('Dövüş Kulübü oyuncuları')).toBeInTheDocument()
  })
})
