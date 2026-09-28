import { AlertTriangle, CheckCircle2, Info, Siren } from 'lucide-react'
import { cn } from '../lib/format'
import { useToastStore, type ToastTone } from '../store/toastStore'

const styles: Record<ToastTone, string> = {
  info: 'bg-encre text-white',
  succes: 'bg-vert-fondation text-white',
  alerte: 'bg-jaune-soleil text-encre',
  danger: 'bg-rouge-sos text-white',
}

const icons = { info: Info, succes: CheckCircle2, alerte: AlertTriangle, danger: Siren }

/** Pile de toasts. `fixed` pour la centrale / pages web, `absolute` dans le téléphone. */
export function Toaster({ fixed }: { fixed?: boolean }) {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  return (
    <div
      aria-live="polite"
      className={cn(
        'pointer-events-none inset-x-0 z-[60] flex flex-col items-center gap-2 px-4',
        fixed ? 'fixed top-4' : 'absolute top-3',
      )}
    >
      {toasts.map((t) => {
        const Icon = icons[t.tone]
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            className={cn(
              'anim-toast pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-[14px] px-4 py-3 text-left text-sm font-semibold shadow-flottante',
              styles[t.tone],
            )}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <span>{t.message}</span>
          </button>
        )
      })}
    </div>
  )
}
