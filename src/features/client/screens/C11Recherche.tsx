import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banknote, CarFront, Crosshair, MapPin, MessageSquareText, Radar, ShieldCheck, SignalLow, X } from 'lucide-react'
import { path } from '../../../app/screens'
import { AppHeader, Badge, ProfileButton, Screen } from '../../../design'
import { cn, formatAmount } from '../../../lib/format'
import { placeById } from '../../../mock/places'
import { useDemoStore } from '../../../store/demoStore'
import { toast } from '../../../store/toastStore'
import { AudioPlayer } from '../components/AudioPlayer'

/** Voitures interrogées, dans l'ordre d'apparition sur le radar (positions en % du cadre). */
const SCANNED = [
  { x: 18, y: 26, minutes: 1 },
  { x: 73, y: 17, minutes: 2 },
  { x: 22, y: 64, minutes: 4 },
  { x: 71, y: 72, minutes: 3, faded: true },
]
const SEARCH_SECONDS = 40

/** C11 – Recherche d'une place : minuteur, voitures interrogées, message vocal, secours SMS. */
export function C11Recherche() {
  const navigate = useNavigate()
  const ride = useDemoStore((s) => s.ride)
  const draft = useDemoStore((s) => s.client.draft)
  const createRide = useDemoStore((s) => s.createRide)
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const archiveRide = useDemoStore((s) => s.archiveRide)
  const [scanned, setScanned] = useState(0)
  const [seconds, setSeconds] = useState(SEARCH_SECONDS)
  const created = useRef(false)

  // Arrivée directe sur l'écran (panneau démo) : on lance une recherche avec le brouillon courant.
  useEffect(() => {
    if (!created.current && (!ride || ride.status === 'terminee' || ride.status === 'annulee')) {
      created.current = true
      createRide({ source: 'app' })
    }
  }, [ride, createRide])

  useEffect(() => {
    const id = window.setInterval(() => {
      setScanned((n) => Math.min(SCANNED.length, n + 1))
      setSeconds((s) => Math.max(0, s - 1))
    }, 900)
    return () => window.clearInterval(id)
  }, [])

  const from = placeById(ride?.fromId ?? draft.fromId)
  const to = placeById(ride?.toId ?? draft.toId)
  const price = ride?.price ?? 700

  const cancel = () => {
    setRideStatus('annulee')
    archiveRide()
    toast('Recherche annulée. Aucun frais.', 'info')
    navigate(path('C7'))
  }

  return (
    <Screen
      header={
        <AppHeader
          back={path('C10')}
          eyebrow="Allo Tukki"
          eyebrowTone="vert"
          title="Recherche d'un chauffeur"
          right={<ProfileButton onClick={() => navigate(path('C19'))} />}
        />
      }
      band={
        <div className="flex shrink-0 items-center gap-2 bg-encre px-4 py-2.5 text-[13px] font-semibold text-white">
          <SignalLow size={16} className="text-jaune-soleil" />
          <span className="min-w-0 flex-1 truncate">Réseau Edge/3G détecté • Synchronisation en direct</span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] leading-tight">Tivaouane Live</span>
        </div>
      }
    >
      <div className="space-y-4 px-4 pb-6 pt-4">
        <div className="flex items-center gap-3 rounded-carte bg-surface p-3.5 shadow-douce">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vert-clair">
            <span className="absolute h-11 w-11 animate-ping rounded-full bg-vert-action/20" />
            <span className="h-3.5 w-3.5 rounded-full bg-vert-fondation" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[18px] font-semibold leading-tight">
              Recherche en cours <span className="text-vert-action">•</span>
            </div>
            <div className="text-[13px] text-encre-douce">Rayon d'action étendu : 1.5 km</div>
          </div>
          <div className="text-right">
            <div className="text-[24px] font-extrabold tabular-nums leading-none text-vert-fondation">
              00:{String(seconds).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[11px] font-semibold uppercase text-encre-douce">Temps estimé</div>
          </div>
        </div>

        <div className="relative h-[290px] overflow-hidden rounded-carte bg-fond-carte shadow-douce">
          <span className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#c8d3ea]" />
          <span className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-vert-action/25 [animation-duration:2.4s]" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <span className="mb-1.5 flex items-center gap-1 whitespace-nowrap rounded-full bg-vert-fondation px-3 py-1 text-[13px] font-bold text-white">
              <MapPin size={14} /> Vous êtes ici
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-vert-fondation text-white shadow-flottante">
              <Crosshair size={20} />
            </span>
            <span className="mt-1.5 whitespace-nowrap rounded-[6px] bg-white px-2 py-0.5 text-[13px] font-bold">Porte Ouest</span>
          </div>
          {SCANNED.slice(0, scanned).map((car, i) => (
            <div
              key={i}
              className={cn('anim-pop absolute flex flex-col items-center', car.faded && 'opacity-60')}
              style={{ left: `${car.x}%`, top: `${car.y}%` }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jaune-soleil text-brun-ocre shadow">
                <CarFront size={16} />
              </span>
              <span className="mt-1 rounded-[5px] bg-white px-1.5 py-px text-[11px] font-semibold">{car.minutes} min</span>
            </div>
          ))}
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-[10px] bg-encre/80 px-3 py-1.5 text-[12px] font-semibold text-white">
            <Radar size={15} className="text-jaune-soleil" /> {scanned} conducteur{scanned > 1 ? 's' : ''} actif
            {scanned > 1 ? 's' : ''} scanné{scanned > 1 ? 's' : ''}
          </span>
        </div>

        <AudioPlayer title="Vocal Wolof activé" quote="« Dinañu la nuyul bu chauffeur bi nàmpé »" />

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-encre-douce">Détails de la course</span>
            <Badge tone="vert" className="text-[13px]">
              Prix fixe garanti
            </Badge>
          </div>
          <div className="relative mt-3 pl-6">
            <span className="absolute left-[5px] top-2 h-[calc(100%-1.4rem)] w-0.5 bg-encre" />
            <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-vert-fondation" />
            <div className="text-[13px] font-semibold text-encre-douce">Point de ramassage</div>
            <div className="text-[17px] font-semibold leading-tight">{from.name} Tivaouane</div>
            <div className="text-[13px] text-encre-douce">{from.landmark}</div>
            <div className="mt-2 text-[13px] font-semibold text-encre-douce">Destination</div>
            <div className="text-[17px] font-semibold leading-tight">{to.name}</div>
            <span className="absolute bottom-1 left-0 h-3 w-3 rounded-[2px] bg-brun-ocre" />
            <div className="text-[13px] text-encre-douce">{to.landmark}</div>
          </div>
          <div className="mt-3 flex items-end justify-between rounded-[12px] bg-fond-carte px-3 py-2.5">
            <div>
              <div className="text-[12px] font-semibold">Montant certifié</div>
              <span className="text-[34px] font-extrabold leading-none text-vert-fondation">{formatAmount(price)}</span>
              <span className="ml-1 text-[15px] font-bold text-vert-fondation">FCFA</span>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[17px] font-semibold">
                <Banknote size={18} /> Espèces
              </div>
              <div className="text-[12px] text-encre-douce">Paiement direct à l'arrivée</div>
            </div>
          </div>
        </section>

        <div className="flex gap-3 rounded-carte bg-fond-carte p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vert-fondation text-white">
            <ShieldCheck size={22} />
          </span>
          <div className="text-[13px] leading-snug text-encre-douce">
            <div className="text-[17px] font-semibold text-encre">Sécurité & Charte Fondation</div>
            Chauffeurs agréés en tenue verte officielle, véhicules propres et désinfectés contrôlés quotidiennement.
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(path('C20'))}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-[#dfe3f7] text-[15px] font-bold"
        >
          <MessageSquareText size={19} className="text-vert-fondation" /> Passerelle Commande SMS (Réseau lent)
        </button>
        <button
          type="button"
          onClick={cancel}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-rouge-pale text-[15px] font-bold text-rouge-sos"
        >
          <X size={19} /> Annuler la recherche de course
        </button>
      </div>
    </Screen>
  )
}
