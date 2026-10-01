import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { setupStore, WatchCounter } from '@impl/WatchCounter'

describe('gerçek store ile bileşen', () => {
  it('başlangıç state’indeki kayıt sayısını gösterir', () => {
    render(
      <Provider store={setupStore([550, 603])}>
        <WatchCounter />
      </Provider>,
    )
    expect(screen.getByText('2 film')).toBeInTheDocument()
  })

  it('tıklama store’u ve çıktıyı günceller, aynı ID’yi tekrarlamaz', async () => {
    const user = userEvent.setup()
    const store = setupStore()
    render(
      <Provider store={store}>
        <WatchCounter />
      </Provider>,
    )
    await user.click(screen.getByRole('button', { name: '550 ekle' }))
    await user.click(screen.getByRole('button', { name: '550 ekle' }))
    expect(screen.getByText('1 film')).toBeInTheDocument()
    expect(store.getState().watchlists.ids).toEqual([550])
  })
})
