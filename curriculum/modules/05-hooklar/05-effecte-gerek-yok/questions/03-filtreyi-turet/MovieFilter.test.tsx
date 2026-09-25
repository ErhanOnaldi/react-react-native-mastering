import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MovieFilter } from '@exercise/MovieFilter'
describe('MovieFilter', () => {
  it('ilk renderda sorguya uyan filmleri gösterir', () => {
    render(<MovieFilter titles={['Dövüş Kulübü', 'Matrix']} query="mat" />)
    expect(screen.getByText('Matrix')).toBeInTheDocument()
    expect(screen.queryByText('Dövüş Kulübü')).not.toBeInTheDocument()
  })
  it('query değiştiği renderda eski listeyi göstermez', () => {
    const titles = ['Dövüş Kulübü', 'Matrix']
    const view = render(<MovieFilter titles={titles} query="mat" />)
    view.rerender(<MovieFilter titles={titles} query="döv" />)
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(screen.queryByText('Matrix')).not.toBeInTheDocument()
  })
})
