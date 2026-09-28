import { Outlet } from 'react-router-dom'
import { MobileAppLayout } from '../../components/MobileAppLayout'

export function ClientLayout() {
  return (
    <MobileAppLayout app="client">
      <Outlet />
    </MobileAppLayout>
  )
}
