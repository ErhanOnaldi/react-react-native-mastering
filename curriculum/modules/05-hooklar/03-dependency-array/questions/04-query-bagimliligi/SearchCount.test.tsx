import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { requests } from '@test-utils'
import { SearchCount } from '@exercise/SearchCount'
describe('SearchCount', () => {
  it('boş aramada istek atmaz', () => {
    render(<SearchCount query="" />)
    expect(requests(/search\/movie/)).toHaveLength(0)
  })
  it('arama değişince yeni query ile istek atar', async () => {
    const view = render(<SearchCount query="Dövüş" />)
    await screen.findByText(/^[1-9]\d* sonuç$/)
    view.rerender(<SearchCount query="Matrix" />)
    await screen.findByText(/^[1-9]\d* sonuç$/)
    expect(requests(/search\/movie/).map((r) => r.search.get('query'))).toEqual(['Dövüş', 'Matrix'])
  })
})
