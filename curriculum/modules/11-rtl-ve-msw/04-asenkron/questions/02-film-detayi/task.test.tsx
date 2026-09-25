import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieTitle } from '@exercise/MovieTitle'
describe('MovieTitle', () => {
  it('yüklenirken durum gösterir ve sonra Türkçe film başlığını getirir', async () => {
    render(<MovieTitle id={550} />)
    expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor')
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
  it('404 yanıtında kullanıcıya hata gösterir', async () => {
    render(<MovieTitle id={999999} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Film yüklenemedi')
  })
  it('id değişince yeni filmi gösterir', async () => {
    const view = render(<MovieTitle id={550} />)
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
    view.rerender(<MovieTitle id={603} />)
    expect(await screen.findByRole('heading', { name: 'Matrix' })).toBeInTheDocument()
  })
})
