import { FaMoon, FaSun } from 'react-icons/fa'
import { useTheme, applyTheme, type Theme } from '../hooks/useTheme'
import { cn } from '../lib/utils'

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(rect.left + rect.width / 2)
    const y = Math.round(rect.top + rect.height / 2)
    document.documentElement.style.setProperty('--reveal-x', `${x}px`)
    document.documentElement.style.setProperty('--reveal-y', `${y}px`)

    const next: Theme = dark ? 'light' : 'dark'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const apply = () => {
      applyTheme(next)
      toggle()
    }

    if (!reduced && 'startViewTransition' in document) {
      ;(document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(apply)
    } else {
      apply()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={dark ? 'Mode terang' : 'Mode gelap'}
      title={dark ? 'Mode terang' : 'Mode gelap'}
      className={cn(
        'flex size-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 transition-colors hover:border-orange-300 hover:text-orange-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-orange-400 dark:hover:text-orange-400',
        className
      )}
    >
      {dark ? <FaSun className="size-4" /> : <FaMoon className="size-4" />}
    </button>
  )
}

export default ThemeToggle
