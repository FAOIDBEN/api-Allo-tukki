import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BatteryCharging, Bus, CarFront, ChevronRight, Flashlight, Hospital, Landmark, Moon, Power, Radar, RadioTower, Shield, ShieldCheck, Siren, Sun, UserCog, Wallet } from 'lucide-react'
import { path } from '../../../app/screens'
import { MapView } from '../../../components/MapView'
import { AppHeader, BottomNav, ProfileButton, Screen, type NavItem } from '../../../design'
import { cn } from '../../../lib/format'
import { MOUSSA } from '../../../mock/people'
import { TIVAOUANE_CENTER } from '../../../mock/places'
import { useDemoStore } from '../../../store/demoStore'
import { toast } from '../../../store/toastStore'

const nightNav: NavItem[] = [
  { to: path('D9'), label: 'Maraude', icon: <Moon size={24} /> },
  { to: path('D15'), label: 'Courses', icon: <CarFront size={24} /> },
  { to: path('D14'), label: 'Solde', icon: <Wallet size={24} /> },
  { to: path('D5'), label: 'Compte', icon: <UserCog size={24} /> },
]

const ZONES = [
  { icon: Siren, tile: 'bg-rouge-pale text-rouge-sos', name: 'Urgences Dabakh', detail: 'Forte demande • Sorties de garde', detailClass: 'text-rouge-sos', dist: '450m' },
  { icon: Bus, tile: 'bg-jaune-pale text-brun-ocre', name: 'Gare Routière (Sud)', detail: 'Arrivée de 3 cars de Dakar', detailClass: 'text-encre-douce', dist: '1.2 km' },
  { icon: Moon, tile: 'bg-[#dfe6f0] text-vert-fondation', name: 'Esplanade Zawiya', detail: 'Veillée spirituelle • Retours calmes', detailClass: 'text-encre-douce', dist: '800m' },
]

const CHECKS = [
  { icon: Flashlight, label: 'Phare avant LED puissant', status: 'Vérifié', iconClass: 'text-vert-fondation' },
  { icon: Shield, label: 'Gilet réfléchissant Fondation', status: 'Porté', iconClass: 'text-brun-ocre' },
  { icon: Siren, label: 'Feu stop arrière conforme', status: 'Conforme', iconClass: 'text-rouge-sos' },
]

