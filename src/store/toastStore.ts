import { create } from 'zustand'
import { uid } from '../lib/format'

export type ToastTone = 'info' | 'succes' | 'alerte' | 'danger'

export interface Toast {
  id: string
  message: string
  tone: ToastTone
}

interface ToastState {
  toasts: Toast[]
  push: (message: string, tone?: ToastTone, durationMs?: number) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (message, tone = 'info', durationMs = 3200) => {
    const id = uid('T-')
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }].slice(-3) }))
    window.setTimeout(() => get().dismiss(id), durationMs)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Raccourci utilisable hors composant. */
export const toast = (message: string, tone?: ToastTone, durationMs?: number) =>
  useToastStore.getState().push(message, tone, durationMs)
