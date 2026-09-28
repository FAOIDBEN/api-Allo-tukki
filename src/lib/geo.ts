import type { LatLng } from '../mock/places'

/** Distance en mètres (haversine). */
export function distance(a: LatLng, b: LatLng): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Tracé « routier » prédéfini entre deux points : deux coudes façon rues,
 * légèrement décalés pour ne pas paraître parfaitement géométriques.
 */
export function buildRoute(from: LatLng, to: LatLng): LatLng[] {
  const midLat = from[0] + (to[0] - from[0]) * 0.45
  const midLng = from[1] + (to[1] - from[1]) * 0.55
  return [
    from,
    [midLat + 0.0004, from[1] + (to[1] - from[1]) * 0.08],
    [midLat, midLng],
    [to[0] - (to[0] - from[0]) * 0.12, to[1] - 0.0003],
    to,
  ]
}

export function routeLength(route: LatLng[]): number {
  let total = 0
  for (let i = 1; i < route.length; i++) total += distance(route[i - 1], route[i])
  return total
}

/** Découpe un tracé à la fraction `t` (0→1) : partie parcourue, partie restante, position courante. */
export function splitRoute(route: LatLng[], t: number): { done: LatLng[]; remaining: LatLng[]; point: LatLng } {
  const clamped = Math.min(1, Math.max(0, t))
  const total = routeLength(route)
  let target = total * clamped
  for (let i = 1; i < route.length; i++) {
    const seg = distance(route[i - 1], route[i])
    if (target <= seg || i === route.length - 1) {
      const f = seg === 0 ? 0 : Math.min(1, target / seg)
      const a = route[i - 1]
      const b = route[i]
      const point: LatLng = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
      return { done: [...route.slice(0, i), point], remaining: [point, ...route.slice(i)], point }
    }
    target -= seg
  }
  const last = route[route.length - 1]
  return { done: route, remaining: [last], point: last }
}

/** "2,4 km" ou "850 m" */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.max(0, Math.round(meters / 10) * 10)} m`
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`
}
