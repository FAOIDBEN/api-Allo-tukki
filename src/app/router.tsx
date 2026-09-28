import { Navigate, createBrowserRouter } from 'react-router-dom'
import { SCREENS, path, type ScreenDef } from './screens'
import { ClientLayout } from '../features/client/ClientLayout'
import { clientScreens } from '../features/client'
import { DriverLayout } from '../features/driver/DriverLayout'
import { driverScreens } from '../features/driver'
import { CentraleLayout } from '../features/centrale/CentraleLayout'
import { CentraleSkeleton } from '../features/centrale/CentraleSkeleton'
import { centraleScreens } from '../features/centrale'
import { ScreenSkeleton } from '../features/ScreenSkeleton'
import { HomePage } from '../features/home/HomePage'
import { PresentationPage } from '../features/home/PresentationPage'
import type { ComponentType } from 'react'

function routesFor(app: ScreenDef['app'], implemented: Record<string, ComponentType>) {
  return SCREENS.filter((s) => s.app === app).map((screen) => {
    const Component = implemented[screen.code]
    const slug = screen.path.split('/').pop()!
    return {
      path: slug,
      element: Component ? (
        <Component />
      ) : app === 'centrale' ? (
        <CentraleSkeleton screen={screen} />
      ) : (
        <ScreenSkeleton screen={screen} />
      ),
    }
  })
}

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/presentation', element: <PresentationPage /> },
  {
    path: '/client',
    element: <ClientLayout />,
    children: [{ index: true, element: <Navigate to={path('C1')} replace /> }, ...routesFor('client', clientScreens)],
  },
  {
    path: '/chauffeur',
    element: <DriverLayout />,
    children: [
      { index: true, element: <Navigate to={path('D7')} replace /> },
      ...routesFor('chauffeur', driverScreens),
    ],
  },
  {
    path: '/centrale',
    element: <CentraleLayout />,
    children: [
      { index: true, element: <Navigate to={path('W1')} replace /> },
      ...routesFor('centrale', centraleScreens),
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
