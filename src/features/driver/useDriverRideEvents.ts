import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { path } from '../../app/screens'
import { useDemoStore, simMs } from '../../store/demoStore'
import { useOnChange } from '../../store/simulation'
import { isRemoteClientPresent } from '../../store/sync'
import { toast } from '../../store/toastStore'

/** Délai avant la réservation fictive automatique, une fois en ligne. */
export const AUTO_BOOKING_MS = 5000

/**
 * Réactions de l'app chauffeur :
 * - une nouvelle réservation (client réel ou simulée) ouvre D8 ;
 * - seul sur l'appareil, une réservation fictive arrive ~5 s après être passé en ligne ;
 * - les messages rapides du voyageur s'affichent en toast ;
 * - l'annulation par le voyageur ramène à l'accueil.
 */
export function useDriverRideEvents(): void {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const ride = useDemoStore((s) => s.ride)
  const online = useDemoStore((s) => s.driver.online)
  const createRide = useDemoStore((s) => s.createRide)
  const onAgrement = ['D1', 'D2', 'D3', 'D4', 'D5'].some((c) => pathname === path(c))

  // Nouvelle réservation en attente → écran D8
  useOnChange(ride?.status === 'recherche' ? ride.id : null, (id) => {
    if (id && online && !onAgrement && pathname !== path('D8')) navigate(path('D8'))
  })

  // Voyageur qui annule
  useOnChange(ride?.status, (status, previous) => {
    if (status === 'annulee' || (!status && previous && ['acceptee', 'chauffeur_arrive'].includes(previous))) {
      toast('Le voyageur a annulé la course.', 'alerte')
      if ([path('D8'), path('D10')].includes(pathname)) navigate(path('D7'))
    }
  })

  const lastMessage = ride?.messages[ride.messages.length - 1]
  useOnChange(lastMessage?.id, () => {
    if (lastMessage?.from === 'client') toast(`${ride?.passenger.firstName} : « ${lastMessage.text} »`, 'info', 4500)
  })

  // Réservation fictive automatique quand le chauffeur est seul et en ligne sans course.
  const idle = online && (!ride || ['terminee', 'annulee', 'expiree'].includes(ride.status))
  useEffect(() => {
    if (!idle || onAgrement) return
    const id = window.setTimeout(() => {
      const current = useDemoStore.getState().ride
      if (isRemoteClientPresent()) return
      if (current && !['terminee', 'annulee', 'expiree'].includes(current.status)) return
      createRide({ source: 'demo' })
    }, simMs(AUTO_BOOKING_MS))
    return () => window.clearTimeout(id)
  }, [idle, onAgrement, createRide])
}
