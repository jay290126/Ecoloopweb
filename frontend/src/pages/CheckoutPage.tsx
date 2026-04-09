import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CreditCard, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { api, getApiErrorMessage } from '../services/api'
import type { Product } from '../types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'

type PaymentMethod = 'COD' | 'UPI'

export function CheckoutPage() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const [loadingProduct, setLoadingProduct] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  const [fullName, setFullName] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [phone, setPhone] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('COD')

  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    async function load() {
      setLoadingProduct(true)
      try {
        const res = await api.get('/products')
        const list = (res.data?.products || []) as Product[]
        const found = list.find((p) => p._id === productId)
        setProduct(found || null)
        if (!found) toast.error('Product not found')
      } catch (err) {
        toast.error(getApiErrorMessage(err))
      } finally {
        setLoadingProduct(false)
      }
    }
    if (productId) void load()
  }, [productId])

  const canPlace = useMemo(() => {
    return (
      !!productId &&
      !!product &&
      fullName.trim().length >= 2 &&
      addressLine.trim().length >= 6 &&
      city.trim().length >= 2 &&
      pincode.trim().length >= 4 &&
      phone.trim().length >= 8
    )
  }, [productId, product, fullName, addressLine, city, pincode, phone])

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!canPlace) return
    setPlacing(true)
    try {
      const res = await api.post('/order', {
        productId,
        address: {
          fullName: fullName.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          phone: phone.trim(),
        },
        paymentMethod: payment,
      })
      const orderId = res.data?.order?.orderId || res.data?.orderId
      toast.success(`Order placed! Order ID: ${orderId}`)
      navigate('/orders', { replace: true })
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setPlacing(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="grid place-items-center rounded-3xl border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-500" />
          Loading checkout…
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-950">
        <div className="text-base font-semibold text-slate-900 dark:text-white">
          Product not found
        </div>
        <div className="mt-4">
          <Button onClick={() => navigate('/')}>Back to marketplace</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            Checkout
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Enter delivery details and choose a demo payment method.
          </div>

          <form onSubmit={placeOrder} className="mt-6 grid gap-4">
            <Input
              label="Full Name"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Textarea
              label="Address"
              placeholder="House no, street, landmark…"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="City"
                placeholder="Ahmedabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="Pincode"
                placeholder="380001"
                inputMode="numeric"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <Input
              label="Phone number"
              placeholder="9876543210"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Payment (demo)
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/30">
                  <input
                    type="radio"
                    name="pay"
                    checked={payment === 'COD'}
                    onChange={() => setPayment('COD')}
                  />
                  Cash on Delivery
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/30">
                  <input
                    type="radio"
                    name="pay"
                    checked={payment === 'UPI'}
                    onChange={() => setPayment('UPI')}
                  />
                  UPI (fake)
                </label>
              </div>
            </div>

            <Button type="submit" isLoading={placing} disabled={!canPlace}>
              Place order
            </Button>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Secure checkout (demo)
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery tracking enabled
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                SMS not actually sent
              </span>
            </div>
          </form>
        </div>
      </div>

      <aside className="lg:col-span-2">
        <div className="sticky top-24 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="p-5">
              <div className="text-base font-semibold text-slate-900 dark:text-white">
                {product.name}
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {product.description}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{Number(product.price || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <CreditCard className="h-4 w-4" />
                Payment methods are demo-only.
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

