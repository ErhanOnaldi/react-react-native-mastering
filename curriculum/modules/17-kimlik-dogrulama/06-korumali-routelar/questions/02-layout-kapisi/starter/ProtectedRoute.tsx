import { Outlet } from 'react-router'
export function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  return <Outlet />
}
