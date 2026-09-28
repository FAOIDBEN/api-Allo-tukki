import { Outlet } from 'react-router-dom'
import { MobileAppLayout } from '../../components/MobileAppLayout'
import { useDemoStore } from '../../store/demoStore'

export function DriverLayout() {
  const nightMode = useDemoStore((s) => s.settings.nightMode)
  const online = useDemoStore((s) => s.driver.online)
  return (
    <MobileAppLayout app="chauffeur" dark={nightMode} online={online}>
      <div className={nightMode ? 'theme-nuit h-full' : 'h-full'}>
        <Outlet />
      </div>
    </MobileAppLayout>
  )
}
