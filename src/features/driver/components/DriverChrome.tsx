import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Asterisk, User } from 'lucide-react'
import { path } from '../../../app/screens'
import { LogoTile } from '../../../design'
import { cn } from '../../../lib/format'

/** Bandeau sombre tout en haut des écrans chauffeur (« MODE COURSE ACTIVE », « SYNC RÉSEAU »…). */
export function DriverStrip({ left, right, dot = 'ocre' }: { left: string; right?: ReactNode; dot?: 'ocre' | 'vert' }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 bg-sombre px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white">
      <span className="flex min-w-0 items-center gap-1.5 truncate">
        <span className={cn('h-2 w-2 shrink-0 rounded-full', dot === 'vert' ? 'bg-vert-action' : 'bg-[#b08a45]')} />
        {left}
      </span>
      {right && <span className="flex shrink-0 items-center gap-1 text-jaune-soleil">{right}</span>}
    </div>
  )
}

/** En-tête « mode course » (D8, D10, D12) : retour, titre en capitales, profil, SOS. */
export function CourseHeader({ title, back = path('D7') }: { title: string; back?: string }) {
  const navigate = useNavigate()
  return (
    <header className="z-10 flex shrink-0 items-center gap-2.5 bg-surface-haut px-4 py-2.5 shadow-[0_1px_0_rgb(20_27_43/0.04)]">
      <button
        type="button"
        aria-label="Retour"
        onClick={() => navigate(back)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-fond-carte text-encre"
      >
        <ArrowLeft size={21} />
      </button>
      <LogoTile size={32} />
      <span className="min-w-0 flex-1 truncate text-[18px] font-bold uppercase">{title}</span>
      <button
        type="button"
        aria-label="Profil"
        onClick={() => navigate(path('D5'))}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-vert-fondation text-white"
      >
        <User size={17} />
      </button>
      <button
        type="button"
        aria-label="SOS"
        onClick={() => navigate(`${path('D9')}#sos`)}
        className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-rouge-pale text-rouge-sos"
      >
        <Asterisk size={24} strokeWidth={3} />
      </button>
    </header>
  )
}
