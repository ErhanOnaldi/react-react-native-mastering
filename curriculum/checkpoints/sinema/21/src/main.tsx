import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/shared/api/query-client'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import '@/index.css'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { router } from '@/router'
import { reportError } from '@/shared/lib/report-error'

createRoot(document.getElementById('root')!, {
  onCaughtError(error, info) {
    void reportError(error, {
      kind: 'caught',
      componentStack: info.componentStack,
    })
  },
  onUncaughtError(error, info) {
    void reportError(error, {
      kind: 'uncaught',
      componentStack: info.componentStack,
    })
  },
  onRecoverableError(error, info) {
    void reportError(error, {
      kind: 'recoverable',
      componentStack: info.componentStack,
    })
  },
}).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
