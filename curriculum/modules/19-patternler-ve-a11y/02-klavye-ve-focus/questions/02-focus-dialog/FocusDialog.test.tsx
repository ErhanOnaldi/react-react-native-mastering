import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FocusDialog } from '@exercise/FocusDialog'

function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Fragmanı aç</button>
      <FocusDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}

describe('Fragman odağı', () => {
  it('açılınca adı olan modal dialogu gösterip Oynat düğmesine focus verir', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    expect(screen.getByRole('dialog', { name: 'Fragman' })).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', { name: 'Oynat' })).toHaveFocus()
  })

  it('Tab ve Shift+Tab odağı dialog içinde döndürür', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(screen.getByRole('button', { name: 'Oynat' })).toHaveFocus()
  })

  it('Escape ile kapanıp odağı açan düğmeye geri verir', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fragmanı aç' })).toHaveFocus()
  })

  it('Kapat düğmesi de dialogu kapatıp odağı geri verir', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    await user.click(screen.getByRole('button', { name: 'Kapat' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fragmanı aç' })).toHaveFocus()
  })

  it('açıkken yeni bir onClose ile render olunca focus yerinde kalır', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<FocusDialog open onClose={() => {}} />)
    await user.keyboard('{Tab}')
    expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus()
    const latestClose = vi.fn()
    rerender(<FocusDialog open onClose={latestClose} />)
    expect(screen.getByRole('button', { name: 'Kapat' }), 'Effect yeniden kurulup focus’u taşıdı').toHaveFocus()
    await user.keyboard('{Escape}')
    expect(latestClose, 'Escape en güncel onClose’u çağırmalı').toHaveBeenCalledTimes(1)
  })
})
