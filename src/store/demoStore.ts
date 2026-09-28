import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '../lib/format'
import { AMINATA, MOUSSA, OTHER_PASSENGERS, type Passenger } from '../mock/people'
import { placeById } from '../mock/places'
import type { DemoData, FeedEvent, Ride, RideSource, RideStatus, SmsRequest, SosAlert } from './types'

export const STORAGE_KEY = 'allo-tukki-demo'

/** Prix fixe par place (maquettes C10, C13, C15). */
export const SEAT_PRICE = 700
/** Commission solidaire reversée à la Fondation. */
export const COMMISSION_RATE = 0.1
/** Durée du compte à rebours D8, en ms (avant accélération). */
export const OFFER_DURATION = 15_000
/** Durées de simulation d'un voyage (avant accélération). */
export const AUTO_ACCEPT_MS = 4_000
export const APPROACH_MS = 30_000
export const BOARDING_MS = 6_000
export const TRIP_MS = 40_000

const FEED_LIMIT = 40

export function initialData(): DemoData {
  return {
    settings: { speed: 'normale', lang: 'fr', lowData: false, nightMode: false, voiceAssist: true },
    client: {
      onboarded: false,
      phone: '',
      firstName: '',
      draft: {
        fromId: 'marche-central',
        toId: 'hopital',
        landmarks: ['Foulard jaune'],
        note: 'Maison bleue derrière la boulangerie du Marché, je porte un foulard jaune',
        seats: 1,
      },
    },
    driver: {
      online: false,
      earningsToday: 6500,
      tripsToday: 8,
      dossier: { step: 0, docs: {}, validated: false },
    },
    ride: null,
    rideHistory: [],
    centrale: {
      kpis: {
        carsOnline: 142,
        tripsClosed: 854,
        smsRequests: 68,
        solidarityFund: 85400,
        severeIncidents: 0,
        mediations: 2,
      },
      feed: [],
      smsQueue: [],
      sosAlerts: [],
    },
  }
}

export interface CreateRideInput {
  source: RideSource
  passenger?: Passenger
  fromId?: string
  toId?: string
  landmarks?: string[]
  note?: string
  seats?: number
}

interface Actions {
  setSettings: (patch: Partial<DemoData['settings']>) => void
  updateClient: (patch: Partial<Omit<DemoData['client'], 'draft'>>) => void
  updateDraft: (patch: Partial<DemoData['client']['draft']>) => void
  updateDriver: (patch: Partial<Omit<DemoData['driver'], 'dossier'>>) => void
  updateDossier: (patch: Partial<DemoData['driver']['dossier']>) => void

  createRide: (input: CreateRideInput) => Ride
  updateRide: (patch: Partial<Ride>) => void
  setRideStatus: (status: RideStatus, patch?: Partial<Ride>) => void
  addRideMessage: (from: 'client' | 'chauffeur', text: string) => void
  archiveRide: () => void

  pushFeed: (event: Omit<FeedEvent, 'id' | 'at'>) => void
  patchKpis: (patch: Partial<DemoData['centrale']['kpis']>) => void
  addSms: (sms: Omit<SmsRequest, 'id' | 'at' | 'status'>) => void
  assignSms: (id: string) => void
  triggerSos: (input?: Partial<Pick<SosAlert, 'passengerName' | 'phone' | 'location' | 'rideId'>>) => SosAlert
  updateSos: (id: string, status: SosAlert['status']) => void

  resetDemo: () => void
}

export type DemoState = DemoData & Actions

/** Clés de données (hors actions), utilisées pour la persistance et la synchronisation. */
export const DATA_KEYS = Object.keys(initialData()) as Array<keyof DemoData>

export function pickData(state: DemoState): DemoData {
  const data = {} as Record<string, unknown>
  for (const key of DATA_KEYS) data[key] = state[key]
  return data as unknown as DemoData
}

