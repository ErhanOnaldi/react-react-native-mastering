import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { setupStore } from '@project/src/app/store'
import { MovieDetailsPage } from '@project/src/pages/MovieDetailsPage'
import { Tabs } from '@project/src/shared/ui/tabs/Tabs'
import { renderWithRouter } from '@project/src/test/render'

function Demo({ label = 'Film bilgileri' }: { label?: string }) {
  return (
    <Tabs defaultValue="summary">
      <Tabs.List aria-label={label}>
        <Tabs.Trigger value="summary">Özet</Tabs.Trigger>
        <Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>
        <Tabs.Trigger value="videos">Videolar</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="summary">Dövüş Kulübü özeti</Tabs.Panel>
      <Tabs.Panel value="cast">Brad Pitt, Edward Norton</Tabs.Panel>
      <Tabs.Panel value="videos">Resmi fragman</Tabs.Panel>
    </Tabs>
  )
}

function renderDetails(id: number) {
  return renderWithRouter(
    [
      {
        path: '/movie/:id',
        element: (
          <Provider store={setupStore()}>
            <MovieDetailsPage />
          </Provider>
        ),
      },
    ],
    { route: `/movie/${id}` },
  )
}

describe('Sinema Tabs', () => {
  it('başlangıçta Özet seçili; diğer sekmeler Tab sırası dışında ve panel sekmeye bağlı', () => {
    render(<Demo />)
    expect(screen.getByRole('tablist', { name: 'Film bilgileri' })).toBeInTheDocument()
    const tab = screen.getByRole('tab', { name: 'Özet' })
    const panel = screen.getByRole('tabpanel', { name: 'Özet' })
    expect(tab).toHaveAttribute('aria-selected', 'true')
    expect(tab).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Oyuncular' })).toHaveAttribute('tabindex', '-1')
    expect(tab.getAttribute('aria-controls')).toBe(panel.id)
    expect(panel).toHaveTextContent('Dövüş Kulübü özeti')
    expect(screen.queryByRole('tabpanel', { name: 'Oyuncular' })).not.toBeInTheDocument()
  })

  it('ok tuşları döngüyle focus ve seçimi birlikte taşır', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.tab()
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Videolar' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Videolar' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Videolar' })).toHaveTextContent('Resmi fragman')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveFocus()
    expect(screen.getByRole('tabpanel', { name: 'Özet' })).toBeInTheDocument()
  })

  it('Home ve End ilk ve son sekmeye gider', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.tab()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Videolar' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveAttribute('aria-selected', 'true')
  })

  it('aynı sayfadaki iki Tabs’in id’leri çakışmaz', () => {
    render(
      <>
        <Demo label="Birinci" />
        <Demo label="İkinci" />
      </>,
    )
    const ids = screen.getAllByRole('tab').map((tab) => tab.id)
    expect(ids.every(Boolean), 'Her sekmenin bir id’si olmalı').toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('550 detayında gerçek oyuncu ve video verisini sekmelerde gösterir', async () => {
    const user = userEvent.setup()
    renderDetails(550)
    expect(await screen.findByRole('tablist', { name: 'Film bilgileri' })).toBeInTheDocument()
    const tablist = screen.getByRole('tablist', { name: 'Film bilgileri' })
    expect(within(tablist).queryByRole('button', { name: 'Fragmanı aç' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fragmanı aç' })).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Oyuncular' }))
    expect(screen.getByRole('tabpanel', { name: 'Oyuncular' })).toHaveTextContent('Edward Norton')
    await user.click(screen.getByRole('tab', { name: 'Videolar' }))
    expect(screen.getByRole('tabpanel', { name: 'Videolar' })).toHaveTextContent(
      'Fight Club Trailer HD',
    )
  })

  it('videosu olmayan filmde Videolar sekmesi üretmez', async () => {
    renderDetails(1368337)
    expect(await screen.findByRole('tablist', { name: 'Film bilgileri' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Özet' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Oyuncular' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Videolar' })).not.toBeInTheDocument()
  })
})
