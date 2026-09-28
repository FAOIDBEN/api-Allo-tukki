import type { ComponentType } from 'react'
import { D7Accueil } from './screens/D7Accueil'
import { D8Reservation } from './screens/D8Reservation'
import { D9ModeNuit } from './screens/D9ModeNuit'
import { D10PriseEnCharge } from './screens/D10PriseEnCharge'
import { D11Voyage } from './screens/D11Voyage'
import { D12Encaissement } from './screens/D12Encaissement'
import { D13Evaluation } from './screens/D13Evaluation'

/** Écrans chauffeur implémentés, par code. Les autres affichent un squelette. */
export const driverScreens: Record<string, ComponentType> = {
  D7: D7Accueil,
  D8: D8Reservation,
  D9: D9ModeNuit,
  D10: D10PriseEnCharge,
  D11: D11Voyage,
  D12: D12Encaissement,
  D13: D13Evaluation,
}
