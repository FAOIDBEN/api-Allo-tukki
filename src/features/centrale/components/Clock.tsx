import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Africa/Dakar',
})

/** Heure de Tivaouane (GMT), mise à jour chaque seconde. */
export function useDakarClock(): string {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return formatter.format(now)
}
