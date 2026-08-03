import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export default function ProtectedRoute() {
  const location = useLocation()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/80">
        <div className="relative flex size-12 items-center justify-center">
          <div className="absolute size-12 animate-spin rounded-full border-4 border-gray-100" />
          <div className="absolute size-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
        <p className="mt-4 text-sm text-gray-400">Memeriksa sesi...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
