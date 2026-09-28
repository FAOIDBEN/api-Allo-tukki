import type { ReactNode } from 'react'
import { cn } from '../lib/format'

export type BadgeTone = 'vert' | 'vertPlein' | 'jaune' | 'soleil' | 'rouge' | 'rougePlein' | 'gris' | 'lavande' | 'sombre'

const tones: Record<BadgeTone, string> = {
  vert: 'bg-vert-menthe text-vert-fondation',
  vertPlein: 'bg-vert-fondation text-white',
  jaune: 'bg-jaune-pale text-brun-ocre',
  soleil: 'bg-jaune-soleil text-encre',
  rouge: 'bg-rouge-pale text-rouge-sos',
  rougePlein: 'bg-rouge-sos text-white',
  gris: 'bg-gris-bord text-gris-texte',
  lavande: 'bg-fond-carte text-encre-douce',
  sombre: 'bg-encre text-white',
}

export function Badge({
  tone = 'vert',
  icon,
  className,
  children,
}: {
  tone?: BadgeTone
  icon?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-bold',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
