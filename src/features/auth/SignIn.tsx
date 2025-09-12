import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from './hooks'

export default function SignIn() {
  const { login, googleLogin } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const navigateFrom = location.state?.from?.pathname || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(navigateFrom)
    } catch (err) {
      if (err instanceof Error) setErr(err.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setErr('')
    setLoading(true)

    try {
      await googleLogin()
      navigate(navigateFrom)
    } catch (err) {
      if (err instanceof Error) setErr(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Sign in</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full py-2 bg-indigo-600 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleGoogle}
          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
        >
          Sign in with Google
        </button>

        <Link to="/auth/signUp" className="text-sm text-indigo-600">
          Create account
        </Link>
      </div>
    </div>
  )
}
