import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { HeartOff } from 'lucide-react'
import { api, getApiErrorMessage } from '../services/api'
import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { Button } from '../components/ui/Button'

export function WishlistPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<Product[]>([])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/wishlist')
      setWishlist(res.data?.wishlist || [])
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function remove(productId: string) {
    try {
      await api.post(`/wishlist/${productId}`)
      toast.success('Removed from wishlist')
      setWishlist((prev) => prev.filter((p) => p._id !== productId))
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            Wishlist
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Items you saved for later.
          </div>
        </div>
        <Button variant="ghost" onClick={load} isLoading={loading}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid place-items-center rounded-3xl border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-500" />
            Loading wishlist…
          </div>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-200">
            <HeartOff className="h-6 w-6" />
          </div>
          <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            Your wishlist is empty
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Browse products and hit “Save” to add them here.
          </div>
          <div className="mt-5">
            <Button onClick={() => navigate('/')}>Browse marketplace</Button>
          </div>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              wished
              onToggleWish={() => void remove(p._id)}
              onBuy={() => navigate(`/checkout/${p._id}`)}
            />
          ))}
        </section>
      )}
    </div>
  )
}

