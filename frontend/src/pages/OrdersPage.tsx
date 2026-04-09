import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Calendar, MapPin, Package, Truck } from 'lucide-react'
import { api, getApiErrorMessage } from '../services/api'
import type { Order, OrderStatus } from '../types'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

const statusSteps: OrderStatus[] = [
  'Pending',
  'Shipped',
  'Out for Delivery',
  'Delivered',
]

function toneFor(status: OrderStatus) {
  if (status === 'Delivered') return 'success'
  if (status === 'Out for Delivery') return 'info'
  if (status === 'Shipped') return 'warning'
  return 'neutral'
}

export function OrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/orders')
      setOrders(res.data?.orders || [])
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const sorted = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [orders])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            My Orders
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Track delivery status: Pending → Shipped → Out for Delivery → Delivered.
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
            Loading orders…
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-950">
          <div className="text-base font-semibold text-slate-900 dark:text-white">
            No orders yet
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Place an order from the marketplace to see it here.
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((o) => {
            const idx = statusSteps.indexOf(o.status)
            return (
              <div
                key={o._id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        Order #{o.orderId}
                      </div>
                      <Badge tone={toneFor(o.status)}>{o.status}</Badge>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {o.productId?.name} • ₹
                        {Number(o.productId?.price || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {o.address?.city} • {o.address?.pincode}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    Payment: {o.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI (demo)'}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Delivery progress
                    </span>
                    <span>
                      Step {Math.max(1, idx + 1)} / {statusSteps.length}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {statusSteps.map((s, i) => {
                      const active = i <= idx
                      return (
                        <div key={s} className="flex flex-col gap-2">
                          <div
                            className={`h-2 rounded-full ${
                              active
                                ? 'bg-emerald-600 dark:bg-emerald-500'
                                : 'bg-slate-200 dark:bg-slate-800'
                            }`}
                          />
                          <div
                            className={`text-[11px] font-medium ${
                              active
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {s}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-200">
                    <div className="font-semibold">Delivery Address</div>
                    <div className="mt-1">
                      {o.address?.fullName} • {o.address?.phone}
                    </div>
                    <div className="mt-1 text-slate-600 dark:text-slate-300">
                      {o.address?.addressLine}, {o.address?.city} - {o.address?.pincode}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

