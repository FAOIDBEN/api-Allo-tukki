import type { ReactNode } from 'react'
import { BatteryFull, Signal, Wifi } from 'lucide-react'
import { cn } from '../lib/format'

/**
 * Cadre d'iPhone (≈ 390×844 utiles, Dynamic Island, barre d'état 9:41).
 * - ≥ 640 px : cadre réaliste.
 * - < 640 px : plein écran, sans cadre ni fausse barre d'état.
 * `alwaysFramed` force le cadre (mode présentation, où chaque téléphone contient une iframe).
 */
export function PhoneFrame({
  children,
  dark,
  alwaysFramed,
}: {
  children: ReactNode
  dark?: boolean
  alwaysFramed?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        dark ? 'bg-[#0d1220]' : 'bg-fond-clair',
        alwaysFramed
          ? 'h-[min(866px,calc(100dvh-96px))] w-[412px] shrink-0 rounded-[56px] border-[11px] border-[#1b1f27] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55),0_0_0_2px_#3a3f4a]'
          : 'h-dvh w-full sm:h-[min(866px,calc(100dvh-32px))] sm:w-[412px] sm:shrink-0 sm:rounded-[56px] sm:border-[11px] sm:border-[#1b1f27] sm:shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55),0_0_0_2px_#3a3f4a]',
      )}
    >
      <div className={cn('flex-col', alwaysFramed ? 'flex h-full' : 'flex h-full')}>
        <StatusBar dark={dark} className={alwaysFramed ? 'flex' : 'hidden sm:flex'} />
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-1.5 left-1/2 z-20 h-[5px] w-32 -translate-x-1/2 rounded-full',
          dark ? 'bg-white/70' : 'bg-sombre/80',
          alwaysFramed ? 'block' : 'hidden sm:block',
        )}
      />
    </div>
  )
}

function StatusBar({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        'relative h-[46px] shrink-0 items-center justify-between px-7 pt-1 text-[15px] font-bold',
        dark ? 'bg-[#0d1220] text-white' : 'bg-surface-haut text-encre',
        className,
      )}
    >
      <span className="w-12">9:41</span>
      <span aria-hidden className="absolute left-1/2 top-2 h-[30px] w-[108px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1">
        <Signal size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <BatteryFull size={22} strokeWidth={2} />
      </span>
    </div>
  )
}
