import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { Crosshair, MapPinOff } from 'lucide-react'
import { cn } from '../lib/format'
import type { LatLng } from '../mock/places'

export type MarkerKind = 'voiture' | 'navigation' | 'voyageur' | 'lieu' | 'voiture-attente'

export interface MapMarker {
  id: string
  position: LatLng
  kind: MarkerKind
  label?: string
  labelTone?: 'vert' | 'sombre' | 'jaune' | 'blanc'
  /** Label permanent (sinon affiché au survol) */
  permanentLabel?: boolean
}

/**
 * Tuiles OpenStreetMap standard (sans clé API). Un filtre CSS les adoucit pour
 * approcher le rendu des maquettes ; le mode nuit les inverse (voir index.css).
 */
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; contributeurs OpenStreetMap'

const SVG = {
  voiture:
    '<path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>',
  navigation: '<polygon points="12 2 19 21 12 17 5 21 12 2"/>',
  voyageur:
    '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
}

function svg(paths: string, size: number, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
}

const iconCache = new Map<MarkerKind, L.DivIcon>()

function markerIcon(kind: MarkerKind): L.DivIcon {
  const cached = iconCache.get(kind)
  if (cached) return cached
  let html: string
  let size: number
  switch (kind) {
    case 'voiture':
    case 'navigation':
    case 'voyageur':
      size = 44
      html = `<div style="width:44px;height:44px;border-radius:9999px;background:#005F3F;border:3px solid #fff;box-shadow:0 6px 14px -4px rgba(20,27,43,.45);display:flex;align-items:center;justify-content:center">${svg(SVG[kind], 22, '#fff')}</div>`
      break
    case 'voiture-attente':
      size = 30
      html = `<div style="width:30px;height:30px;border-radius:9999px;background:#fff;box-shadow:0 3px 8px -2px rgba(20,27,43,.35);display:flex;align-items:center;justify-content:center">${svg(SVG.voiture, 16, '#005F3F')}</div>`
      break
    case 'lieu':
    default:
      size = 18
      html = '<div style="width:18px;height:18px;border-radius:9999px;background:#FEB726;border:3px solid #fff;box-shadow:0 2px 6px rgba(20,27,43,.35)"></div>'
  }
  const icon = L.divIcon({ className: 'at-marker', html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] })
  iconCache.set(kind, icon)
  return icon
}

const labelClass: Record<NonNullable<MapMarker['labelTone']>, string> = {
  vert: 'at-label at-label-vert',
  sombre: 'at-label at-label-sombre',
  jaune: 'at-label at-label-jaune',
  blanc: 'at-label at-label-blanc',
}

function Recenter({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap()
  const [lat, lng] = center
  useEffect(() => {
    map.setView([lat, lng], zoom, { animate: false })
  }, [map, lat, lng, zoom])
  return null
}

function ClickHandler({ onClick }: { onClick: (position: LatLng) => void }) {
  useMapEvents({ click: (e) => onClick([e.latlng.lat, e.latlng.lng]) })
  return null
}

function LocateButton({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap()
  return (
    <button
      type="button"
      aria-label="Recentrer"
      onClick={() => map.flyTo(center, zoom, { duration: 0.6 })}
      className="absolute bottom-3 right-3 z-[400] flex h-11 w-11 items-center justify-center rounded-full bg-white text-encre shadow-flottante"
    >
      <Crosshair size={22} />
    </button>
  )
}

export function MapView({
  center,
  zoom = 14,
  markers = [],
  route,
  routeDone,
  className,
  interactive = true,
  dark,
  lowData,
  showLocate = true,
  followCenter,
  onMapClick,
}: {
  center: LatLng
  zoom?: number
  markers?: MapMarker[]
  /** Tracé restant (pointillés verts) */
  route?: LatLng[]
  /** Tracé déjà parcouru (trait plein discret) */
  routeDone?: LatLng[]
  className?: string
  interactive?: boolean
  dark?: boolean
  /** Mode bas débit : carte remplacée par un encart léger */
  lowData?: boolean
  showLocate?: boolean
  /** Recentre la carte quand `center` change */
  followCenter?: boolean
  onMapClick?: (position: LatLng) => void
}) {
  if (lowData) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-fond-carte text-center text-sm text-gris-texte',
          className,
        )}
      >
        <MapPinOff size={28} className="text-vert-fondation" />
        <span className="font-bold text-encre">Carte allégée</span>
        <span className="max-w-60">Mode bas débit actif : la carte n'est pas chargée pour économiser vos données.</span>
      </div>
    )
  }

  return (
    <div className={cn('relative isolate', className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        attributionControl
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        className="h-full w-full"
      >
        <TileLayer key={dark ? 'nuit' : 'jour'} url={TILE_URL} attribution={ATTRIBUTION} maxZoom={19} className={dark ? 'at-tiles-nuit' : 'at-tiles'} />
        {routeDone && routeDone.length > 1 && (
          <Polyline positions={routeDone} pathOptions={{ color: '#005F3F', weight: 5, opacity: 0.25 }} />
        )}
        {route && route.length > 1 && (
          <Polyline positions={route} pathOptions={{ color: '#005F3F', weight: 5, dashArray: '10 10', lineCap: 'round' }} />
        )}
        {markers.map((m) => (
          <Marker key={m.id} position={m.position} icon={markerIcon(m.kind)}>
            {m.label && (
              <Tooltip
                permanent={m.permanentLabel ?? true}
                direction="top"
                offset={[0, m.kind === 'lieu' ? -10 : -24]}
                className={labelClass[m.labelTone ?? 'sombre']}
              >
                {m.label}
              </Tooltip>
            )}
          </Marker>
        ))}
        {onMapClick && <ClickHandler onClick={onMapClick} />}
        {followCenter && <Recenter center={center} zoom={zoom} />}
        {showLocate && interactive && <LocateButton center={center} zoom={zoom} />}
      </MapContainer>
    </div>
  )
}
