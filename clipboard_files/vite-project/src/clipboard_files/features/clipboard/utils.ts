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
  title: string,
  text: string,
  format: ClipboardFormat,
  ownerEmail: string,
  passcodeHash: string,
): ClipboardEntry => ({
  id: crypto.randomUUID(),
  title: title.trim(),
  text: text.trimEnd(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  format,
  ownerEmail: normalizeEmail(ownerEmail),
  passcodeHash,
})

export const getSortedEntries = (
  entries: ClipboardEntries,
): ClipboardEntry[] =>
  Object.values(entries).sort((first, second) => second.createdAt - first.createdAt)

export const getFirstLinePreview = (text: string): string => {
  const [firstLine] = text.trim().split(/\r?\n/)
  return firstLine || 'Untitled clipping'
}

export const getEntryTitle = (entry: ClipboardEntry): string =>
  entry.title || getFirstLinePreview(entry.text)

export const formatEntryDateTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const day = date.getDate()
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${monthFormatter.format(
    date,
  )}, ${yearFormatter.format(date)}`

  return `${formattedDate} | ${timeFormatter.format(date)}`
}

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase()

export const getEmailGreetingName = (email: string): string => {
  const [name] = normalizeEmail(email).split('@')
  return name || 'there'
}

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email))

export const isValidPasscode = (passcode: string): boolean =>
  /^\d{4}$/.test(passcode)

export const hashPasscode = async (
  passcode: string,
  email: string,
): Promise<string> => {
  const payload = `${normalizeEmail(email)}:${passcode}`
  const encodedPayload = new TextEncoder().encode(payload)
  const digest = await crypto.subtle.digest('SHA-256', encodedPayload)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
