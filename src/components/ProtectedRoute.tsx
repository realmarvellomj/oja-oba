import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole } from '../types'

type ProtectedRouteProps = {
  allowedRoles?: UserRole[]
}

function getRoleHome(role: UserRole) {
  switch (role) {
    case 'admin':
    case 'support':
      return '/admin'

    case 'merchant':
      return '/merchant'

    case 'rider':
      return '/rider'

    case 'customer':
    default:
      return '/customer'
  }
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Checking your account...
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Profile unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            We could not load your ỌJA ỌBA profile. Please sign out and try
            again.
          </p>
        </div>
      </div>
    )
  }

  if (profile.status !== 'active') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Account restricted
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your account status is <strong>{profile.status}</strong>. Please
            contact ỌJA ỌBA support if you believe this is an error.
          </p>
        </div>
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={getRoleHome(profile.role)} replace />
  }

  return <Outlet />
}