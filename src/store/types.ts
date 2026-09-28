import type { Lang } from '../i18n'
import type { Passenger } from '../mock/people'

export type Speed = 'normale' | 'rapide'

/**
 * Cycle de vie d'une réservation, partagé entre client, chauffeur et centrale.
 * recherche → acceptee → chauffeur_arrive → en_route → arrivee → payee → terminee
 */
export type RideStatus =
  | 'recherche'
  | 'acceptee'
  | 'chauffeur_arrive'
  | 'en_route'
  | 'arrivee'
  | 'payee'
  | 'terminee'
  | 'annulee'
  | 'expiree'

export type RideSource = 'app' | 'sms' | 'demo'

export interface RideMessage {
  id: string
  from: 'client' | 'chauffeur'
  text: string
  at: number
}

export interface Ride {
  id: string
  source: RideSource
  status: RideStatus
  createdAt: number
  passenger: Passenger
  fromId: string
  toId: string
  landmarks: string[]
  seats: number
  price: number
  /** Fin du compte à rebours côté chauffeur (D8) */
  offerExpiresAt?: number
  driverId?: string
  acceptedAt?: number
  driverArrivedAt?: number
  startedAt?: number
  endedAt?: number
  paidAt?: number
  cashGiven?: number
  messages: RideMessage[]
  rating?: number
  tip?: number
  passengerRating?: number
}

export type FeedKind = 'reservation' | 'sms' | 'affectation' | 'sos' | 'cloture' | 'info'

export interface FeedEvent {
  id: string
  at: number
  kind: FeedKind
  title: string
  detail: string
}

export interface SmsRequest {
  id: string
  at: number
  phone: string
  text: string
  channel: 'sms' | 'vocal'
  destinationId: string
  suggestedDriverId: string
  status: 'attente' | 'affectee'
}

export interface SosAlert {
  id: string
  at: number
  passengerName: string
  phone: string
  location: string
  rideId?: string
  status: 'envoyee' | 'prise_en_charge' | 'resolue'
}

export type DocStatus = 'a_envoyer' | 'envoye' | 'valide'

export interface Kpis {
  carsOnline: number
  tripsClosed: number
  smsRequests: number
  solidarityFund: number
  severeIncidents: number
  mediations: number
}

export interface DemoData {
  settings: {
    speed: Speed
    lang: Lang
    lowData: boolean
    nightMode: boolean
    voiceAssist: boolean
  }
  client: {
    onboarded: boolean
    phone: string
    firstName: string
    consentAt?: number
    draft: {
      fromId: string
      toId: string
      landmarks: string[]
      seats: number
    }
  }
  driver: {
    online: boolean
    onlineSince?: number
    earningsToday: number
    tripsToday: number
    dossier: {
      step: number
      docs: Record<string, DocStatus>
      submittedAt?: number
      validated: boolean
    }
  }
  /** Réservation active (une seule à la fois dans la démo) */
  ride: Ride | null
  rideHistory: Ride[]
  centrale: {
    kpis: Kpis
    feed: FeedEvent[]
    smsQueue: SmsRequest[]
    sosAlerts: SosAlert[]
  }
}
