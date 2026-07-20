import { useCallback, useState } from 'react'
import { AppLayout } from './AppLayout'
import { Editor } from './Editor'
import { Sidebar } from './Sidebar'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '../hooks/useTheme'

export function ClipboardWorkspace() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((isOpen) => !isOpen)
  }, [])

  return (
    <AppLayout
      editor={<Editor onOpenSidebar={toggleSidebar} />}
      isSidebarOpen={isSidebarOpen}
      onCloseSidebar={closeSidebar}
      sidebar={<Sidebar onSelect={closeSidebar} />}
      themeToggle={<ThemeToggle theme={theme} onToggle={toggleTheme} />}
    />
  )
}
