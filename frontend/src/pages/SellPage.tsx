import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ImagePlus, IndianRupee, PlusCircle } from 'lucide-react'
import { api, getApiErrorMessage } from '../services/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'

async function fileToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

export function SellPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && description.trim().length >= 5 && !!price
  }, [name, description, price])

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2.5 * 1024 * 1024) {
      toast.error('Image too large. Please pick under 2.5MB.')
      return
    }
    const b64 = await fileToBase64(file)
    setImage(b64)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    try {
      await api.post('/products', {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        image,
      })
      toast.success('Product listed!')
      setName('')
      setDescription('')
      setPrice('')
      setImage(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              Sell an item
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Add details and a photo. Buyers will see it instantly.
            </div>
          </div>
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            Browse items
          </Button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <Input
            label="Product name"
            placeholder="e.g. Study table"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Condition, brand, reason for selling…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-[42px] text-slate-400">
                <IndianRupee className="h-4 w-4" />
              </div>
              <Input
                label="Price"
                placeholder="499"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-9"
              />
            </div>

            <label className="block">
              <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Image (optional)
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
                <div className="inline-flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" />
                  <span>Upload photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPickImage}
                  className="block w-[115px] text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-700"
                />
              </div>
            </label>
          </div>

          {image ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
                <div className="font-medium">Preview</div>
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="text-xs font-medium text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <img src={image} alt="Preview" className="max-h-72 w-full object-cover" />
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <Button
              type="submit"
              isLoading={loading}
              disabled={!canSubmit}
              className="min-w-40"
            >
              <PlusCircle className="h-4 w-4" />
              Publish listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

