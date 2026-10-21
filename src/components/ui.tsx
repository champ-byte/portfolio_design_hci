import { useEffect, useRef, type ReactNode, type PointerEvent, type SVGProps } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useFinePointer, useReducedMotionPref } from '../hooks/useMediaQuery'

const ease = [0.22, 1, 0.36, 1] as const

/** `/images/x.webp` → srcSet with its `-sm` variant (generated at build-prep time). */
export const srcSetOf = (src: string, smallW: number, fullW: number) =>
  `${src.replace('.webp', '-sm.webp')} ${smallW}w, ${src} ${fullW}w`

/* ---------- Reveal on scroll ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  tone = 'default',
  className = '',
  id,
}: {
  id?: string
  index: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  tone?: 'default' | 'onDark'
  className?: string
}) {
  const onDark = tone === 'onDark'
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <p
        className={`mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.22em] uppercase ${
          onDark ? 'text-sage' : 'text-moss'
        }`}
      >
        <span className="tabular-nums">{index}</span>
        <span aria-hidden className={`h-px w-10 ${onDark ? 'bg-sage/60' : 'bg-moss/50'}`} />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.02em] [&_em]:font-light [&_em]:italic ${
          onDark ? 'text-cream [&_em]:text-sage' : 'text-ink [&_em]:text-moss'
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 max-w-xl text-lg leading-relaxed ${onDark ? 'text-cream/75' : 'text-muted'}`}>{intro}</p>
      )}
    </Reveal>
  )
}

/* ---------- Magnetic wrapper (buttons lean toward the cursor) ---------- */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotionPref()
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 })
  const enabled = fine && !reduce

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className="inline-flex">
      {children}
    </motion.div>
  )
}

/* ---------- Card with a pointer-following glow and optional 3D tilt ---------- */
export function SpotlightCard({
  children,
  className = '',
  tilt = false,
}: {
  children: ReactNode
  className?: string
  tilt?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotionPref()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [4, -4]), { stiffness: 160, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), { stiffness: 160, damping: 18 })
  const tiltOn = tilt && fine && !reduce

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--x', `${x}px`)
    el.style.setProperty('--y', `${y}px`)
    px.set(x / r.width)
    py.set(y / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={tiltOn ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      className={`card spotlight relative overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(31_58_46/0.35)] ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Number that counts up when it scrolls into view ---------- */
export function CountUp({
  value,
  decimals = 0,
  suffix = '',
  className = '',
}: {
  value: number
  decimals?: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotionPref()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    if (reduce) {
      el.textContent = value.toFixed(decimals) + suffix
      return
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, value, decimals, suffix, reduce])

  return (
    <span className={className}>
      <span className="sr-only">
        {value.toFixed(decimals)}
        {suffix}
      </span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {(0).toFixed(decimals)}
        {suffix}
      </span>
    </span>
  )
}

/* ---------- Infinite ribbon ---------- */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 font-display text-xl italic sm:text-2xl">{item}</span>
          <LeafMark className="size-4 text-sage" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`marquee flex overflow-hidden ${className}`}>
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

/* ---------- Small icons ---------- */
export function LeafMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.5 3.5c-7.5-.4-13.6 2.6-15.4 9-1 3.4.2 6 1.6 7.4l.9-.9c-.9-1.4-1.2-3.2-.6-5.1.5 2.2 1.8 3.9 3.6 4.7 6.2-1.9 9.6-7.6 9.9-15.1Z" />
    </svg>
  )
}

export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}
