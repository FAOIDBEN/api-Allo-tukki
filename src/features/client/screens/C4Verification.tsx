import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CircleHelp, Clock3, MessageSquareMore, Pencil, Phone, RefreshCw } from 'lucide-react'
import { path } from '../../../app/screens'
import { AppHeader, BottomSheet, Button, ProfileButton, Screen } from '../../../design'
import { cn } from '../../../lib/format'
import { simMs, useDemoStore } from '../../../store/demoStore'
import { toast } from '../../../store/toastStore'
import { Keypad } from '../components/Keypad'

const AUTO_CODE = '582417'
const RESEND_SECONDS = 45

/** C4 – Code de vérification : le code SMS se remplit tout seul (détection automatique simulée). */
export function C4Verification() {
  const navigate = useNavigate()
  const phone = useDemoStore((s) => s.client.phone) || '+221 77 452 18 90'
  const [code, setCode] = useState('')
  const [autoFilled, setAutoFilled] = useState(false)
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const [helpOpen, setHelpOpen] = useState(false)

  // Détection automatique : le code « arrive » après ~2 s puis s'écrit chiffre par chiffre.
  useEffect(() => {
    const timers: number[] = []
    const start = simMs(2000)
    AUTO_CODE.split('').forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setCode((c) => (c.length === i ? AUTO_CODE.slice(0, i + 1) : c))
          if (i === AUTO_CODE.length - 1) setAutoFilled(true)
        }, start + i * 140),
      )
    })
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  useEffect(() => {
    if (seconds <= 0) return
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [seconds])

  const onDigit = useCallback((d: string) => setCode((c) => (c.length < 6 ? c + d : c)), [])
  const onDelete = useCallback(() => {
    setCode((c) => c.slice(0, -1))
    setAutoFilled(false)
  }, [])

  const complete = code.length === 6

  return (
    <Screen
      header={
        <AppHeader
          back={path('C3')}
          eyebrow="Allo Tukki"
          eyebrowTone="vert"
          title="Vérification Code Otp"
          right={<ProfileButton onClick={() => toast('Validez d’abord votre code.')} />}
        />
      }
      band={
        <div className="flex shrink-0 items-center justify-between bg-fond-carte px-4 py-2 text-[13px] font-bold">
          <span className="flex items-center gap-2 text-encre-douce">
            <span className="h-2 w-2 rounded-full bg-vert-action/70" /> Sécurité Allo Tukki
          </span>
          <span className="text-vert-action">ÉTAPE 2 SUR 3</span>
        </div>
      }
    >
      <div className="flex flex-col items-center px-4 pb-5 pt-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-vert-menthe text-vert-fondation">
          <MessageSquareMore size={26} />
        </span>
        <h1 className="mt-3 text-[26px] font-extrabold tracking-tight">Entrez le code reçu</h1>
        <p className="text-[15px] text-encre-douce">Code à 6 chiffres envoyé par SMS au</p>
        <button
          type="button"
          onClick={() => navigate(path('C3'))}
          className="mt-2 flex items-center gap-2 rounded-full bg-fond-carte py-1 pl-3 pr-1 text-[15px] font-bold"
        >
          {phone.replace(/\s/g, '').replace(/^(\+221)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1$2 $3 $4 $5')}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d7dcf5] text-vert-fondation">
            <Pencil size={14} />
          </span>
        </button>

        <div className="mt-4 grid w-full grid-cols-6 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => {
            const digit = code[i]
            const active = i === code.length
            return (
              <span
                key={i}
                className={cn(
                  'flex h-14 items-center justify-center rounded-[12px] text-[30px] font-extrabold',
                  digit ? 'bg-white shadow-[0_2px_6px_-3px_rgb(20_27_43/0.2)]' : active ? 'bg-vert-clair' : 'bg-fond-carte',
                )}
              >
                {digit ?? (active ? <span className="h-7 w-0.5 animate-pulse bg-vert-action" /> : null)}
              </span>
            )
          })}
        </div>

        <span className="mt-3 flex items-center gap-2 rounded-[10px] bg-fond-carte px-3 py-1.5 text-[13px] font-semibold text-encre-douce">
          <RefreshCw size={15} className={cn('text-vert-action', !autoFilled && 'animate-spin [animation-duration:2s]')} />
          {autoFilled ? 'Code détecté automatiquement ✓' : 'Détection automatique du SMS activée…'}
        </span>

        <p className="mt-3 flex items-center gap-2 text-[14px] font-bold">
          <Clock3 size={17} className="text-brun-ocre" />
          {seconds > 0 ? (
            <>
              Renvoyer un nouveau code dans{' '}
              <span className="text-brun-ocre">0:{String(seconds).padStart(2, '0')}</span>
            </>
          ) : (
            'Vous pouvez demander un nouveau code'
          )}
        </p>
        <div className="mt-1 flex items-center gap-3 text-[13px] font-bold">
          <button
            type="button"
            disabled={seconds > 0}
            onClick={() => {
              setSeconds(RESEND_SECONDS)
              toast('Nouveau code envoyé par SMS.', 'succes')
            }}
            className="uppercase tracking-wide text-gris-texte enabled:text-vert-fondation"
          >
            Renvoyer par SMS
          </button>
          <span className="h-1 w-1 rounded-full bg-gris-bord" />
          <button
            type="button"
            onClick={() => toast('Appel en cours : un agent vocal va vous dicter le code.', 'info')}
            className="flex items-center gap-1 text-vert-fondation"
          >
            <Phone size={14} /> Appel vocal
          </button>
        </div>

        <div className="mt-4 w-full">
          <Keypad variant="blanc" onDigit={onDigit} onDelete={onDelete} />
        </div>

        <Button
          block
          size="lg"
          className="mt-4"
          disabled={!complete}
          onClick={() => navigate(path('C5'))}
          iconRight={<ArrowRight size={20} />}
        >
          Valider et continuer
        </Button>
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="mt-3 flex items-center gap-1.5 text-[14px] font-medium text-encre-douce"
        >
          <CircleHelp size={16} /> Besoin d'aide pour recevoir le code ?
        </button>
      </div>

      <BottomSheet open={helpOpen} onClose={() => setHelpOpen(false)} title="Vous ne recevez pas le code ?">
        <ul className="space-y-2 text-[14px] text-encre-douce">
          <li>• Vérifiez que votre numéro est correct.</li>
          <li>• Attendez la fin du compte à rebours pour renvoyer le code.</li>
          <li>• Choisissez « Appel vocal » : le code vous est dicté par téléphone.</li>
        </ul>
        <Button
          block
          size="md"
          className="mt-4"
          iconLeft={<Phone size={18} />}
          onClick={() => {
            setHelpOpen(false)
            toast('Appel en cours : un agent vocal va vous dicter le code.', 'info')
          }}
        >
          Recevoir le code par appel
        </Button>
      </BottomSheet>
    </Screen>
  )
}
