import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/format'

/**
 * Modale et feuille du bas. Positionnées en `absolute` pour rester dans le cadre
 * du téléphone (le conteneur parent doit être `relative`), ou `fixed` pour la centrale.
 */
export function Modal({
  open,
  onClose,
  title,
  fixed,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: ReactNode
  fixed?: boolean
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div
      className={cn('inset-0 z-50 flex items-center justify-center bg-encre/50 p-5', fixed ? 'fixed' : 'absolute')}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="anim-pop max-h-full w-full max-w-md overflow-y-auto rounded-[20px] bg-surface p-5 shadow-flottante"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className="text-lg font-extrabold">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Fermer" className="rounded-full p-1 hover:bg-fond-clair">
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-encre/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="anim-sheet max-h-[85%] overflow-y-auto rounded-t-[24px] bg-surface px-5 pb-6 pt-3 shadow-flottante"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gris-bord" />
        {title && <h2 className="mb-3 text-lg font-extrabold">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
