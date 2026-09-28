import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Bus, CarFront, ChevronRight, Compass, History, Hospital, Landmark, Navigation, Search, Star, Store, X } from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView } from '../../../components/MapView'
import { Badge, Button, Modal, Screen } from '../../../design'
import { cn } from '../../../lib/format'
import { distance } from '../../../lib/geo'
import { PLACES, RECENT_PLACE_IDS, TIVAOUANE_CENTER, placeById, type LatLng, type PlaceCategory } from '../../../mock/places'
import { useDemoStore } from '../../../store/demoStore'
import { toast } from '../../../store/toastStore'
import { ClientHeader } from '../components/ClientHeader'
import { PlaceIcon } from '../components/placeVisuals'

type Filter = 'tous' | PlaceCategory

const FILTERS: Array<{ id: Filter; label: string; icon: typeof Landmark }> = [
  { id: 'tous', label: 'Tous', icon: Navigation },
  { id: 'culte', label: 'Lieux de culte', icon: Landmark },
  { id: 'marche', label: 'Marchés & Boutiques', icon: Store },
  { id: 'sante', label: 'Santé', icon: Hospital },
  { id: 'gare', label: 'Gares & Sorties', icon: Bus },
]

/** C8 – Recherche du lieu (repères locaux, carte, durées et prix). */
export function C8Depart() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const draft = useDemoStore((s) => s.client.draft)
  const lowData = useDemoStore((s) => s.settings.lowData)
  const updateDraft = useDemoStore((s) => s.updateDraft)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>((params.get('categorie') as Filter) || 'tous')
  const [recentsCleared, setRecentsCleared] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [picked, setPicked] = useState<LatLng | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q || filter !== 'tous' ? PLACES : RECENT_PLACE_IDS.map(placeById)
    return base.filter(
      (p) =>
        p.id !== draft.fromId &&
        (filter === 'tous' || p.category === filter) &&
        (!q || `${p.name} ${p.detail}`.toLowerCase().includes(q)),
    )
  }, [query, filter, draft.fromId])

  const choose = (toId: string) => {
    updateDraft({ toId })
    navigate(path('C10'))
  }

  const nearestToPicked = picked
    ? [...PLACES].filter((p) => p.id !== draft.fromId).sort((a, b) => distance(a.position, picked) - distance(b.position, picked))[0]
    : null

  const showList = !recentsCleared || query || filter !== 'tous'

  return (
    <Screen header={<ClientHeader back={path('C7')} title="Où Allez Vous ?" />}>
      <div className="px-4 pb-6 pt-3">
        <div className="flex h-14 items-center gap-3 rounded-[14px] bg-white px-4 shadow-douce">
          <Search size={21} className="text-vert-fondation" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quartier, mosquée, rond-point…"
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-gris-texte"
          />
          {query && (
            <button type="button" aria-label="Effacer" onClick={() => setQuery('')}>
              <X size={20} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="mt-3 flex w-full items-center gap-3 rounded-[14px] bg-fond-carte p-3 text-left shadow-douce"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-vert-action text-white">
            <Compass size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[17px] font-semibold">Pointer sur la carte</span>
            <span className="block truncate text-[13px] text-encre-douce">Pratique si vous connaissez l'angle de la rue</span>
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <ChevronRight size={18} />
          </span>
        </button>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold">Repères par catégorie</h2>
          <span className="text-[13px] font-bold text-vert-action">Tivaouane</span>
        </div>
        <div className="-mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {FILTERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-semibold',
                filter === id ? 'bg-vert-fondation text-white' : 'bg-white text-encre shadow-douce',
              )}
            >
              <Icon size={17} className={filter === id ? '' : id === 'marche' ? 'text-brun-ocre' : 'text-vert-fondation'} />
              {label}
            </button>
          ))}
        </div>

        {filter === 'tous' && !query && (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <CategoryCard
                onClick={() => setFilter('culte')}
                icon={<Landmark size={20} />}
                iconClass="bg-fond-carte text-vert-fondation"
                badge={<Badge tone="vert">3 spots</Badge>}
                title="Zawiyas & Mosquées"
                text="Rkhiya, Seydi Jamil…"
              />
              <CategoryCard
                onClick={() => setFilter('gare')}
                icon={<CarFront size={20} />}
                iconClass="bg-jaune-pale text-brun-ocre"
                badge={<Badge tone="jaune">Carrefours</Badge>}
                title="Gares & Sorties"
                text="Thiès, Dakar, Pout…"
              />
            </div>

            <button
              type="button"
              onClick={() => choose('zawiya-babacar')}
              className="mt-3 flex w-full items-center gap-3 rounded-carte bg-fond-carte p-3 text-left shadow-douce"
            >
              <img src="/images/zawiya-babacar-sy.jpg" alt="" className="h-16 w-16 rounded-[10px] object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-bold text-vert-action">Repère populaire •</span>
                <span className="block truncate text-[17px] font-semibold">Zawiya Serigne Babacar Sy</span>
                <span className="block truncate text-[13px] text-encre-douce">Quartier Ndoutte • Zone sécurisée</span>
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vert-fondation text-white">
                <ArrowUpRight size={20} />
              </span>
            </button>
          </>
        )}

        <div className="mt-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[17px] font-semibold">
            <History size={19} className="text-vert-fondation" />
            {query || filter !== 'tous' ? 'Résultats' : 'Récents & Favoris'}
          </h2>
          {!query && filter === 'tous' && !recentsCleared && (
            <button type="button" onClick={() => setRecentsCleared(true)} className="text-[13px] font-semibold text-gris-texte">
              Effacer tout
            </button>
          )}
        </div>
        <div className="mt-2.5 space-y-2.5">
          {showList && results.length === 0 && (
            <p className="rounded-carte bg-white p-4 text-center text-[14px] text-gris-texte">Aucun lieu trouvé pour « {query} ».</p>
          )}
          {!showList && (
            <p className="rounded-carte bg-white p-4 text-center text-[14px] text-gris-texte">Aucun lieu récent.</p>
          )}
          {showList &&
            results.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => choose(place.id)}
                className="flex w-full items-center gap-3 rounded-carte bg-white p-3 text-left shadow-douce"
              >
                <PlaceIcon category={place.category} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[16px] font-semibold">{place.name}</span>
                    {place.favorite && <Star size={15} className="shrink-0 fill-brun-ocre text-brun-ocre" />}
                  </span>
                  <span className="block truncate text-[13px] text-encre-douce">{place.detail}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="flex items-center gap-1 rounded-full bg-fond-carte px-2 py-0.5 text-[12px] font-bold text-vert-fondation">
                    <CarFront size={13} /> ~{place.minutes} min
                  </span>
                  <span className="text-[13px] text-encre-douce">{place.price} F CFA</span>
                </span>
              </button>
            ))}
        </div>
      </div>

      <Modal open={mapOpen} onClose={() => setMapOpen(false)} title="Pointer sur la carte">
        <p className="mb-2 text-[13px] text-encre-douce">Touchez la carte à l'endroit où vous souhaitez aller.</p>
        <MapView
          center={TIVAOUANE_CENTER}
          zoom={14}
          lowData={lowData}
          showLocate={false}
          onMapClick={setPicked}
          markers={picked ? [{ id: 'pick', position: picked, kind: 'voyageur' }] : []}
          className="h-64 overflow-hidden rounded-[14px]"
        />
        {nearestToPicked && (
          <p className="mt-2 text-[13px]">
            Repère le plus proche : <strong>{nearestToPicked.name}</strong>
          </p>
        )}
        <Button
          block
          size="md"
          className="mt-3"
          disabled={!nearestToPicked && !lowData}
          onClick={() => {
            const target = nearestToPicked ?? placeById('hopital')
            setMapOpen(false)
            toast(`Point placé près de ${target.name}.`, 'succes')
            choose(target.id)
          }}
        >
          Valider ce point
        </Button>
      </Modal>
    </Screen>
  )
}

function CategoryCard({
  onClick,
  icon,
  iconClass,
  badge,
  title,
  text,
}: {
  onClick: () => void
  icon: ReactNode
  iconClass: string
  badge: ReactNode
  title: string
  text: string
}) {
  return (
    <button type="button" onClick={onClick} className="rounded-carte bg-white p-3.5 text-left shadow-douce">
      <span className="flex items-start justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${iconClass}`}>{icon}</span>
        {badge}
      </span>
      <span className="mt-3 block text-[17px] font-medium leading-tight">{title}</span>
      <span className="mt-0.5 block truncate text-[13px] text-encre-douce">{text}</span>
    </button>
  )
}
