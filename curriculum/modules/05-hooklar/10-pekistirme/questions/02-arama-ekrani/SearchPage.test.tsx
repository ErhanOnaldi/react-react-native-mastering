import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { requests } from '@test-utils'
import { SearchPage } from '@exercise/SearchPage'
describe('SearchPage', () => {
  it('yazılan arama için film başlığını gösterir', async () => {
    render(<SearchPage />)
    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'Matrix')
    expect(await screen.findByText('Matrix')).toBeInTheDocument()
  })
  it('arama silinince eski sonuçları temizler', async () => {
    render(<SearchPage />)
    const user = userEvent.setup()
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    await user.type(input, 'Matrix')
    await screen.findByText('Matrix')
    await user.clear(input)
    await waitFor(() => expect(screen.queryByText('Matrix')).not.toBeInTheDocument())
    expect(requests(/search\/movie/).length).toBeGreaterThan(0)
  })
})