function feedEvent(event: Omit<FeedEvent, 'id' | 'at'>): FeedEvent {
  return { ...event, id: uid('EV-'), at: Date.now() }
}

function rideLabel(ride: Ride): string {
  return `${placeById(ride.fromId).name} → ${placeById(ride.toId).name}`
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...initialData(),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      updateClient: (patch) => set((s) => ({ client: { ...s.client, ...patch } })),
      updateDraft: (patch) => set((s) => ({ client: { ...s.client, draft: { ...s.client.draft, ...patch } } })),
      updateDriver: (patch) => set((s) => ({ driver: { ...s.driver, ...patch } })),
      updateDossier: (patch) =>
        set((s) => ({ driver: { ...s.driver, dossier: { ...s.driver.dossier, ...patch } } })),

      createRide: (input) => {
        const { client } = get()
        const passenger =
          input.passenger ??
          (input.source === 'app'
            ? { ...AMINATA, firstName: client.firstName || AMINATA.firstName }
            : OTHER_PASSENGERS[Math.floor(Math.random() * OTHER_PASSENGERS.length)])
        const seats = input.seats ?? (input.source === 'app' ? client.draft.seats : 1)
        const ride: Ride = {
          id: uid('R-'),
          source: input.source,
          status: 'recherche',
          createdAt: Date.now(),
          passenger,
          fromId: input.fromId ?? client.draft.fromId,
          toId: input.toId ?? client.draft.toId,
          landmarks: input.landmarks ?? (input.source === 'app' ? client.draft.landmarks : ['Devant boutique']),
          note: input.note ?? (input.source === 'app' ? client.draft.note : ''),
          seats,
          price: SEAT_PRICE * seats,
          offerExpiresAt: Date.now() + simMs(OFFER_DURATION),
          messages: [],
        }
        set((s) => ({
          ride,
          centrale: {
            ...s.centrale,
            feed: [
              feedEvent({
                kind: 'reservation',
                title: `Nouvelle réservation • ${passenger.firstName}`,
                detail: `${rideLabel(ride)} • ${seats} place${seats > 1 ? 's' : ''}`,
              }),
              ...s.centrale.feed,
            ].slice(0, FEED_LIMIT),
          },
        }))
        return ride
      },

      updateRide: (patch) => set((s) => (s.ride ? { ride: { ...s.ride, ...patch } } : {})),

      setRideStatus: (status, patch = {}) => {
        const { ride } = get()
        if (!ride) return
        const now = Date.now()
        const stamps: Partial<Ride> = {
          acceptee: { acceptedAt: now, driverId: ride.driverId ?? MOUSSA.id, approachMs: simMs(APPROACH_MS) },
          chauffeur_arrive: { driverArrivedAt: now },
          en_route: { startedAt: now, tripMs: simMs(TRIP_MS) },
          arrivee: { endedAt: now },
          payee: { paidAt: now },
        }[status as string] ?? {}
        const next: Ride = { ...ride, ...stamps, ...patch, status }

        set((s) => {
          const feed = [...s.centrale.feed]
          const kpis = { ...s.centrale.kpis }
          const driver = { ...s.driver }
          if (status === 'acceptee') {
            feed.unshift(
              feedEvent({
                kind: 'affectation',
                title: `Affectation • ${MOUSSA.firstName} ${MOUSSA.lastName}`,
                detail: `${MOUSSA.car.plate} prend ${ride.passenger.firstName} • ${rideLabel(ride)}`,
              }),
            )
          }
          if (status === 'payee' && ride.status !== 'payee') {
            kpis.tripsClosed += 1
            kpis.solidarityFund += Math.round(ride.price * COMMISSION_RATE)
            // Gains bruts : la commission de 10 % est affichée « à reverser » (D7, D14)
            driver.earningsToday += ride.price
            driver.tripsToday += 1
            feed.unshift(
              feedEvent({
                kind: 'cloture',
                title: `Course clôturée • ${ride.passenger.firstName}`,
                detail: `${rideLabel(ride)} • ${ride.price} FCFA encaissés`,
              }),
            )
          }
          return { ride: next, driver, centrale: { ...s.centrale, kpis, feed: feed.slice(0, FEED_LIMIT) } }
        })
      },

      addRideMessage: (from, text) =>
        set((s) =>
          s.ride
            ? { ride: { ...s.ride, messages: [...s.ride.messages, { id: uid('M-'), from, text, at: Date.now() }] } }
            : {},
        ),

      archiveRide: () =>
        set((s) => (s.ride ? { rideHistory: [s.ride, ...s.rideHistory].slice(0, 20), ride: null } : {})),

      pushFeed: (event) =>
        set((s) => ({
          centrale: { ...s.centrale, feed: [feedEvent(event), ...s.centrale.feed].slice(0, FEED_LIMIT) },
        })),

      patchKpis: (patch) =>
        set((s) => ({ centrale: { ...s.centrale, kpis: { ...s.centrale.kpis, ...patch } } })),

      addSms: (sms) =>
        set((s) => {
          const request: SmsRequest = { ...sms, id: uid('SMS-'), at: Date.now(), status: 'attente' }
          return {
            centrale: {
              ...s.centrale,
              smsQueue: [request, ...s.centrale.smsQueue],
              kpis: { ...s.centrale.kpis, smsRequests: s.centrale.kpis.smsRequests + 1 },
              feed: [
                feedEvent({
                  kind: 'sms',
                  title: `SMS reçu au 28020 • ${sms.phone}`,
                  detail: sms.text,
                }),
                ...s.centrale.feed,
              ].slice(0, FEED_LIMIT),
            },
          }
        }),

      assignSms: (id) =>
        set((s) => ({
          centrale: {
            ...s.centrale,
            smsQueue: s.centrale.smsQueue.map((r) => (r.id === id ? { ...r, status: 'affectee' } : r)),
          },
        })),

      triggerSos: (input = {}) => {
        const { ride, client } = get()
        const alert: SosAlert = {
          id: uid('SOS-'),
          at: Date.now(),
          passengerName: input.passengerName ?? `${client.firstName || AMINATA.firstName} ${AMINATA.lastName}`,
          phone: input.phone ?? (client.phone || AMINATA.phone),
          location: input.location ?? (ride ? rideLabel(ride) : 'Tivaouane • Marché Central'),
          rideId: input.rideId ?? ride?.id,
          status: 'envoyee',
        }
        set((s) => ({
          centrale: {
            ...s.centrale,
            sosAlerts: [alert, ...s.centrale.sosAlerts],
            feed: [
              feedEvent({ kind: 'sos', title: `Alerte SOS • ${alert.passengerName}`, detail: alert.location }),
              ...s.centrale.feed,
            ].slice(0, FEED_LIMIT),
          },
        }))
        return alert
      },

      updateSos: (id, status) =>
        set((s) => ({
          centrale: {
            ...s.centrale,
            sosAlerts: s.centrale.sosAlerts.map((a) => (a.id === id ? { ...a, status } : a)),
          },
        })),

      resetDemo: () => set(initialData()),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      migrate: () => initialData() as unknown as DemoState,
      partialize: (state) => pickData(state),
    },
  ),
)

/** Applique la vitesse de simulation à une durée (mode « rapide » ≈ ×2,5). */
export function simMs(ms: number): number {
  return useDemoStore.getState().settings.speed === 'rapide' ? Math.round(ms * 0.4) : ms
}

/** Réservation active, sinon la dernière archivée : l'autre app a pu l'archiver entre-temps. */
export function useCurrentOrLastRide() {
  const ride = useDemoStore((s) => s.ride)
  const last = useDemoStore((s) => s.rideHistory[0])
  return ride ?? last ?? null
}
