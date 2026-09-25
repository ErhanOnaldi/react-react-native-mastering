import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { setupStore, WatchCounter } from '@exercise/WatchCounter'
describe('gerçek store ile bileşen', () => {
  it('preloaded state sayısını gösterir', () => {
    render(
      <Provider store={setupStore([550, 603])}>
        <WatchCounter />
      </Provider>,
    )
    expect(screen.getByText('2 film')).toBeInTheDocument()
  })
  it('tıklama store’u ve çıktıyı günceller, tekrar eklemez', async () => {
    const store = setupStore()
    render(
      <Provider store={store}>
        <WatchCounter />
      </Provider>,
    )
    const button = screen.getByRole('button', { name: '550 ekle' })
    await userEvent.setup().click(button)
    await userEvent.setup().click(button)
    expect(screen.getByText('1 film')).toBeInTheDocument()
    expect(store.getState().watchlists.ids).toEqual([550])
  })
})
