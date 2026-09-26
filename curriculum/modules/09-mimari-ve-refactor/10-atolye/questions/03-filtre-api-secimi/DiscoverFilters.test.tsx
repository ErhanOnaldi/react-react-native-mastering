import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DiscoverFilters } from '@exercise/DiscoverFilters'

describe('keşif filtreleri', () => {
  it('tür ve sıralama seçimini gösterir, sıfırlayınca varsayılana döner', async () => {
    const user = userEvent.setup()
    render(<DiscoverFilters />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Tür' }), '35')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sıralama' }), 'title.asc')
    expect(screen.getByRole('combobox', { name: 'Tür' })).toHaveValue('35')
    expect(screen.getByRole('combobox', { name: 'Sıralama' })).toHaveValue('title.asc')
    await user.click(screen.getByRole('button', { name: 'Sıfırla' }))
    expect(screen.getByRole('combobox', { name: 'Tür' })).toHaveValue('28')
    expect(screen.getByRole('combobox', { name: 'Sıralama' })).toHaveValue('popularity.desc')
  })
})
