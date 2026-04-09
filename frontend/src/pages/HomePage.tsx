import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Filter, Search } from 'lucide-react'
import { api, getApiErrorMessage } from '../services/api'
import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function HomePage() {
  const navigate = useNavigate()
  const { isAuthed } = useAuth()

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())

  const [q, setQ] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  async function loadAll() {
    setLoading(true)
    try {
      const res = await api.get('/products')
      setProducts(res.data?.products || [])
      if (isAuthed) {
        const w = await api.get('/wishlist')
        const ids = new Set<string>((w.data?.wishlist || []).map((p: any) => p._id))
        setWishlistIds(ids)
      } else {
        setWishlistIds(new Set())
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    const min = minPrice ? Number(minPrice) : null
    const max = maxPrice ? Number(maxPrice) : null
    return products.filter((p) => {
      const matchText =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      const price = Number(p.price || 0)
      const matchMin = min == null || price >= min
      const matchMax = max == null || price <= max
      return matchText && matchMin && matchMax
    })
  }, [products, q, minPrice, maxPrice])

  async function toggleWish(productId: string) {
    if (!isAuthed) {
      toast('Login to use wishlist')
      navigate('/login')
      return
    }
    try {
      const res = await api.post(`/wishlist/${productId}`)
      const wished = !!res.data?.wished
      setWishlistIds((prev) => {
        const next = new Set(prev)
        if (wished) next.add(productId)
        else next.delete(productId)
        return next
      })
      toast.success(wished ? 'Saved to wishlist' : 'Removed from wishlist')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-emerald-950/20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Buy & sell responsibly
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              A modern marketplace for pre-loved items
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Discover great deals, list your items in minutes, and track delivery
              status—from Pending to Delivered.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/sell')}>
              List an item
            </Button>
            <Button variant="ghost" onClick={loadAll} isLoading={loading}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search products…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Input
            placeholder="Min ₹"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max ₹"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Filter className="h-4 w-4" />
          Search & price filters run instantly (no page refresh).
        </div>
      </section>

      {loading ? (
        <div className="grid place-items-center rounded-3xl border border-slate-200 bg-white p-10 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-500" />
            <div className="text-sm font-medium">Loading products…</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <div className="text-base font-semibold text-slate-900 dark:text-white">
            No products found
          </div>
          <div className="mt-2 text-sm">
            Try clearing filters or list the first item.
          </div>
          <div className="mt-5 flex justify-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setQ('')
                setMinPrice('')
                setMaxPrice('')
              }}
            >
              Clear filters
            </Button>
            <Button onClick={() => navigate('/sell')}>Sell an item</Button>
          </div>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              wished={wishlistIds.has(p._id)}
              onToggleWish={() => void toggleWish(p._id)}
              onBuy={() => navigate(`/checkout/${p._id}`)}
            />
          ))}
        </section>
      )}
    </div>
  )
}

