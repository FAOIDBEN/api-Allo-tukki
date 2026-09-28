import { useEffect, useState } from 'react'
import { Pause, Volume2 } from 'lucide-react'
import { cn } from '../../../lib/format'

/**
 * Faux lecteur audio (aucun son) : bouton lecture + forme d'onde animée.
 * Simule un message vocal en wolof d'environ `durationSec` secondes.
 */
export function AudioPlayer({
  title,
  quote,
  durationSec = 8,
  className,
}: {
  title: string
  quote: string
  durationSec?: number
  className?: string
}) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setElapsed((e) => {
        if (e + 0.25 >= durationSec) {
          setPlaying(false)
          return 0
        }
        return e + 0.25
      })
    }, 250)
    return () => window.clearInterval(id)
  }, [playing, durationSec])

  const bars = [5, 9, 14, 8, 16, 11, 6, 13, 17, 9, 12, 7, 15, 10, 6, 12, 8, 14]

  return (
    <div className={cn('flex items-center gap-3 rounded-carte bg-surface p-3 shadow-douce', className)}>
      <button
        type="button"
        aria-label={playing ? 'Mettre en pause' : 'Écouter le message vocal'}
        onClick={() => setPlaying((p) => !p)}
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors',
          playing ? 'bg-vert-fondation text-white' : 'bg-vert-clair text-vert-fondation',
        )}
      >
        {playing ? <Pause size={22} /> : <Volume2 size={22} />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[18px] font-semibold leading-tight">{title}</div>
        {playing ? (
          <div className="mt-1.5 flex h-5 items-center gap-[3px]" aria-hidden>
            {bars.map((h, i) => {
              const passed = i / bars.length < elapsed / durationSec
              return (
                <span
                  key={i}
                  className={cn('w-[3px] animate-pulse rounded-full', passed ? 'bg-vert-fondation' : 'bg-vert-action/40')}
                  style={{ height: h, animationDelay: `${(i % 5) * 120}ms` }}
                />
              )
            })}
            <span className="ml-2 text-[12px] font-semibold tabular-nums text-encre-douce">
              0:{String(Math.floor(elapsed)).padStart(2, '0')}
            </span>
          </div>
        ) : (
          <p lang="wo" className="truncate text-[14px] text-encre-douce">
            {quote}
          </p>
        )}
      </div>
    </div>
  )
}
