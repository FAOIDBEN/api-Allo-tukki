import type { ReactNode } from 'react'
import { cn } from '../lib/format'

type Tone = 'vert' | 'vertPlein' | 'menthe' | 'jaune' | 'rouge' | 'lavande' | 'blanc' | 'sombre'

const tones: Record<Tone, string> = {
  vert: 'bg-vert-clair text-vert-fondation',
  vertPlein: 'bg-vert-fondation text-white',
  menthe: 'bg-vert-menthe text-vert-fondation',
  jaune: 'bg-jaune-pale text-brun-ocre',
  rouge: 'bg-rouge-pale text-rouge-sos',
  lavande: 'bg-fond-carte text-vert-fondation',
  blanc: 'bg-white text-vert-fondation',
  sombre: 'bg-sombre text-white',
}

export function IconTile({
  tone = 'vert',
  size = 44,
  round,
  className,
  children,
}: {
  tone?: Tone
  size?: number
  round?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', round ? 'rounded-full' : 'rounded-[12px]', tones[tone], className)}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  )
}

/** Tuile logo Allo Tukki (icône d'app). */
export function LogoTile({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/images/logo.png"
      alt="Allo Tukki"
      width={size}
      height={size}
      className={cn('shrink-0 rounded-[9px]', className)}
      style={{ width: size, height: size }}
    />
  )
}
