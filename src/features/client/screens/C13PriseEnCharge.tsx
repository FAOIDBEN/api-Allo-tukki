import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CarFront, CircleCheck, CircleX, MapPin, MessageSquareText, Phone, RadioTower, ShieldCheck } from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView, type MapMarker } from '../../../components/MapView'
import { Button, Modal, Screen } from '../../../design'
import { cn, formatAmount } from '../../../lib/format'
import { formatDistance } from '../../../lib/geo'
import { MOUSSA } from '../../../mock/people'
import { placeById } from '../../../mock/places'
import { useDemoStore } from '../../../store/demoStore'
import { ensureDemoRide, rideGeometry, rideProgress, useNow } from '../../../store/simulation'
import { toast } from '../../../store/toastStore'
import { ClientHeader } from '../components/ClientHeader'
import { DriverCard } from '../components/DriverCard'

const QUICK_MESSAGES = ["J'arrive", 'Je suis devant', 'Je vous attends devant la boutique', "J'ai un foulard jaune"]

/** C13 – Prise en charge : la voiture approche en direct sur la carte, puis le trajet se déroule. */
export function C13PriseEnCharge() {
  const navigate = useNavigate()
  const ride = useDemoStore((s) => s.ride)
  const firstName = useDemoStore((s) => s.client.firstName)
  const lowData = useDemoStore((s) => s.settings.lowData)
  const addRideMessage = useDemoStore((s) => s.addRideMessage)
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const archiveRide = useDemoStore((s) => s.archiveRide)
  const [messageIndex, setMessageIndex] = useState(2)
  const [cancelOpen, setCancelOpen] = useState(false)
  const now = useNow(400)

  useEffect(() => {
    if (!ride || ride.status === 'recherche' || ride.status === 'annulee' || ride.status === 'terminee') ensureDemoRide('acceptee')
  }, [ride])

  const geo = useMemo(() => (ride ? rideGeometry(ride) : null), [ride])
  if (!ride || !geo || ride.status === 'recherche') return null

  const progress = rideProgress(ride, now)
  const from = placeById(ride.fromId)
  const to = placeById(ride.toId)
  const minutes = Math.max(0, Math.ceil(progress.remainingSeconds / 60))
  const onTrip = progress.phase === 'trajet' || progress.phase === 'arrive'
  const name = firstName || ride.passenger.firstName

  const markers: MapMarker[] = [
    {
      id: 'voiture',
      position: progress.car,
      kind: 'navigation',
      label: `${MOUSSA.firstName} (Voiture)`,
      labelTone: 'vert',
    },
    onTrip
      ? { id: 'dest', position: geo.destination, kind: 'lieu', label: to.name, labelTone: 'sombre' }
      : { id: 'moi', position: geo.pickup, kind: 'voyageur', label: `${name} (Vous)`, labelTone: 'sombre' },
  ]
  const route = onTrip ? geo.tripRoute : geo.approachRoute
  const center: [number, number] = [
    (route[0][0] + route[route.length - 1][0]) / 2,
    (route[0][1] + route[route.length - 1][1]) / 2,
  ]

  const banner = {
    approche: { title: `${MOUSSA.firstName} arrive`, pill: `${Math.max(1, minutes)} min`, sub: `Distance restante : ${formatDistance(progress.remainingMeters)} (Route principale)`, big: `${String(Math.max(1, minutes)).padStart(2, '0')}` },
    'sur-place': { title: `${MOUSSA.firstName} est arrivé`, pill: 'Sur place', sub: `Il vous attend : ${from.name}`, big: '00' },
    trajet: { title: 'Voyage en cours', pill: `${Math.max(1, minutes)} min`, sub: `Vers ${to.name} • ${formatDistance(progress.remainingMeters)}`, big: `${String(Math.max(1, minutes)).padStart(2, '0')}` },
    arrive: { title: 'Arrivée à destination', pill: 'Terminé', sub: to.name, big: '00' },
  }[progress.phase]

  const sendMessage = () => {
    const text = QUICK_MESSAGES[messageIndex]
    addRideMessage('client', text)
    toast(`Message envoyé à ${MOUSSA.firstName} : « ${text} »`, 'succes')
  }

  const cancel = () => {
    setRideStatus('annulee')
    archiveRide()
    setCancelOpen(false)
    toast('Course annulée sans frais.', 'info')
    navigate(path('C7'))
  }

  return (
    <Screen
      header={<ClientHeader back={path('C7')} title={onTrip ? 'Voyage en cours' : 'Chauffeur en route'} />}
      band={
        <div className="flex shrink-0 items-center gap-2 bg-sombre px-4 py-2 text-[13px] font-semibold text-white">
          <RadioTower size={16} className="text-[#7fd9a8]" />
          <span className="flex-1 truncate">Réseau stable • Suivi direct Tivaouane</span>
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[12px] text-[#9ff5c3]">2G/3G OK</span>
        </div>
      }
    >
      <div className="sticky top-0 z-0 h-[330px]">
        <MapView
          center={center}
          zoom={14}
          markers={markers}
          route={progress.remaining}
          routeDone={progress.done}
          lowData={lowData}
          followCenter
          className="h-full w-full"
        />
        <div className="absolute inset-x-3 top-3 z-[450] flex items-center gap-3 rounded-carte bg-vert-action px-3.5 py-3 text-white shadow-flottante">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vert-fondation">
            <CarFront size={21} />
            <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-jaune-soleil" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[18px] font-semibold text-[#9ff5c3]">{banner.title}</span>
              <span className="shrink-0 rounded-full bg-vert-fondation px-2 py-0.5 text-[12px] font-bold">{banner.pill}</span>
            </div>
            <div className="truncate text-[13px] text-[#c9f5dc]">{banner.sub}</div>
          </div>
          <div className="shrink-0 text-[30px] font-extrabold tabular-nums text-[#9ff5c3]">
            {banner.big}
            <span className="text-[18px]">m</span>
          </div>
        </div>
      </div>

      <section className="relative z-[500] -mt-5 space-y-4 rounded-t-[24px] bg-surface px-4 pb-6 pt-3">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-gris-bord" />
        <div className="flex items-center gap-3 rounded-carte bg-fond-carte p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vert-fondation text-white">
            <MapPin size={19} />
          </span>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-encre-douce">
              {onTrip ? 'Destination' : 'Point de rendez-vous'}
            </div>
            <div className="text-[15px] font-medium">
              {onTrip ? `${to.name} (${to.landmark})` : `${from.name} (${ride.note ? ride.note.split(',')[0].toLowerCase() : from.landmark})`}
            </div>
          </div>
        </div>

        <DriverCard driver={MOUSSA} />

        <div className="flex items-center justify-between rounded-carte bg-fond-carte px-4 py-3">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide">Tarif convenu</div>
            <div className="text-[13px] text-encre-douce">À régler en espèces à l'arrivée</div>
          </div>
          <div className="text-vert-fondation">
            <span className="text-[34px] font-extrabold leading-none">{formatAmount(ride.price)}</span>
            <span className="ml-1 text-[16px] font-bold">FCFA</span>
          </div>
        </div>

        {progress.phase === 'arrive' ? (
          <Button block size="lg" iconRight={<ArrowRight size={20} />} onClick={() => navigate(path('C15'))}>
            Passer au paiement
          </Button>
        ) : (
          <Button
            block
            size="lg"
            variant="action"
            iconLeft={<Phone size={20} />}
            onClick={() => toast(`Appel de ${MOUSSA.firstName} (${MOUSSA.phone})…`, 'info')}
          >
            Appeler {MOUSSA.firstName} ({MOUSSA.phone})
          </Button>
        )}

        <div className="rounded-carte bg-fond-carte p-3">
          <div className="-mx-3 mb-2 flex gap-1.5 overflow-x-auto px-3 [scrollbar-width:none]">
            {QUICK_MESSAGES.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => setMessageIndex(i)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-[12px] font-bold',
                  i === messageIndex ? 'bg-vert-fondation text-white' : 'bg-surface text-encre-douce',
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <MessageSquareText size={21} className="shrink-0 text-vert-fondation" />
            <span className="min-w-0 flex-1 truncate text-[15px]">« {QUICK_MESSAGES[messageIndex]} »</span>
            <button type="button" onClick={sendMessage} className="text-[14px] font-bold text-vert-fondation">
              Envoyer
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[14px] font-semibold">
          {onTrip ? (
            <span />
          ) : (
            <button type="button" onClick={() => setCancelOpen(true)} className="flex items-center gap-1.5 text-rouge-sos">
              <CircleX size={18} /> Annuler la course
            </button>
          )}
          <span className="flex items-center gap-1.5 text-encre-douce">
            <CircleCheck size={17} className="text-vert-action" /> Paiement cash sans frais
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-carte bg-fond-carte p-3.5 text-[13px] leading-snug text-encre-douce">
          <ShieldCheck size={22} className="shrink-0 text-vert-fondation" />
          <span>
            Course supervisée par la <strong className="text-encre">Régie Municipale de Tivaouane</strong>. Assistance 24/7
            active.
          </span>
        </div>
      </section>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Annuler la course ?">
        <p className="text-[14px] text-encre-douce">
          L'annulation est gratuite avant l'arrivée du chauffeur. {MOUSSA.firstName} sera prévenu immédiatement.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="md" onClick={() => setCancelOpen(false)}>
            Garder
          </Button>
          <Button variant="danger" size="md" onClick={cancel}>
            Annuler
          </Button>
        </div>
      </Modal>
    </Screen>
  )
}
