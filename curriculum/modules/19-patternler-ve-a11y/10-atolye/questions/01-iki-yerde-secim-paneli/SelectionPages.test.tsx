import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SelectionPages } from '@exercise/SelectionPages'

describe('iki sayfada seçim paneli', () => {
  it('her iki sayfada da ok tuşuyla seçim ve focus birlikte hareket eder, sayfa değişince seçim korunur', async () => {
    const user = userEvent.setup()
    render(<SelectionPages />)

    const aksiyon = screen.getByRole('radio', { name: 'Aksiyon' })
    aksiyon.focus()
    expect(aksiyon).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Komedi' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Komedi' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Aksiyon' })).toHaveAttribute('tabindex', '-1')

    await user.click(screen.getByRole('button', { name: 'Detay' }))
    const puan = screen.getByRole('radio', { name: 'Puan' })
    puan.focus()
    expect(puan).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Tarih' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Tarih' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Ana Sayfa' }))
    expect(screen.getByRole('radio', { name: 'Komedi' })).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('button', { name: 'Detay' }))
    expect(screen.getByRole('radio', { name: 'Tarih' })).toHaveAttribute('aria-checked', 'true')
  })
})
