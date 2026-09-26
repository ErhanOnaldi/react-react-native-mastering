import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs } from './Tabs'

function Demo() {
  return (
    <Tabs defaultValue="summary">
      <Tabs.List aria-label="Film bilgileri">
        <Tabs.Trigger value="summary">Özet</Tabs.Trigger>
        <Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>
        <Tabs.Trigger value="videos">Videolar</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="summary">Özet metni</Tabs.Panel>
      <Tabs.Panel value="cast">Keanu Reeves</Tabs.Panel>
      <Tabs.Panel value="videos">Fragman</Tabs.Panel>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('seçili sekmeyi paneline bağlar, diğer panelleri gizler', () => {
    render(<Demo />)
    const tab = screen.getByRole('tab', { name: 'Özet' })
    const panel = screen.getByRole('tabpanel', { name: 'Özet' })
    expect(tab).toHaveAttribute('aria-controls', panel.id)
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
  })

  it('yön tuşları ve Home/End ile focus ve seçimi taşır', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Oyuncular' })).toHaveFocus()
    expect(
      screen.getByRole('tabpanel', { name: 'Oyuncular' }),
    ).toHaveTextContent('Keanu Reeves')
    await user.keyboard('{End}{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Videolar' })).toHaveFocus()
  })
})
