import { useSyncExternalStore } from 'react'
import { prefersReducedMotion } from './scroll'

export type Theme = 'light' | 'dark'

const listeners = new Set<() => void>()
const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0F1712' : '#F3F1E8')
  if (persist) {
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
  }
  listeners.forEach((l) => l())
}

/** Switch theme with a circular reveal from `origin` (View Transitions API when available). */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  if (!('startViewTransition' in document) || prefersReducedMotion()) {
    apply(theme, true)
    return
  }
  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? 0
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const transition = document.startViewTransition(() => apply(theme, true))
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  // Follow the OS setting until the visitor makes an explicit choice.
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = (e: MediaQueryListEvent) => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem('theme')
    } catch {
      /* ignore */
    }
    if (!saved) apply(e.matches ? 'dark' : 'light', false)
  }
  mq.addEventListener('change', onChange)
  return () => {
    listeners.delete(cb)
    mq.removeEventListener('change', onChange)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'light' as Theme)
  const toggle = (origin?: { x: number; y: number }) => setTheme(theme === 'dark' ? 'light' : 'dark', origin)
  return { theme, toggle }
}
