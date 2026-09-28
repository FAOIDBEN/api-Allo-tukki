export interface Passenger {
  firstName: string
  lastName: string
  phone: string
  avatar?: string
}

/** Voyageuse des maquettes. */
export const AMINATA: Passenger = {
  firstName: 'Aminata',
  lastName: 'Fall',
  phone: '+221 77 452 18 90',
  avatar: '/images/voyageuse-aminata.jpg',
}

/** Autres voyageurs pour les réservations simulées. */
export const OTHER_PASSENGERS: Passenger[] = [
  { firstName: 'Fatou', lastName: 'Ndiaye', phone: '+221 76 214 55 08' },
  { firstName: 'Ousmane', lastName: 'Sarr', phone: '+221 78 330 91 12' },
  { firstName: 'Awa', lastName: 'Diouf', phone: '+221 77 601 42 73' },
  { firstName: 'Mamadou', lastName: 'Gueye', phone: '+221 70 845 20 66' },
  { firstName: 'Khady', lastName: 'Sy', phone: '+221 77 918 03 54' },
]

export interface Car {
  model: string
  color: string
  colorHex: string
  plate: string
  seats: number
}

export interface Driver {
  id: string
  firstName: string
  lastName: string
  phone: string
  avatar?: string
  rating: number
  trips: number
  station: string
  car: Car
}

/** Chauffeur des maquettes (C13, D7, D5). */
export const MOUSSA: Driver = {
  id: 'TK-4812',
  firstName: 'Moussa',
  lastName: 'Diop',
  phone: '+221 77 645 28 19',
  avatar: '/images/chauffeur-moussa.jpg',
  rating: 4.8,
  trips: 142,
  station: 'Gare Routière de Tivaouane',
  car: { model: 'Toyota Corolla', color: 'Rouge', colorHex: '#c62828', plate: 'TH-1234-A', seats: 4 },
}

export const OTHER_DRIVERS: Driver[] = [
  {
    id: 'TK-4813',
    firstName: 'Babacar',
    lastName: 'Sylla',
    phone: '+221 77 290 11 48',
    rating: 4.7,
    trips: 98,
    station: 'Gare Routière',
    car: { model: 'Hyundai', color: 'Bleue', colorHex: '#1d4ed8', plate: 'TH-2901-B', seats: 4 },
  },
  {
    id: 'TK-4814',
    firstName: 'Cheikh T.',
    lastName: 'Cissé',
    phone: '+221 76 551 72 30',
    rating: 4.9,
    trips: 211,
    station: 'Hôpital Mame Abdou',
    car: { model: 'Peugeot 505 break 7 places', color: 'Noire', colorHex: '#141b2b', plate: 'TH-6612-C', seats: 7 },
  },
  {
    id: 'TK-4815',
    firstName: 'Ibrahima',
    lastName: 'Faye',
    phone: '+221 78 402 66 19',
    rating: 4.6,
    trips: 57,
    station: 'Marché Central',
    car: { model: 'Peugeot 504 break 7 places', color: 'Blanche', colorHex: '#e5e7eb', plate: 'TH-3377-A', seats: 7 },
  },
  {
    id: 'TK-4816',
    firstName: 'Modou',
    lastName: 'Ba',
    phone: '+221 77 144 80 25',
    rating: 4.8,
    trips: 164,
    station: 'Grande Mosquée',
    car: { model: 'Toyota Hiace', color: 'Verte', colorHex: '#005f3f', plate: 'DK-5678-B', seats: 14 },
  },
]
