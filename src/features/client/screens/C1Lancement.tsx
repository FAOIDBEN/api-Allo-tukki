import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Zap } from 'lucide-react'
import { path } from '../../../app/screens'
import { useDemoStore } from '../../../store/demoStore'

/** C1 – Écran de lancement : passe tout seul à la découverte (ou à l'accueil si déjà inscrit). */
export function C1Lancement() {
  const navigate = useNavigate()
  const onboarded = useDemoStore((s) => s.client.onboarded)
  const next = onboarded ? path('C7') : path('C2')

  useEffect(() => {
    const id = window.setTimeout(() => navigate(next), 2800)
    return () => window.clearTimeout(id)
  }, [navigate, next])

  return (
    <button
      type="button"
      onClick={() => navigate(next)}
      className="relative flex h-full w-full flex-col items-center overflow-hidden bg-[#f9faff] px-4 pb-4 pt-4 text-left"
    >
      <Backdrop />
      <span className="relative flex items-center gap-2 rounded-full bg-fond-carte px-4 py-1.5 text-[12px] font-bold tracking-wide text-encre-douce">
        <span className="h-2 w-2 rounded-full bg-vert-action/70" /> TIVAOUANE CONNECT • 2G/3G ACTIF
      </span>

      <div className="relative mt-auto flex flex-col items-center">
        <div className="relative rounded-full bg-white p-2 shadow-[0_20px_40px_-20px_rgb(0_95_63/0.5)]">
          <img src="/images/logo.png" alt="" className="h-[96px] w-[96px] rounded-full" />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-jaune-soleil text-brun-ocre shadow">
            <Zap size={16} strokeWidth={2.5} />
          </span>
        </div>
        <div className="mt-6 text-[40px] font-extrabold leading-none tracking-tight">
          <span className="text-vert-fondation">Allo </span>
          <span className="text-[#7a5a0a]">Tukki</span>
        </div>
        <p className="mt-2 text-[16px] font-medium text-encre-douce">Votre Allo Dakar, à portée de clic.</p>
        <div className="mt-5 flex gap-2.5">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-vert-fondation" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-jaune-soleil [animation-delay:200ms]" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#7fd9a8] [animation-delay:400ms]" />
        </div>
        <span lang="wo" className="mt-5 rounded-full bg-white px-4 py-1.5 text-[13px] font-bold text-vert-fondation shadow-douce">
          Dalal ak jàmm ci Tivaouane
        </span>
      </div>

      <div className="relative mt-auto w-full">
        <div className="flex items-center gap-3 rounded-carte bg-white p-3.5 shadow-douce">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fond-carte text-vert-fondation">
            <ShieldCheck size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-bold">Fondation des Sympathisants</span>
            <span className="block truncate text-[13px] text-encre-douce">Ville de Tivaouane • Service de transport interrégional</span>
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between px-1 text-[12px] font-bold text-encre-douce">
          <span className="flex items-center gap-1">
            <Zap size={13} /> Réseau 2G/3G optimisé
          </span>
          <span>v1.0.4</span>
        </div>
      </div>
    </button>
  )
}

function Backdrop() {
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="#005F3F" strokeOpacity="0.06" strokeWidth="3">
        <circle cx="195" cy="380" r="120" />
        <circle cx="195" cy="380" r="200" />
        <circle cx="195" cy="380" r="280" />
        <path d="M-20 330 L150 310 L260 120 L300 640 L410 470" />
        <path d="M-20 350 L140 340 L120 520 L150 610 L60 700" />
        <path d="M250 180 L140 660 M140 660 L410 440" />
      </g>
    </svg>
  )
}
