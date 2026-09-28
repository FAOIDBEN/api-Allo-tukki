import { Hammer } from 'lucide-react'
import type { ScreenDef } from '../../app/screens'

export function CentraleSkeleton({ screen }: { screen: ScreenDef }) {
  return (
    <div className="rounded-carte bg-white p-8 shadow-douce">
      <span className="inline-block rounded-[10px] bg-jaune-soleil px-3 py-1 text-2xl font-extrabold">{screen.code}</span>
      <h1 className="mt-3 text-2xl font-extrabold">{screen.name}</h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-gris-texte">
        <Hammer size={15} /> Module en cours de construction
      </p>
    </div>
  )
}