/** D9 – Mode nuit & économie batterie : bascule réelle du thème, radar de maraude, contrôle sécurité. */
export function D9ModeNuit() {
  const navigate = useNavigate()
  const { hash } = useLocation()
  const nightMode = useDemoStore((s) => s.settings.nightMode)
  const online = useDemoStore((s) => s.driver.online)
  const setSettings = useDemoStore((s) => s.setSettings)
  const updateDriver = useDemoStore((s) => s.updateDriver)
  const triggerSos = useDemoStore((s) => s.triggerSos)
  const sosRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (hash === '#sos') sosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [hash])

  const sos = () => {
    triggerSos({ passengerName: `${MOUSSA.firstName} ${MOUSSA.lastName} (chauffeur)`, phone: MOUSSA.phone, location: 'Tivaouane • Patrouille de nuit' })
    toast('Alerte SOS envoyée à la centrale. Patrouille prévenue.', 'danger', 4500)
  }

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Allo Tukki"
          eyebrowTone="vert"
          title="Mode nuit / Écran éco"
          right={
            <>
              <RadioTower size={22} className="text-encre-douce" />
              <ProfileButton onClick={() => navigate(path('D5'))} />
            </>
          }
        />
      }
      band={
        <div className="flex shrink-0 items-center gap-2 bg-sombre px-4 py-2 text-[13px] font-semibold text-white">
          <BatteryCharging size={17} />
          <span className="flex-1 truncate">
            {nightMode ? 'Mode Nuit Éco Actif' : 'Mode Jour'} • <span className="text-[#9ff5c3]">{nightMode ? '+40% autonomie' : 'Luminosité max'}</span>
          </span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[#9ff5c3]">88 %</span>
        </div>
      }
      nav={<BottomNav items={nightNav} />}
    >
      <div className="space-y-4 px-4 pb-6 pt-4">
        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vert-fondation text-white">
              <CarFront size={23} />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-vert-menthe" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[18px] font-semibold">
                  {MOUSSA.firstName} {MOUSSA.lastName}
                </span>
                <span className="rounded-md bg-vert-clair px-1.5 text-[12px] font-bold text-vert-fondation">Pro</span>
              </div>
              <div className="truncate text-[13px] text-encre-douce">Voiture #{MOUSSA.id} • Tivaouane</div>
            </div>
            <span className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold', online ? 'bg-vert-fondation text-white' : 'bg-gris-bord text-gris-texte')}>
              {online ? 'EN SERVICE' : 'HORS SERVICE'} <span className={cn('h-2.5 w-2.5 rounded-full', online ? 'bg-[#35e06b]' : 'bg-gris-texte')} />
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-[14px] bg-fond-carte p-1">
            <button
              type="button"
              onClick={() => setSettings({ nightMode: false })}
              className={cn('flex h-11 items-center justify-center gap-2 rounded-[11px] text-[15px] font-semibold', !nightMode ? 'bg-surface shadow-douce' : 'text-encre-douce')}
            >
              <Sun size={18} /> Jour (Soleil)
            </button>
            <button
              type="button"
              onClick={() => setSettings({ nightMode: true })}
              className={cn('flex h-11 items-center justify-center gap-2 rounded-[11px] text-[15px] font-semibold', nightMode ? 'bg-[#1f2738] text-white' : 'text-encre-douce')}
            >
              <Moon size={18} className="text-jaune-soleil" /> Nuit (Éco OLED)
            </button>
          </div>
        </section>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[19px] font-semibold leading-tight">
              <Radar size={22} className="shrink-0 text-vert-fondation" /> Radar Maraude Nocturne
            </h2>
            <span className="shrink-0 rounded-full bg-jaune-creme px-3 py-1 text-[13px] font-bold leading-tight text-brun-ocre">3 zones d'affluence</span>
          </div>
          <div className="relative mt-3 h-[210px] overflow-hidden rounded-[14px]">
            <MapView
              center={TIVAOUANE_CENTER}
              zoom={14}
              dark
              showLocate={false}
              markers={[{ id: 'moi', position: TIVAOUANE_CENTER, kind: 'navigation' }]}
              className="h-full w-full"
            />
            <span className="pointer-events-none absolute left-2 top-2 z-[450] flex items-center gap-1 rounded-[8px] bg-sombre/85 px-2 py-1 text-[13px] font-semibold text-[#9ff5c3]">
              <Hospital size={14} /> Urgences Dabakh
            </span>
            <span className="pointer-events-none absolute right-2 top-2 z-[450] flex items-center gap-1 rounded-[8px] bg-sombre/85 px-2 py-1 text-[13px] font-semibold text-jaune-soleil">
              <Landmark size={14} /> Zawiya
            </span>
            <span className="pointer-events-none absolute bottom-2 left-2 z-[450] flex items-center gap-1 rounded-[8px] bg-sombre/85 px-2 py-1 text-[13px] font-semibold text-[#9ff5c3]">
              <Bus size={14} /> Gare Routière
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {ZONES.map((z) => (
              <button
                key={z.name}
                type="button"
                onClick={() => toast(`Itinéraire vers ${z.name} (${z.dist}).`)}
                className="flex w-full items-center gap-3 rounded-[12px] bg-fond-carte p-2.5 text-left"
              >
                <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]', z.tile)}>
                  <z.icon size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px]">{z.name}</span>
                  <span className={cn('block truncate text-[13px]', z.detailClass)}>{z.detail}</span>
                </span>
                <span className="text-[14px] font-medium">{z.dist}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between">
            <h2 className="text-[19px] font-semibold">Sécurité Nocturne Validée</h2>
            <ShieldCheck size={22} className="text-vert-fondation" />
          </div>
          <div className="mt-3 space-y-2">
            {CHECKS.map((c) => (
              <div key={c.label} className="flex items-center gap-2.5 rounded-[12px] bg-fond-carte px-3 py-2.5">
                <c.icon size={18} className={c.iconClass} />
                <span className="flex-1 text-[15px]">{c.label}</span>
                <span className="rounded-full bg-vert-clair px-2 py-0.5 text-[13px] font-bold text-vert-fondation">{c.status} ✓</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-carte bg-surface p-3.5 shadow-douce">
            <div className="flex items-center justify-between text-[13px] font-semibold text-encre-douce">
              Courses Nuit <CarFront size={18} className="text-vert-fondation" />
            </div>
            <div className="mt-2 text-[32px] font-extrabold leading-none">4</div>
            <div className="mt-1 text-[13px] text-vert-action">Activité régulière</div>
          </div>
          <div className="rounded-carte bg-surface p-3.5 shadow-douce">
            <div className="flex items-center justify-between text-[13px] font-semibold text-encre-douce">
              Gains Nuit <Wallet size={18} className="text-brun-ocre" />
            </div>
            <div className="mt-2 text-[32px] font-extrabold leading-none">
              3 200<span className="ml-1 text-[12px] font-bold">FCFA</span>
            </div>
            <div className="mt-1 text-[13px] text-encre-douce">Solde actualisé</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            updateDriver({ online: false })
            toast('Maraude terminée. Bon retour au garage, rentrez en sécurité.', 'info')
            navigate(path('D7'))
          }}
          className="flex w-full items-center gap-3 rounded-carte bg-[#2a3142] p-3 text-left text-white"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-jaune-soleil">
            <Power size={21} />
          </span>
          <span className="flex-1">
            <span className="block text-[18px] font-semibold">Terminer la Maraude</span>
            <span className="block text-[13px] text-white/70">Rentrer au garage en sécurité</span>
          </span>
          <ChevronRight size={22} />
        </button>
        <button ref={sosRef} type="button" onClick={sos} className="flex h-14 w-full items-center justify-center gap-2 rounded-carte bg-rouge-sos text-[18px] font-semibold text-white shadow-douce">
          <Shield size={21} /> SOS Patrouille de Nuit (24/7)
        </button>
      </div>
    </Screen>
  )
}
