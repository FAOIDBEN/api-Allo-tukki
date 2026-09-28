import { useLocation, useNavigate } from 'react-router-dom'
import { path } from '../../app/screens'
import { MOUSSA } from '../../mock/people'
import { placeById } from '../../mock/places'
import { useDemoStore } from '../../store/demoStore'
import { useAutoDriver, useOnChange } from '../../store/simulation'
import { toast } from '../../store/toastStore'

/**
 * Réactions de l'app client aux évolutions de la réservation partagée
 * (qu'elles viennent du chauffeur fictif ou d'un vrai téléphone chauffeur).
 */
export function useClientRideEvents(): void {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const ride = useDemoStore((s) => s.ride)
  useAutoDriver()

  useOnChange(ride?.status, (status) => {
    if (!ride) return
    if (status === 'acceptee') {
      toast(`${MOUSSA.firstName} a accepté votre course !`, 'succes')
      if (pathname === path('C11')) navigate(path('C13'))
    }
    if (status === 'expiree') toast('Le chauffeur n’a pas pu accepter. Recherche d’un autre chauffeur…', 'alerte')
    if (status === 'chauffeur_arrive') toast('Votre chauffeur est arrivé 🚗', 'succes', 4500)
    if (status === 'en_route') toast(`Bon voyage ! En route vers ${placeById(ride.toId).name}.`, 'info')
    if (status === 'arrivee' && pathname === path('C13')) navigate(path('C15'))
  })

  const lastMessage = ride?.messages[ride.messages.length - 1]
  useOnChange(lastMessage?.id, () => {
    if (lastMessage?.from === 'chauffeur') toast(`${MOUSSA.firstName} : « ${lastMessage.text} »`, 'info', 4500)
  })
}
