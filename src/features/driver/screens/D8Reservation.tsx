import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BellRing, CarFront, Check, Clock3, Hospital, MapPinned, Navigation, Route, ShieldCheck, Star, Store, Timer, Volume2, X } from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView } from '../../../components/MapView'
import { Screen } from '../../../design'
import { formatAmount } from '../../../lib/format'
import { buildRoute, formatDistance, routeLength } from '../../../lib/geo'
import { placeById } from '../../../mock/places'
import { OFFER_DURATION, simMs, useDemoStore } from '../../../store/demoStore'
import { rideGeometry, useNow } from '../../../store/simulation'
import { toast } from '../../../store/toastStore'
import { CourseHeader, DriverStrip } from '../components/DriverChrome'

/** D8 – Nouvelle réservation : alerte prioritaire, compte à rebours réel, bouton géant. */
export function D8Reservation() {
  const navigate = useNavigate()
  const ride = useDemoStore((s) => s.ride)
  const nightMode = useDemoStore((s) => s.settings.nightMode)
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const archiveRide = useDemoStore((s) => s.archiveRide)
  const createRide = useDemoStore((s) => s.createRide)
  const updateDriver = useDemoStore((s) => s.updateDriver)
  const now = useNow(250)
  const handled = useRef<string | null>(null)

  // Arrivée directe (panneau démo) sans réservation en attente : on en simule une.
  useEffect(() => {
    if (handled.current) return
    if (!ride || ['terminee', 'annulee', 'expiree'].includes(ride.status)) {
      updateDriver({ online: true })
      createRide({ source: 'demo' })
    }
  }, [ride, createRide, updateDriver])

  const pending = ride?.status === 'recherche' ? ride : null
  const total = simMs(OFFER_DURATION)
  const remainingMs = pending?.offerExpiresAt ? Math.max(0, pending.offerExpiresAt - now) : total
  const seconds = Math.ceil(remainingMs / 1000)

  const pass = (reason: 'expire' | 'refus') => {
    if (!pending || handled.current === pending.id) return
    handled.current = pending.id
    setRideStatus('expiree')
    if (pending.source !== 'app') archiveRide()
    toast(reason === 'expire' ? 'Temps écoulé : la course est attribuée à une autre voiture.' : 'Course laissée passer. Une autre arrivera bientôt.', 'alerte')
    navigate(path('D7'))
  }

  useEffect(() => {
    if (pending && remainingMs <= 0) pass('expire')
  })

  const geo = useMemo(() => (ride ? rideGeometry(ride) : null), [ride])
  if (!ride || !geo) return null

  const from = placeById(ride.fromId)
  const to = placeById(ride.toId)
  const approach = routeLength(geo.approachRoute)
  const trip = routeLength(buildRoute(from.position, to.position)) * 1.15

  const accept = () => {
    if (!pending) return navigate(path('D10'))
    handled.current = pending.id
    setRideStatus('acceptee')
    toast(`Course acceptée ! ${ride.passenger.firstName} est prévenue.`, 'succes')
    navigate(path('D10'))
  }

  const ratio = remainingMs / total
  const circumference = 2 * Math.PI * 40

  return (
    <Screen
      header={
        <>
          <DriverStrip left="Mode course active (sécurisé)" right={<><Navigation size={13} /> GPS actif</>} />
          <CourseHeader title="Demande course" />
        </>
      }
    >
      <div className="space-y-3 px-4 pb-6 pt-3">
        <div className="flex items-center gap-3 rounded-carte bg-jaune-soleil p-3.5 shadow-douce">
          <span className="flex h-11 w-11 shrink-0 animate-pulse items-center justify-center rounded-full bg-brun-ocre text-jaune-soleil">
            <BellRing size={21} />
          </span>
          <div className="min-w-0 flex-1 text-brun-ocre">
            <div className="text-[11px] font-bold uppercase tracking-wide">Alerte prioritaire chauffeur</div>
            <div className="text-[20px] font-extrabold uppercase leading-tight">Nouvelle course à proximité !</div>
          </div>
          <button type="button" aria-label="Annonce vocale" onClick={() => toast('Annonce vocale : « Nouvelle course au Marché Central ».')} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-vert-fondation">
            <Volume2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-carte bg-surface p-4 shadow-douce">
          <div className="min-w-0 flex-1">
            <span className="rounded-md bg-jaune-creme px-2 py-0.5 text-[12px] font-bold uppercase tracking-wide text-encre-douce">Temps de décision</span>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-[34px] font-extrabold leading-none text-rouge-sos tabular-nums">{pending ? seconds : '✓'}</span>
              <span className="text-[19px] font-bold">{pending ? 'secondes restantes' : 'Course acceptée'}</span>
            </div>
            <div className="mt-1 text-[13px] leading-snug text-encre-douce">Attribution automatique aux autres voitures</div>
          </div>
          <svg width="92" height="92" viewBox="0 0 92 92" className="shrink-0" aria-hidden>
            <circle cx="46" cy="46" r="40" fill="none" stroke="var(--color-fond-carte)" strokeWidth="9" />
            <circle
              cx="46"
              cy="46"
              r="40"
              fill="none"
              stroke="#c62828"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - ratio)}
              transform="rotate(-90 46 46)"
              style={{ transition: 'stroke-dashoffset 250ms linear' }}
            />
            <foreignObject x="30" y="30" width="32" height="32">
              <Timer size={32} />
            </foreignObject>
          </svg>
        </div>

        <div className="rounded-carte bg-sombre p-4 text-white shadow-douce">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold uppercase tracking-wide text-jaune-pale">Tarif net garanti</span>
            <span className="rounded-md bg-jaune-pale px-2 py-0.5 text-[13px] font-bold text-encre">CASH DIRECT</span>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <span>
              <span className="text-[40px] font-extrabold leading-none">{formatAmount(ride.price)}</span>
              <span className="ml-1.5 text-[20px] font-bold text-jaune-soleil">FCFA</span>
            </span>
            <span className="flex items-center gap-1.5 text-[15px] font-bold text-jaune-soleil">
              <CarFront size={17} /> {ride.seats} place{ride.seats > 1 ? 's' : ''}
            </span>
          </div>
          <p className="mt-2 text-[13px] text-white/80">Espèces à régler au départ ou à l'arrivée (sans commission)</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-carte bg-fond-carte p-3.5">
            <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase text-encre-douce">
              <Navigation size={15} className="text-vert-fondation" /> Distance client
            </span>
            <div className="mt-2 text-[20px] font-extrabold">{formatDistance(approach * 0.45)}</div>
            <div className="text-[13px] text-encre-douce">Prise en charge immédiate</div>
          </div>
          <div className="rounded-carte bg-fond-carte p-3.5">
            <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase leading-tight text-encre-douce">
              <Clock3 size={15} className="shrink-0 text-vert-fondation" /> Approche estimée
            </span>
            <div className="mt-2 text-[20px] font-extrabold">~ 2 min</div>
            <div className="text-[13px] text-encre-douce">Trafic fluide dans la zone</div>
          </div>
        </div>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold uppercase tracking-wide text-encre-douce">
              {ride.passenger.lastName === 'Fall' ? 'Passagère confirmée' : 'Passager confirmé'}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-fond-carte px-2.5 py-0.5 text-[14px] font-bold">
              <Star size={14} className="fill-jaune-soleil text-jaune-soleil" /> 4.9
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="relative shrink-0">
              {ride.passenger.avatar ? (
                <img src={ride.passenger.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-fond-carte text-[20px] font-bold text-vert-fondation">
                  {ride.passenger.firstName[0]}
                  {ride.passenger.lastName[0]}
                </span>
              )}
              <ShieldCheck size={20} className="absolute -bottom-1 -right-1 rounded-full bg-vert-fondation p-0.5 text-white" />
            </span>
            <div>
              <div className="text-[20px] font-semibold">
                {ride.passenger.firstName} {ride.passenger.lastName}
              </div>
              <div className="text-[13px] text-encre-douce">32 courses réalisées avec succès</div>
            </div>
          </div>
          <div className="relative mt-4 pl-8">
            <span className="absolute left-[9px] top-5 h-[calc(100%-2.5rem)] w-1 rounded bg-sombre" />
            <span className="absolute left-0 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-vert-fondation">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
            <div className="text-[13px]">
              <span className="rounded bg-vert-clair px-1.5 py-0.5 font-bold uppercase text-vert-fondation">Départ</span>{' '}
              <span className="font-semibold text-encre-douce">Point de rendez-vous</span>
            </div>
            <div className="mt-1 text-[19px] font-bold">{from.name}</div>
            <div className="flex items-center gap-1.5 text-[14px] text-encre-douce">
              <Store size={15} className="text-vert-fondation" /> {from.landmark}
            </div>
            {(ride.landmarks.length > 0 || ride.note) && (
              <div className="mt-1.5 rounded-[10px] bg-jaune-creme px-2.5 py-1.5 text-[13px] text-brun-ocre">
                <MapPinned size={13} className="mr-1 inline" />
                {[...ride.landmarks, ride.note].filter(Boolean).join(' • ')}
              </div>
            )}
            <span className="absolute left-0.5 top-[calc(100%-3.6rem)] flex h-4 w-4 items-center justify-center rounded-[3px] bg-brun-ocre">
              <span className="h-1.5 w-1.5 bg-white" />
            </span>
            <div className="mt-4 text-[13px]">
              <span className="rounded bg-jaune-creme px-1.5 py-0.5 font-bold uppercase text-brun-ocre">Arrivée</span>{' '}
              <span className="font-semibold text-encre-douce">Destination</span>
            </div>
            <div className="mt-1 text-[19px] font-bold">{to.name}</div>
            <div className="flex items-center gap-1.5 text-[14px] text-encre-douce">
              <Hospital size={15} className="text-brun-ocre" /> {to.landmark}
            </div>
          </div>
        </section>

        <div className="relative h-[150px] overflow-hidden rounded-carte shadow-douce">
          <MapView
            center={[(from.position[0] + to.position[0]) / 2, (from.position[1] + to.position[1]) / 2]}
            zoom={14}
            interactive={false}
            dark={nightMode}
            route={buildRoute(from.position, to.position)}
            markers={[
              { id: 'a', position: from.position, kind: 'lieu' },
              { id: 'b', position: to.position, kind: 'lieu' },
            ]}
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[450] flex items-center justify-between bg-gradient-to-t from-encre/80 to-transparent px-3 pb-2.5 pt-6 text-white">
            <span className="flex items-center gap-1.5 text-[14px] font-bold">
              <Route size={17} className="text-jaune-soleil" /> Distance trajet : ~{formatDistance(trip)} ({to.minutes} min)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={accept}
          className="flex min-h-[76px] w-full items-center gap-3 rounded-[18px] bg-vert-fondation py-2 pl-4 pr-2 text-left text-white shadow-flottante active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Check size={28} strokeWidth={3} />
          </span>
          <span className="flex-1">
            <span className="block text-[22px] font-extrabold uppercase leading-tight">{pending ? 'Accepter la course' : 'Voir la prise en charge'}</span>
            <span className="block text-[13px] text-white/85">Confirmation instantanée</span>
          </span>
          <span className="flex h-[60px] min-w-[64px] flex-col items-center justify-center rounded-[12px] bg-vert-action px-2 text-[22px] font-extrabold leading-none">
            {formatAmount(ride.price)}
            <span className="text-[14px]">F</span>
          </span>
        </button>
        {pending && (
          <button
            type="button"
            onClick={() => pass('refus')}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-[16px] bg-fond-carte text-[18px] font-bold"
          >
            <X size={22} className="text-rouge-sos" /> Laisser passer la course
          </button>
        )}
      </div>
    </Screen>
  )
}
