import type { HTMLAttributes } from 'react'
import { cn } from '../lib/format'

type Tone = 'blanc' | 'lavande' | 'vert' | 'jaune' | 'rouge' | 'sombre'

const tones: Record<Tone, string> = {
  blanc: 'bg-surface shadow-douce',
  lavande: 'bg-fond-carte',
  vert: 'bg-vert-fondation text-white shadow-douce',
  jaune: 'bg-jaune-pale',
  rouge: 'bg-rouge-pale',
  sombre: 'bg-sombre text-white',
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone
  padded?: boolean
}

export function Card({ tone = 'blanc', padded = true, className, ...rest }: CardProps) {
  return <div className={cn('rounded-carte', tones[tone], padded && 'p-4', className)} {...rest} />
}
