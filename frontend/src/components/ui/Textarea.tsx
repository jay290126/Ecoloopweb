import React from 'react'
import { cn } from '../../lib/cn'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({
  className,
  label,
  hint,
  error,
  id,
  ...props
}: Props) {
  const inputId = id || props.name
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </div>
      ) : null}
      <textarea
        id={inputId}
        className={cn(
          'min-h-24 w-full resize-y rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-600',
          error
            ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20'
            : 'border-slate-200',
          className,
        )}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-xs text-rose-500">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </div>
      ) : null}
    </label>
  )
}

