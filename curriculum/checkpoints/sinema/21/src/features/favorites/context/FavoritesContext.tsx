import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/store'

/** Eski sayfa testleri için Redux sağlayıcısı. Uygulama main.tsx içindeki Provider'ı kullanır. */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
