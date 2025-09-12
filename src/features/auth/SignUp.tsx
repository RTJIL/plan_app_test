import React, { useState } from 'react'
import { useAuth } from './hooks'
import { useNavigate } from 'react-router-dom'

import { Link } from 'react-router-dom'

export default function SignUp() {
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    try {
      await register(email, password, displayName)
      navigate('/events/calendar')
    } catch (err) {
      if (err instanceof Error) setErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        
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
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <div className="text-right">
          <Link to="/auth/signIn" className="text-indigo-600">
            SignIn
          </Link>
        </div>
      </form>
    </div>
  )
}
