import { useSyncExternalStore } from 'react'

// Page-level "pause animations" switch (WCAG 2.2.2 Pause, Stop, Hide).
// Stored on <html data-motion> so plain CSS animations can react to it too.
const listeners = new Set<() => void>()
const read = () => document.documentElement.dataset.motion === 'paused'

export function setMotionPaused(paused: boolean) {
  document.documentElement.dataset.motion = paused ? 'paused' : 'on'
  try {
    localStorage.setItem('motion', paused ? 'paused' : 'on')
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
  listeners.forEach((l) => l())
}

export function useMotionPaused() {
  const paused = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    read,
    () => false,
  )
  return { paused, toggle: () => setMotionPaused(!paused) }
}
