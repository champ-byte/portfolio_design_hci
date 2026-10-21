import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { profile, sections } from '../data/profile'
import { scrollToId } from '../lib/scroll'
import { shortcutLabel } from '../components/Navbar'
import { LeafMark } from '../components/ui'

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 font-display text-3xl italic">
            {profile.name} <LeafMark className="size-5 text-sage" />
          </p>
          <p className="mt-2 max-w-sm text-muted">{profile.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 text-sm font-semibold">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(s.id)
                  }}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 text-muted transition hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {profile.name}. Designed &amp; built with care.</p>
        <p className="hidden md:block">
          Press{' '}
          <kbd className="rounded-md border border-line px-1.5 py-0.5 text-xs font-semibold text-ink">{shortcutLabel}</kbd>{' '}
          to jump anywhere
        </p>
      </div>
    </footer>
  )
}

/** Floating button with a ring that shows how far down the page you are. */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll()
  const [show, setShow] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 900))

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => scrollToId('top')}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          className="glass fixed right-4 bottom-4 z-[65] grid size-14 place-items-center rounded-full shadow-soft sm:right-6 sm:bottom-6"
        >
          <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden>
            <motion.circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="var(--moss)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp className="size-5" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
