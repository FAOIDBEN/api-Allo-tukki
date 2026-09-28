import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Banknote,
  CarFront,
  Languages,
  MonitorSmartphone,
  Presentation,
  RotateCcw,
  ShieldCheck,
  Signal,
  Smartphone,
  SunMedium,
  Check,
} from 'lucide-react'
import { path } from '../../app/screens'
import { DemoPanel } from '../../components/DemoPanel'
import { LogoTile, Toaster } from '../../design'
import { useDemoStore } from '../../store/demoStore'
import { toast } from '../../store/toastStore'

export function HomePage() {
  const resetDemo = useDemoStore((s) => s.resetDemo)

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-fond-clair">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8">
        <header className="flex items-center gap-2.5">
          <LogoTile size={30} />
          <span className="font-extrabold text-vert-fondation">Allo Tukki</span>
          <span className="h-4 w-px bg-gris-bord" />
          <span className="text-sm text-gris-texte">Démo cliquable</span>
        </header>

        <section className="mt-10 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-vert-action">Démo interactive</div>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Le transport interrégional, digitalisé de bout en bout.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-encre-douce md:text-lg">
            Cliquez dans les parcours comme si l'application existait déjà. Une réservation faite côté client arrive
            en direct chez le chauffeur et dans la centrale.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/presentation"
              className="inline-flex h-14 items-center gap-2 rounded-bouton bg-vert-fondation px-6 font-bold text-white shadow-douce hover:bg-[#004d33]"
            >
              <Presentation size={20} /> Mode présentation
            </Link>
            <button
              type="button"
              onClick={() => {
                resetDemo()
                toast('Démo réinitialisée.', 'succes')
              }}
              className="inline-flex h-14 items-center gap-2 rounded-bouton bg-fond-carte px-5 font-bold text-encre hover:bg-[#dde1f7]"
            >
              <RotateCcw size={18} /> Réinitialiser
            </button>
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          <AppCard
            number="01"
            title="Application Client"
            text="Réserver sa place, suivre sa voiture, payer en espèces, évaluer. Même sans internet."
            icon={<Smartphone size={30} />}
            to={path('C1')}
            links={[
              { label: 'Accueil voyageur (C7)', to: path('C7') },
              { label: 'Réservation SMS (C20)', to: path('C20') },
            ]}
          />
          <AppCard
            number="02"
            title="Application Chauffeur"
            text="Obtenir son agrément, remplir sa voiture, encaisser et suivre ses gains."
            icon={<CarFront size={30} />}
            to={path('D7')}
            links={[
              { label: 'Devenir chauffeur (D1)', to: path('D1') },
              { label: 'Gains & portefeuille (D14)', to: path('D14') },
            ]}
          />
          <AppCard
            number="03"
            title="Centrale de régulation"
            text="Superviser les départs, dispatcher les SMS, gérer sécurité, agréments et caisse."
            icon={<MonitorSmartphone size={30} />}
            to={path('W1')}
            links={[
              { label: 'Dispatch SMS (W2)', to: path('W2') },
              { label: 'Sécurité & SOS (W3)', to: path('W3') },
            ]}
          />
        </section>

        <section className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <Pillar icon={<Check size={20} />} title="Simplicité" text="Connexion par numéro, gros boutons, parcours courts." />
          <Pillar icon={<Banknote size={20} />} title="Espèces d'abord" text="Prix fixe par place, paiement au chauffeur, Wave / Orange Money en option." />
          <Pillar icon={<Signal size={20} />} title="Réseau faible" text="Mode bas débit et commande par SMS sans internet." />
          <Pillar icon={<Languages size={20} />} title="Langue locale" text="Français et wolof, avec explications audio." />
          <Pillar icon={<ShieldCheck size={20} />} title="Sécurité" text="SOS, partage de position, alerte silencieuse, médiation." />
          <Pillar icon={<SunMedium size={20} />} title="Conçu pour la route" text="Lisible en plein soleil, mode nuit pour les voyages tardifs." />
        </section>

        <p className="mt-12 rounded-carte bg-white p-4 text-sm text-encre-douce shadow-douce">
          Chaque écran porte un code (C7, D8, W1…) visible à côté du téléphone et dans le panneau démo (bouton ⚙︎ en
          bas à gauche, ou touche <kbd className="rounded bg-fond-carte px-1.5 font-bold">D</kbd>). Citez-le pour vos
          retours.
        </p>
      </div>
      <Toaster fixed />
      <DemoPanel />
    </div>
  )
}

function AppCard({
  number,
  title,
  text,
  icon,
  to,
  links,
}: {
  number: string
  title: string
  text: string
  icon: ReactNode
  to: string
  links: Array<{ label: string; to: string }>
}) {
  return (
    <div className="flex flex-col rounded-[26px] bg-[linear-gradient(145deg,#0d7a53_0%,#005f3f_60%,#004a31_100%)] p-6 text-white shadow-flottante">
      <div className="flex items-start justify-between">
        <span className="text-sm font-extrabold tracking-widest text-jaune-soleil">{number}</span>
        <span className="rounded-[14px] bg-white/10 p-2.5">{icon}</span>
      </div>
      <h2 className="mt-4 text-2xl font-extrabold leading-tight">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-white/80">{text}</p>
      <Link
        to={to}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-bouton bg-white font-bold text-vert-fondation hover:bg-fond-clair"
      >
        Ouvrir <ArrowRight size={18} />
      </Link>
      <div className="mt-4 flex flex-col gap-1.5">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="text-sm font-semibold text-white/75 underline-offset-4 hover:text-white hover:underline">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function Pillar({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-vert-clair text-vert-fondation">
        {icon}
      </span>
      <div>
        <div className="font-bold">{title}</div>
        <div className="text-sm leading-snug text-gris-texte">{text}</div>
      </div>
    </div>
  )
}
