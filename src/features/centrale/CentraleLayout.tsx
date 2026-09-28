import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  CarFront,
  Clock3,
  Contact,
  LayoutGrid,
  Menu,
  Network,
  Phone,
  ShieldCheck,
  Siren,
  User,
  Wallet,
  Wifi,
  X,
} from 'lucide-react'
import { path } from '../../app/screens'
import { DemoPanel } from '../../components/DemoPanel'
import { LogoTile, Toaster } from '../../design'
import { cn } from '../../lib/format'
import { toast } from '../../store/toastStore'
import { useDemoStore } from '../../store/demoStore'
import { useDakarClock } from './components/Clock'

interface MenuEntry {
  label: string
  icon: ReactNode
  to?: string
}

const MENU: MenuEntry[] = [
  { label: "Vue d'ensemble", icon: <LayoutGrid size={20} />, to: path('W1') },
  { label: 'Supervision Flotte & Chauffeurs', icon: <CarFront size={20} /> },
  { label: 'Dispatch & Demandes SMS', icon: <Contact size={20} />, to: path('W2') },
  { label: 'Sécurité & Urgences SOS', icon: <Siren size={20} />, to: path('W3') },
  { label: 'Agréments Chauffeurs', icon: <ShieldCheck size={20} />, to: path('W4') },
  { label: 'Finances & Caisse Solidaire', icon: <Wallet size={20} />, to: path('W5') },
  { label: 'Stations & Paramètres', icon: <Network size={20} /> },
]

export function CentraleLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-[#f7f8fe] text-encre">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[290px] flex-col bg-fond-clair transition-transform lg:translate-x-0',
          menuOpen ? 'translate-x-0 shadow-flottante' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 bg-white px-5">
          <LogoTile size={36} />
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight text-vert-fondation">Allo Tukki</div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-encre-douce">Centrale régulation</div>
          </div>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="ml-auto rounded-full p-1.5 hover:bg-fond-clair lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => toast('Seule la Zone Nord (Tivaouane Hub) est ouverte dans la démo.')}
          className="mx-3 mt-3 flex items-center justify-between rounded-[10px] bg-fond-carte px-3 py-2 text-[13px] font-semibold"
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-vert-action" /> Tivaouane Hub
          </span>
          <span className="font-bold text-encre-douce">ZONE NORD</span>
        </button>

        <nav className="mt-3 flex flex-col gap-0.5 px-3">
          {MENU.map((entry) =>
            entry.to ? (
              <NavLink
                key={entry.label}
                to={entry.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-semibold leading-snug transition-colors',
                    isActive ? 'bg-white text-vert-fondation shadow-douce' : 'text-encre-douce hover:bg-white/70',
                  )
                }
              >
                <span className="shrink-0">{entry.icon}</span>
                {entry.label}
              </NavLink>
            ) : (
              <button
                key={entry.label}
                type="button"
                onClick={() => toast(`« ${entry.label} » : module prévu dans une prochaine version.`)}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] font-semibold leading-snug text-encre-douce/70 hover:bg-white/70"
              >
                <span className="shrink-0">{entry.icon}</span>
                <span className="flex-1">{entry.label}</span>
                <span className="rounded-md bg-gris-bord px-1.5 py-0.5 text-[10px] font-bold uppercase text-gris-texte">
                  bientôt
                </span>
              </button>
            ),
          )}
        </nav>

        <div className="mt-auto p-3">
          <div className="rounded-[14px] bg-white p-3.5 shadow-douce">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[13px] font-bold">
                <Wifi size={16} className="text-vert-fondation" /> Réseau 2G/Sync
              </span>
              <span className="rounded-md bg-vert-menthe px-1.5 py-0.5 text-[11px] font-extrabold">Optimal</span>
            </div>
            <p className="mt-1 text-[12px] leading-snug text-gris-texte">Bande passante Tivaouane Centre stable.</p>
          </div>
        </div>
      </aside>
      {menuOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-30 bg-sombre/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="lg:pl-[290px]">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-4 md:px-6">
          <Outlet />
        </main>
      </div>

      <Toaster fixed />
      <DemoPanel />
    </div>
  )
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const clock = useDakarClock()
  const pendingSos = useDemoStore((s) => s.centrale.sosAlerts.filter((a) => a.status === 'envoyee').length)
  const pendingSms = useDemoStore((s) => s.centrale.smsQueue.filter((r) => r.status === 'attente').length)
  const notifications = pendingSos + pendingSms

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-white/95 px-4 backdrop-blur md:gap-5 md:px-6">
      <button type="button" aria-label="Ouvrir le menu" onClick={onMenu} className="rounded-full p-1.5 hover:bg-fond-clair lg:hidden">
        <Menu size={22} />
      </button>
      <span className="hidden items-center gap-1.5 rounded-full bg-vert-fondation px-3 py-1.5 text-[12px] font-bold text-white sm:flex">
        <span className="h-2.5 w-2.5 rounded-full bg-vert-action ring-2 ring-white/30" /> CENTRALE ACTIVE (24/7)
      </span>
      <span className="flex items-center gap-1.5 text-[13px] font-semibold tabular-nums">
        <Clock3 size={17} /> Tivaouane : {clock} GMT
      </span>

      <div className="ml-auto flex items-center gap-3 md:gap-5">
        <button
          type="button"
          onClick={() => toast('Appel de la hotline SOS 800 00 28 28 (simulation).', 'danger')}
          className="hidden items-center gap-1.5 rounded-full bg-rouge-pale px-3.5 py-1.5 text-[12px] font-extrabold text-rouge-sos md:flex"
        >
          <Phone size={15} /> HOTLINE SOS : 800 00 28 28
        </button>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() =>
            toast(
              notifications > 0
                ? `${pendingSos} alerte(s) SOS et ${pendingSms} SMS en attente.`
                : 'Aucune notification en attente.',
            )
          }
          className="relative rounded-full p-1.5 hover:bg-fond-clair"
        >
          <Bell size={21} />
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rouge-sos ring-2 ring-white" />
        </button>
        <Link to="/" className="flex items-center gap-2.5" title="Accueil de la démo">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-vert-fondation text-white">
            <User size={18} />
          </span>
          <span className="hidden leading-tight xl:block">
            <span className="block text-[13px] font-bold">Serigne Fallou Ndiaye</span>
            <span className="block text-[12px] text-gris-texte">Chef Régulateur</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
