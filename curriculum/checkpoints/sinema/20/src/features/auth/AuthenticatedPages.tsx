import { useAppSelector } from '@/app/store'
import { ProtectedRoute } from './ProtectedRoute'

/** Oturum yoksa korumalı sayfaları /login'e yönlendiren layout route'u. */
export function AuthenticatedPages() {
  const isAuthenticated = useAppSelector((state) =>
    Boolean(state.auth.accessToken),
  )
  return <ProtectedRoute isAuthenticated={isAuthenticated} />
}
