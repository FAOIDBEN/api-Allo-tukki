import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeft, Asterisk, Phone, User } from 'lucide-react'
import { cn } from '../lib/format'
import { LogoTile } from './IconTile'

/** Écran mobile : en-tête fixe, contenu scrollable, pied (CTA) et barre de navigation fixes. */
export function Screen({
  header,
  band,
  footer,
  nav,
  className,
  children,
}: {
  header?: ReactNode
  band?: ReactNode
  footer?: ReactNode
  nav?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className="relative flex h-full flex-col bg-fond-clair">
      {header}
      {band}
      <main className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', className)}>{children}</main>
      {footer && <div className="shrink-0 bg-fond-clair/95 px-4 pb-3 pt-2 backdrop-blur">{footer}</div>}
      {nav}
    </div>
  )
}

export function AppHeader({
  back,
  eyebrow,
  eyebrowStyle = 'texte',
  title,
  subtitle,
  brand,
  right,
}: {
  /** true = retour arrière, string = chemin cible */
  back?: boolean | string
  eyebrow?: string
  eyebrowStyle?: 'texte' | 'badge'
  title: string
  subtitle?: string
  /** Titre « Allo Tukki » en vert, style marque (C7, C19) */
  brand?: boolean
  right?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <header className="z-10 flex shrink-0 items-center gap-2.5 bg-surface-haut px-4 pb-3 pt-3 shadow-[0_1px_0_rgb(20_27_43/0.04)]">
      {back && (
        <button
          type="button"
          aria-label="Retour"
          onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))}
          className="-ml-1 rounded-full p-1.5 text-encre hover:bg-fond-carte"
        >
          <ArrowLeft size={22} />
        </button>
      )}
      <LogoTile size={brand ? 34 : 32} />
      <div className="min-w-0 flex-1">
        {eyebrow &&
          (eyebrowStyle === 'badge' ? (
            <span className="mb-0.5 inline-block rounded-md bg-jaune-soleil px-1.5 py-px text-[10px] font-extrabold uppercase tracking-wide text-brun-ocre">
              {eyebrow}
            </span>
          ) : (
            <div className="text-[11px] font-bold uppercase tracking-wide text-brun-ocre">{eyebrow}</div>
          ))}
        <div
          className={cn(
            'truncate leading-tight',
            brand ? 'text-[19px] font-extrabold tracking-tight text-vert-fondation' : 'text-[17px] font-bold text-encre',
          )}
        >
          {title}
        </div>
        {subtitle && <div className="truncate text-[11px] font-semibold text-encre-douce">{subtitle}</div>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </header>
  )
}

export function SosIconButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="SOS"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-rouge-pale text-rouge-sos"
    >
      <Asterisk size={22} strokeWidth={3} />
    </button>
  )
}

export function SosPill({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 items-center gap-1.5 rounded-full bg-rouge-sos px-3 text-sm font-extrabold text-white shadow-douce"
    >
      <Phone size={15} strokeWidth={2.5} />
      SOS
    </button>
  )
}

export function ProfileButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Profil"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-vert-fondation text-white"
    >
      <User size={17} />
    </button>
  )
}

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="z-10 flex shrink-0 justify-around border-t border-gris-bord/60 bg-surface-haut px-2 pb-[max(env(safe-area-inset-bottom),10px)] pt-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex min-w-16 flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[12px] font-bold',
              isActive ? 'text-vert-fondation' : 'text-encre-douce',
            )
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

/** Bandeau sombre d'état réseau (C13, D5, D7…). */
export function StatusBand({
  icon,
  children,
  right,
}: {
  icon?: ReactNode
  children: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 bg-encre px-4 py-2 text-[13px] font-semibold text-white">
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {right}
    </div>
  )
}
