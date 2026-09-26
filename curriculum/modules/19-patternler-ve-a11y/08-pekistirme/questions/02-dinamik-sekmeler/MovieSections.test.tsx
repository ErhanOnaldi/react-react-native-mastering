import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MovieSections } from '@exercise/MovieSections'
describe('Film bölümleri', () => {
  it('videos yokken boş sekmeyi çıkarır ve gerçek film verisini gösterir', () => {
    render(<MovieSections title="Dövüş Kulübü" cast={['Brad Pitt', 'Edward Norton']} videos={[]} />)
    expect(screen.queryByRole('tab', { name: 'Videolar' })).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Dövüş Kulübü')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tabpanel', { name: 'Özet' })).toBeInTheDocument()
  })
  it('iki sekmede sağ ok sonuncudan ilkine döner', async () => {
    const user = userEvent.setup()
    render(<MovieSections title="Matrix" cast={['Keanu Reeves']} videos={[]} />)
    screen.getByRole('tab', { name: 'Özet' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Oyuncular' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Keanu Reeves')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveFocus()
  })
  it('video varsa üçüncü sekmeyi erişilebilir şekilde seçer', async () => {
    const user = userEvent.setup()
    render(<MovieSections title="Başlangıç" cast={[]} videos={['Resmi fragman']} />)
    await user.click(screen.getByRole('tab', { name: 'Videolar' }))
    expect(screen.getByRole('tab', { name: 'Videolar' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Videolar' })).toHaveTextContent('Resmi fragman')
  })
  it('video verisi kaybolunca boş panel yerine Özet seçimini gösterir', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <MovieSections title="Başlangıç" cast={[]} videos={['Resmi fragman']} />,
    )
    await user.click(screen.getByRole('tab', { name: 'Videolar' }))
    rerender(<MovieSections title="Başlangıç" cast={[]} videos={[]} />)
    expect(screen.queryByRole('tab', { name: 'Videolar' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveFocus()
    expect(screen.getByRole('tabpanel', { name: 'Özet' })).toHaveTextContent('Başlangıç')
  })
})
