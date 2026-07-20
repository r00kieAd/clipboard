import type { ReactNode } from 'react'

type AppLayoutProps = {
  editor: ReactNode
  isSidebarOpen: boolean
  onCloseSidebar: () => void
  sidebar: ReactNode
  themeToggle: ReactNode
}

export function AppLayout({
  editor,
  isSidebarOpen,
  onCloseSidebar,
  sidebar,
  themeToggle,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar-frame" aria-label="Clipboard history">
        {sidebar}
      </aside>

      <div className={`drawer ${isSidebarOpen ? 'drawer--open' : ''}`}>
        <div className="drawer__panel">{sidebar}</div>
        <button
          type="button"
          className="drawer__scrim"
          aria-label="Close clipboard history"
          onClick={onCloseSidebar}
        />
      </div>

      <main className="workspace">
        <div className="workspace__topbar">{themeToggle}</div>
        {editor}
      </main>
    </div>
  )
}
