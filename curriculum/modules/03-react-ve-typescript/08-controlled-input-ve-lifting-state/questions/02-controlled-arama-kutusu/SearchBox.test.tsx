import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBox } from '@exercise/SearchBox'
describe('SearchBox', () => {
  it('üst bileşenden gelen değeri gösterir', () => {
    const { rerender } = render(<SearchBox value="" onChange={() => {}} />)
    rerender(<SearchBox value="Kara" onChange={() => {}} />)
    expect(screen.getByRole('textbox', { name: 'Film ara' })).toHaveValue('Kara')
  })
  it('yazılan metni üst bileşene bildirir', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    render(<SearchBox value="" onChange={change} />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'M')
    expect(change).toHaveBeenCalledWith('M')
  })
})
