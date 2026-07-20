import type { ClipboardEntries, ClipboardEntry, ClipboardFormat } from './types'

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
})

const yearFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
})

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) {
    return 'th'
  }

  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export const createClipboardEntry = (
  text: string,
  format: ClipboardFormat,
): ClipboardEntry => ({
  id: crypto.randomUUID(),
  text: text.trimEnd(),
  createdAt: Date.now(),
  format,
})

export const getSortedEntries = (
  entries: ClipboardEntries,
): ClipboardEntry[] =>
  Object.values(entries).sort((first, second) => second.createdAt - first.createdAt)

export const getFirstLinePreview = (text: string): string => {
  const [firstLine] = text.trim().split(/\r?\n/)
  return firstLine || 'Untitled clipping'
}

export const formatEntryDateTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const day = date.getDate()
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${monthFormatter.format(
    date,
  )}, ${yearFormatter.format(date)}`

  return `${formattedDate} | ${timeFormatter.format(date)}`
}
