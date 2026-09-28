import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MonitorSmartphone, MoveHorizontal, RotateCcw } from 'lucide-react'
import { path } from '../../app/screens'
import { DemoPanel } from '../../components/DemoPanel'
import { PhoneFrame } from '../../components/PhoneFrame'
import { Toaster } from '../../design'
import { useDemoStore } from '../../store/demoStore'
import { toast } from '../../store/toastStore'

/**
 * Client et chauffeur côte à côte. Chaque téléphone contient l'app réelle dans une iframe :
 * ils communiquent par BroadcastChannel, exactement comme deux onglets.
 */
export function PresentationPage() {
  const [session, setSession] = useState(0)

  // Le chauffeur est en ligne d'office : la réservation du client lui arrive directement.
  useEffect(() => {
    useDemoStore.getState().updateDriver({ online: true, onlineSince: Date.now() })
  }, [session])

  const restart = () => {
    const { resetDemo, updateClient } = useDemoStore.getState()
    resetDemo()
    updateClient({ onboarded: true, firstName: 'Aminata', phone: '+221 77 452 18 90' })
    setSession((n) => n + 1)
    toast('Démo remise à zéro : les deux téléphones repartent de l’accueil.', 'succes')
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_50%_0%,#0d7a53_0%,#005f3f_45%,#00402a_100%)] px-4 py-5 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white">
          <ArrowLeft size={16} /> Accueil de la démo
        </Link>
        <h1 className="hidden text-lg font-extrabold md:block">Mode présentation</h1>
        <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-1.5 rounded-full bg-jaune-soleil px-3 py-1.5 text-sm font-bold text-encre hover:bg-[#f5aa10]"
        >
          <RotateCcw size={16} /> Recommencer la démo
        </button>
        <a
          href={path('W1')}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20"
        >
          <MonitorSmartphone size={16} /> Ouvrir la centrale
        </a>
        </div>
      </header>

      <div className="mx-auto mt-4 hidden items-start justify-center gap-6 lg:flex xl:gap-16">
        <PhoneColumn key={`c${session}`} label="Application Client" src={path('C7')} />
        <div className="mt-[40vh] flex flex-col items-center gap-2 text-white/60">
          <MoveHorizontal size={28} />
          <span className="max-w-28 text-center text-xs font-semibold">Synchronisation en direct</span>
        </div>
        <PhoneColumn key={`d${session}`} label="Application Chauffeur" src={path('D7')} />
      </div>

      <p className="mx-auto mt-16 max-w-md text-center text-white/80 lg:hidden">
        Le mode présentation affiche deux téléphones côte à côte : ouvrez cette page sur un écran d'ordinateur (au
        moins 1024 px de large).
      </p>

      <Toaster fixed />
      <DemoPanel />
    </div>
  )
}

function PhoneColumn({ label, src }: { label: string; src: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-jaune-soleil">{label}</span>
      <PhoneFrame alwaysFramed>
        <iframe title={label} src={src} className="h-full w-full border-0" />
      </PhoneFrame>
    </div>
  )
}
