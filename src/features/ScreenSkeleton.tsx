import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Hammer } from 'lucide-react'
import { SCREENS, type ScreenDef } from '../app/screens'
import { AppHeader, BottomNav, Button, Card, ProfileButton, Screen } from '../design'
import { clientNav, driverNav } from './navItems'

const WITH_NAV = new Set(['C7', 'C17', 'C19', 'D7', 'D14', 'D15'])

/** Écran provisoire, titré par son code, en attendant son implémentation. */
export function ScreenSkeleton({ screen }: { screen: ScreenDef }) {
  const navigate = useNavigate()
  const siblings = SCREENS.filter((s) => s.app === screen.app)
  const index = siblings.findIndex((s) => s.code === screen.code)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const nav = WITH_NAV.has(screen.code) ? (
    <BottomNav items={screen.app === 'client' ? clientNav : driverNav} />
  ) : undefined

  return (
    <Screen
      header={
        <AppHeader
          back={index > 0}
          eyebrow={screen.app === 'chauffeur' ? 'Chauffeur Allo Tukki' : undefined}
          title={screen.name}
          right={<ProfileButton />}
        />
      }
      nav={nav}
    >
      <div className="p-4">
        <Card className="text-center">
          <div className="mx-auto inline-block rounded-[12px] bg-jaune-soleil px-4 py-1.5 text-4xl font-extrabold">
            {screen.code}
          </div>
          <h1 className="mt-3 text-xl font-extrabold">{screen.name}</h1>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-gris-texte">
            <Hammer size={15} /> Écran en cours de construction
          </p>
        </Card>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="md"
            disabled={!prev}
            iconLeft={<ArrowLeft size={18} />}
            onClick={() => prev && navigate(prev.path)}
          >
            {prev ? prev.code : '—'}
          </Button>
          <Button size="md" disabled={!next} iconRight={<ArrowRight size={18} />} onClick={() => next && navigate(next.path)}>
            {next ? next.code : '—'}
          </Button>
        </div>
      </div>
    </Screen>
  )
}
