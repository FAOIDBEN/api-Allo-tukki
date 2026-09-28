import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banknote, ChevronRight, Clock3, CornerUpLeft, CornerUpRight, Flag, Gauge, MapPin, Navigation2, Phone, ShieldCheck, Star, TriangleAlert, Volume2 } from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView } from '../../../components/MapView'
import { AppHeader, ProfileButton, Screen } from '../../../design'
import { cn, formatAmount } from '../../../lib/format'
import { formatDistance } from '../../../lib/geo'
import { placeById } from '../../../mock/places'
import { useDemoStore } from '../../../store/demoStore'
import { ensureDemoRide, rideGeometry, rideProgress, useNow } from '../../../store/simulation'
import { toast } from '../../../store/toastStore'

const INSTRUCTIONS = [
  { dist: 350, text: 'Continuer tout droit', street: 'Avenue Serigne Babacar Sy', icon: Navigation2 },
  { dist: 200, text: 'Tourner à droite', street: 'Rue de la Gare vers Grande Mosquée', icon: CornerUpRight },
  { dist: 150, text: 'Tourner à gauche', street: 'Route de Kaolack', icon: CornerUpLeft },
  { dist: 80, text: 'Destination sur votre droite', street: '', icon: MapPin },
]

/** D11 – Voyage en cours : guidage, alerte de zone 30 km/h, fin du voyage. */
export function D11Voyage() {
  const navigate = useNavigate()
  const ride = useDemoStore((s) => s.ride)
  const nightMode = useDemoStore((s) => s.settings.nightMode)
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const [voice, setVoice] = useState<'fr' | 'wo'>('fr')
  const now = useNow(400)

  useEffect(() => {
    if (!ride || !['en_route', 'arrivee'].includes(ride.status)) ensureDemoRide('en_route', 'demo')
  }, [ride])

  const geo = useMemo(() => (ride ? rideGeometry(ride) : null), [ride])
  if (!ride || !geo) return null

  const to = placeById(ride.toId)
  const progress = rideProgress(ride, now)
  const t = progress.phase === 'trajet' ? progress.t : 1
  const inZone = t > 0.3 && t < 0.65
  const speed = t >= 1 ? 0 : inZone ? 26 + Math.round(3 * Math.sin(now / 900)) : 44 + Math.round(6 * Math.sin(now / 1300))
  const step = INSTRUCTIONS[Math.min(INSTRUCTIONS.length - 1, Math.floor(t * INSTRUCTIONS.length))]
  const StepIcon = step.icon
  const minutes = Math.max(0, Math.ceil(progress.remainingSeconds / 60))

  const finish = () => {
    setRideStatus('arrivee')
    navigate(path('D12'))
  }

  return (
    <Screen
      header={<AppHeader back={path('D10')} eyebrow="Allo Tukki" eyebrowTone="vert" title={`Course en cours avec ${ride.passenger.firstName}`} right={<ProfileButton onClick={() => navigate(path('D5'))} />} />}
    >
      <div className="space-y-3 px-4 pb-6 pt-3">
        <div className="flex items-center justify-between rounded-full bg-sombre px-3 py-1.5 text-[12px] font-bold uppercase text-white">
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-white/15" /> GPS haute précision • 2G/4G sync
          </span>
          <span className="rounded-full bg-white/15 px-2 text-jaune-pale">120 Hz</span>
        </div>

        <div className="flex items-center gap-3 rounded-carte bg-vert-fondation p-3.5 text-white shadow-douce">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Gauge size={21} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-bold uppercase text-[#9ff5c3]">Mode chauffeur • À bord</div>
            <div className="truncate text-[19px] font-semibold">Course en cours…</div>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-bold text-[#9ff5c3]">
            <ShieldCheck size={15} /> EN SÉCURITÉ
          </span>
        </div>

        <section className="rounded-carte bg-surface p-3.5 shadow-douce">
          <div className="flex items-center gap-3">
            <span className="relative shrink-0">
              {ride.passenger.avatar ? (
                <img src={ride.passenger.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-fond-carte text-[18px] font-bold text-vert-fondation">{ride.passenger.firstName[0]}</span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[19px] font-semibold">
                  {ride.passenger.firstName} {ride.passenger.lastName}
                </span>
                <span className="flex items-center gap-0.5 rounded-full bg-fond-carte px-2 text-[13px] font-bold">
                  <Star size={12} className="fill-brun-ocre text-brun-ocre" /> 5.0
                </span>
              </div>
              <div className="flex items-center gap-1 text-[14px] text-encre-douce">
                <ShieldCheck size={15} className="fill-vert-fondation text-white" /> Ceinture bouclée ✓
              </div>
            </div>
            <button type="button" aria-label="Appeler" onClick={() => toast(`Appel de ${ride.passenger.firstName}…`)} className="flex h-12 w-12 items-center justify-center rounded-full bg-jaune-soleil text-brun-ocre">
              <Phone size={21} />
            </button>
          </div>
          <div className="mt-3 flex gap-2.5 rounded-[12px] bg-fond-carte p-3">
            <MapPin size={22} className="shrink-0 fill-rouge-sos text-white" />
            <div>
              <div className="text-[12px] font-semibold uppercase text-encre-douce">Destination finale</div>
              <div className="text-[18px] font-semibold leading-tight">{to.name}</div>
              <div className="text-[13px] font-semibold text-rouge-sos">✱ {to.landmark}</div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-carte bg-sombre shadow-douce">
          <div className="flex items-center gap-4 p-4 text-white">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-jaune-soleil text-encre">
              <StepIcon size={34} />
            </span>
            <div className="min-w-0">
              <div className="text-[30px] font-extrabold leading-none text-jaune-pale">{t >= 1 ? 'Arrivé' : `${step.dist} m`}</div>
              <div className="text-[18px] font-semibold">{t >= 1 ? 'Vous êtes à destination' : step.text}</div>
              {step.street && t < 1 && <div className="truncate text-[13px] text-white/70">{step.street}</div>}
            </div>
          </div>
          <div className="relative h-[230px]">
            <MapView
              center={[(geo.pickup[0] + geo.destination[0]) / 2, (geo.pickup[1] + geo.destination[1]) / 2]}
              zoom={14}
              dark={nightMode}
              showLocate={false}
              markers={[
                { id: 'dest', position: geo.destination, kind: 'lieu' },
                { id: 'moi', position: progress.car, kind: 'navigation' },
              ]}
              route={progress.remaining}
              routeDone={progress.done}
              className="h-full w-full"
            />
            {inZone && (
              <div className="anim-pop absolute inset-x-3 top-2 z-[450] flex gap-2.5 rounded-carte bg-jaune-soleil p-3 text-brun-ocre shadow-flottante">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brun-ocre text-jaune-soleil">
                  <Gauge size={19} />
                </span>
                <div className="text-[13px] leading-snug">
                  <div className="font-extrabold uppercase">Zone religieuse • Zawiya</div>
                  Attention : Zone piétonne sacrée. Ralentir impérativement (Max 30 km/h).
                </div>
              </div>
            )}
            <div className="absolute inset-x-3 bottom-2 z-[450] grid grid-cols-3 divide-x divide-gris-bord rounded-carte bg-surface py-2 shadow-flottante">
              <Stat icon={<Navigation2 size={20} className="fill-vert-fondation text-vert-fondation" />} label="Distance" value={formatDistance(progress.remainingMeters)} />
              <Stat icon={<Clock3 size={20} className="text-brun-ocre" />} label="Arrivée" value={`${minutes} min`} />
              <Stat label="Vitesse" value={<span className={cn(inZone ? 'text-vert-fondation' : 'text-encre')}>{speed} <span className="text-[12px]">km/h</span></span>} />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between rounded-carte bg-fond-carte p-2 pl-3.5">
          <span className="flex items-center gap-2 text-[15px] font-medium">
            <Volume2 size={20} className="text-vert-fondation" /> Guidage vocal
          </span>
          <div className="flex rounded-[12px] bg-surface p-1">
            {(['fr', 'wo'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setVoice(l)
                  toast(l === 'fr' ? 'Guidage vocal en français.' : 'Guidage vocal en wolof.')
                }}
                className={cn('rounded-[9px] px-3.5 py-1.5 text-[14px] font-bold', voice === l ? 'bg-vert-fondation text-white' : 'text-encre-douce')}
              >
                {l === 'fr' ? 'FR' : 'WOLOF'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-carte bg-fond-carte p-4">
          <div>
            <div className="text-[13px] font-bold uppercase text-vert-fondation">Tarif garanti course</div>
            <div>
              <span className="text-[34px] font-extrabold leading-none">{formatAmount(ride.price)}</span>
              <span className="ml-1 text-[18px] font-bold">FCFA</span>
            </div>
            <div className="text-[13px] text-encre-douce">À encaisser en espèces (Cash direct)</div>
          </div>
          <span className="flex flex-col items-center gap-1 rounded-[14px] bg-surface px-4 py-3 text-[12px] font-semibold">
            <Banknote size={26} className="text-vert-fondation" /> CASH
          </span>
        </div>

        <button type="button" onClick={finish} className="flex w-full items-center gap-3 rounded-carte bg-vert-fondation p-3 text-left text-white shadow-flottante">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Flag size={24} fill="currentColor" />
          </span>
          <span className="flex-1">
            <span className="block text-[20px] font-semibold leading-tight">{t >= 1 ? 'Arrivé à destination' : 'Terminer le voyage'}</span>
            <span className="block text-[13px] text-[#9ff5c3]">Terminer le trajet &amp; encaisser</span>
          </span>
          <ChevronRight size={24} />
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => navigate(`${path('D9')}#sos`)} className="flex h-12 items-center justify-center gap-2 rounded-carte bg-rouge-pale text-[15px] font-bold text-rouge-sos">
            <span className="text-[12px] font-extrabold">SOS</span> SOS Fondation
          </button>
          <button type="button" onClick={() => toast('Trafic signalé à la centrale. Merci !', 'succes')} className="flex h-12 items-center justify-center gap-2 rounded-carte bg-fond-carte text-[15px] font-bold">
            <TriangleAlert size={18} className="text-brun-ocre" /> Signaler Trafic
          </button>
        </div>
      </div>
    </Screen>
  )
}

function Stat({ icon, label, value }: { icon?: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 px-2">
      {icon}
      <div className="text-center">
        <div className="text-[12px] text-encre-douce">{label}</div>
        <div className="text-[18px] font-semibold leading-tight">{value}</div>
      </div>
    </div>
  )
}
