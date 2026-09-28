export type AppKind = 'client' | 'chauffeur' | 'centrale'

export interface ScreenDef {
  code: string
  name: string
  app: AppKind
  /** Chemin absolu de la route */
  path: string
}

const client = (code: string, slug: string, name: string): ScreenDef => ({
  code,
  name,
  app: 'client',
  path: `/client/${slug}`,
})
const chauffeur = (code: string, slug: string, name: string): ScreenDef => ({
  code,
  name,
  app: 'chauffeur',
  path: `/chauffeur/${slug}`,
})
const centrale = (code: string, slug: string, name: string): ScreenDef => ({
  code,
  name,
  app: 'centrale',
  path: `/centrale/${slug}`,
})

/** Les 36 écrans des maquettes (C9, C12, C14 et D6 n'existent pas). */
export const SCREENS: ScreenDef[] = [
  client('C1', 'lancement', 'Écran de lancement'),
  client('C2', 'decouverte', 'Découverte en 3 étapes'),
  client('C3', 'telephone', 'Numéro de téléphone'),
  client('C4', 'verification', 'Code de vérification'),
  client('C5', 'consentement', 'Consentement & données'),
  client('C6', 'prenom', 'Prénom du voyageur'),
  client('C7', 'accueil', 'Accueil voyageur'),
  client('C8', 'depart', 'Recherche du point de départ'),
  client('C10', 'recap', 'Récapitulatif de la réservation'),
  client('C11', 'recherche', "Recherche d'une place"),
  client('C13', 'prise-en-charge', 'Prise en charge'),
  client('C15', 'arrivee', 'Arrivée & paiement en espèces'),
  client('C16', 'evaluation', 'Évaluation & reçu'),
  client('C17', 'historique', 'Historique des voyages'),
  client('C18', 'sos', 'Assistance SOS & sécurité'),
  client('C19', 'profil', 'Profil & paramètres'),
  client('C20', 'hors-ligne', 'Mode hors-ligne & réservation SMS'),

  chauffeur('D1', 'devenir-chauffeur', 'Devenir chauffeur'),
  chauffeur('D2', 'identite', 'Identité & gare de départ'),
  chauffeur('D3', 'voiture', 'Enregistrement de la voiture'),
  chauffeur('D4', 'pieces', 'Pièces justificatives'),
  chauffeur('D5', 'dossier', "Suivi du dossier d'agrément"),
  chauffeur('D7', 'accueil', 'Accueil chauffeur en ligne'),
  chauffeur('D8', 'reservation', 'Nouvelle réservation'),
  chauffeur('D9', 'mode-nuit', 'Mode nuit & économie batterie'),
  chauffeur('D10', 'prise-en-charge', 'Prise en charge des voyageurs'),
  chauffeur('D11', 'voyage', 'Voyage en cours'),
  chauffeur('D12', 'encaissement', 'Encaissement en espèces'),
  chauffeur('D13', 'evaluation', 'Évaluation du voyageur'),
  chauffeur('D14', 'gains', 'Gains & portefeuille'),
  chauffeur('D15', 'historique', 'Historique des voyages'),

  centrale('W1', 'vue-ensemble', "Vue d'ensemble"),
  centrale('W2', 'dispatch', 'Dispatch & réservations SMS / vocales'),
  centrale('W3', 'securite', 'Sécurité, alertes SOS & médiation'),
  centrale('W4', 'agrements', 'Agréments chauffeurs'),
  centrale('W5', 'finances', 'Finances & caisse solidaire'),
]

export const APP_LABELS: Record<AppKind, string> = {
  client: 'Application Client',
  chauffeur: 'Application Chauffeur',
  centrale: 'Centrale de régulation',
}

export function screenByCode(code: string): ScreenDef {
  const screen = SCREENS.find((s) => s.code === code)
  if (!screen) throw new Error(`Écran inconnu : ${code}`)
  return screen
}

export function screenByPath(pathname: string): ScreenDef | undefined {
  const clean = pathname.replace(/\/+$/, '')
  return SCREENS.find((s) => s.path === clean)
}

/** Raccourci pour naviguer : path('C7') → "/client/accueil" */
export function path(code: string): string {
  return screenByCode(code).path
}
