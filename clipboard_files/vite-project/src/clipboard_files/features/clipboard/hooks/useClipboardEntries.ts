import { useMemo } from 'react'
import { getSortedEntries } from '../utils'
import { useClipboard } from './useClipboard'

export const useClipboardEntries = () => {
  const { entries } = useClipboard()

  return useMemo(() => getSortedEntries(entries), [entries])
}
