import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Archive, Banknote, CircleCheck, HandHeart, NotebookPen, ShieldCheck, Star } from 'lucide-react'
import { path } from '../../../app/screens'
import { AppHeader, Button, ProfileButton, Screen } from '../../../design'
import { cn, formatAmount } from '../../../lib/format'
import { placeById } from '../../../mock/places'
import { COMMISSION_RATE, useCurrentOrLastRide, useDemoStore } from '../../../store/demoStore'
import { ensureDemoRide } from '../../../store/simulation'
import { toast } from '../../../store/toastStore'

const LABELS = ['', 'Voyage difficile', 'Voyage moyen', 'Voyage correct', 'Bon voyage', 'Excellent voyage']
const STRENGTHS = ['Ponctuelle au rdv ⏱️', "Monnaie d'appoint prête 🪙", 'Ceinture attachée ✅', 'Courtoise & respectueuse 🤝']

/** D13 – Évaluation du voyageur par le chauffeur, puis retour en ligne. */
export function D13Evaluation() {
  const navigate = useNavigate()
  const ride = useCurrentOrLastRide()
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const updateRide = useDemoStore((s) => s.updateRide)
  const archiveRide = useDemoStore((s) => s.archiveRide)
  const updateDriver = useDemoStore((s) => s.updateDriver)
  const [stars, setStars] = useState(5)
  const [strengths, setStrengths] = useState<string[]>(STRENGTHS)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!ride || !['payee', 'terminee'].includes(ride.status)) ensureDemoRide('payee', 'demo')
  }, [ride])

  if (!ride) return null
  const from = placeById(ride.fromId)
  const to = placeById(ride.toId)
  const commission = Math.round(ride.price * COMMISSION_RATE)
  const courseNo = `TK-${(parseInt(ride.id.slice(2), 36) % 9000) + 1000}`
  const female = ride.passenger.lastName === 'Fall' || ['Fatou', 'Awa', 'Khady', 'Aminata'].includes(ride.passenger.firstName)

  const validate = () => {
    const active = useDemoStore.getState().ride
    if (active && active.id === ride.id) {
      updateRide({ passengerRating: stars })
      // Le voyageur (app client) termine lui-même sa course ; sinon on clôture ici.
      if (active.source !== 'app') {
        setRideStatus('terminee')
        archiveRide()
      }
    }
    updateDriver({ online: true })
    toast('Évaluation enregistrée. Vous êtes de nouveau en ligne.', 'succes')
    navigate(path('D7'))
  }

  return (
    <Screen header={<AppHeader back={path('D12')} eyebrow="Allo Tukki" eyebrowTone="vert" title="Reçu & évaluation chauffeur" right={<ProfileButton onClick={() => navigate(path('D5'))} />} />}>
      <div className="space-y-4 px-4 pb-6 pt-4">
        <div className="relative flex items-center gap-3 overflow-hidden rounded-carte bg-vert-action p-4 text-white shadow-douce">
          <span className="absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-white/10" />
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
            <CircleCheck size={24} fill="white" className="text-vert-action" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-bold uppercase text-[#9ff5c3]">Course #{courseNo}</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[13px] font-bold">Alhamdoulillah 🤲</span>
            </div>
            <div className="text-[20px] font-semibold">Course terminée avec succès !</div>
            <div className="truncate text-[14px] text-[#9ff5c3]">
              {from.name} → {to.name}
            </div>
          </div>
        </div>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[17px] font-semibold">
              <Banknote size={20} className="text-vert-fondation" /> Encaissement Validé
            </h2>
            <span className="rounded-full bg-fond-carte px-2.5 py-0.5 text-[13px] font-bold">Espèces directes</span>
          </div>
          <div className="mt-3 flex items-end justify-between rounded-[12px] bg-fond-carte px-4 py-3">
            <div className="text-[14px] text-encre-douce">
              <div>Montant net perçu</div>Payé en liquide par le client
            </div>
            <div>
              <span className="text-[38px] font-extrabold leading-none">{formatAmount(ride.price)}</span>
              <span className="ml-1 text-[15px] font-bold">FCFA</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between px-1 text-[15px]">
            <span className="flex items-center gap-2 text-encre-douce">
              <ShieldCheck size={18} className="fill-vert-fondation text-white" /> Assurance Fondation (10 %)
            </span>
            <strong className="text-rouge-sos">-{formatAmount(commission)} FCFA</strong>
          </div>
          <div className="mt-2 flex justify-between rounded-[10px] bg-fond-carte px-3 py-2 text-[15px] font-semibold">
            Net Chauffeur conservé <span className="text-vert-fondation">{formatAmount(ride.price - commission)} FCFA</span>
          </div>
          {!!ride.tip && (
            <div className="mt-2 flex items-center gap-3 rounded-[12px] bg-jaune-creme p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jaune-soleil text-brun-ocre">
                <HandHeart size={20} />
              </span>
              <div className="flex-1 text-[14px] leading-snug">
                <strong>Pourboire Téranga reçu</strong>
                <div className="text-encre-douce">Via Wave (Sur votre solde)</div>
              </div>
              <strong className="text-[17px] text-brun-ocre">+{ride.tip} FCFA</strong>
            </div>
          )}
        </section>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center gap-3">
            {ride.passenger.avatar ? (
              <img src={ride.passenger.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-fond-carte text-[18px] font-bold text-vert-fondation">{ride.passenger.firstName[0]}</span>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-[20px] font-semibold">
                {ride.passenger.firstName} {ride.passenger.lastName}
              </div>
              <div className="flex items-center gap-1 text-[14px] text-encre-douce">
                <Star size={15} className="fill-brun-ocre text-brun-ocre" /> {female ? 'Passagère régulière' : 'Passager régulier'} • 4.9
              </div>
            </div>
            <span className="rounded-full bg-vert-clair px-2.5 py-1 text-[13px] font-bold text-vert-fondation">Évaluation</span>
          </div>
          <div className="mt-3 rounded-[12px] bg-fond-carte p-3 text-center">
            <div className="text-[14px] text-encre-douce">Qualité de l'échange avec {female ? 'la passagère' : 'le passager'}</div>
            <div className="mt-2 flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" aria-label={`${n} étoiles`} onClick={() => setStars(n)}>
                  <Star size={32} className={n <= stars ? 'fill-jaune-soleil text-jaune-soleil' : 'fill-gris-bord text-gris-bord'} />
                </button>
              ))}
            </div>
            <div className="mt-2 text-[15px] font-bold text-vert-fondation">
              {LABELS[stars]} ({stars}/5)
            </div>
          </div>
          <div className="mt-4 text-[13px] font-bold uppercase tracking-wide text-encre-douce">Points forts constatés (optionnel)</div>
          <div className="mt-2 flex flex-col items-start gap-2">
            {STRENGTHS.map((s) => {
              const on = strengths.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStrengths((l) => (on ? l.filter((x) => x !== s) : [...l, s]))}
                  className={cn('rounded-full px-3.5 py-1.5 text-[14px] font-bold', on ? 'bg-vert-fondation text-white' : 'bg-fond-carte text-encre-douce')}
                >
                  {s}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[14px] font-semibold">
            <NotebookPen size={17} /> Remarque confidentielle (Station &amp; Modération)
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Laisser une note pour la modération ou les délégués de station…"
            className="mt-2 w-full rounded-[12px] bg-fond-carte p-3 text-[14px] outline-none placeholder:text-gris-texte"
          />
        </section>

        <p className="flex items-center gap-2 px-1 text-[14px] text-encre-douce">
          <Archive size={18} className="shrink-0 text-vert-fondation" /> Ce rapport est archivé dans votre historique journalier.
        </p>
        <Button block size="lg" iconRight={<ArrowRight size={20} />} onClick={validate}>
          Valider &amp; Repasser En Ligne
        </Button>
      </div>
    </Screen>
  )
}
