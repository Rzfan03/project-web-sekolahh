import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiLogIn, FiArrowLeft } from 'react-icons/fi'
import { login } from '../../lib/auth'
import { SCHOOL_LOGO } from '../../lib/logo'
import { Button } from '../../lib/ui/Button'
import { Input } from '../../lib/ui/Input'

const BG_IMAGE = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string } | null)?.from || '/admin/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email dan password wajib diisi!')
      return
    }
    setLoading(true)
    const { error: authError } = await login(email, password)
    if (authError) {
      setError('Email atau password salah!')
      setLoading(false)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0">
        <img src={BG_IMAGE} alt="" className="size-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/90 via-orange-500/80 to-orange-600/90" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-orange-100">
              <img src={SCHOOL_LOGO} alt="Logo SMKN 1 Sumbawa Besar" className="size-full object-contain p-1" />
            </div>
            <h1 className="mt-4 text-center text-xl font-bold text-gray-900">SMKN 1 Sumbawa Besar</h1>
            <p className="mt-1 text-sm text-gray-500">Silakan masuk ke panel admin</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              autoComplete="email"
              disabled={loading}
            />
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg" icon={FiLogIn} loading={loading} disabled={loading}>
              {loading ? 'Memeriksa...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-orange-500">
              <FiArrowLeft className="size-4" />
              Kembali ke website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
