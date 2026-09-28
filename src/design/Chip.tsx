import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../lib/format'

export function Chip({
  selected,
  onClick,
  icon,
  className,
  children,
}: {
  selected?: boolean
  onClick?: () => void
  icon?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex min-h-10 items-center gap-1.5 rounded-[12px] px-3.5 py-2 text-sm font-semibold transition-colors',
        selected ? 'bg-vert-fondation text-white' : 'bg-fond-carte text-encre hover:bg-[#dde1f7]',
        className,
      )}
    >
      {selected ? <Check size={16} strokeWidth={2.5} /> : icon}
      {children}
    </button>
  )
}
