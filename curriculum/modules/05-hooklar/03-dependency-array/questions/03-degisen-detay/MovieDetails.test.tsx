import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { requests } from '@test-utils'
import { MovieDetails } from '@exercise/MovieDetails'
describe('MovieDetails', () => {
  it('ilk filmin adını gösterir', async () => {
    render(<MovieDetails id={550} />)
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
  })
  it('id değişince yeni film için istek atar ve başlığı yeniler', async () => {
    const view = render(<MovieDetails id={550} />)
    await screen.findByText('Dövüş Kulübü')
    view.rerender(<MovieDetails id={27205} />)
    expect(await screen.findByText('Başlangıç')).toBeInTheDocument()
    expect(requests('/3/movie/27205')).toHaveLength(1)
  })
})
