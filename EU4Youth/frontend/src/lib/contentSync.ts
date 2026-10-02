const CHANNEL = 'eu4y-content-sync'

export type ContentSyncMessage = {
  source: 'dashboard' | 'live'
  page?: string
}

export function notifyContentSaved(page?: string) {
  try {
    const ch = new BroadcastChannel(CHANNEL)
    ch.postMessage({ source: 'dashboard', page } satisfies ContentSyncMessage)
    ch.close()
  } catch {
    /* ignore */
  }
}

export function onContentUpdated(handler: (msg: ContentSyncMessage) => void) {
  try {
    const ch = new BroadcastChannel(CHANNEL)
    ch.onmessage = (event) => handler(event.data)
    return () => ch.close()
  } catch {
    return () => undefined
  }
}
