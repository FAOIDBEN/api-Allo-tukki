import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Banknote, CarFront, Compass, Landmark, Megaphone, Power, RadioTower, Star, TrendingUp, User, Zap } from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView, type MapMarker } from '../../../components/MapView'
import { BottomNav, LogoTile, Screen } from '../../../design'
import { cn, formatAmount } from '../../../lib/format'
import { MOUSSA } from '../../../mock/people'
import { placeById } from '../../../mock/places'
import { COMMISSION_RATE, useDemoStore } from '../../../store/demoStore'
import { toast } from '../../../store/toastStore'
import { driverNav } from '../../navItems'
import { DriverStrip } from '../components/DriverChrome'

/** D7 – Accueil chauffeur en ligne : statut, zone, bilan du jour, pause en un geste. */
export function D7Accueil() {
  const navigate = useNavigate()
  const driver = useDemoStore((s) => s.driver)
  const nightMode = useDemoStore((s) => s.settings.nightMode)
  const updateDriver = useDemoStore((s) => s.updateDriver)
  const online = driver.online
  const commission = Math.round(driver.earningsToday * COMMISSION_RATE)
  const marche = placeById('marche-central')
  const mosquee = placeById('grande-mosquee')

  const markers = useMemo<MapMarker[]>(
    () => [
      { id: 'moi', position: [marche.position[0] + 0.0012, marche.position[1] - 0.0022], kind: 'voiture', label: `${MOUSSA.firstName} (${MOUSSA.car.plate})`, labelTone: 'sombre' },
      { id: 'mosquee', position: mosquee.position, kind: 'lieu', label: 'Grande Mosquée (~250m)', labelTone: 'blanc' },
      { id: 'marche', position: marche.position, kind: 'lieu', label: 'Marché Central (~400m)', labelTone: 'blanc' },
    ],
    [marche, mosquee],
  )

  const toggle = () => {
    if (online) {
      updateDriver({ online: false, onlineSince: undefined })
      toast('Vous êtes hors ligne. Aucune nouvelle demande.', 'info')
    } else {
      updateDriver({ online: true, onlineSince: Date.now() })
      toast('Vous êtes en ligne. Les réservations arrivent ici.', 'succes')
    }
  }

  return (
    <Screen
      header={
        <>
          <DriverStrip dot="vert" left="Sync réseau (2G/3G OK)" right={<><Zap size={14} /> Tivaouane Pro</>} />
          
        <header className="z-10 flex shrink-0 items-center gap-2.5 bg-surface-haut px-4 py-3">
          <LogoTile size={34} />
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-md bg-jaune-soleil px-1.5 text-[11px] font-extrabold uppercase text-brun-ocre">Interrégional Pro</span>
            <div className="truncate text-[18px] font-bold uppercase leading-tight">Accueil chauffeur</div>
          </div>
          <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold', online ? 'bg-fond-carte' : 'bg-gris-bord text-gris-texte')}>
            <span className={cn('h-2.5 w-2.5 rounded-full', online ? 'bg-vert-action' : 'bg-gris-texte')} />
            {online ? 'EN LIGNE' : 'HORS LIGNE'}
          </span>
          <button type="button" aria-label="Profil" onClick={() => navigate(path('D5'))} className="flex h-9 w-9 items-center justify-center rounded-full bg-vert-fondation text-white">
            <User size={18} />
          </button>
        </header>
      
        </>
      }
      nav={<BottomNav items={driverNav} />}
    >
      <div className="bg-fond-carte px-4 pb-3 pt-3">
        <div className="grid grid-cols-[1.6fr_1fr] gap-2">
          <button
            type="button"
            onClick={toggle}
            className={cn('flex items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-[13px] font-bold uppercase leading-tight', online ? 'bg-vert-menthe text-encre' : 'bg-vert-fondation text-white')}
          >
            <span className={cn('h-3.5 w-3.5 shrink-0 rounded-full', online ? 'bg-vert-fondation' : 'bg-white')} />
            {online ? 'En ligne • Prêt pour course' : 'Passer en ligne'}
          </button>
          <span className="flex items-center gap-2 rounded-full bg-surface/70 px-3 text-[12px] font-bold leading-tight">
            <RadioTower size={17} className="shrink-0 text-vert-fondation" /> GPS • 2G/3G OK
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[14px] leading-snug">
            <Compass size={18} className="shrink-0 text-brun-ocre" />
            <span>
              Secteur : <strong>Marché Central &amp; Gare Routière</strong>
            </span>
          </p>
          <span className="shrink-0 rounded-md bg-jaune-pale px-2 py-1 text-[13px] font-bold leading-tight text-brun-ocre">Forte Demande</span>
        </div>
      </div>

      <div className="px-4 pb-6 pt-3">
        <MapView center={[marche.position[0] + 0.002, marche.position[1] - 0.001]} zoom={15} markers={markers} dark={nightMode} className="h-[240px] overflow-hidden rounded-carte shadow-douce" />

        <div className="mt-3 flex items-center gap-3">
          <span className="relative">
            <img src={MOUSSA.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
            <span className={cn('absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white', online ? 'bg-vert-action' : 'bg-gris-texte')} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[19px] font-semibold">
              {MOUSSA.firstName} {MOUSSA.lastName} <BadgeCheck size={18} className="fill-vert-fondation text-white" />
            </div>
            <div className="flex items-center gap-2 text-[14px]">
              <span className="rounded-md bg-fond-carte px-1.5 font-bold tracking-wide">{MOUSSA.car.plate}</span>
              <span className="text-encre-douce">• Corolla {MOUSSA.car.color}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-[17px] font-bold">
              <Star size={16} className="fill-brun-ocre text-brun-ocre" /> 4.9
            </div>
            <div className="text-[12px] text-encre-douce">{MOUSSA.trips} avis</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[14px] font-bold uppercase tracking-wide text-encre-douce">Bilan d'aujourd'hui</span>
          <span className="text-[13px] text-encre-douce">Mise à jour directe</span>
        </div>
        <div className="mt-2 grid grid-cols-[1.9fr_1fr] gap-2.5">
          <button type="button" onClick={() => navigate(path('D14'))} className="rounded-carte bg-surface p-3.5 text-left shadow-douce">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-encre-douce">
              <Banknote size={17} className="text-vert-fondation" /> Gains Chauffeur
            </span>
            <span className="mt-2 block text-vert-fondation">
              <span className="text-[34px] font-extrabold leading-none">{formatAmount(driver.earningsToday)}</span>
              <span className="ml-1 text-[13px] font-bold">FCFA</span>
            </span>
            <span className="mt-1 flex items-center gap-1 text-[13px] text-encre-douce">
              <TrendingUp size={14} /> +{formatAmount(driver.earningsToday - 5300)} vs hier
            </span>
          </button>
          <button type="button" onClick={() => navigate(path('D15'))} className="rounded-carte bg-surface p-3.5 text-left shadow-douce">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-encre-douce">
              <CarFront size={17} className="text-brun-ocre" /> Courses
            </span>
            <span className="mt-2 block text-[34px] font-extrabold leading-none">{driver.tripsToday}</span>
            <span className="mt-1 block text-[13px] text-encre-douce">validées</span>
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-carte bg-fond-carte p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#dfe3f7] text-encre-douce">
            <Landmark size={20} />
          </span>
          <div className="min-w-0 flex-1 text-[13px] leading-snug text-encre-douce">
            <div className="truncate text-[15px] font-semibold text-encre">Commission Fondation (10 %)</div>
            Solde prélevé sur courses validées
          </div>
          <div className="text-right">
            <div className="text-[17px] font-bold text-rouge-sos">{formatAmount(commission)} FCFA</div>
            <div className="text-[12px] font-semibold text-encre-douce">À reverser</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-carte bg-jaune-soleil p-3.5">
          <Megaphone size={24} className="shrink-0 text-brun-ocre" />
          <div className="min-w-0 flex-1 text-[13px] leading-snug text-brun-ocre">
            <div className="text-[15px] font-bold">Affluence Wazifa du Soir</div>
            Forte concentration de demandes près des esplanades.
          </div>
          <button type="button" onClick={() => navigate(path('D9'))} className="shrink-0 rounded-[10px] bg-brun-ocre px-3 py-2 text-[13px] font-bold text-white">
            Voir Zone
          </button>
        </div>

        <button
          type="button"
          onClick={toggle}
          className={cn(
            'mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-carte text-[18px] font-extrabold uppercase shadow-douce',
            online ? 'bg-rouge-pale text-rouge-sos' : 'bg-vert-fondation text-white',
          )}
        >
          <Power size={22} /> {online ? 'Passer hors ligne' : 'Passer en ligne'}
        </button>
        <p className="mt-2 text-center text-[13px] text-encre-douce">
          {online ? 'Vous ne recevrez plus de demandes de courses à proximité.' : 'Passez en ligne pour recevoir les réservations de places.'}
        </p>
      </div>
    </Screen>
  )
}
