import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchField } from '@exercise/SearchField'
describe('SearchField', () => {
  it('verilen değeri inputta gösterir', () => {
    render(<SearchField value="Kara" onChange={() => {}} />)
    expect(screen.getByRole('textbox', { name: 'Film ara' })).toHaveValue('Kara')
  })
  it('yazılan yeni değeri callback ile bildirir', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    render(<SearchField value="" onChange={change} />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'M')
    expect(change).toHaveBeenCalledWith('M')
  })
})
