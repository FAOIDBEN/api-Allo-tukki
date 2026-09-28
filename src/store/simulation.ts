import { useEffect, useRef, useState } from 'react'
import { buildRoute, routeLength, splitRoute } from '../lib/geo'
import { placeById, type LatLng } from '../mock/places'
import { MOUSSA } from '../mock/people'
import { APPROACH_MS, AUTO_ACCEPT_MS, BOARDING_MS, TRIP_MS, simMs, useDemoStore } from './demoStore'
import { isRemoteDriverOnline } from './sync'
import type { Ride, RideStatus } from './types'

/**
 * Moteur de simulation d'un voyage.
 * Les positions sont calculées à partir des horodatages de la réservation (partagés entre onglets) :
 * client, chauffeur et centrale voient donc la même voiture au même endroit, sans échange de « ticks ».
 */

/** Point de départ fictif du chauffeur (≈ 1 km au nord-ouest du point de prise en charge). */
export function driverStartFor(pickup: LatLng): LatLng {
  return [pickup[0] + 0.0068, pickup[1] - 0.0072]
}

export interface RideGeometry {
  pickup: LatLng
  destination: LatLng
  approachRoute: LatLng[]
  tripRoute: LatLng[]
}

export function rideGeometry(ride: Pick<Ride, 'fromId' | 'toId'>): RideGeometry {
  const pickup = placeById(ride.fromId).position
  const destination = placeById(ride.toId).position
  return {
    pickup,
    destination,
    approachRoute: buildRoute(driverStartFor(pickup), pickup),
    tripRoute: buildRoute(pickup, destination),
  }
}

export type RidePhase = 'approche' | 'sur-place' | 'trajet' | 'arrive'

export interface RideProgress {
  phase: RidePhase
  /** Avancement de la phase (0 → 1) */
  t: number
  car: LatLng
  done: LatLng[]
  remaining: LatLng[]
  remainingMeters: number
  remainingSeconds: number
}

/** Durée « réelle » affichée : 1 s de simulation ≈ 6 s de trajet, pour des minutes crédibles. */
const DISPLAY_FACTOR = 6

export function rideProgress(ride: Ride, now: number): RideProgress {
  const geo = rideGeometry(ride)
  if (ride.status === 'acceptee' && ride.acceptedAt && ride.approachMs) {
    const t = Math.min(1, (now - ride.acceptedAt) / ride.approachMs)
    const { done, remaining, point } = splitRoute(geo.approachRoute, t)
    return {
      phase: 'approche',
      t,
      car: point,
      done,
      remaining,
      remainingMeters: routeLength(remaining),
      remainingSeconds: ((1 - t) * ride.approachMs * DISPLAY_FACTOR) / 1000,
    }
  }
  if (ride.status === 'en_route' && ride.startedAt && ride.tripMs) {
    const t = Math.min(1, (now - ride.startedAt) / ride.tripMs)
    const { done, remaining, point } = splitRoute(geo.tripRoute, t)
    return {
      phase: 'trajet',
      t,
      car: point,
      done,
      remaining,
      remainingMeters: routeLength(remaining),
      remainingSeconds: ((1 - t) * ride.tripMs * DISPLAY_FACTOR) / 1000,
    }
  }
  if (ride.status === 'arrivee' || ride.status === 'payee' || ride.status === 'terminee') {
    return { phase: 'arrive', t: 1, car: geo.destination, done: geo.tripRoute, remaining: [], remainingMeters: 0, remainingSeconds: 0 }
  }
  if (ride.status === 'recherche') {
    const start = driverStartFor(geo.pickup)
    return { phase: 'approche', t: 0, car: start, done: [], remaining: geo.approachRoute, remainingMeters: routeLength(geo.approachRoute), remainingSeconds: 0 }
  }
  // chauffeur_arrive
  return { phase: 'sur-place', t: 1, car: geo.pickup, done: geo.approachRoute, remaining: [], remainingMeters: 0, remainingSeconds: 0 }
}

/** Re-rendu régulier pour les animations basées sur l'heure. */
export function useNow(intervalMs = 500, enabled = true): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, enabled])
  return now
}

