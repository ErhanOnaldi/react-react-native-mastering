import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tabs } from '@exercise/Tabs'
function Demo() {
  return (
    <Tabs defaultValue="summary">
      <Tabs.List aria-label="Film bilgileri">
        <Tabs.Trigger value="summary">Özet</Tabs.Trigger>
        <Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="summary">Dövüş Kulübü özeti</Tabs.Panel>
      <Tabs.Panel value="cast">Oyuncu listesi</Tabs.Panel>
    </Tabs>
  )
}
describe('Compound Tabs', () => {
  it('başlangıçta yalnızca seçili paneli ve adlandırılmış tab listesini gösterir', () => {
    render(<Demo />)
    expect(screen.getByRole('tablist', { name: 'Film bilgileri' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Dövüş Kulübü özeti')
    expect(screen.queryByText('Oyuncu listesi')).not.toBeInTheDocument()
  })
  it('tıklamayla seçimi ve paneli birlikte değiştirir', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('tab', { name: 'Oyuncular' }))
    expect(screen.getByRole('tab', { name: 'Oyuncular' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Oyuncu listesi')
  })
  it('Tabs dışında kullanılan parça sessiz kalmaz, anlaşılır hata fırlatır', () => {
    const silence = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>)).toThrow(/Tabs/)
    silence.mockRestore()
  })
})
