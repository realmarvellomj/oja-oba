
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, refreshProfile } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')

    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail) {
      setError('Please enter your email address.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    const { error: signInError } = await signIn(
      trimmedEmail,
      password,
    )

    if (signInError) {
      setLoading(false)
      setError(signInError.message)
      return
    }

    const profile = await refreshProfile()

    setLoading(false)

    if (!profile) {
      setError(
        'Login succeeded, but we could not load your account profile. Please try again.',
      )
      return
    }

    if (profile.status !== 'active') {
      setError(
        'Your account is currently ' +
          profile.status +
          '. Please contact ỌJA ỌBA support.',
      )
      return
    }

    switch (profile.role) {
      case 'admin':
      case 'support':
        navigate('/admin', { replace: true })
        return

      case 'merchant':
        navigate('/merchant', { replace: true })
        return

      case 'rider':
        navigate('/rider', { replace: true })
        return

      case 'customer':
      default:
        navigate('/customer', { replace: true })
        return
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900"
            >
              <ShoppingBag className="text-orange-500" size={28} />
              ỌJA <span className="text-orange-500">ỌBA</span>
            </Link>

            <h1 className="mt-6 text-3xl font-black text-slate-950">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Log in to continue to your ỌJA ỌBA account.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
