import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { requests } from '@test-utils'
import { MovieTitle } from '@exercise/MovieTitle'
describe('MovieTitle', () => {
  it('TMDB başlığını gösterir', async () => {
    render(<MovieTitle id={550} />)
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
  })
  it('bir film için tek istek atar', async () => {
    render(<MovieTitle id={550} />)
    await screen.findByRole('heading', { name: 'Dövüş Kulübü' })
    await new Promise((r) => setTimeout(r, 30))
    expect(requests('/3/movie/550'), 'Beklenen: 1 istek').toHaveLength(1)
  })
})
