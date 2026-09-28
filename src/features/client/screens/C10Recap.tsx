import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  Banknote,
  CarFront,
  CircleCheck,
  CircleDollarSign,
  Eye,
  Headset,
  Landmark,
  Lock,
  MapPin,
  MapPinPlus,
  Radio,
  Route,
  Shirt,
  Store,
} from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView } from '../../../components/MapView'
import { Badge, Screen } from '../../../design'
import { cn, formatAmount } from '../../../lib/format'
import { buildRoute, formatDistance, routeLength } from '../../../lib/geo'
import { placeById } from '../../../mock/places'
import { SEAT_PRICE, useDemoStore } from '../../../store/demoStore'
import { toast } from '../../../store/toastStore'
import { ClientHeader } from '../components/ClientHeader'

const LANDMARK_CHIPS = [
  { label: 'Foulard jaune', icon: Shirt },
  { label: 'Devant boutique', icon: Store },
  { label: 'Près de la mosquée', icon: MapPin },
]
const NOTE_MAX = 120

/** C10 – Récapitulatif de la réservation (trajet, repères, prix garanti). */
export function C10Recap() {
  const navigate = useNavigate()
  const draft = useDemoStore((s) => s.client.draft)
  const lowData = useDemoStore((s) => s.settings.lowData)
  const updateDraft = useDemoStore((s) => s.updateDraft)
  const createRide = useDemoStore((s) => s.createRide)
  const from = placeById(draft.fromId)
  const to = placeById(draft.toId)
  const route = useMemo(() => buildRoute(from.position, to.position), [from, to])
  const km = formatDistance(routeLength(route) * 1.15)
  const price = SEAT_PRICE * draft.seats

  const toggleLandmark = (label: string) =>
    updateDraft({
      landmarks: draft.landmarks.includes(label) ? draft.landmarks.filter((l) => l !== label) : [...draft.landmarks, label],
    })

  const order = () => {
    createRide({ source: 'app' })
    navigate(path('C11'))
  }

  return (
    <Screen header={<ClientHeader back={path('C8')} title="Confirmer la course" />}>
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2.5 rounded-b-[16px] bg-sombre px-4 py-2.5 text-[14px] font-semibold text-white">
          <Radio size={17} className="text-jaune-soleil" />
          <span className="flex-1">Réseau 3G stable • Tarif garanti verrouillé</span>
          <BadgeCheck size={20} className="text-[#7fd9a8]" />
        </div>

        <div className="relative mt-4 h-[150px] overflow-hidden rounded-carte shadow-douce">
          <MapView
            center={[(from.position[0] + to.position[0]) / 2, (from.position[1] + to.position[1]) / 2]}
            zoom={14}
            interactive={false}
            lowData={lowData}
            route={route}
            markers={[
              { id: 'from', position: from.position, kind: 'lieu' },
              { id: 'to', position: to.position, kind: 'lieu' },
            ]}
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-x-2 bottom-2 z-[450] flex justify-between gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-bold shadow-douce">
              <CarFront size={15} /> Trajet interrégional
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-[13px] font-bold text-vert-fondation shadow-douce">
              {km} • ~{to.minutes} min
            </span>
          </div>
        </div>

        <section className="mt-4 rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[18px] font-semibold">
              <Route size={20} className="text-vert-fondation" /> Itinéraire choisi
            </h2>
            <Badge tone="lavande" className="text-vert-fondation">
              Course simple
            </Badge>
          </div>
          <div className="relative mt-3 pl-8">
            <span className="absolute left-[9px] top-3 h-[calc(100%-1.5rem)] w-0.5 bg-sombre" />
            <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-vert-fondation">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-encre-douce">Point de prise en charge</div>
            <div className="text-[18px] font-bold leading-tight">{from.name}</div>
            <div className="text-[14px] text-encre-douce">{from.landmark}</div>
            <span className="absolute bottom-7 left-0.5 h-4 w-4 rounded-[3px] border-[3px] border-brun-ocre bg-white" />
            <div className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-encre-douce">Destination</div>
            <div className="text-[18px] font-bold leading-tight">{to.name}</div>
            <div className="text-[14px] text-encre-douce">{to.landmark}</div>
          </div>
        </section>

        <section className="mt-4 rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-start justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[18px] font-semibold leading-tight">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jaune-soleil text-brun-ocre">
                <MapPinPlus size={17} />
              </span>
              Précision pour le chauffeur
            </h2>
            <Badge tone="vert">VITAL</Badge>
          </div>
          <p className="mt-1.5 text-[14px] leading-snug text-encre-douce">
            Aidez le chauffeur à vous identifier instantanément dans la foule sans appels répétés.
          </p>
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
            {LANDMARK_CHIPS.map(({ label, icon: Icon }) => {
              const on = draft.landmarks.includes(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLandmark(label)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-semibold',
                    on ? 'bg-vert-fondation text-white' : 'bg-fond-carte',
                  )}
                >
                  <Icon size={15} /> {label}
                </button>
              )
            })}
          </div>
          <div className="mt-3 rounded-[12px] bg-fond-carte p-3">
            <textarea
              value={draft.note}
              maxLength={NOTE_MAX}
              rows={3}
              onChange={(e) => updateDraft({ note: e.target.value })}
              placeholder="Ex : maison bleue derrière la boulangerie…"
              className="w-full resize-none bg-transparent text-[15px] leading-snug outline-none"
            />
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-1.5 font-bold text-vert-fondation">
                <Eye size={15} /> Visible direct sur son tableau de bord
              </span>
              <span className="text-encre-douce">
                {draft.note.length}/{NOTE_MAX}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[18px] font-semibold">
              <Banknote size={21} className="text-brun-ocre" /> Tarif Garanti Fixe
            </h2>
            <Badge tone="jaune" icon={<Lock size={12} />} className="text-encre">
              Sans surprise
            </Badge>
          </div>
          <div className="mt-3 flex items-end justify-between rounded-[12px] bg-fond-carte px-4 py-2">
            <div className="pb-1">
              <div className="text-[13px] font-medium">Total à payer</div>
              <div className="text-[13px] text-vert-action">Course urbaine certifiée</div>
            </div>
            <div className="text-vert-fondation">
              <span className="text-[38px] font-extrabold leading-none tracking-tight">{formatAmount(price)}</span>
              <span className="ml-1 text-[18px] font-bold">FCFA</span>
            </div>
          </div>
          <div className="mt-2 flex gap-2.5 rounded-[12px] bg-jaune-pale p-3">
            <CircleDollarSign size={19} className="mt-0.5 shrink-0 text-brun-ocre" />
            <p className="text-[13px] leading-snug text-brun-ocre">
              <strong className="block text-[14px] text-encre">Règlement en espèces à destination</strong>
              Prévoyez l'appoint si possible (billet de 1000 ou pièces de 500/200). Paiement direct remis au chauffeur à
              l'arrêt.
            </p>
          </div>
          <p className="mt-3 flex items-center gap-2.5 text-[13px] leading-snug text-encre-douce">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vert-menthe text-vert-fondation">
              <Landmark size={15} />
            </span>
            Tarif solidaire agréé sous l'égide de la communauté des transporteurs de Tivaouane.
          </p>
        </section>

        <button
          type="button"
          onClick={order}
          className="mt-5 flex min-h-16 w-full items-center gap-3 rounded-[16px] bg-vert-fondation px-4 py-2 text-white shadow-[0_4px_0_#b6bcc9]"
        >
          <CarFront size={24} className="shrink-0" />
          <span className="flex-1 text-center text-[19px] font-bold uppercase leading-tight">
            Commander mon Allo ({formatAmount(price)} FCFA)
          </span>
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-encre-douce">
          <CircleCheck size={16} className="text-vert-action" /> Annulation gratuite avant l'arrivée du chauffeur
        </p>
        <button
          type="button"
          onClick={() => toast('Appel du standard Allo Tukki : 800 00 28 28 (simulation).')}
          className="mt-3 flex w-full items-center justify-center gap-1.5 text-[14px] text-encre-douce"
        >
          <Headset size={16} /> Besoin d'aide ? Appeler le standard
        </button>
      </div>
    </Screen>
  )
}
