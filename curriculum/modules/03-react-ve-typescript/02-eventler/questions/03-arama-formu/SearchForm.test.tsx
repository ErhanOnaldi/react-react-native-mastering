import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchForm } from '@exercise/SearchForm'
describe('SearchForm', () => {
  it('Enter ile sorguyu kırpıp bildirir', async () => {
    const user = userEvent.setup()
    const search = vi.fn()
    render(<SearchForm onSearch={search} />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), '  Matrix  {Enter}')
    expect(search).toHaveBeenCalledWith('Matrix')
  })
  it('boş sorguda arama başlatmaz', async () => {
    const user = userEvent.setup()
    const search = vi.fn()
    render(<SearchForm onSearch={search} />)
    const button = screen.getByRole('button', { name: 'Ara' })
    expect(button).toHaveAttribute('type', 'submit')
    await user.click(button)
    expect(search).not.toHaveBeenCalled()
  })
})
