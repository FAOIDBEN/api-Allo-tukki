export type LatLng = [number, number]

export type PlaceCategory = 'culte' | 'marche' | 'sante' | 'gare' | 'ecole' | 'maison'

export interface Place {
  id: string
  name: string
  /** Précision affichée sous le nom (repère, quartier) */
  detail: string
  category: PlaceCategory
  position: LatLng
}

/** Centre de Tivaouane (carte par défaut). */
export const TIVAOUANE_CENTER: LatLng = [14.95, -16.8167]

/** Repères de Tivaouane repris des maquettes (C7, C8, C10). */
export const PLACES: Place[] = [
  {
    id: 'marche-central',
    name: 'Marché Central',
    detail: 'Devant Pharmacie Serigne Fallou',
    category: 'marche',
    position: [14.9512, -16.8172],
  },
  {
    id: 'grande-mosquee',
    name: 'Grande Mosquée',
    detail: 'Zawiya Sy',
    category: 'culte',
    position: [14.9531, -16.8203],
  },
  {
    id: 'hopital',
    name: 'Hôpital Matlaboul Fawzayni',
    detail: 'Urgences & Soins',
    category: 'sante',
    position: [14.9462, -16.8128],
  },
  {
    id: 'gare-routiere',
    name: 'Gare Routière',
    detail: 'Vers Thiès / Dakar',
    category: 'gare',
    position: [14.9481, -16.8104],
  },
  {
    id: 'maison',
    name: 'Maison',
    detail: 'Quartier Kouly',
    category: 'maison',
    position: [14.9556, -16.8141],
  },
]

export function placeById(id: string): Place {
  const place = PLACES.find((p) => p.id === id)
  if (!place) throw new Error(`Lieu inconnu : ${id}`)
  return place
}

export interface City {
  id: string
  name: string
  position: LatLng
}

/** Villes des liaisons interrégionales. */
export const CITIES: City[] = [
  { id: 'tivaouane', name: 'Tivaouane', position: [14.95, -16.8167] },
  { id: 'thies', name: 'Thiès', position: [14.791, -16.9256] },
  { id: 'dakar', name: 'Dakar', position: [14.7167, -17.4677] },
  { id: 'touba', name: 'Touba', position: [14.85, -15.8833] },
  { id: 'kaolack', name: 'Kaolack', position: [14.151, -16.0726] },
  { id: 'saint-louis', name: 'Saint-Louis', position: [16.0179, -16.4896] },
  { id: 'louga', name: 'Louga', position: [15.6144, -16.2244] },
  { id: 'mbour', name: 'Mbour', position: [14.42, -16.964] },
]
