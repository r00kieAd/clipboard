import { ClipboardProvider } from '../features/clipboard/context/ClipboardContext'
import { ClipboardWorkspace } from '../features/clipboard/components/ClipboardWorkspace'

export function ClipboardApp() {
  return (
    <ClipboardProvider>
      <ClipboardWorkspace />
    </ClipboardProvider>
  )
}
