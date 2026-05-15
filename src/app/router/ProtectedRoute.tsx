import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasValidAccessToken } from '@/shared'
import { routePaths } from './routePaths'

export const ProtectedRoute = () => {
  const location = useLocation()

  if (!hasValidAccessToken()) {
    return <Navigate to={routePaths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
