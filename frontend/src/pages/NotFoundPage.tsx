import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="text-2xl font-bold text-slate-900 dark:text-white">
        404
      </div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Page not found.
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button onClick={() => navigate('/')}>Marketplace</Button>
      </div>
    </div>
  )
}

