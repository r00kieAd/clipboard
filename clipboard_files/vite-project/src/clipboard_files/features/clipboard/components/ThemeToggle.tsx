import { memo } from 'react'

type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export const ThemeToggle = memo(function ThemeToggle({
  theme,
  onToggle,
}: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-pressed={isDark}
      onClick={onToggle}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb" />
      </span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
})
