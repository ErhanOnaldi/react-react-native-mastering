import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieTitle } from '@exercise/MovieTitle'

describe('MovieTitle', () => {
  it('film adını gösterir', async () => {
    render(<MovieTitle id={550} />)
    expect(await screen.findByRole('heading', { name: 'Fight Club' })).toBeInTheDocument()
  })

  it('yalnızca bir istek atar', async () => {
    render(<MovieTitle id={550} />)
    await screen.findByRole('heading', { name: 'Fight Club' })
    await new Promise((r) => setTimeout(r, 50))
    expect(requests('/3/movie/550'), 'Beklenen: 1 istek').toHaveLength(1)
  })
})
