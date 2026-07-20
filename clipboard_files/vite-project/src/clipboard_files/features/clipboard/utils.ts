import type { ClipboardEntries, ClipboardEntry } from './types'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
})

export const createClipboardEntry = (text: string): ClipboardEntry => ({
  id: crypto.randomUUID(),
  text: text.trimEnd(),
  createdAt: Date.now(),
})

export const getSortedEntries = (
  entries: ClipboardEntries,
): ClipboardEntry[] =>
  Object.values(entries).sort((first, second) => second.createdAt - first.createdAt)

export const getFirstLinePreview = (text: string): string => {
  const [firstLine] = text.trim().split(/\r?\n/)
  return firstLine || 'Untitled clipping'
}

export const formatEntryDate = (timestamp: number): string =>
  dateFormatter.format(timestamp)

export const formatEntryTime = (timestamp: number): string =>
  timeFormatter.format(timestamp)
