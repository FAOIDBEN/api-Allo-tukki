import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarPlus, Gauge, Home, RotateCcw, Settings2, Siren, X } from 'lucide-react'
import { APP_LABELS, SCREENS, path, type AppKind } from '../app/screens'
import { useCurrentApp, useCurrentScreen } from '../app/useCurrentScreen'
import { cn } from '../lib/format'
import { useDemoStore } from '../store/demoStore'
import { isEmbedded } from '../store/sync'
import { toast } from '../store/toastStore'
import type { Speed } from '../store/types'

/**
 * Panneau démo discret (bouton ⚙︎ en bas à gauche, raccourci clavier « D »).
 * Réservé à la personne qui présente : saut d'écran, réinitialisation, simulations.
 */
export function DemoPanel() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const screen = useCurrentScreen()
  const app = useCurrentApp()
  const speed = useDemoStore((s) => s.settings.speed)
  const setSettings = useDemoStore((s) => s.setSettings)
  const resetDemo = useDemoStore((s) => s.resetDemo)
  const createRide = useDemoStore((s) => s.createRide)
  const triggerSos = useDemoStore((s) => s.triggerSos)
  const updateDriver = useDemoStore((s) => s.updateDriver)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'd' || e.key === 'D') setOpen((o) => !o)
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (isEmbedded()) return null

  const simulateBooking = () => {
    createRide({ source: 'demo' })
    if (app === 'chauffeur') {
      updateDriver({ online: true, onlineSince: Date.now() })
      navigate(path('D8'))
    } else {
      toast('Réservation simulée envoyée aux chauffeurs.', 'succes')
    }
    setOpen(false)
  }

  const sos = () => {
    triggerSos()
    toast('Alerte SOS envoyée à la centrale (W3).', 'danger')
    setOpen(false)
  }

  const reset = () => {
    resetDemo()
    toast('Démo réinitialisée.', 'info')
    setOpen(false)
  }

  const groups: AppKind[] = ['client', 'chauffeur', 'centrale']

  return (
    <>
      <button
        type="button"
        aria-label="Panneau démo (touche D)"
        title="Panneau démo (touche D)"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed z-[70] flex h-10 w-10 items-center justify-center rounded-full bg-encre/70 text-white opacity-40 shadow-flottante backdrop-blur transition hover:bg-encre hover:opacity-100 sm:opacity-100',
          app === 'centrale' ? 'bottom-5 left-5 lg:left-[310px]' : 'bottom-24 left-3 sm:bottom-5 sm:left-5',
        )}
      >
        {open ? <X size={18} /> : <Settings2 size={18} />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Panneau démo"
          className="anim-pop fixed bottom-36 left-3 z-[70] w-[min(340px,calc(100vw-24px))] rounded-[18px] bg-white p-4 text-encre shadow-flottante ring-1 ring-gris-bord sm:bottom-18 sm:left-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gris-texte">Panneau démo</span>
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-1 text-xs font-bold text-vert-fondation">
              <Home size={14} /> Accueil démo
            </Link>
          </div>

          <div className="mb-3 rounded-[12px] bg-fond-clair p-3">
            {screen ? (
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-jaune-soleil px-2 py-0.5 text-sm font-extrabold">{screen.code}</span>
                <span className="text-sm font-semibold leading-tight">{screen.name}</span>
              </div>
            ) : (
              <span className="text-sm font-semibold">Accueil de la démo</span>
            )}
          </div>

          <label className="mb-1 block text-xs font-bold text-gris-texte" htmlFor="demo-jump">
            Aller à l'écran
          </label>
          <select
            id="demo-jump"
            value={screen?.path ?? ''}
            onChange={(e) => {
              if (e.target.value) navigate(e.target.value)
            }}
            className="mb-3 h-11 w-full rounded-[12px] border border-gris-bord bg-white px-3 text-sm font-semibold"
          >
            <option value="">Choisir un écran…</option>
            {groups.map((g) => (
              <optgroup key={g} label={APP_LABELS[g]}>
                {SCREENS.filter((s) => s.app === g).map((s) => (
                  <option key={s.code} value={s.path}>
                    {s.code} – {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <div className="grid grid-cols-1 gap-2">
            <PanelButton icon={<CalendarPlus size={17} />} onClick={simulateBooking}>
              Simuler une réservation
            </PanelButton>
            <PanelButton icon={<Siren size={17} />} onClick={sos} tone="danger">
              Déclencher un SOS
            </PanelButton>
            <PanelButton icon={<RotateCcw size={17} />} onClick={reset}>
              Réinitialiser la démo
            </PanelButton>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-gris-bord pt-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-gris-texte">
              <Gauge size={15} /> Vitesse de simulation
            </span>
            <div className="flex rounded-[10px] bg-fond-clair p-0.5">
              {(['normale', 'rapide'] as Speed[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSettings({ speed: s })}
                  className={cn(
                    'rounded-[8px] px-2.5 py-1 text-xs font-bold capitalize',
                    speed === s ? 'bg-vert-fondation text-white' : 'text-encre-douce',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-gris-texte">Raccourci : touche D</p>
        </div>
      )}
    </>
  )
}

function PanelButton({
  icon,
  onClick,
  tone,
  children,
}: {
  icon: ReactNode
  onClick: () => void
  tone?: 'danger'
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-11 items-center gap-2 rounded-[12px] px-3 text-sm font-bold transition-colors',
        tone === 'danger' ? 'bg-rouge-pale text-rouge-sos hover:bg-[#fbd0d0]' : 'bg-fond-carte hover:bg-[#dde1f7]',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
