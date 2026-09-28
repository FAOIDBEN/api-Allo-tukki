import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageSquareText } from 'lucide-react'
import { APP_LABELS, type AppKind } from '../app/screens'
import { useCurrentScreen } from '../app/useCurrentScreen'
import { Toaster } from '../design'
import { announcePresence } from '../store/sync'
import { DemoPanel } from './DemoPanel'
import { PhoneFrame } from './PhoneFrame'

/**
 * Coquille commune des apps mobiles : fond vert Fondation + téléphone centré sur desktop,
 * plein écran sur mobile. Signale la présence de l'app aux autres onglets.
 */
export function MobileAppLayout({
  app,
  dark,
  online,
  children,
}: {
  app: Extract<AppKind, 'client' | 'chauffeur'>
  dark?: boolean
  online?: boolean
  children: ReactNode
}) {
  const screen = useCurrentScreen()

  useEffect(() => {
    announcePresence(app, online)
    const id = window.setInterval(() => announcePresence(app, online), 2000)
    return () => window.clearInterval(id)
  }, [app, online])

  return (
    <div className="min-h-dvh sm:flex sm:items-center sm:justify-center sm:gap-14 sm:bg-vert-fondation sm:bg-[radial-gradient(circle_at_25%_20%,#0d7a53_0%,#005f3f_45%,#00402a_100%)] sm:p-4">
      <PhoneFrame dark={dark}>
        {children}
        <Toaster />
      </PhoneFrame>

      <aside className="hidden w-64 text-white md:block">
        <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white">
          <ArrowLeft size={16} /> Accueil de la démo
        </Link>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-jaune-soleil">{APP_LABELS[app]}</div>
        {screen && (
          <>
            <div className="mt-4 inline-block rounded-[10px] bg-jaune-soleil px-3 py-1 text-3xl font-extrabold text-encre">
              {screen.code}
            </div>
            <div className="mt-3 text-2xl font-extrabold leading-tight">{screen.name}</div>
          </>
        )}
        <p className="mt-6 flex gap-2 text-sm leading-relaxed text-white/70">
          <MessageSquareText size={18} className="mt-0.5 shrink-0" />
          Pour un retour précis, citez simplement le code de l'écran.
        </p>
      </aside>

      <DemoPanel />
    </div>
  )
}
