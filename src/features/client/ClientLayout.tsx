import { Outlet } from 'react-router-dom'
import { MobileAppLayout } from '../../components/MobileAppLayout'
import { useClientRideEvents } from './useClientRideEvents'

export function ClientLayout() {
  useClientRideEvents()
  return (
    <MobileAppLayout app="client">
      <Outlet />
    </MobileAppLayout>
  )
}
