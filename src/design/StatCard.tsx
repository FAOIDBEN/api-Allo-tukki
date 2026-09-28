import type { ReactNode } from 'react'
import { cn } from '../lib/format'

/** Carte d'indicateur de la centrale (W1, W5). Purement présentationnelle. */
export function StatCard({
  label,
  icon,
  value,
  unit,
  trend,
  caption,
  footer,
  valueClassName,
  className,
}: {
  label: string
  icon?: ReactNode
  value: ReactNode
  unit?: ReactNode
  trend?: ReactNode
  caption?: ReactNode
  footer?: ReactNode
  valueClassName?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col rounded-carte bg-surface p-5 shadow-douce', className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[12px] font-bold uppercase leading-tight tracking-wide text-encre-douce">{label}</span>
        {icon}
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className={cn('text-[34px] font-extrabold leading-none tracking-tight', valueClassName)}>{value}</span>
        {unit && <span className="text-sm font-bold">{unit}</span>}
        {trend}
      </div>
      {caption && <div className="mt-2 text-[13px] leading-snug text-gris-texte">{caption}</div>}
      {footer && <div className="mt-auto pt-4">{footer}</div>}
    </div>
  )
}
