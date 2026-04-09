import { Heart, ShoppingBag } from 'lucide-react'
import { cn } from '../lib/cn'
import type { Product } from '../types'
import { Button } from './ui/Button'

export function ProductCard({
  product,
  wished,
  onToggleWish,
  onBuy,
}: {
  product: Product
  wished: boolean
  onToggleWish: () => void
  onBuy: () => void
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No image
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            onToggleWish()
          }}
          className={cn(
            'absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/80 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-950',
          )}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn(
              'h-5 w-5',
              wished
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-700 dark:text-slate-200',
            )}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-slate-900 dark:text-white">
              {product.name}
            </div>
            <div className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
              {product.description}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Price
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ₹{Number(product.price || 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={onBuy}>
            <ShoppingBag className="h-4 w-4" />
            Buy Now
          </Button>
          <Button
            variant="ghost"
            onClick={onToggleWish}
            className="h-10 px-3"
          >
            {wished ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

