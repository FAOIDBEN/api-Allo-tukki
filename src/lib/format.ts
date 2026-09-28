/** Formate un montant : 85400 → "85 400" (espace insécable fine pour les milliers). */
export function formatAmount(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** 85400 → "85 400 FCFA" */
export function formatFCFA(value: number): string {
  return `${formatAmount(value)} FCFA`
}

/** Heure 24 h : "14:32" ou "14:32:08" */
export function formatTime(date: Date | number, withSeconds = false): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: false,
  }).format(date)
}

/** "jeudi 24 octobre" */
export function formatDate(date: Date | number, withWeekday = true): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: withWeekday ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function uid(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 8).toUpperCase()
}
