import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Menu, Moon, Pause, Play, Search, Sun, X, ArrowUpRight } from 'lucide-react'
import { profile, sections } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { lockScroll, scrollToId } from '../lib/scroll'
import { useTheme } from '../lib/theme'
import { useMotionPaused } from '../lib/motion'
import { GitHubIcon, LinkedInIcon } from './ui'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)
export const shortcutLabel = isMac ? '⌘K' : 'Ctrl K'

// Sections that are not in the nav highlight their closest nav neighbour.
const navAlias: Record<string, string> = { now: 'about', beyond: 'journey' }

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className={`relative grid size-11 place-items-center overflow-hidden rounded-full text-ink transition hover:bg-leaf ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -18, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          {dark ? <Sun className="size-[18px]" aria-hidden /> : <Moon className="size-[18px]" aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function MotionToggle({ className = '' }: { className?: string }) {
  const { paused, toggle } = useMotionPaused()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label={paused ? 'Play animations' : 'Pause animations'}
      title={paused ? 'Play animations' : 'Pause animations'}
      className={`grid size-11 place-items-center rounded-full text-ink transition hover:bg-leaf ${className}`}
    >
      {paused ? <Play className="size-[17px]" aria-hidden /> : <Pause className="size-[17px]" aria-hidden />}
    </button>
  )
}

export function Navbar({ ready, onOpenCommand }: { ready: boolean; onOpenCommand: () => void }) {
  const ids = useMemo(() => sections.map((s) => s.id), [])
  const rawActive = useActiveSection(ids)
  const active = rawActive ? (navAlias[rawActive] ?? rawActive) : null
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // Hide on scroll down, reveal on scroll up (more room to read, nav one flick away).
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    if (Math.abs(y - prev) < 4) return
    setHidden(y > prev && y > 240)
  })

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: hidden && !menuOpen ? -110 : 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className="glass flex h-14 w-full max-w-5xl items-center justify-between gap-2 rounded-full pr-1.5 pl-2 shadow-soft md:w-auto md:justify-start"
        >
          <a
            href="#top"
            onClick={(e) => go(e, 'top')}
            className="flex h-11 items-center gap-2 rounded-full px-2 pr-3 font-display text-lg italic"
            aria-label={`${profile.name}, back to top`}
          >
            <img src="/images/avatar.webp" alt="" className="size-9 object-contain" width={36} height={38} />
            <span className="hidden sm:inline md:hidden lg:inline">Kavya</span>
          </a>

          <ul className="hidden items-center md:flex">
            {sections
              .filter((s) => s.nav)
              .map((s) => {
                const isActive = active === s.id
                return (
                  <li key={s.id} className="relative">
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => go(e, s.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative z-10 flex h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                        isActive ? 'text-on-accent' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {s.label}
                    </a>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </li>
                )
              })}
          </ul>

          <div className="flex items-center gap-1">
            <span aria-hidden className="mx-1 hidden h-6 w-px bg-line md:block" />
            <button
              type="button"
              onClick={onOpenCommand}
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm text-muted transition hover:bg-leaf hover:text-ink md:flex"
              aria-label={`Quick navigation (${shortcutLabel})`}
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Search className="size-4" aria-hidden />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-sans text-[11px] font-semibold">
                {shortcutLabel}
              </kbd>
            </button>
            <MotionToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-11 place-items-center rounded-full bg-accent text-on-accent md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} onGo={go} />}</AnimatePresence>
    </>
  )
}

function MobileMenu({ onClose, onGo }: { onClose: () => void; onGo: (e: MouseEvent, id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, true, onClose)
  useEffect(() => {
    lockScroll(true)
    return () => lockScroll(false)
  }, [])

  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-forest px-6 pt-5 pb-8 text-cream"
    >
      <img
        src="/images/bg-contact-sm.webp"
        alt=""
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover opacity-50"
      />
      <div className="flex items-center justify-between">
        <span className="font-display text-xl italic">Kavya Zala</span>
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          className="grid size-12 place-items-center rounded-full bg-cream text-forest"
          aria-label="Close menu"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <ul className="mt-12 flex flex-1 flex-col justify-center gap-1">
        {sections.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href={`#${s.id}`}
              onClick={(e) => onGo(e, s.id)}
              className="flex items-baseline gap-4 py-1.5 font-display text-[clamp(2.2rem,10vw,3.5rem)] leading-tight"
            >
              <span className="w-8 font-sans text-xs font-bold tracking-widest text-sage">0{i + 1}</span>
              {s.label}
            </a>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center gap-3 border-t border-cream/15 pt-6"
      >
        <a
          href={`mailto:${profile.email}`}
          className="flex h-12 items-center gap-2 rounded-full bg-cream px-5 text-sm font-bold text-forest"
        >
          Email me <ArrowUpRight className="size-4" aria-hidden />
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub (opens in a new tab)"
          className="grid size-12 place-items-center rounded-full border border-cream/25"
        >
          <GitHubIcon className="size-5" />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn (opens in a new tab)"
          className="grid size-12 place-items-center rounded-full border border-cream/25"
        >
          <LinkedInIcon className="size-5" />
        </a>
      </motion.div>
    </motion.div>
  )
}

/** Thin progress bar along the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-sage via-moss to-forest dark:to-cream"
    />
  )
}
