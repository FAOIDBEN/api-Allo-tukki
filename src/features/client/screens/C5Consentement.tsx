import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Banknote, Check, CircleCheck, Landmark, Lock, Navigation, PhoneCall, ShieldCheck } from 'lucide-react'
import { path } from '../../../app/screens'
import { AppHeader, Button, Modal, ProfileButton, Screen } from '../../../design'
import { cn } from '../../../lib/format'
import { useDemoStore } from '../../../store/demoStore'
import { toast } from '../../../store/toastStore'

const ITEMS = [
  {
    icon: <PhoneCall size={24} />,
    title: 'Votre numéro de téléphone',
    text: (
      <>
        Sert uniquement à vous connecter et à permettre au conducteur de vous appeler si besoin durant la course.{' '}
        <strong className="text-encre">Jamais vendu ni partagé.</strong>
      </>
    ),
  },
  {
    icon: <Navigation size={24} className="-rotate-45" />,
    title: 'Votre position sur la course',
    text: 'Activée uniquement lorsque vous commandez un Allo pour que le chauffeur vous retrouve instantanément dans les ruelles et carrefours de Tivaouane.',
  },
  {
    icon: <Banknote size={24} className="text-brun-ocre" />,
    title: 'Zéro coordonnée bancaire',
    text: "Tous les règlements se font de la main à la main en espèces (FCFA). Aucun compte ni carte bancaire n'est requis ni enregistré.",
  },
]

/** C5 – Consentement & données. */
export function C5Consentement() {
  const navigate = useNavigate()
  const updateClient = useDemoStore((s) => s.updateClient)
  const [accepted, setAccepted] = useState(true)
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <Screen
      header={
        <AppHeader
          back={path('C4')}
          eyebrow="Allo Tukki"
          eyebrowTone="vert"
          title="Consentement & données"
          right={
            <>
              <span className="flex items-center gap-1 rounded-full bg-fond-carte px-2.5 py-1 text-[12px] font-semibold leading-tight">
                <ShieldCheck size={14} className="text-vert-fondation" /> Étape
                <br />
                fin
              </span>
              <ProfileButton onClick={() => toast('Terminez d’abord votre inscription.')} />
            </>
          }
        />
      }
    >
      <div className="px-4 pb-5 pt-4">
        <div className="flex justify-center">
          <span className="rounded-full bg-fond-carte px-4 py-1 text-[12px] font-bold uppercase tracking-wide text-vert-fondation">
            ● Étape 3 sur 4 • Sécurité & confidentialité
          </span>
        </div>
        <div className="relative mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full bg-vert-menthe text-vert-fondation">
          <ShieldCheck size={38} fill="currentColor" stroke="#9ff5c3" />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-jaune-soleil text-brun-ocre">
            <Lock size={15} />
          </span>
        </div>
        <h1 className="mt-4 text-center text-[26px] font-extrabold leading-tight tracking-tight">Vos données restent protégées</h1>
        <p className="mt-2 text-center text-[14px] leading-snug text-encre-douce">
          La Fondation des Sympathisants de Tivaouane veille au respect et à la dignité de votre vie privée.
        </p>

        <div className="mt-5 space-y-3">
          {ITEMS.map((item) => (
            <div key={item.title} className="flex gap-3 rounded-carte bg-white p-4 shadow-douce">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-fond-carte text-vert-fondation">
                {item.icon}
              </span>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-[17px] font-semibold leading-tight">{item.title}</h2>
                  <CircleCheck size={19} className="shrink-0 text-vert-fondation" />
                </div>
                <p className="mt-1 text-[14px] leading-relaxed text-encre-douce">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-carte bg-fond-carte p-4">
          <Landmark size={30} className="shrink-0 text-vert-fondation" />
          <p className="text-[13px] leading-snug text-encre-douce">
            Engagement fraternel de probité et d'honnêteté religieuse et civique au service des pèlerins et citoyens de
            Tivaouane.
          </p>
        </div>

        <div className="mt-5 flex gap-3 rounded-carte bg-white p-4 shadow-douce">
          <button
            type="button"
            role="checkbox"
            aria-checked={accepted}
            onClick={() => setAccepted((a) => !a)}
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border-2',
              accepted ? 'border-vert-fondation bg-vert-fondation text-white' : 'border-gris-bord bg-white',
            )}
          >
            {accepted && <Check size={18} strokeWidth={3} />}
          </button>
          <div className="text-[14px] font-medium leading-snug">
            J'accepte les Conditions d'Utilisation et la Charte de Confidentialité de la Fondation.
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="mt-0.5 block font-bold text-vert-action underline underline-offset-2"
            >
              Consulter le résumé des règles (1 page claire)
            </button>
          </div>
        </div>

        <Button
          block
          size="lg"
          className="mt-4"
          disabled={!accepted}
          iconRight={<ArrowRight size={20} />}
          onClick={() => {
            updateClient({ consentAt: Date.now() })
            navigate(path('C6'))
          }}
        >
          Accepter et continuer
        </Button>
        <p className="mt-3 flex items-center justify-center gap-2 text-center text-[12px] font-semibold text-encre-douce">
          <ShieldCheck size={15} className="shrink-0" />
          Conforme aux lois de protection des données (CDP Sénégal – Loi 2008-12)
        </p>
      </div>

      <Modal open={rulesOpen} onClose={() => setRulesOpen(false)} title="Résumé des règles">
        <ul className="space-y-2 text-[14px] leading-snug text-encre-douce">
          <li>• Votre numéro sert uniquement à la connexion et au contact avec le chauffeur.</li>
          <li>• Votre position n'est partagée que pendant une course.</li>
          <li>• Aucune donnée bancaire : le paiement se fait en espèces.</li>
          <li>• Respect mutuel entre voyageurs et chauffeurs, médiation en cas de litige.</li>
        </ul>
        <Button block size="md" className="mt-4" onClick={() => setRulesOpen(false)}>
          J'ai compris
        </Button>
      </Modal>
    </Screen>
  )
}
