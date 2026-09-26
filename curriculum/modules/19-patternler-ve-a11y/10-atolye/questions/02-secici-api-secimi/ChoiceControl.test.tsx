import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ChoiceControl } from '@exercise/ChoiceControl'

describe('seçici API seçimi', () => {
  it('seçim yapılmadan kaydedilirse hata gösterir, seçilince kaybolur', async () => {
    const user = userEvent.setup()
    render(<ChoiceControl />)
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    const group = screen.getByRole('radiogroup', { name: 'Kitap biçimi' })
    expect(group).toHaveAccessibleDescription(/seç/i)

    screen.getByRole('radio', { name: 'E-kitap' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Basılı' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Basılı' })).toHaveFocus()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(await screen.findByText('Kaydedildi: Basılı')).toBeInTheDocument()
  })

  it('fareyle doğrudan seçim de çalışır', async () => {
    const user = userEvent.setup()
    render(<ChoiceControl />)
    await user.click(screen.getByRole('radio', { name: 'Sesli' }))
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(await screen.findByText('Kaydedildi: Sesli')).toBeInTheDocument()
  })
})
