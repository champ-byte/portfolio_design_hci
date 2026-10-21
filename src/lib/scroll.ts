import type Lenis from 'lenis'

let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Smoothly scroll to a section and move focus there for keyboard / screen-reader users. */
export function scrollToId(id: string) {
  // Navigating from an overlay (menu, command palette) must not wait for its exit animation.
  lockScroll(false)
  if (id === 'top') {
    if (lenis && !prefersReducedMotion()) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0 })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  if (lenis && !prefersReducedMotion()) lenis.scrollTo(el, { duration: 1.4 }) // sections' scroll-margin-top clears the nav
  else el.scrollIntoView()
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** Freeze page scrolling while an overlay (menu, modal, intro) is open. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
