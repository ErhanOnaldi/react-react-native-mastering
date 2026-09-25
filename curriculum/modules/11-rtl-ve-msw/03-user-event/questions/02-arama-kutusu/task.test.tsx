import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { SearchBox } from '@exercise/SearchBox'
function Harness({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('')
  return <SearchBox value={value} onChange={setValue} onSubmit={onSubmit} />
}
describe('SearchBox', () => {
  it('kullanıcının yazdığını kontrollü inputta gösterir ve Enter ile arar', async () => {
    const submit = vi.fn()
    render(<Harness onSubmit={submit} />)
    const input = screen.getByRole('searchbox', { name: 'Film ara' })
    await userEvent.setup().type(input, ' Matrix {Enter}')
    expect(input).toHaveValue(' Matrix ')
    expect(submit).toHaveBeenCalledWith('Matrix')
  })
  it('boş sorguyu göndermez', async () => {
    const submit = vi.fn()
    render(<Harness onSubmit={submit} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ara' }))
    expect(submit).not.toHaveBeenCalled()
  })
})
