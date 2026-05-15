import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RecoverPasswordPage, SignUpPage } from '@/features/auth'
import { DashboardPage } from '@/pages'
import { hasValidAccessToken } from '@/shared'
import { ProtectedRoute } from './ProtectedRoute'
import { routePaths } from './routePaths'

const AuthRedirect = () => {
  return (
    <Navigate
      to={hasValidAccessToken() ? routePaths.dashboard : routePaths.login}
      replace
    />
  )
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routePaths.root} element={<AuthRedirect />} />
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.signup} element={<SignUpPage />} />
      <Route
        path={routePaths.recoverPassword}
        element={<RecoverPasswordPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path={routePaths.dashboard} element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  )
}
