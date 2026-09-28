import type { AppKind } from '../app/screens'
import { STORAGE_KEY, pickData, useDemoStore } from './demoStore'
import type { DemoData } from './types'

/**
 * Synchronisation de la démo entre onglets / iframes du mode présentation.
 * - BroadcastChannel('allo-tukki-demo') : diffusion de l'état complet à chaque changement local.
 * - Repli : événement `storage` (l'état est persisté en localStorage) → réhydratation.
 * - Présence : chaque app ouverte signale sa présence, pour savoir si un « vrai »
 *   chauffeur est là (sinon le client simule un chauffeur fictif).
 */

type Message =
  | { type: 'state'; data: DemoData }
  | { type: 'presence'; app: AppKind; at: number; online?: boolean }

const CHANNEL_NAME = 'allo-tukki-demo'
const PRESENCE_TTL = 5000

let channel: BroadcastChannel | null = null
let applyingRemote = false
let started = false
const presence: Partial<Record<AppKind, { at: number; online?: boolean }>> = {}

export function initSync(): void {
  if (started) return
  started = true

  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (event: MessageEvent<Message>) => {
      const msg = event.data
      if (msg.type === 'state') {
        applyingRemote = true
        useDemoStore.setState(msg.data)
        applyingRemote = false
      } else if (msg.type === 'presence') {
        presence[msg.app] = { at: msg.at, online: msg.online }
      }
    }
  } else {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) void useDemoStore.persist.rehydrate()
    })
  }

  useDemoStore.subscribe((state) => {
    if (applyingRemote || !channel) return
    channel.postMessage({ type: 'state', data: pickData(state) } satisfies Message)
  })
}

/** Signale qu'une app est ouverte dans cet onglet (appelé périodiquement par les layouts). */
export function announcePresence(app: AppKind, online?: boolean): void {
  channel?.postMessage({ type: 'presence', app, at: Date.now(), online } satisfies Message)
}

/** Une app chauffeur en ligne est-elle ouverte ailleurs (autre onglet / autre téléphone) ? */
export function isRemoteDriverOnline(): boolean {
  const p = presence.chauffeur
  return !!p && !!p.online && Date.now() - p.at < PRESENCE_TTL
}

export function isEmbedded(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}
