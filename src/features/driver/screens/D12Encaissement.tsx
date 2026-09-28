import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Banknote, Check, CircleHelp, CloudCheck, HandCoins, Info, Navigation, ReceiptText, TriangleAlert, Wallet } from 'lucide-react'
import { path } from '../../../app/screens'
import { Screen } from '../../../design'
import { cn, formatAmount } from '../../../lib/format'
import { placeById } from '../../../mock/places'
import { COMMISSION_RATE, useCurrentOrLastRide, useDemoStore } from '../../../store/demoStore'
import { ensureDemoRide } from '../../../store/simulation'
import { toast } from '../../../store/toastStore'
import { CourseHeader, DriverStrip } from '../components/DriverChrome'

/** D12 – Encaissement en espèces : montant, monnaie à rendre, décompte brut / commission / net. */
export function D12Encaissement() {
  const navigate = useNavigate()
  const ride = useCurrentOrLastRide()
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const [received, setReceived] = useState(false)
  const [bill, setBill] = useState<number | null>(null)

  useEffect(() => {
    if (!ride || ['recherche', 'acceptee', 'chauffeur_arrive', 'en_route', 'annulee', 'expiree'].includes(ride.status))
      ensureDemoRide('arrivee', 'demo')
  }, [ride])

  if (!ride) return null
  const from = placeById(ride.fromId)
  const to = placeById(ride.toId)
  const commission = Math.round(ride.price * COMMISSION_RATE)
  const net = ride.price - commission
  const clientPaid = ride.status === 'payee' || ride.status === 'terminee'
  const given = bill ?? ride.cashGiven ?? ride.price
  const change = Math.max(0, given - ride.price)
  const courseNo = `TI-${(parseInt(ride.id.slice(2), 36) % 9000) + 1000}`

  const confirm = () => {
    if (!clientPaid) setRideStatus('payee', { cashGiven: given })
    toast(`Encaissement de ${formatAmount(ride.price)} FCFA confirmé. Gain net : ${formatAmount(net)} FCFA.`, 'succes')
    navigate(path('D13'))
  }

  return (
    <Screen
      header={
        <>
          <DriverStrip left="Mode course active (sécurisé)" right={<><Navigation size={13} /> GPS actif</>} />
          <CourseHeader title="Encaissement" back={path('D11')} />
        </>
      }
    >
      <div className="flex items-center justify-between bg-sombre px-4 pb-2 text-[13px] text-white">
        <span className="flex items-center gap-1.5">
          <CloudCheck size={16} className="text-[#9ff5c3]" /> Paiement synchronisé (Réseau Tivaouane stable)
        </span>
        <span className="font-bold text-jaune-pale">#142</span>
      </div>
      <div className="space-y-4 px-4 pb-6 pt-4">
        <div className="flex items-center gap-3 rounded-carte bg-[#138a3f] p-4 text-white shadow-douce">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-vert-fondation">
            <Check size={26} strokeWidth={3} />
          </span>
          <div>
            <div className="text-[20px] font-semibold leading-tight">Course terminée avec succès !</div>
            <div className="text-[14px] text-[#b9f5cf]">
              Trajet : {from.name} → {to.name}
            </div>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-carte bg-surface p-4 text-center shadow-douce">
          <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-jaune-creme" />
          <span className="relative rounded-full bg-jaune-creme px-4 py-1 text-[13px] font-bold uppercase text-brun-ocre">Règlement immédiat</span>
          <div className="relative mt-3 text-[15px] font-medium uppercase text-encre-douce">Montant à encaisser</div>
          <div className="relative text-vert-fondation">
            <span className="text-[46px] font-extrabold leading-none">{formatAmount(ride.price)}</span>
            <span className="ml-1.5 text-[22px] font-bold">FCFA</span>
          </div>
          <div className="relative mt-3 flex items-center gap-3 rounded-[12px] bg-fond-carte px-3 py-2.5 text-left">
            <Banknote size={22} className="shrink-0 text-brun-ocre" />
            <span className="flex-1 text-center text-[15px] font-semibold">
              À encaisser en espèces auprès de {ride.passenger.firstName} {ride.passenger.lastName}
            </span>
          </div>
          <div className="relative mt-3 text-left">
            <div className="mb-1.5 text-[12px] font-bold uppercase text-encre-douce">Billet remis par le voyageur</div>
            <div className="flex flex-wrap gap-1.5">
              {[ride.price, 1000, 2000, 5000].filter((v, i, a) => a.indexOf(v) === i && v >= ride.price).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBill(b)}
                  className={cn('rounded-full px-3 py-1 text-[13px] font-bold', given === b ? 'bg-vert-fondation text-white' : 'bg-fond-carte')}
                >
                  {b === ride.price ? 'Appoint' : `${formatAmount(b)} F`}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between rounded-[10px] bg-jaune-creme px-3 py-2 text-[14px]">
              <span className="flex items-center gap-1.5 font-semibold text-brun-ocre">
                <HandCoins size={17} /> Monnaie à rendre
              </span>
              <strong className="text-[17px]">{formatAmount(change)} FCFA</strong>
            </div>
          </div>
        </section>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[17px] font-semibold">
              <ReceiptText size={20} className="text-vert-fondation" /> Décompte Chauffeur
            </h2>
            <span className="whitespace-nowrap rounded-md bg-fond-carte px-2 py-0.5 text-[12px] font-bold">Course #{courseNo}</span>
          </div>
          <div className="mt-3 flex justify-between text-[15px]">
            <span className="text-encre-douce">Montant brut course</span>
            <strong>{formatAmount(ride.price)} FCFA</strong>
          </div>
          <div className="mt-2 flex justify-between border-b-2 border-fond-carte pb-2.5 text-[15px]">
            <span className="flex items-center gap-1 text-encre-douce">
              Commission Fondation (10 %) <CircleHelp size={15} />
            </span>
            <strong className="text-rouge-sos">– {formatAmount(commission)} FCFA</strong>
          </div>
          <div className="mt-2.5 flex items-center justify-between rounded-[12px] bg-vert-clair px-3 py-2.5">
            <span className="flex items-center gap-2 text-[16px] font-bold text-vert-fondation">
              <Wallet size={19} /> Gain net pour Moussa
            </span>
            <span className="text-[22px] font-extrabold text-vert-fondation">{formatAmount(net)} FCFA</span>
          </div>
        </section>

        <div className="flex gap-3 rounded-carte bg-fond-carte p-4">
          <Info size={21} className="shrink-0 text-brun-ocre" />
          <p className="text-[14px] leading-snug">
            <strong className="block text-brun-ocre">Note d'organisation</strong>
            Règlement des commissions chaque fin de semaine à la permanence Fondation (face Zawiya Rkhiya).
          </p>
        </div>

        {clientPaid && (
          <div className="flex items-center gap-2 rounded-carte bg-vert-clair p-3 text-[14px] font-semibold text-vert-fondation">
            <BadgeCheck size={19} /> {ride.passenger.firstName} a confirmé le paiement dans son application.
          </div>
        )}

        <button
          type="button"
          role="checkbox"
          aria-checked={received}
          onClick={() => setReceived((r) => !r)}
          className="flex w-full items-center gap-4 rounded-carte bg-surface p-4 text-left shadow-douce"
        >
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]', received ? 'bg-vert-fondation text-white' : 'bg-fond-carte')}>
            {received && <Check size={20} strokeWidth={3} />}
          </span>
          <span>
            <span className="block text-[19px] font-semibold leading-tight">J'ai bien reçu les {formatAmount(ride.price)} FCFA en espèces</span>
            <span className="block text-[14px] text-encre-douce">Assurez-vous d'avoir remis la monnaie exacte</span>
          </span>
        </button>

        <button
          type="button"
          disabled={!received}
          onClick={confirm}
          className="flex min-h-16 w-full items-center gap-3 rounded-carte bg-vert-fondation px-4 py-2 text-white shadow-douce transition-colors disabled:bg-fond-carte disabled:text-gris-texte"
        >
          <BadgeCheck size={24} className="shrink-0" />
          <span className="flex-1 text-center text-[18px] font-bold uppercase leading-tight">Confirmer l'encaissement &amp; retour en ligne</span>
        </button>
        <div className="flex items-center justify-between text-[14px]">
          <button type="button" onClick={() => toast('Médiation ouverte : un régulateur de la centrale vous contacte.', 'alerte')} className="flex items-center gap-1.5 text-encre-douce">
            <TriangleAlert size={16} /> Problème de paiement ?
          </button>
          <span className="font-bold text-vert-fondation">Tivaouane Sécurisé</span>
        </div>
      </div>
    </Screen>
  )
}
