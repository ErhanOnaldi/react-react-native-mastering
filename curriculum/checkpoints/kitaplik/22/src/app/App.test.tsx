import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render'

describe('Uygulama iskeleti', () => {
  it('ana sayfada "Kitaplık" başlığını ve arama kutusunu gösterir', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Kitaplık' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Kitap ara' })).toBeInTheDocument()
  })

  it('bilinmeyen adreste 404 sayfası gösterir', () => {
    renderApp('/olmayan-sayfa')
    expect(screen.getByRole('heading', { name: 'Sayfa bulunamadı' })).toBeInTheDocument()
  })
})
