import { Navigate, Outlet, useLocation } from 'react-router'

export function ProtectedRoute({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  const location = useLocation()
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}
