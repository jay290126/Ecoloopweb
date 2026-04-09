import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../services/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await register(username.trim(), email.trim(), password)
      toast.success('Account created!')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">
        Create your account
      </div>
      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{' '}
        <Link className="text-emerald-600 hover:underline" to="/login">
          Login
        </Link>
        .
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Username"
          placeholder="Jay Patel"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least 6 characters recommended."
        />
        <Button type="submit" className="w-full" isLoading={loading}>
          <UserPlus className="h-4 w-4" />
          Create account
        </Button>
      </form>
    </div>
  )
}

