import type { ClipboardEntries, ClipboardEntry, ClipboardFormat } from '../types'
import { createClipboardEntry } from '../utils'

const storageKey = 'clipboard-entries'
const defaultFormat: ClipboardFormat = 'plain-text'
const formats: ClipboardFormat[] = ['plain-text', 'markdown', 'code']

const simulateLatency = async () => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 120)
  })
}

const isClipboardEntry = (value: unknown): value is ClipboardEntry => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as ClipboardEntry

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.text === 'string' &&
    typeof candidate.createdAt === 'number'
  )
}

const getFormat = (value: unknown): ClipboardFormat =>
  formats.includes(value as ClipboardFormat)
    ? (value as ClipboardFormat)
    : defaultFormat

const readEntries = (): ClipboardEntries => {
  const rawEntries = window.localStorage.getItem(storageKey)

  if (!rawEntries) {
    return {}
  }

  try {
    const parsedEntries = JSON.parse(rawEntries) as Record<string, unknown>

    return Object.values(parsedEntries).reduce<ClipboardEntries>(
      (entries, entry) => {
        if (isClipboardEntry(entry)) {
          entries[entry.id] = {
            ...entry,
            format: getFormat(entry.format),
          }
        }

        return entries
      },
      {},
    )
  } catch {
    return {}
  }
}

const writeEntries = (entries: ClipboardEntries) => {
  window.localStorage.setItem(storageKey, JSON.stringify(entries))
}

export const clipboardService = {
  async getAll(): Promise<ClipboardEntries> {
    await simulateLatency()
    return readEntries()
  },

  async save(text: string, format: ClipboardFormat): Promise<ClipboardEntry> {
    await simulateLatency()
    const entry = createClipboardEntry(text, format)
    const entries = readEntries()

    writeEntries({
      ...entries,
      [entry.id]: entry,
    })

    return entry
  },

  async delete(id: string): Promise<void> {
    await simulateLatency()
    const entries = readEntries()

    delete entries[id]
    writeEntries(entries)
  },

  async copy(text: string): Promise<void> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard access is not available in this browser.')
    }

    await navigator.clipboard.writeText(text)
  },
}
