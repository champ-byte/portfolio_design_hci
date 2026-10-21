import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { lockScroll } from '../lib/scroll'
import { profile } from '../data/profile'

const curtainEase = [0.76, 0, 0.24, 1] as const
const MIN_DURATION = 1700 // ms: long enough for the name to finish revealing
const MAX_DURATION = 6000 // ms: never hold a visitor longer than this on a slow connection
const EXIT_DURATION = 0.95

/** Preload what the hero needs, reporting real progress (0 to 1). */
function preloadHero(onProgress: (fraction: number) => void) {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  const images = [
    { src: '/images/avatar.webp' },
    {
      src: `/images/bg-hero-${theme}.webp`,
      srcset: `/images/bg-hero-${theme}-sm.webp 900w, /images/bg-hero-${theme}.webp 1672w`,
      sizes: '100vw',
    },
  ]
  const total = images.length + 1 // + fonts
  let done = 0
  const tick = () => onProgress(++done / total)
  for (const { src, srcset, sizes } of images) {
    const img = new Image()
    if (srcset && sizes) {
      img.sizes = sizes
      img.srcset = srcset // same candidates as the hero <img>, so the browser reuses the download
    }
    img.onload = img.onerror = tick
    img.src = src
  }
  document.fonts.ready.then(tick, tick)
}

type Flight = { x: number; y: number; scale: number }

const TAGLINE = 'AI Engineer · Researcher · Design Lead'
const nameClass =
  'mt-8 flex overflow-hidden font-display text-[clamp(2.2rem,8vw,4.5rem)] leading-none font-light tracking-[0.06em] whitespace-pre'
const taglineClass = 'mt-4 text-center text-[10px] font-bold tracking-[0.18em] text-forest/80 uppercase sm:text-sm sm:tracking-[0.3em]'

/**
 * Opening sequence (doubles as the loading screen): the counter tracks the hero's
 * fonts and images loading → watercolour bloom → avatar + ring → name.
 * Then the cream curtain lifts (a forest panel trails behind it) and the
 * avatar flies to its hero position (#hero-avatar) so the hand-off is seamless.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false)
  const [flight, setFlight] = useState<Flight | null>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    onDone()
  }, [onDone])

  const startExit = useCallback(() => {
    const target = document.getElementById('hero-avatar')
    const me = avatarRef.current
    if (target && me) {
      const t = target.getBoundingClientRect()
      const m = me.getBoundingClientRect()
      setFlight({
        x: t.left + t.width / 2 - (m.left + m.width / 2),
        y: t.top + t.height / 2 - (m.top + m.height / 2),
        scale: t.width / m.width,
      })
    }
    setExiting(true)
    window.setTimeout(finish, EXIT_DURATION * 1000 + 80)
  }, [finish])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    lockScroll(true)

    // The counter shows real loading progress, paced so it never jumps ahead of the animation.
    let loaded = 0
    preloadHero((f) => (loaded = f))
    const start = performance.now()
    let shown = 0
    let frame = 0
    const step = (now: number) => {
      const elapsed = now - start
      const pace = Math.min(1, elapsed / MIN_DURATION)
      const real = elapsed > MAX_DURATION ? 1 : loaded
      const target = Math.min(pace, real) * 100
      shown += (target - shown) * 0.18
      if (target === 100 && shown > 99.5) shown = 100
      if (counterRef.current) counterRef.current.textContent = String(Math.round(shown)).padStart(3, '0')
      if (shown >= 100) startExit()
      else frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [startExit, finish])

  const letters = profile.name.toUpperCase().split('')

  return (
    <div className="fixed inset-0 z-[100]" aria-label="Intro animation">
      {/* Forest panel revealed briefly as the cream curtain lifts. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-forest"
        animate={exiting ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: EXIT_DURATION - 0.1, delay: 0.12, ease: curtainEase }}
      />

      {/* Cream curtain with the bloom, name and counter. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 overflow-hidden bg-[#F3F1E8] text-forest"
        animate={exiting ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: EXIT_DURATION - 0.15, ease: curtainEase }}
      >
        <motion.picture
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.35 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <source media="(orientation: portrait)" srcSet="/images/bg-intro-portrait.webp" />
          <img
            src="/images/bg-intro-landscape.webp"
            srcSet="/images/bg-intro-landscape-sm.webp 900w, /images/bg-intro-landscape.webp 1672w"
            sizes="100vw"
            alt=""
            className="size-full object-cover"
          />
        </motion.picture>

        {/* soft cream halo keeps the name readable over the bloom */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_32%_at_50%_58%,rgb(243_241_232/0.85),transparent_75%)]" />
        <div className="relative flex h-full flex-col items-center justify-center px-6">
          {/* placeholder that reserves the avatar's space; the real avatar sits in the top layer */}
          <div className="aspect-[586/626] w-[clamp(130px,30vw,180px)]" />

          <div className={nameClass}>
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </div>
          <motion.p
            className={taglineClass}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15 }}
          >
            {TAGLINE}
          </motion.p>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 sm:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-forest/60 uppercase">Portfolio · 2026</p>
          <p className="font-display text-[clamp(3rem,10vw,7rem)] leading-none font-light tabular-nums">
            <span ref={counterRef}>000</span>
          </p>
        </div>
      </motion.div>

      {/* Avatar + drawn ring: top layer so it can fly to the hero. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
        <motion.div
          ref={avatarRef}
          className="relative aspect-[586/626] w-[clamp(130px,30vw,180px)]"
          initial={{ scale: 0, rotate: -12 }}
          animate={
            exiting && flight
              ? { scale: flight.scale, x: flight.x, y: flight.y, rotate: 0 }
              : exiting
                ? { opacity: 0 }
                : { scale: 1, rotate: 0 }
          }
          transition={
            exiting
              ? { duration: EXIT_DURATION, ease: curtainEase }
              : { type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }
          }
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute -inset-[14%] size-[128%] -rotate-90"
            aria-hidden
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#1F3A2E"
              strokeWidth="0.8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.svg>
          <img src="/images/avatar.webp" alt="" className="size-full object-contain drop-shadow-xl" />
        </motion.div>
        {/* invisible copy of the text block so both layers share the same layout */}
        <div aria-hidden className="invisible flex flex-col items-center">
          <div className={nameClass}>{profile.name.toUpperCase()}</div>
          <p className={taglineClass}>{TAGLINE}</p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={finish}
        className="absolute top-5 right-5 z-10 rounded-full border border-forest/20 bg-white/60 px-4 py-2.5 text-sm font-semibold text-forest backdrop-blur transition hover:bg-white sm:top-8 sm:right-8"
        animate={{ opacity: exiting ? 0 : 1 }}
      >
        Skip intro <span className="ml-1 hidden text-forest/50 sm:inline">Esc</span>
      </motion.button>
    </div>
  )
}
