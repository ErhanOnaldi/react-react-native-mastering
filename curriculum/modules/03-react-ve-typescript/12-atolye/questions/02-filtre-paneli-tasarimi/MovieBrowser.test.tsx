import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MovieBrowser } from '@exercise/MovieBrowser'

describe('film filtresi', () => {
  it('başlığa göre süzer ve alan temizlenince tüm filmleri geri getirir', async () => {
    render(<MovieBrowser />)
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    await userEvent.type(input, 'resident')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Resident Evil')).toBeInTheDocument()
    await userEvent.clear(input)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('Türkçe harflerde de başlık eşleşmesini korur', async () => {
    render(<MovieBrowser />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Film ara' }), 'ÖRÜMCEK')
    expect(screen.getByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
