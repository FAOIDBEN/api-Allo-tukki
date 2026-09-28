import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CarFront, CircleCheck, ShieldCheck, User } from 'lucide-react'
import { path } from '../../../app/screens'
import { AppHeader, Button, Screen } from '../../../design'
import { cn } from '../../../lib/format'
import { useDemoStore } from '../../../store/demoStore'

const SUGGESTIONS = ['Aminata', 'Fatou', 'Moussa', 'Modou', 'Mariama']

/** C6 – Prénom du voyageur (dernière étape de l'inscription). */
export function C6Prenom() {
  const navigate = useNavigate()
  const updateClient = useDemoStore((s) => s.updateClient)
  const [name, setName] = useState('')

  const finish = (firstName: string) => {
    updateClient({ firstName, onboarded: true })
    navigate(path('C7'))
  }

  return (
    <Screen header={<AppHeader back={path('C5')} logo={false} title="Inscription (4/4)" />}>
      <div className="px-4 pb-5 pt-3">
        <div className="flex items-center justify-between text-[14px] font-medium uppercase">
          <span>Étape 4 sur 4 • Dernière étape</span>
          <span>4/4</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-vert-action" />

        <h1 className="mt-6 text-[30px] font-extrabold leading-[1.1] tracking-tight">Comment vous appelle-t-on ? 👋</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-encre-douce">
          Votre prénom sera affiché au chauffeur pour vous reconnaître et vous saluer poliment à son arrivée.
        </p>

        <label htmlFor="prenom" className="mt-5 block text-[14px] font-medium uppercase">
          Votre prénom ou surnom
        </label>
        <div className="mt-2 flex h-14 items-center rounded-[14px] border-[3px] border-vert-fondation bg-white pl-4 pr-3">
          <input
            id="prenom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Aminata"
            autoComplete="given-name"
            className="min-w-0 flex-1 bg-transparent text-[17px] font-semibold outline-none placeholder:font-medium placeholder:text-vert-action/70"
          />
          <User size={22} className="text-vert-action" />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-gris-texte">
          <ShieldCheck size={14} className="text-vert-fondation" /> Pas besoin de votre nom de famille si vous préférez.
        </p>

        <div className="mt-5 text-[12px] font-bold uppercase tracking-[0.12em] text-encre-douce">Suggestions rapides</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setName(s)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-[15px] font-medium',
                name === s ? 'border-vert-fondation bg-vert-fondation text-white' : 'border-gris-bord bg-fond-carte',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3 rounded-carte border border-gris-bord bg-fond-clair p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-vert-menthe/60 text-vert-fondation">
            <CarFront size={19} />
          </span>
          <div className="text-[13px] leading-snug text-encre-douce">
            <div className="font-bold text-encre">Exemple d'affichage conducteur</div>
            « Course pour <strong className="text-vert-action underline underline-offset-2">{name.trim() || 'Aminata'}</strong>{' '}
            (Marché Central) » sur l'écran du conducteur.
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-[14px] font-medium text-vert-action">
          <CircleCheck size={18} /> Compte activé instantanément dès la validation.
        </p>

        <Button
          block
          size="lg"
          className="mt-5"
          disabled={!name.trim()}
          iconRight={<ArrowRight size={20} />}
          onClick={() => finish(name.trim())}
        >
          Terminer et commencer à rouler
        </Button>
        <button
          type="button"
          onClick={() => finish('')}
          className="mt-3 w-full text-center text-[14px] font-semibold text-encre-douce"
        >
          Passer cette étape (je le ferai plus tard)
        </button>
      </div>
    </Screen>
  )
}
