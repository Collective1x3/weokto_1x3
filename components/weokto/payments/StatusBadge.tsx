import { cn } from '@/lib/utils'

type Tone = 'default' | 'positive' | 'warning' | 'negative' | 'info'

const toneStyles: Record<Tone, string> = {
  default: 'bg-slate-800/60 text-slate-200 border border-slate-700/60',
  positive: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40',
  warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/40',
  negative: 'bg-rose-500/10 text-rose-300 border border-rose-500/40',
  info: 'bg-sky-500/10 text-sky-300 border border-sky-500/40'
}

export function StatusBadge({ label, tone = 'default' }: { label: string; tone?: Tone }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide', toneStyles[tone])}>
      {label}
    </span>
  )
}
