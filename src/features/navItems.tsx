import { CarFront, History, ReceiptText, User, UserCircle2, Wallet } from 'lucide-react'
import { path } from '../app/screens'
import type { NavItem } from '../design'

export const clientNav: NavItem[] = [
  { to: path('C7'), label: 'Accueil', icon: <CarFront size={24} /> },
  { to: path('C17'), label: 'Courses', icon: <ReceiptText size={24} /> },
  { to: path('C19'), label: 'Profil', icon: <User size={24} /> },
]

export const driverNav: NavItem[] = [
  { to: path('D7'), label: 'Accueil', icon: <CarFront size={24} /> },
  { to: path('D14'), label: 'Gains', icon: <Wallet size={24} /> },
  { to: path('D15'), label: 'Historique', icon: <History size={24} /> },
  { to: path('D5'), label: 'Profil', icon: <UserCircle2 size={24} /> },
]
