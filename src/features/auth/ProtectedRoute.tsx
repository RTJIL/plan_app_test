import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks'
import type { JSX } from 'react'

interface ProtectedRouteProps {
  children: JSX.Element
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div>/// Loading ///</div>

  if (!user) return <Navigate to={'/auth/signIn'} state={{ from: location }} />

  return children
}
