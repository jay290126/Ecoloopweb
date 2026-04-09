import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../services/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as any
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email.trim(), password)
      toast.success('Welcome back!')
      navigate(location?.state?.from || '/', { replace: true })
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-sm dark:border-slate-800 dark:from-emerald-950/25 dark:to-slate-950 lg:block">
        <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          ecoLoop Marketplace
        </div>
        <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Login to continue buying & selling
        </div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Track deliveries, manage wishlist, and see order statuses.
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="text-lg font-semibold text-slate-900 dark:text-white">
          Login
        </div>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link className="text-emerald-600 hover:underline" to="/register">
            Create an account
          </Link>
          .
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            <Mail className="h-4 w-4" />
            Login
          </Button>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4" />
              JWT protected APIs
            </div>
            <div>Token stored in localStorage</div>
          </div>
        </form>
      </div>
    </div>
  )
}

