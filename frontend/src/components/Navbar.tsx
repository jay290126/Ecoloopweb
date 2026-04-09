import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Heart,
  LogIn,
  LogOut,
  Moon,
  PackageSearch,
  PlusCircle,
  Sun,
  Truck,
  UserCircle2,
} from 'lucide-react'
import { cn } from '../lib/cn'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/Button'

export function Navbar({
  isDark,
  onToggleDark,
}: {
  isDark: boolean
  onToggleDark: () => void
}) {
  const { isAuthed, user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="container-app flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <PackageSearch className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              ecoLoop
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Marketplace
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                'rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60',
                isActive && 'bg-slate-100 dark:bg-slate-900/60',
              )
            }
          >
            Browse
          </NavLink>

          {isAuthed ? (
            <>
              <NavLink
                to="/sell"
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60',
                    isActive && 'bg-slate-100 dark:bg-slate-900/60',
                  )
                }
              >
                Sell
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60',
                    isActive && 'bg-slate-100 dark:bg-slate-900/60',
                  )
                }
              >
                My Orders
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60',
                    isActive && 'bg-slate-100 dark:bg-slate-900/60',
                  )
                }
              >
                Wishlist
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900/60"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthed ? (
            <>
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 sm:flex">
                <UserCircle2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="max-w-40 truncate">{user?.username}</span>
              </div>

              <Button
                variant="ghost"
                onClick={() => navigate('/sell')}
                className="hidden md:inline-flex"
              >
                <PlusCircle className="h-4 w-4" />
                List item
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate('/orders')}
                className="hidden md:inline-flex"
              >
                <Truck className="h-4 w-4" />
                Orders
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate('/wishlist')}
                className="hidden md:inline-flex"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')}>
                Create account
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

