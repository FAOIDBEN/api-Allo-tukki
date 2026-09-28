import type { ComponentType } from 'react'
import { C1Lancement } from './screens/C1Lancement'
import { C2Decouverte } from './screens/C2Decouverte'
import { C3Telephone } from './screens/C3Telephone'
import { C4Verification } from './screens/C4Verification'
import { C5Consentement } from './screens/C5Consentement'
import { C6Prenom } from './screens/C6Prenom'
import { C7Accueil } from './screens/C7Accueil'
import { C8Depart } from './screens/C8Depart'
import { C10Recap } from './screens/C10Recap'
import { C11Recherche } from './screens/C11Recherche'
import { C13PriseEnCharge } from './screens/C13PriseEnCharge'
import { C15Arrivee } from './screens/C15Arrivee'
import { C16Evaluation } from './screens/C16Evaluation'

/** Écrans client implémentés, par code. Les autres affichent un squelette. */
export const clientScreens: Record<string, ComponentType> = {
  C1: C1Lancement,
  C2: C2Decouverte,
  C3: C3Telephone,
  C4: C4Verification,
  C5: C5Consentement,
  C6: C6Prenom,
  C7: C7Accueil,
  C8: C8Depart,
  C10: C10Recap,
  C11: C11Recherche,
  C13: C13PriseEnCharge,
  C15: C15Arrivee,
  C16: C16Evaluation,
}
