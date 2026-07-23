import type { ClipboardEntries, ClipboardEntry, ClipboardFormat } from '../types'
import { normalizeEmail } from '../utils'

const storageKey = 'clipboard-entries'
const otpStorageKey = 'clipboard-otp'
const defaultFormat: ClipboardFormat = 'plain-text'
const formats: ClipboardFormat[] = ['plain-text', 'markdown', 'code']
const apiBaseUrl = import.meta.env.VITE_CLIPBOARD_API_URL as string | undefined

const simulateLatency = async () => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 120)
  })
}

type StoredClipboardEntry = Partial<ClipboardEntry> & {
  id: string
  text: string
  createdAt: number
}

const isStoredClipboardEntry = (value: unknown): value is StoredClipboardEntry => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as StoredClipboardEntry

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
        if (isStoredClipboardEntry(entry)) {
          entries[entry.id] = {
            ...entry,
            title: entry.title ?? '',
            updatedAt: entry.updatedAt ?? entry.createdAt,
            format: getFormat(entry.format),
            ownerEmail: entry.ownerEmail ?? '',
            passcodeHash: entry.passcodeHash ?? '',
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

const getApiUrl = (path: string): string | null => {
  if (!apiBaseUrl) {
    return null
  }

  return `${apiBaseUrl.replace(/\/$/, '')}${path}`
}

const requestJson = async <ResponseBody>(
  path: string,
  init?: RequestInit,
): Promise<ResponseBody | null> => {
  const url = getApiUrl(path)

  if (!url) {
    return null
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error('Sync service request failed.')
  }

  if (response.status === 204) {
    return null
  }

  return (await response.json()) as ResponseBody
}

const createLocalOtp = (email: string): string => {
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  window.sessionStorage.setItem(
    otpStorageKey,
    JSON.stringify({
      email: normalizeEmail(email),
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    }),
  )

  return otp
}

const verifyLocalOtp = (email: string, otp: string): boolean => {
  const rawOtp = window.sessionStorage.getItem(otpStorageKey)

  if (!rawOtp) {
    return false
  }

  try {
    const storedOtp = JSON.parse(rawOtp) as {
      email: string
      otp: string
      expiresAt: number
    }

    return (
      storedOtp.email === normalizeEmail(email) &&
      storedOtp.otp === otp &&
      storedOtp.expiresAt > Date.now()
    )
  } catch {
    return false
  }
}

export const clipboardService = {
  async getAll(): Promise<ClipboardEntries> {
    await simulateLatency()
    const remoteEntries = await requestJson<ClipboardEntries>('/notes').catch(
      () => null,
    )

    if (remoteEntries) {
      writeEntries(remoteEntries)
      return remoteEntries
    }

    return readEntries()
  },

  async save(entry: ClipboardEntry): Promise<ClipboardEntry> {
    await simulateLatency()
    const remoteEntry = await requestJson<ClipboardEntry>(`/notes/${entry.id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    }).catch(() => null)
    const entries = readEntries()

    writeEntries({
      ...entries,
      [entry.id]: remoteEntry ?? entry,
    })

    return remoteEntry ?? entry
  },

  async delete(id: string): Promise<void> {
    await simulateLatency()
    await requestJson(`/notes/${id}`, { method: 'DELETE' }).catch(() => null)
    const entries = readEntries()

    delete entries[id]
    writeEntries(entries)
  },

  async sendOtp(email: string): Promise<{ demoOtp?: string }> {
    await simulateLatency()
    const response = await requestJson<{ demoOtp?: string }>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email: normalizeEmail(email) }),
    }).catch(() => null)

    if (response) {
      return response
    }

    return { demoOtp: createLocalOtp(email) }
  },

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    await simulateLatency()
    const response = await requestJson<{ verified: boolean }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email: normalizeEmail(email), otp }),
    }).catch(() => null)

    if (response) {
      return response.verified
    }

    return verifyLocalOtp(email, otp)
  },

  async copy(text: string): Promise<void> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard access is not available in this browser.')
    }

    await navigator.clipboard.writeText(text)
  },
}
