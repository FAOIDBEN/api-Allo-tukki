import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Banknote, Landmark, Search, ShieldAlert } from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView, type MapMarker } from '../../../components/MapView'
import { BottomNav, BottomSheet, Screen } from '../../../design'
import { cn } from '../../../lib/format'
import { FREQUENT_PLACE_IDS, PLACES, placeById, type LatLng } from '../../../mock/places'
import { useDemoStore } from '../../../store/demoStore'
import { clientNav } from '../../navItems'
import { ClientHeader } from '../components/ClientHeader'
import { PlaceIcon } from '../components/placeVisuals'

/** Voitures interrégionales en attente autour du voyageur (décalages autour du point de départ). */
const WAITING_CARS: Array<{ offset: LatLng; minutes: number; highlight?: boolean }> = [
  { offset: [0.0042, -0.0061], minutes: 2, highlight: true },
  { offset: [0.0058, 0.0071], minutes: 4 },
  { offset: [-0.0052, 0.0079], minutes: 5 },
]

/** C7 – Accueil voyageur : carte des départs en direct + recherche de destination. */
export function C7Accueil() {
  const navigate = useNavigate()
  const firstName = useDemoStore((s) => s.client.firstName)
  const draft = useDemoStore((s) => s.client.draft)
  const lowData = useDemoStore((s) => s.settings.lowData)
  const updateDraft = useDemoStore((s) => s.updateDraft)
  const [departureOpen, setDepartureOpen] = useState(false)
  const departure = placeById(draft.fromId)

  const markers = useMemo<MapMarker[]>(
    () => [
      { id: 'moi', position: departure.position, kind: 'voyageur', label: departure.name, labelTone: 'blanc' },
      ...WAITING_CARS.map((c, i) => ({
        id: `car-${i}`,
        position: [departure.position[0] + c.offset[0], departure.position[1] + c.offset[1]] as LatLng,
        kind: 'voiture-attente' as const,
        label: `${c.minutes} min`,
        labelTone: c.highlight ? ('jaune' as const) : ('blanc' as const),
      })),
    ],
    [departure],
  )

  const choose = (toId: string) => {
    updateDraft({ toId })
    navigate(path('C10'))
  }

  return (
    <Screen
      header={<ClientHeader brand title="Allo Tukki" subtitle="Par la Fondation • Accueil" sos="icone" />}
      nav={<BottomNav items={clientNav} />}
    >
      <div className="sticky top-0 h-[300px]">
        <MapView center={departure.position} zoom={14} markers={markers} lowData={lowData} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-x-3 top-3 z-[450] flex justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold shadow-douce">
            <span className="h-2 w-2 rounded-full bg-vert-fondation" /> GPS précis
            <span className="text-gris-texte">•</span>
            <span className="text-vert-action">2G/3G OK</span>
          </span>
          <button
            type="button"
            onClick={() => navigate(path('C18'))}
            className="pointer-events-auto flex items-center gap-1 rounded-full bg-rouge-pale px-2.5 py-1 text-[11px] font-bold text-rouge-sos shadow-douce"
          >
            <ShieldAlert size={13} /> Sécurité
          </button>
        </div>
      </div>

      <section className="relative z-[500] -mt-6 min-h-[60%] rounded-t-[24px] bg-surface px-4 pb-6 pt-2.5 shadow-[0_-8px_24px_-12px_rgb(20_27_43/0.25)]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-gris-bord" />
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[25px] font-extrabold leading-tight tracking-tight">
              Bonjour{firstName ? ` ${firstName}` : ''} 👋
            </h1>
            <p className="text-[14px] text-encre-douce">Où souhaitez-vous aller aujourd'hui ?</p>
          </div>
          <button
            type="button"
            aria-label="Lieux de culte"
            onClick={() => navigate(`${path('C8')}?categorie=culte`)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vert-menthe text-vert-fondation"
          >
            <Landmark size={21} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-[14px] bg-fond-carte px-3.5 py-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-vert-fondation" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wide text-encre-douce">Point de départ</div>
            <div className="truncate text-[14px] font-semibold">
              Ma position • {departure.id === 'marche-central' ? 'Devant ' : ''}
              {departure.name}
            </div>
          </div>
          <button type="button" onClick={() => setDepartureOpen(true)} className="text-[13px] font-bold text-vert-fondation">
            Modifier
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(path('C8'))}
          className="mt-3 flex w-full items-center gap-3 rounded-[14px] bg-fond-carte p-2 pl-2.5 text-left shadow-douce"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-vert-menthe text-vert-fondation">
            <Search size={18} />
          </span>
          <span className="flex-1 text-[17px] font-medium text-gris-texte">Où allez-vous ?</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-vert-fondation text-white">
            <ArrowRight size={20} />
          </span>
        </button>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Lieux fréquents à Tivaouane</h2>
          <button type="button" onClick={() => navigate(path('C8'))} className="text-[13px] font-bold text-vert-fondation">
            Voir tout
          </button>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {FREQUENT_PLACE_IDS.map((id) => {
            const place = placeById(id)
            return (
              <button
                key={id}
                type="button"
                onClick={() => choose(id)}
                className="flex items-center gap-2.5 rounded-[14px] bg-fond-carte p-2.5 text-left transition-colors hover:bg-[#dde1f7]"
              >
                <PlaceIcon category={place.category} size={40} />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-bold">{place.name}</span>
                  <span className="block truncate text-[12px] text-encre-douce">{place.short}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-[14px] bg-fond-carte p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vert-fondation text-white">
            <Banknote size={18} />
          </span>
          <div className="text-[12px] leading-snug text-encre-douce">
            <div className="text-[13px] font-bold text-encre">Paiement en espèces au chauffeur</div>
            Tarifs encadrés par la Fondation • Pas de surprise
          </div>
        </div>
      </section>

      <BottomSheet open={departureOpen} onClose={() => setDepartureOpen(false)} title="Point de départ">
        <div className="space-y-2">
          {PLACES.filter((p) => p.category !== 'maison' || p.id === 'maison').map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => {
                updateDraft({ fromId: place.id, toId: draft.toId === place.id ? 'hopital' : draft.toId })
                setDepartureOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-[14px] p-2.5 text-left',
                place.id === draft.fromId ? 'bg-vert-clair ring-2 ring-vert-fondation' : 'bg-fond-clair',
              )}
            >
              <PlaceIcon category={place.category} size={38} />
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-bold">{place.name}</span>
                <span className="block truncate text-[12px] text-encre-douce">{place.detail}</span>
              </span>
            </button>
          ))}
        </div>
      </BottomSheet>
    </Screen>
  )
}
