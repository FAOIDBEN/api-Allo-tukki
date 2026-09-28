import { useDemoStore } from '../store/demoStore'

export type Lang = 'fr' | 'wo'

/**
 * Dictionnaire de l'interface.
 * Règle : le wolof ne contient QUE des textes visibles dans les maquettes.
 * Toute clé absente de `wo` retombe sur le français (voir README).
 */
const fr = {
  'nav.accueil': 'Accueil',
  'nav.courses': 'Courses',
  'nav.profil': 'Profil',
  'lang.fr': 'Français',
  'lang.wo': 'Wolof (Wolofal)',
} as const

export type TKey = keyof typeof fr

const wo: Partial<Record<TKey, string>> = {}

const dictionaries: Record<Lang, Partial<Record<TKey, string>>> = { fr, wo }

export function translate(lang: Lang, key: TKey): string {
  return dictionaries[lang][key] ?? fr[key]
}

export function useT() {
  const lang = useDemoStore((s) => s.settings.lang)
  return (key: TKey) => translate(lang, key)
}
