import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** True on devices with a precise pointer that can hover (mouse / trackpad). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const useReducedMotionPref = () => useMediaQuery('(prefers-reduced-motion: reduce)')