/**
 * Chauffeur fictif côté client : si aucune app chauffeur « en ligne » n'est ouverte ailleurs,
 * il accepte la réservation (~4 s), arrive, embarque le voyageur et termine le trajet.
 */
export function useAutoDriver(): void {
  const ride = useDemoStore((s) => s.ride)
  const setRideStatus = useDemoStore((s) => s.setRideStatus)
  const addRideMessage = useDemoStore((s) => s.addRideMessage)

  useEffect(() => {
    if (!ride || ride.source !== 'app') return
    let delay: number | null = null
    let action: (() => void) | null = null
    // Réservation laissée passer par le vrai chauffeur : un autre chauffeur (fictif) la prend.
    let force = false
    const now = Date.now()

    switch (ride.status) {
      case 'recherche':
        delay = Math.max(0, ride.createdAt + simMs(AUTO_ACCEPT_MS) - now)
        action = () => setRideStatus('acceptee')
        break
      case 'expiree':
        force = true
        delay = simMs(1500)
        action = () => setRideStatus('acceptee')
        break
      case 'acceptee':
        if (ride.acceptedAt && ride.approachMs) {
          delay = Math.max(0, ride.acceptedAt + ride.approachMs - now)
          action = () => {
            setRideStatus('chauffeur_arrive')
            addRideMessage('chauffeur', 'Je suis devant le point de rendez-vous.')
          }
        }
        break
      case 'chauffeur_arrive':
        if (ride.driverArrivedAt) {
          delay = Math.max(0, ride.driverArrivedAt + simMs(BOARDING_MS) - now)
          action = () => setRideStatus('en_route')
        }
        break
      case 'en_route':
        if (ride.startedAt && ride.tripMs) {
          delay = Math.max(0, ride.startedAt + ride.tripMs - now)
          action = () => setRideStatus('arrivee')
        }
        break
    }
    if (delay === null || !action) return
    const run = action
    const id = window.setTimeout(() => {
      // Une app chauffeur réelle est en ligne : c'est elle qui pilote.
      if (!force && isRemoteDriverOnline()) return
      run()
    }, delay)
    return () => window.clearTimeout(id)
  }, [ride, setRideStatus, addRideMessage])
}

/** Exécute `fn` quand la valeur change (hors premier rendu). */
export function useOnChange<T>(value: T, fn: (value: T, previous: T) => void): void {
  const previous = useRef(value)
  const callback = useRef(fn)
  useEffect(() => {
    callback.current = fn
  })
  useEffect(() => {
    if (previous.current !== value) {
      const prev = previous.current
      previous.current = value
      callback.current(value, prev)
    }
  }, [value])
}

const STATUS_ORDER: RideStatus[] = ['recherche', 'acceptee', 'chauffeur_arrive', 'en_route', 'arrivee', 'payee', 'terminee']

/**
 * Arrivée directe sur un écran (panneau démo) : garantit une réservation au moins au stade `status`,
 * en créant et en « avançant » une course fictive si nécessaire.
 */
export function ensureDemoRide(status: RideStatus, source: 'app' | 'demo' = 'app'): void {
  const state = useDemoStore.getState()
  const current = state.ride
  const target = STATUS_ORDER.indexOf(status)
  if (current && STATUS_ORDER.indexOf(current.status) >= target && current.status !== 'terminee') return
  if (!current || current.status === 'terminee' || current.status === 'annulee') state.createRide({ source })
  const now = Date.now()
  const patch: Partial<Ride> = { status, driverId: MOUSSA.id }
  if (target >= 1) Object.assign(patch, { acceptedAt: now, approachMs: simMs(APPROACH_MS) })
  if (target >= 2) Object.assign(patch, { acceptedAt: now - simMs(APPROACH_MS), driverArrivedAt: now })
  if (target >= 3) Object.assign(patch, { startedAt: now, tripMs: simMs(TRIP_MS) })
  if (target >= 4) Object.assign(patch, { startedAt: now - simMs(TRIP_MS), endedAt: now })
  if (target >= 5) Object.assign(patch, { paidAt: now, cashGiven: 1000 })
  useDemoStore.getState().updateRide(patch)
}
