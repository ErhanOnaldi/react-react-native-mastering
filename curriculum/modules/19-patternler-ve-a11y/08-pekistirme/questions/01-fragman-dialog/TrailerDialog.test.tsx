import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TrailerDialog } from '@exercise/TrailerDialog'

async function openDialog(movieTitle: string) {
  const user = userEvent.setup()
  render(
    <div data-testid="kart">
      <TrailerDialog movieTitle={movieTitle} />
    </div>,
  )
  const trigger = screen.getByRole('button', { name: 'Fragmanı aç' })
  await user.click(trigger)
  return { user, trigger }
}

describe('Fragman akışı', () => {
  it('film adıyla duyurulan dialogu body altındaki arka planda açıp Oynat’a focus verir', async () => {
    await openDialog('Dövüş Kulübü')
    const dialog = screen.getByRole('dialog', { name: 'Dövüş Kulübü fragmanı' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog.parentElement?.parentElement, 'Arka plan document.body altında olmalı').toBe(
      document.body,
    )
    expect(screen.getByTestId('kart')).not.toContainElement(dialog)
    expect(screen.getByRole('button', { name: 'Oynat' })).toHaveFocus()
  })

  it('Tab sınırlarında odağı dialog içinde döndürür', async () => {
    const { user } = await openDialog('Matrix')
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(screen.getByRole('button', { name: 'Oynat' })).toHaveFocus()
  })

  it('Escape sonrası dialogu kaldırır ve odağı açan düğmeye geri verir', async () => {
    const { user, trigger } = await openDialog('Başlangıç')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('dialogun içine tıklamak kapatmaz, arka plana tıklamak kapatır', async () => {
    const { user, trigger } = await openDialog('Yıldızlararası')
    const dialog = screen.getByRole('dialog', { name: 'Yıldızlararası fragmanı' })
    await user.click(screen.getByRole('heading', { name: 'Yıldızlararası fragmanı' }))
    await user.click(dialog)
    expect(screen.getByRole('dialog'), 'İçeri tıklama dialogu kapattı').toBeInTheDocument()
    await user.click(dialog.parentElement!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('Kapat düğmesi de kapatıp odağı geri verir', async () => {
    const { user, trigger } = await openDialog('Matrix')
    await user.click(screen.getByRole('button', { name: 'Kapat' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
