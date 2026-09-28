import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banknote, CircleCheck, CircleHelp, Clock3, Hand, Lightbulb, Phone, ShieldCheck, Star } from 'lucide-react'
import { path } from '../../../app/screens'
import { Button, Screen } from '../../../design'
import { cn, formatAmount, formatTime } from '../../../lib/format'
import { MOUSSA } from '../../../mock/people'
import { placeById } from '../../../mock/places'
import { useDemoStore } from '../../../store/demoStore'
import { ensureDemoRide } from '../../../store/simulation'
import { toast } from '../../../store/toastStore'
import { ClientHeader } from '../components/ClientHeader'
import { DriverAvatar } from '../components/DriverCard'

const BILLS = [1000, 2000, 5000, 10000]

/** C15 – Arrivée & paiement en espèces, avec calcul de la monnaie à rendre. */
export function C15Arrivee() {
  const navigate = useNavigate()
  const ride = useDemoStore((s) => s.ride)
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const [given, setGiven] = useState<number>(1000)

  useEffect(() => {
    if (!ride || ['recherche', 'acceptee', 'chauffeur_arrive', 'en_route', 'terminee', 'annulee'].includes(ride.status))
      ensureDemoRide('arrivee')
  }, [ride])

  if (!ride) return null
  const from = placeById(ride.fromId)
  const to = placeById(ride.toId)
  const price = ride.price
  const exact = given === price
  const change = Math.max(0, given - price)
  const paid = ride.status === 'payee' || ride.status === 'terminee'
  const bills = BILLS.filter((b) => b >= price)

  const pay = () => {
    if (!paid) setRideStatus('payee', { cashGiven: given })
    toast(paid ? `${MOUSSA.firstName} a confirmé l'encaissement.` : `Paiement de ${formatAmount(price)} FCFA confirmé.`, 'succes')
    navigate(path('C16'))
  }

  return (
    <Screen
      header={<ClientHeader back={path('C13')} title="Arrivée et paiement" />}
      band={
        <div className="flex shrink-0 items-center justify-between bg-encre px-4 py-2 text-[13px] font-semibold text-white">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-vert-action" /> Connexion sécurisée Tivaouane-Net
          </span>
          <span className="text-white/70">Arrivée confirmée</span>
        </div>
      }
    >
      <div className="space-y-4 px-4 pb-6 pt-4">
        <section className="relative overflow-hidden rounded-carte bg-fond-carte p-4 shadow-douce">
          <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-vert-menthe/40" />
          <div className="relative flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vert-fondation text-white">
              <CircleCheck size={24} />
            </span>
            <div className="flex-1">
              <h1 className="pr-16 text-[20px] font-semibold leading-tight">Arrivée à destination ! 🎉</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[14px] whitespace-nowrap">
                <Clock3 size={15} className="text-vert-fondation" />
                {formatTime(ride.endedAt ?? ride.createdAt)}
                <span className="text-gris-texte">•</span>
                <span className="font-semibold text-vert-fondation">Course terminée</span>
              </div>
            </div>
            <span className="absolute right-0 top-0 rounded-full bg-surface px-2.5 py-1 text-[12px] font-bold">Espèces</span>
          </div>
          <div className="relative mt-3 rounded-[12px] bg-surface px-3 py-2.5">
            <div className="flex items-center gap-2 text-[14px] text-encre-douce">
              <span className="h-2.5 w-2.5 rounded-full bg-vert-fondation" /> {from.name} Tivaouane
            </div>
            <div className="flex items-center gap-2 text-[16px] font-bold">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-brun-ocre" /> {to.name}
            </div>
          </div>
        </section>

        <section className="rounded-carte bg-surface p-4 shadow-douce">
          <div className="flex justify-center">
            <span className="flex items-center gap-1.5 rounded-full bg-jaune-soleil px-4 py-1 text-[14px] font-bold text-brun-ocre">
              <Banknote size={17} /> Règlement en espèces obligatoire
            </span>
          </div>
          <p className="mt-3 text-center text-[15px] text-encre-douce">Total exact à remettre</p>
          <p className="text-center text-vert-action">
            <span className="text-[46px] font-extrabold leading-none tracking-tight">{formatAmount(price)}</span>
            <span className="ml-2 text-[24px] font-bold">FCFA</span>
          </p>
          <div className="mt-3 flex gap-3 rounded-[12px] bg-fond-carte p-3 text-[14px] leading-snug">
            <Hand size={22} className="shrink-0 text-vert-fondation" />
            <p>
              Remettez <strong className="text-vert-action">{formatAmount(price)} FCFA</strong> directement au conducteur{' '}
              <strong>{MOUSSA.firstName}</strong> en mains propres avant de descendre.
            </p>
          </div>

          <div className="mt-3 rounded-[12px] bg-fond-carte p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-encre-douce">
                <Lightbulb size={15} /> Suggestions de monnaie
              </span>
              <span className="text-[12px] font-semibold text-vert-action">Monnaie facilitée</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="self-center text-[12px] font-semibold text-encre-douce">Je paie avec :</span>
              {bills.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setGiven(b)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[12px] font-bold',
                    given === b ? 'bg-vert-fondation text-white' : 'bg-surface text-encre',
                  )}
                >
                  {formatAmount(b)} F
                </button>
              ))}
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGiven(price)}
                className={cn('rounded-[12px] bg-surface p-3 text-left', exact && 'ring-2 ring-vert-fondation')}
              >
                <span className="flex items-center gap-1 text-[12px] font-bold">
                  <span className="rounded-full bg-jaune-pale px-1.5 py-0.5">500</span>+
                  <span className="rounded-full bg-jaune-pale px-1.5 py-0.5">200</span>
                </span>
                <span className="mt-1.5 block text-[15px] font-semibold text-vert-action">Montant tout rond</span>
                <span className="block text-[12px] text-encre-douce">Pas de monnaie à rendre</span>
              </button>
              <div className={cn('rounded-[12px] bg-surface p-3', !exact && 'ring-2 ring-vert-fondation')}>
                <span className="rounded-md bg-fond-carte px-1.5 py-0.5 text-[12px] font-bold">
                  Billet {formatAmount(exact ? 1000 : given)} F
                </span>
                <span className="mt-1.5 block text-[14px] font-semibold text-brun-ocre">{MOUSSA.firstName} vous rend :</span>
                <span className="block text-[17px] font-bold">{formatAmount(exact ? 1000 - price : change)} FCFA</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center gap-3 rounded-carte bg-surface p-4 shadow-douce">
          <DriverAvatar driver={MOUSSA} size={56} badge="voiture" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[19px] font-semibold">
              {MOUSSA.firstName} {MOUSSA.lastName}
              <span className="flex items-center text-[13px] font-bold text-brun-ocre">
                <Star size={13} className="fill-brun-ocre" /> 4.9
              </span>
            </div>
            <div className="truncate text-[14px] text-encre-douce">
              Corolla {MOUSSA.car.color} • <strong className="text-encre">{MOUSSA.car.plate}</strong>
            </div>
            <div className={cn('flex items-center gap-1.5 text-[13px] font-semibold', paid ? 'text-vert-action' : 'text-brun-ocre')}>
              <span className={cn('h-3 w-3 rounded-full', paid ? 'bg-vert-action' : 'bg-jaune-pale')} />
              {paid ? 'Règlement reçu' : 'En attente de votre règlement'}
            </div>
          </div>
          <button
            type="button"
            aria-label={`Appeler ${MOUSSA.firstName}`}
            onClick={() => toast(`Appel de ${MOUSSA.firstName} (${MOUSSA.phone})…`)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-fond-carte"
          >
            <Phone size={20} />
          </button>
        </section>

        <div className="flex items-center gap-3 rounded-carte bg-fond-carte p-3.5 text-[14px] leading-snug">
          <ShieldCheck size={22} className="shrink-0 fill-vert-fondation text-white" />
          <p>
            <strong>Tarif garanti Allo Tukki :</strong> <span className="text-encre-douce">Fixe et transparent. Aucun supplément pour bagage ou trafic.</span>
          </p>
        </div>

        <Button block size="lg" iconLeft={<CircleCheck size={21} />} onClick={pay}>
          {paid ? 'Continuer' : `J'ai réglé les ${formatAmount(price)} FCFA`}
        </Button>
        <button
          type="button"
          onClick={() => navigate(path('C18'))}
          className="flex w-full items-center justify-center gap-1.5 text-[14px] text-encre-douce"
        >
          <CircleHelp size={17} /> Un souci de monnaie ou de tarif ?
        </button>
      </div>
    </Screen>
  )
}
