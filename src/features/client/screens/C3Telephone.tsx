import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MessageSquareText, RadioTower, ShieldCheck, X, Zap } from 'lucide-react'
import { path } from '../../../app/screens'
import { AppHeader, Badge, Button, ProfileButton, Screen } from '../../../design'
import { formatSenegalNumber } from '../../../lib/format'
import { useDemoStore } from '../../../store/demoStore'
import { toast } from '../../../store/toastStore'
import { Keypad } from '../components/Keypad'

function operatorOf(digits: string): string | null {
  const prefix = digits.slice(0, 2)
  if (prefix === '77' || prefix === '78') return 'ORANGE SN'
  if (prefix === '76') return 'FREE SN'
  if (prefix === '70') return 'EXPRESSO'
  if (prefix === '75') return 'PROMOBILE'
  return null
}

/** C3 – Numéro de téléphone (pavé numérique intégré, aucun mot de passe). */
export function C3Telephone() {
  const navigate = useNavigate()
  const updateClient = useDemoStore((s) => s.updateClient)
  const [digits, setDigits] = useState('')
  const operator = operatorOf(digits)
  const complete = digits.length === 9

  const onDigit = useCallback((d: string) => setDigits((v) => (v.length < 9 ? v + d : v)), [])
  const onDelete = useCallback(() => setDigits((v) => v.slice(0, -1)), [])

  const submit = () => {
    updateClient({ phone: `+221 ${formatSenegalNumber(digits)}` })
    navigate(path('C4'))
  }

  return (
    <Screen
      header={
        <AppHeader
          back={path('C2')}
          eyebrow="Allo Tukki"
          eyebrowTone="vert"
          title="Authentification Téléphonique"
          right={<ProfileButton onClick={() => toast('Créez d’abord votre compte avec votre numéro.')} />}
        />
      }
    >
      <div className="px-4 pb-5 pt-0">
        <div className="-mx-0 flex items-center justify-between gap-2 rounded-b-[16px] bg-fond-carte px-2 py-2">
          <span className="flex items-center gap-2 text-[14px] font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-vert-fondation text-white">
              <ShieldCheck size={15} />
            </span>
            Connexion sécurisée
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold">
            <span className="h-2 w-2 rounded-full bg-vert-action/70" /> Réseau 2G/EDGE OK
          </span>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-jaune-pale px-3 py-1 text-[13px] font-bold text-brun-ocre">
          <Zap size={14} /> Connexion express • Sans mot de passe
        </span>
        <h1 className="mt-2 text-[27px] font-extrabold leading-tight tracking-tight">Quel est votre numéro ?</h1>
        <p className="mt-1 text-[15px] leading-snug text-encre-douce">
          Nous vous enverrons un code de validation SMS gratuit pour activer votre compte de transport.
        </p>

        <div className="mt-4 rounded-carte bg-white p-4 shadow-douce">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wide text-encre-douce">Numéro de téléphone mobile</span>
            {operator && <Badge tone="vert">{operator}</Badge>}
          </div>
          <div className="mt-3 flex gap-2">
            <span className="flex h-12 items-center gap-1.5 rounded-[12px] bg-fond-carte px-3 text-[15px] font-bold">
              <span aria-hidden>🇸🇳</span> +221
            </span>
            <div className="flex h-12 min-w-0 flex-1 items-center rounded-[12px] bg-fond-clair pl-3 pr-1.5">
              <span className={digits ? 'flex-1 text-[21px] font-bold tracking-wide' : 'flex-1 text-[19px] font-semibold text-gris-texte/60'}>
                {digits ? formatSenegalNumber(digits) : '77 000 00 00'}
                {digits && !complete && <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-vert-fondation align-middle" />}
              </span>
              {digits && (
                <button
                  type="button"
                  aria-label="Effacer le numéro"
                  onClick={() => setDigits('')}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-fond-carte"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 text-[13px]">
            <span className="font-semibold leading-tight text-encre-douce">Opérateurs compatibles :</span>
            <span className="flex flex-wrap items-center gap-1 font-bold">
              <span className="text-vert-fondation">Orange</span>•<span className="text-brun-ocre">Free</span>•
              <span className="text-vert-action">Expresso</span>•<span className="text-vert-fondation">Wave</span>
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-3 rounded-carte bg-fond-carte p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-jaune-soleil text-brun-ocre">
            <RadioTower size={19} />
          </span>
          <div className="text-[13px] leading-snug text-encre-douce">
            <div className="text-[14px] font-bold text-encre">Signal optimisé pour Tivaouane</div>
            Fonctionne parfaitement même avec une réception faible 2G/EDGE en périphérie ou marchés.
          </div>
        </div>

        <div className="mt-3">
          <Keypad
            withLetters
            onDigit={onDigit}
            onDelete={onDelete}
            extraKey={{ label: '77 / 78', onPress: () => setDigits((v) => (v ? v : '77')) }}
          />
        </div>

        <Button
          block
          size="lg"
          className="mt-4"
          disabled={!complete}
          onClick={submit}
          iconLeft={<MessageSquareText size={20} />}
          iconRight={<ArrowRight size={20} />}
        >
          Recevoir le code par SMS
        </Button>
        <p className="mt-3 text-center text-[13px] leading-snug text-encre-douce">
          En continuant, vous acceptez les conditions de service de la{' '}
          <strong className="text-encre">Fondation des Sympathisants de Tivaouane</strong> pour un transport urbain
          éthique et sécurisé.
        </p>
      </div>
    </Screen>
  )
}
