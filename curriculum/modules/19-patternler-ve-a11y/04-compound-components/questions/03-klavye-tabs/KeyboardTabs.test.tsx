import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { KeyboardTabs } from '@exercise/KeyboardTabs'
function Demo() {
  return (
    <KeyboardTabs defaultValue="summary">
      <KeyboardTabs.List aria-label="Film bilgileri">
        <KeyboardTabs.Trigger value="summary">Özet</KeyboardTabs.Trigger>
        <KeyboardTabs.Trigger value="cast">Oyuncular</KeyboardTabs.Trigger>
        <KeyboardTabs.Trigger value="video">Videolar</KeyboardTabs.Trigger>
      </KeyboardTabs.List>
      <KeyboardTabs.Panel value="summary">Özet içerik</KeyboardTabs.Panel>
      <KeyboardTabs.Panel value="cast">Oyuncu içerik</KeyboardTabs.Panel>
      <KeyboardTabs.Panel value="video">Video içerik</KeyboardTabs.Panel>
    </KeyboardTabs>
  )
}
describe('Klavye Tabs', () => {
  it('yalnızca seçili tabı Tab sırasına alır ve panelle iki yönlü bağlar', () => {
    render(<Demo />)
    const list = screen.getByRole('tablist', { name: 'Film bilgileri' })
    const summary = within(list).getByRole('tab', { name: 'Özet' })
    const cast = within(list).getByRole('tab', { name: 'Oyuncular' })
    expect(summary).toHaveAttribute('tabindex', '0')
    expect(cast).toHaveAttribute('tabindex', '-1')
    const panel = screen.getByRole('tabpanel')
    expect(summary.getAttribute('aria-controls')).toBe(panel.id)
    expect(panel).toHaveAttribute('aria-labelledby', summary.id)
    expect(screen.getByText('Oyuncu içerik')).toHaveAttribute('hidden')
  })
  it('sağ ok ve sol ok seçimi ve focusu döngüyle taşır', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    screen.getByRole('tab', { name: 'Özet' }).focus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Videolar' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Videolar' })).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveFocus()
  })
  it('Home ve End ilk ve son sekmeye gider', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    screen.getByRole('tab', { name: 'Özet' }).focus()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Videolar' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveFocus()
  })
})
