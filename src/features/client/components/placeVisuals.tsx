import { Bus, GraduationCap, Home, Hospital, Landmark, Store } from 'lucide-react'
import type { PlaceCategory } from '../../../mock/places'

/** Icône et teinte de tuile par catégorie de lieu (C7, C8). */
const PLACE_VISUALS: Record<PlaceCategory, { icon: typeof Landmark; tile: string }> = {
  culte: { icon: Landmark, tile: 'bg-[#dfe6f0] text-vert-fondation' },
  sante: { icon: Hospital, tile: 'bg-rouge-pale text-rouge-sos' },
  gare: { icon: Bus, tile: 'bg-jaune-pale text-brun-ocre' },
  marche: { icon: Store, tile: 'bg-fond-carte text-encre-douce' },
  ecole: { icon: GraduationCap, tile: 'bg-fond-carte text-vert-fondation' },
  maison: { icon: Home, tile: 'bg-fond-carte text-encre-douce' },
}

export function PlaceIcon({ category, size = 44 }: { category: PlaceCategory; size?: number }) {
  const { icon: Icon, tile } = PLACE_VISUALS[category]
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[12px] ${tile}`} style={{ width: size, height: size }}>
      <Icon size={size * 0.48} />
    </span>
  )
}
