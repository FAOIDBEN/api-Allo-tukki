import type { ReactNode } from 'react'
import { BadgeCheck, CarFront, Star } from 'lucide-react'
import { cn } from '../../../lib/format'
import type { Driver } from '../../../mock/people'

/** Photo ronde du chauffeur avec pastille (certifié / voiture). */
export function DriverAvatar({ driver, size = 64, badge = 'certifie' }: { driver: Driver; size?: number; badge?: 'certifie' | 'voiture' }) {
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <img src={driver.avatar} alt={`${driver.firstName} ${driver.lastName}`} className="h-full w-full rounded-full object-cover" />
      <span className="absolute -bottom-0.5 -right-0.5 flex h-[40%] w-[40%] items-center justify-center rounded-full border-2 border-white bg-vert-action text-white">
        {badge === 'certifie' ? <BadgeCheck size={size * 0.2} /> : <CarFront size={size * 0.2} />}
      </span>
    </span>
  )
}

/** Carte chauffeur (C13) : identité, note, voiture et plaque pour le reconnaître. */
export function DriverCard({ driver, extra, className }: { driver: Driver; extra?: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-carte bg-fond-carte p-4', className)}>
      <div className="flex items-center gap-3.5">
        <DriverAvatar driver={driver} size={64} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-[21px] font-semibold">
              {driver.firstName} {driver.lastName}
            </span>
            <span className="rounded-md bg-vert-menthe px-1.5 py-0.5 text-[12px] font-bold text-vert-fondation">Certifié</span>
          </div>
          <div className="flex items-center gap-1 text-[15px]">
            <Star size={16} className="fill-brun-ocre text-brun-ocre" />
            <strong>{driver.rating}</strong>
            <span className="text-encre-douce">• {driver.trips} courses</span>
          </div>
          <div className="truncate text-[13px] text-encre-douce">Chauffeur régulier de la Gare Routière</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-[12px] bg-surface px-3 py-2.5">
        <span className="flex items-center gap-2 text-[16px] font-semibold">
          <span className="h-4 w-4 rounded-full" style={{ background: driver.car.colorHex }} />
          {driver.car.model.split(' ').slice(-1)[0]} {driver.car.color}
        </span>
        <span className="rounded-[8px] bg-fond-carte px-3 py-1 text-[18px] font-semibold tracking-[0.12em]">{driver.car.plate}</span>
      </div>
      {extra}
    </div>
  )
}
