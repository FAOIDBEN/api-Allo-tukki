import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleCheck, Download, HandHeart, MessageSquareText, ReceiptText, Send, Star } from 'lucide-react'
import { path } from '../../../app/screens'
import { Badge, Button, Modal, Screen } from '../../../design'
import { cn, formatAmount } from '../../../lib/format'
import { buildRoute, formatDistance, routeLength } from '../../../lib/geo'
import { MOUSSA } from '../../../mock/people'
import { placeById } from '../../../mock/places'
import { useDemoStore } from '../../../store/demoStore'
import { ensureDemoRide } from '../../../store/simulation'
import { toast } from '../../../store/toastStore'
import { ClientHeader } from '../components/ClientHeader'
import { DriverAvatar } from '../components/DriverCard'

const LABELS = ['', 'Très décevant', 'Décevant', 'Trajet correct', 'Bon trajet', 'Excellent trajet']
const COMPLIMENTS = [
  'Conduite prudente 🛵',
  'Chauffeur poli & courtois 🤝',
  'Voiture climatisée ❄️',
  'Ponctualité exemplaire ⏱️',
  'Monnaie rendue exacte 🪙',
]
const TIPS = [100, 200, 500]

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })

/** C16 – Évaluation & reçu : étoiles, compliments, pourboire Teranga, reçu détaillé. */
export function C16Evaluation() {
  const navigate = useNavigate()
  const ride = useDemoStore((s) => s.ride)
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const archiveRide = useDemoStore((s) => s.archiveRide)
  const [stars, setStars] = useState(5)
  const [compliments, setCompliments] = useState<string[]>([COMPLIMENTS[0], COMPLIMENTS[1], COMPLIMENTS[3]])
  const [comment, setComment] = useState('')
  const [tip, setTip] = useState(200)
  const [receiptOpen, setReceiptOpen] = useState(false)

  useEffect(() => {
    if (!ride || !['payee', 'terminee'].includes(ride.status)) ensureDemoRide('payee')
  }, [ride])

  if (!ride) return null
  const from = placeById(ride.fromId)
  const to = placeById(ride.toId)
  const paidAt = ride.paidAt ?? ride.createdAt
  const km = formatDistance(routeLength(buildRoute(from.position, to.position)) * 1.15)
  const receiptNo = `TIV-${new Date(paidAt).getFullYear()}-${(parseInt(ride.id.slice(2), 36) % 9000) + 1000}`
  const dateLabel = `${dateFormatter.format(paidAt)} à ${timeFormatter.format(paidAt)}`

  const finish = (withReview: boolean) => {
    setRideStatus('terminee', withReview ? { rating: stars, tip } : {})
    archiveRide()
    toast(withReview ? `Merci ! Votre avis a été transmis à la Fondation.${tip ? ` Pourboire Teranga de ${tip} F envoyé.` : ''}` : 'À bientôt sur Allo Tukki !', 'succes')
    navigate(path('C7'))
  }

  const receipt = (
    <>
      <div className="flex items-end justify-between rounded-[12px] bg-fond-carte px-4 py-2.5">
        <span className="pb-1 text-[14px] text-encre-douce">Montant de la course</span>
        <span className="text-vert-fondation">
          <span className="text-[38px] font-extrabold leading-none">{formatAmount(ride.price)}</span>
          <span className="ml-1 text-[15px] font-bold">FCFA</span>
        </span>
      </div>
      <div className="relative mt-3 pl-7">
        <span className="absolute left-[6px] top-2 h-9 w-0.5 bg-gris-bord" />
        <span className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full bg-vert-fondation" />
        <div className="text-[12px] uppercase text-encre-douce">Départ</div>
        <div className="text-[17px] font-medium">{from.name} Tivaouane</div>
        <span className="absolute left-0 top-[54px] h-3.5 w-3.5 bg-encre" />
        <div className="mt-1 text-[12px] uppercase text-encre-douce">Arrivée</div>
        <div className="text-[17px] font-medium">{to.name}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 rounded-[12px] bg-fond-clair p-3 text-[13px]">
        <div>
          <div className="text-[11px] uppercase text-encre-douce">Date & heure</div>
          {dateLabel}
        </div>
        <div>
          <div className="text-[11px] uppercase text-encre-douce">Distance & N° reçu</div>
          {km} • {receiptNo}
        </div>
      </div>
      {tip > 0 && (
        <p className="mt-2 text-[13px] text-encre-douce">
          Pourboire Teranga : <strong className="text-encre">+{tip} F</strong> (Wave)
        </p>
      )}
    </>
  )

  return (
    <Screen header={<ClientHeader back={path('C15')} title="Évaluation et reçu" />}>
      <div className="space-y-4 px-4 pb-6 pt-3">
        <div className="flex items-center gap-2.5 rounded-[14px] bg-[#e4ece9] px-3.5 py-2.5 text-[14px] font-bold text-vert-fondation">
          <CircleCheck size={20} className="fill-vert-fondation text-white" />
          Course terminée avec succès • Alhamdoulillah
        </div>

        <section className="flex flex-col items-center rounded-carte bg-surface p-5 text-center shadow-douce">
          <DriverAvatar driver={MOUSSA} size={80} badge="voiture" />
          <div className="mt-2 text-[22px] font-semibold">
            {MOUSSA.firstName} {MOUSSA.lastName}
          </div>
          <span className="mt-1 flex items-center gap-2 rounded-full bg-fond-carte px-3 py-0.5 text-[14px]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: MOUSSA.car.colorHex }} />
            <strong>Corolla {MOUSSA.car.color}</strong> • {MOUSSA.car.plate}
          </span>
          <h1 className="mt-4 text-[19px] font-medium leading-snug">Comment s'est passée votre course avec {MOUSSA.firstName} ?</h1>
          <p className="mt-1 text-[14px] text-encre-douce">Votre avis renforce la sécurité et l'entraide à Tivaouane.</p>
          <div className="mt-4 flex gap-3" role="radiogroup" aria-label="Note">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} étoile${n > 1 ? 's' : ''}`} onClick={() => setStars(n)}>
                <Star size={36} className={cn('transition-transform active:scale-90', n <= stars ? 'fill-jaune-soleil text-jaune-soleil' : 'fill-gris-bord text-gris-bord')} />
              </button>
            ))}
          </div>
          <p className="mt-3 text-[15px] font-bold text-vert-fondation">
            {LABELS[stars]} ({stars}/5)
          </p>
        </section>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between">
            <h2 className="text-[19px] font-semibold">Compliments du trajet</h2>
            <span className="text-[13px] text-encre-douce">Optionnel</span>
          </div>
          <p className="mt-1 text-[14px] text-encre-douce">Sélectionnez les points forts pour honorer le civisme de {MOUSSA.firstName} :</p>
          <div className="mt-3 flex flex-col items-start gap-2">
            {COMPLIMENTS.map((c) => {
              const on = compliments.includes(c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCompliments((list) => (on ? list.filter((x) => x !== c) : [...list, c]))}
                  className={cn('rounded-full px-3.5 py-1.5 text-[14px] font-bold', on ? 'bg-vert-fondation text-white' : 'bg-fond-carte text-encre-douce')}
                >
                  {c}
                </button>
              )
            })}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder="Laisser un mot ou une remarque pour la Fondation…"
            className="mt-3 w-full rounded-[12px] bg-fond-carte p-3 text-[15px] outline-none placeholder:text-gris-texte"
          />
        </section>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jaune-pale text-brun-ocre">
              <HandHeart size={20} />
            </span>
            <div>
              <h2 className="text-[18px] font-semibold leading-tight">Pourboire solidaire (Teranga)</h2>
              <p className="text-[14px] text-encre-douce">Directement reversé sur le compte Wave de {MOUSSA.firstName}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[...TIPS, 0].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTip(t)}
                className={cn(
                  'h-12 rounded-[12px] font-bold leading-tight',
                  t === 0 ? 'text-[12px]' : 'text-[15px]',
                  tip === t ? 'bg-vert-action text-white' : 'bg-fond-carte',
                )}
              >
                {t === 0 ? 'Pas cette fois' : `+${t} F`}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[19px] font-semibold">
              <ReceiptText size={21} className="text-vert-fondation" /> Reçu de course
            </h2>
            <Badge tone="vert" className="bg-[#e4ece9] text-[13px]">
              Payé • Espèces
            </Badge>
          </div>
          {receipt}
          <button
            type="button"
            onClick={() => setReceiptOpen(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 text-[15px] font-bold text-vert-action"
          >
            <Download size={18} /> Télécharger le reçu (PDF / SMS)
          </button>
        </section>

        <Button block size="lg" variant="action" iconLeft={<Send size={20} />} onClick={() => finish(true)}>
          Envoyer mon avis et terminer
        </Button>
        <button type="button" onClick={() => finish(false)} className="w-full text-center text-[15px] font-semibold text-encre-douce">
          Passer cette étape
        </button>
        <p className="text-center text-[13px] text-gris-texte">
          Initiative soutenue par la Fondation des Sympathisants de Tivaouane pour la sécurité urbaine.
        </p>
      </div>

      <Modal open={receiptOpen} onClose={() => setReceiptOpen(false)} title={`Reçu ${receiptNo}`}>
        {receipt}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            size="md"
            iconLeft={<Download size={17} />}
            onClick={() => toast(`Reçu ${receiptNo}.pdf téléchargé.`, 'succes')}
          >
            Télécharger PDF
          </Button>
          <Button
            size="md"
            variant="secondary"
            iconLeft={<MessageSquareText size={17} />}
            onClick={() => toast('Reçu envoyé par SMS au ' + (ride.passenger.phone || 'numéro enregistré') + '.', 'succes')}
          >
            Recevoir par SMS
          </Button>
        </div>
      </Modal>
    </Screen>
  )
}
