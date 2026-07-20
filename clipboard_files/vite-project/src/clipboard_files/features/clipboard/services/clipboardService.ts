import type { ClipboardEntries, ClipboardEntry } from '../types'
import { createClipboardEntry } from '../utils'

const simulateLatency = async () => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 120)
  })
}

export const clipboardService = {
  async getAll(): Promise<ClipboardEntries> {
    await simulateLatency()
    return {}
  },

  async save(text: string): Promise<ClipboardEntry> {
    await simulateLatency()
    return createClipboardEntry(text)
  },

  async delete(id: string): Promise<void> {
    void id
    await simulateLatency()
  },

  async copy(text: string): Promise<void> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard access is not available in this browser.')
    }

    await navigator.clipboard.writeText(text)
  },
}
