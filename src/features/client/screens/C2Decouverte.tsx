import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Banknote, CarFront, ChevronRight, CircleDollarSign, Clock3, Hand, MapPin, ShieldCheck, UserCircle2, Zap } from 'lucide-react'
import { path } from '../../../app/screens'
import { Button, LogoTile } from '../../../design'
import { cn } from '../../../lib/format'

const STEPS = [
  {
    image: '/images/voyageuse-marche.jpg',
    badge: 'Ultra Rapide',
    badgeIcon: <Zap size={16} />,
    title: 'Commandez en quelques secondes',
    text: 'Indiquez simplement votre lieu de prise en charge et votre destination à Tivaouane sans numéro compliqué ni longue attente.',
  },
  {
    image: '/images/voiture-break-blanche.jpg',
    badge: 'Tout proche',
    badgeIcon: <MapPin size={16} />,
    title: 'Une voiture près de chez vous',
    text: "Les voitures interrégionales en partance autour de vous, avec leur point de départ : gare routière, marché, mosquée.",
  },
  {
    image: '/images/gare-routiere.jpg',
    badge: 'Prix fixe',
    badgeIcon: <Banknote size={16} />,
    title: 'Payez en espèces, sans surprise',
    text: "Le prix de la place est connu avant de réserver. Vous réglez le chauffeur en espèces à l'arrivée.",
  },
]

const PILLARS = [
  { label: 'Rapide', icon: Clock3 },
  { label: 'Proche', icon: CarFront },
  { label: 'Espèces', icon: CircleDollarSign },
]

/** C2 – Découverte en 3 étapes. */
export function C2Decouverte() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : navigate(path('C3')))

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f9faff] px-4 pb-4 pt-3">
      <div className="flex items-center gap-3">
        <LogoTile size={40} className="rounded-full" />
        <div className="flex-1 leading-tight">
          <div className="text-[19px] font-extrabold tracking-tight text-vert-fondation">Allo Tukki</div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-encre-douce">Transport interrégional</div>
        </div>
        <button
          type="button"
          onClick={() => navigate(path('C3'))}
          className="flex h-9 items-center gap-0.5 rounded-full bg-fond-carte pl-4 pr-3 text-[15px] font-bold"
        >
          Passer <ChevronRight size={17} />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {STEPS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Étape ${i + 1}`}
            onClick={() => setStep(i)}
            className={cn('h-2 rounded-full transition-all', i === step ? 'w-8 bg-vert-fondation' : 'w-2 bg-gris-bord')}
          />
        ))}
      </div>

      <div key={step} className="anim-pop mt-4 rounded-carte bg-white p-4 shadow-douce">
        <div className="relative h-[176px] overflow-hidden rounded-[14px]">
          <img src={current.image} alt="" className="h-full w-full object-cover" />
          <span className="absolute left-1 top-1 flex items-center gap-1.5 rounded-full bg-vert-fondation px-3 py-1 text-[13px] font-bold text-white">
            <Hand size={14} /> Étape {step + 1} sur 3
          </span>
          <span className="absolute bottom-1 right-1 flex items-center gap-1 rounded-full bg-jaune-soleil px-3 py-1 text-[13px] font-bold text-brun-ocre">
            {current.badgeIcon} {current.badge}
          </span>
        </div>
        <div className="mt-4 flex items-start gap-2">
          <span className="mt-1.5 flex h-7 w-6 shrink-0 items-center justify-center rounded-full bg-vert-menthe text-[17px] font-extrabold">
            {step + 1}
          </span>
          <h1 className="text-[22px] font-extrabold leading-tight">{current.title}</h1>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-encre-douce">{current.text}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {PILLARS.map(({ label, icon: Icon }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={cn('flex flex-col items-center gap-1.5 rounded-[12px] py-3 text-[13px]', i === step ? 'bg-fond-clair font-bold text-vert-fondation' : 'bg-fond-carte text-encre-douce')}
          >
            <Icon size={20} className={i === step ? 'text-vert-fondation' : 'text-encre-douce'} />
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-carte bg-jaune-pale p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brun-ocre text-white">
          <ShieldCheck size={20} />
        </span>
        <div className="text-[13px] leading-snug text-brun-ocre">
          <div className="text-[14px] font-bold text-encre">Agrément Communautaire</div>
          Reconnu par le regroupement des chauffeurs interrégionaux de Tivaouane.
        </div>
      </div>

      <div className="mt-auto pt-5">
        <Button block size="lg" onClick={next} iconRight={<ArrowRight size={20} />}>
          Continuer
        </Button>
        <Button
          block
          size="md"
          variant="secondary"
          className="mt-2"
          iconLeft={<UserCircle2 size={19} />}
          onClick={() => navigate(path('C3'))}
        >
          Se connecter directement
        </Button>
      </div>
    </div>
  )
}
