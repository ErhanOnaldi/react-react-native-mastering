import { Profiler } from 'react'
import { act, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { setupStore } from '@/app/store'
import { toggleFavorite } from '@/features/favorites/store/favoritesSlice'
import { setTheme } from '@/features/ui/store/uiSlice'
import { ThemeControl } from './ThemeControl'

describe('Tema tüketicisinin render sayısı', () => {
  it('favori değişince yeniden render olmaz, tema değişince olur', () => {
    const store = setupStore()
    let renders = 0
    render(
      <Provider store={store}>
        <Profiler
          id="theme"
          onRender={() => {
            renders += 1
          }}
        >
          <ThemeControl />
        </Profiler>
      </Provider>,
    )
    const initialRenders = renders
    act(() => {
      store.dispatch(toggleFavorite(550))
    })
    expect(renders - initialRenders).toBe(0)
    const nextTheme = store.getState().ui.theme === 'light' ? 'dark' : 'light'
    act(() => {
      store.dispatch(setTheme(nextTheme))
    })
    expect(renders).toBeGreaterThan(initialRenders)
  })
})
