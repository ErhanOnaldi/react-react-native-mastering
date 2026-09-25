import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { requests } from '@test-utils'
import { PopularTitles } from '@exercise/PopularTitles'
describe('PopularTitles', () => {
  it('yüklenirken durum metni gösterir', () => {
    render(<PopularTitles />)
    expect(screen.getByText('Yükleniyor')).toBeInTheDocument()
  })
  it('yetkili isteğin ilk film başlığını gösterir', async () => {
    render(<PopularTitles />)
    expect(await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
    expect(requests('/3/movie/popular')).toHaveLength(1)
  })
})
