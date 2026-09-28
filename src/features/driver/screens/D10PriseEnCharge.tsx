import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerUpRight, MapPin, MessageSquareText, Navigation, Phone, Play, TriangleAlert, User, UserCheck } from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView } from '../../../components/MapView'
import { Button, Screen } from '../../../design'
import { formatAmount } from '../../../lib/format'
import { formatDistance } from '../../../lib/geo'
import { useDemoStore } from '../../../store/demoStore'
import { ensureDemoRide, rideGeometry, rideProgress, useNow } from '../../../store/simulation'
import { toast } from '../../../store/toastStore'
import { CourseHeader, DriverStrip } from '../components/DriverChrome'

/** D10 – Prise en charge : navigation vers le voyageur, repère précis, arrivée signalée. */
export function D10PriseEnCharge() {
  const navigate = useNavigate()
  const ride = useDemoStore((s) => s.ride)
  const nightMode = useDemoStore((s) => s.settings.nightMode)
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const addRideMessage = useDemoStore((s) => s.addRideMessage)
  const now = useNow(400)

  useEffect(() => {
    if (!ride || ['recherche', 'terminee', 'annulee', 'expiree'].includes(ride.status)) ensureDemoRide('acceptee', 'demo')
  }, [ride])

  const geo = useMemo(() => (ride ? rideGeometry(ride) : null), [ride])
  if (!ride || !geo || ride.status === 'recherche') return null

  const progress = rideProgress(ride, now)
  const arrived = ride.status !== 'acceptee'
  const minutes = Math.max(1, Math.ceil(progress.remainingSeconds / 60))
  const speed = arrived ? 0 : 30 + Math.round(8 * Math.sin(now / 1500))
  const lastClientMessage = [...ride.messages].reverse().find((m) => m.from === 'client')
  const repere = ride.note || [...ride.landmarks].join(', ') || 'Aucune précision'

  const signalArrival = () => {
    setRideStatus('chauffeur_arrive')
    addRideMessage('chauffeur', 'Je suis devant le point de rendez-vous.')
    toast(`${ride.passenger.firstName} a été prévenue de votre arrivée.`, 'succes')
  }

  const start = () => {
    setRideStatus('en_route')
    navigate(path('D11'))
  }

  return (
    <Screen
      header={
        <>
          <DriverStrip left="Mode course active (sécurisé)" right={<><Navigation size={13} /> GPS actif</>} />
          <CourseHeader title="Course en approche" />
        </>
      }
    >
      <div className="sticky top-0 h-[360px]">
        <MapView
          center={geo.approachRoute[Math.floor(geo.approachRoute.length / 2)]}
          zoom={15}
          dark={nightMode}
          markers={[
            { id: 'client', position: geo.pickup, kind: 'lieu', label: `● ${ride.passenger.firstName} ${ride.passenger.lastName}`, labelTone: 'vert' },
            { id: 'moi', position: progress.car, kind: 'voiture' },
          ]}
          route={progress.remaining}
          routeDone={progress.done}
          className="h-full w-full"
        />
        <div className="absolute inset-x-3 top-2 z-[450] flex items-center gap-3 rounded-carte bg-sombre p-3 text-white shadow-flottante">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-jaune-soleil text-brun-ocre">
            <Navigation size={21} className="-rotate-90" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-bold uppercase tracking-wide text-[#9ff5c3]">
              {arrived ? 'Sur place au point de rendez-vous' : `En route vers ${ride.passenger.lastName === 'Fall' ? 'la cliente' : 'le client'}`}
            </div>
            <div className="text-[19px] font-semibold">
              {arrived ? (
                'Voyageur prévenu ✓'
              ) : (
                <>
                  Arrivée : <span className="text-jaune-soleil">{minutes} min</span>{' '}
                  <span className="text-[14px] font-normal">({formatDistance(progress.remainingMeters)})</span>
                </>
              )}
            </div>
          </div>
          <div className="rounded-[10px] bg-white/10 px-2.5 py-1 text-center">
            <div className="text-[11px] font-bold uppercase">Vitesse</div>
            <div className="text-[20px] font-extrabold leading-none text-[#9ff5c3]">
              {speed} <span className="text-[11px]">km/h</span>
            </div>
          </div>
        </div>
      </div>

      <section className="relative z-[500] -mx-0 -mt-5 space-y-3 rounded-t-[24px] bg-surface px-4 pb-6 pt-3 shadow-[0_-8px_24px_-12px_rgb(20_27_43/0.25)]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-gris-bord" />
        <div className="flex items-center gap-3">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fond-carte text-vert-fondation">
            <User size={28} fill="currentColor" />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-vert-fondation" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[20px] font-semibold">
                {ride.passenger.firstName} {ride.passenger.lastName}
              </span>
              <span className="rounded-md bg-jaune-pale px-1.5 py-0.5 text-[13px] font-bold">4.9 ★</span>
            </div>
            <div className="text-[14px] text-encre-douce">{ride.passenger.phone}</div>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-bold uppercase text-encre-douce">Course</div>
            <div className="text-[20px] font-extrabold text-vert-fondation">{formatAmount(ride.price)} F</div>
          </div>
        </div>

        <div className="flex gap-3 rounded-carte bg-jaune-creme p-3.5">
          <MapPin size={20} className="mt-0.5 shrink-0 text-brun-ocre" />
          <div>
            <div className="text-[13px] font-bold uppercase text-brun-ocre">Repère précis client</div>
            <div className="text-[16px] font-medium">« {repere} »</div>
          </div>
        </div>

        {lastClientMessage && (
          <div className="anim-pop flex items-center gap-2.5 rounded-carte bg-vert-clair p-3 text-[14px]">
            <MessageSquareText size={19} className="shrink-0 text-vert-fondation" />
            <span>
              <strong>{ride.passenger.firstName} :</strong> « {lastClientMessage.text} »
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => toast(`Appel de ${ride.passenger.firstName} (${ride.passenger.phone})…`)} className="flex items-center gap-2 rounded-carte bg-fond-carte p-2.5 text-[15px] font-semibold">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vert-action text-white">
              <Phone size={18} />
            </span>
            <span className="truncate">Appeler client</span>
          </button>
          <button type="button" onClick={() => toast('Ouverture de la navigation GPS externe (simulation).')} className="flex items-center gap-2 rounded-carte bg-fond-carte p-2.5 text-[15px] font-semibold">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sombre text-white">
              <CornerUpRight size={18} />
            </span>
            Google GPS
          </button>
        </div>

        {arrived ? (
          <Button block size="xl" iconLeft={<Play size={22} />} onClick={start}>
            PASSAGÈRE À BORD • DÉMARRER
          </Button>
        ) : (
          <Button block size="xl" iconLeft={<UserCheck size={24} />} onClick={signalArrival}>
            JE SUIS ARRIVÉ SUR PLACE
          </Button>
        )}
        <p className="text-center text-[13px] text-encre-douce">
          {arrived
            ? 'Vérifiez que la ceinture est bouclée avant de démarrer.'
            : `Une notification instantanée SMS/App sera envoyée à ${ride.passenger.firstName}.`}
        </p>
        <button
          type="button"
          onClick={() => toast('Imprévu signalé à la centrale. Un régulateur vous rappelle.', 'alerte')}
          className="flex w-full items-center justify-center gap-2 pt-1 text-[14px] font-semibold"
        >
          <TriangleAlert size={18} className="text-rouge-sos" /> Signaler un imprévu / Client injoignable
        </button>
      </section>
    </Screen>
  )
}
