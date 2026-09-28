import { useEffect } from 'react'
import { Delete } from 'lucide-react'
import { cn } from '../../../lib/format'

const LETTERS: Record<string, string> = {
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
  '0': '+',
}

/**
 * Pavé numérique large (C3, C4). Accepte aussi le clavier physique (démo sur ordinateur).
 * `extraKey` : touche en bas à gauche (ex. « 77 / 78 »).
 */
export function Keypad({
  onDigit,
  onDelete,
  extraKey,
  variant = 'lavande',
  withLetters,
}: {
  onDigit: (digit: string) => void
  onDelete: () => void
  extraKey?: { label: string; onPress: () => void }
  variant?: 'lavande' | 'blanc'
  withLetters?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (/^\d$/.test(e.key)) onDigit(e.key)
      else if (e.key === 'Backspace') onDelete()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDigit, onDelete])

  const keyClass = cn(
    'flex h-[50px] flex-col items-center justify-center rounded-[12px] text-[22px] font-semibold leading-none text-encre active:scale-[0.97] transition-transform',
    variant === 'blanc' ? 'bg-white shadow-[0_2px_6px_-3px_rgb(20_27_43/0.18)]' : 'bg-fond-clair',
  )

  return (
    <div className={cn('grid grid-cols-3 gap-2', variant === 'lavande' && 'rounded-carte bg-white p-2')}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} type="button" className={keyClass} onClick={() => onDigit(d)}>
          {d}
          {withLetters && LETTERS[d] && <span className="mt-1 text-[9px] font-medium tracking-wide">{LETTERS[d]}</span>}
        </button>
      ))}
      {extraKey ? (
        <button
          type="button"
          className={cn(keyClass, 'bg-fond-carte text-[15px] font-bold text-vert-fondation')}
          onClick={extraKey.onPress}
        >
          {extraKey.label}
        </button>
      ) : (
        <span />
      )}
      <button type="button" className={keyClass} onClick={() => onDigit('0')}>
        0{withLetters && <span className="mt-1 text-[9px] font-medium">+</span>}
      </button>
      <button type="button" aria-label="Effacer" className={cn(keyClass, 'bg-fond-carte')} onClick={onDelete}>
        <Delete size={22} />
      </button>
    </div>
  )
}
