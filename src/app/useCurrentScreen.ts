import { useLocation } from 'react-router-dom'
import { screenByPath, type AppKind } from './screens'

export function useCurrentScreen() {
  const { pathname } = useLocation()
  return screenByPath(pathname)
}

export function useCurrentApp(): AppKind | undefined {
  const { pathname } = useLocation()
  if (pathname.startsWith('/client')) return 'client'
  if (pathname.startsWith('/chauffeur')) return 'chauffeur'
  if (pathname.startsWith('/centrale')) return 'centrale'
  return undefined
}
