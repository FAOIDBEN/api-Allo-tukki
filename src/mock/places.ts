export type LatLng = [number, number]

export type PlaceCategory = 'culte' | 'marche' | 'sante' | 'gare' | 'ecole' | 'maison'

export interface Place {
  id: string
  name: string
  /** Sous-titre court (tuiles « Lieux fréquents » de C7) */
  short: string
  /** Repère détaillé (listes C8) */
  detail: string
  /** Repère affiché dans le récapitulatif (C10, C11) */
  landmark: string
  category: PlaceCategory
  position: LatLng
  /** Durée et prix indicatifs affichés en C8 */
  minutes: number
  price: number
  favorite?: boolean
}

/** Centre de Tivaouane (carte par défaut). */
export const TIVAOUANE_CENTER: LatLng = [14.95, -16.8167]

/** Repères de Tivaouane repris des maquettes (C7, C8, C10, C11). */
export const PLACES: Place[] = [
  {
    id: 'marche-central',
    name: 'Marché Central',
    short: 'Devant Pharmacie',
    detail: 'Devant Pharmacie Serigne Fallou',
    landmark: 'Devant Pharmacie Serigne Fallou',
    category: 'marche',
    position: [14.9512, -16.8172],
    minutes: 3,
    price: 400,
  },
  {
    id: 'grande-mosquee',
    name: 'Grande Mosquée',
    short: 'Zawiya Sy',
    detail: 'Esplanade Ouest • Entrée Zawiya',
    landmark: 'Esplanade Ouest • Entrée Zawiya',
    category: 'culte',
    position: [14.9538, -16.8215],
    minutes: 4,
    price: 500,
    favorite: true,
  },
  {
    id: 'hopital',
    name: 'Hôpital Matlaboul Fawzayni',
    short: 'Urgences & Soins',
    detail: 'Urgences • Porte Principale',
    landmark: 'Porte Principale Urgences',
    category: 'sante',
    position: [14.9418, -16.8062],
    minutes: 6,
    price: 600,
  },
  {
    id: 'gare-routiere',
    name: 'Gare Routière de Tivaouane',
    short: 'Vers Thiès / Dakar',
    detail: 'Sortie vers Thiès / Dakar',
    landmark: 'Sortie vers Thiès / Dakar',
    category: 'gare',
    position: [14.9468, -16.8238],
    minutes: 5,
    price: 500,
  },
  {
    id: 'boulangerie',
    name: 'Boulangerie du Marché',
    short: 'Centre',
    detail: 'En face magasin El Hadj • Centre',
    landmark: 'En face magasin El Hadj',
    category: 'marche',
    position: [14.9506, -16.8158],
    minutes: 2,
    price: 400,
  },
  {
    id: 'lycee',
    name: 'Lycée Ababacar Sy',
    short: 'Route Kaolack',
    detail: 'Grande Grille Verte • Route Kaolack',
    landmark: 'Grande Grille Verte',
    category: 'ecole',
    position: [14.9445, -16.8205],
    minutes: 7,
    price: 600,
  },
  {
    id: 'zawiya-babacar',
    name: 'Zawiya Serigne Babacar Sy',
    short: 'Quartier Ndoutte',
    detail: 'Quartier Ndoutte • Zone sécurisée',
    landmark: 'Quartier Ndoutte • Zone sécurisée',
    category: 'culte',
    position: [14.9552, -16.8188],
    minutes: 4,
    price: 500,
  },
  {
    id: 'maison',
    name: 'Maison',
    short: 'Quartier Kouly',
    detail: 'Quartier Kouly',
    landmark: 'Quartier Kouly',
    category: 'maison',
    position: [14.958, -16.8128],
    minutes: 5,
    price: 500,
    favorite: true,
  },
]

export function placeById(id: string): Place {
  const place = PLACES.find((p) => p.id === id)
  if (!place) throw new Error(`Lieu inconnu : ${id}`)
  return place
}

/** Tuiles « Lieux fréquents à Tivaouane » (C7). */
export const FREQUENT_PLACE_IDS = ['grande-mosquee', 'hopital', 'gare-routiere', 'maison']

/** Liste « Récents & Favoris » (C8). */
export const RECENT_PLACE_IDS = ['grande-mosquee', 'hopital', 'gare-routiere', 'boulangerie', 'lycee']

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
