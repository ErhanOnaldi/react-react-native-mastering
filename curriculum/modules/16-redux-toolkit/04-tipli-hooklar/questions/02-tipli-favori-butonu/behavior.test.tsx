import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { FavoriteButton, ThemeProbe, setupStore } from '@exercise/FavoriteButton'
describe('tipli favori butonu', () => {
  it('başlangıçtaki favoriyi gösterir', () => {
    render(
      <Provider store={setupStore([550])}>
        <FavoriteButton id={550} />
      </Provider>,
    )
    expect(screen.getByRole('button', { name: 'Favoriden çıkar' })).toBeInTheDocument()
  })
  it('tıklayınca gerçek store ve görünür etiket birlikte değişir', async () => {
    const store = setupStore()
    render(
      <Provider store={store}>
        <FavoriteButton id={550} />
      </Provider>,
    )
    await userEvent.setup().click(screen.getByRole('button', { name: 'Favorilere ekle' }))
    expect(store.getState().favorites.ids).toEqual([550])
    expect(screen.getByRole('button', { name: 'Favoriden çıkar' })).toBeInTheDocument()
  })
  it('favori action’ı tema tüketicisinin render sayacını artırmaz', async () => {
    const store = setupStore()
    render(
      <Provider store={store}>
        <FavoriteButton id={550} />
        <ThemeProbe />
      </Provider>,
    )
    const before = screen.getByLabelText('Tema render sayacı').textContent
    await userEvent.setup().click(screen.getByRole('button', { name: 'Favorilere ekle' }))
    expect(screen.getByLabelText('Tema render sayacı').textContent).toBe(before)
  })
})
