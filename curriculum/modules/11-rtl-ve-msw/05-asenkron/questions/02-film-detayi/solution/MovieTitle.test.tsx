import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieTitle } from '@impl/MovieTitle'

describe('MovieTitle', () => {
  it('ilk çizimde yüklenme durumunu, sonra film başlığını gösterir', async () => {
    render(<MovieTitle id={550} />)

    expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor')
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
  })

  it('bulunmayan film için hata durumunu gösterir', async () => {
    render(<MovieTitle id={999999} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Film yüklenemedi')
  })

  it('filmi bir kez ister', async () => {
    render(<MovieTitle id={550} />)
    await screen.findByRole('heading', { name: 'Dövüş Kulübü' })

    expect(requests('/3/movie/550')).toHaveLength(1)
  })
})
