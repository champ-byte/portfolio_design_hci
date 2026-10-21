import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight, GitMerge, GraduationCap, MapPin, MousePointerClick, Trophy } from 'lucide-react'
import { heroBadges, profile, skills } from '../data/profile'
import { useFinePointer, useReducedMotionPref } from '../hooks/useMediaQuery'
import { scrollToId } from '../lib/scroll'
import { useTheme } from '../lib/theme'
import { useMotionPaused } from '../lib/motion'
import { LeafMark, Magnetic, Marquee } from '../components/ui'

const ease = [0.22, 1, 0.36, 1] as const
const badgeIcons = { graduation: GraduationCap, trophy: Trophy, merge: GitMerge }

export function Hero({ ready, introPlayed }: { ready: boolean; introPlayed: boolean }) {
  const fine = useFinePointer()
  const reduce = useReducedMotionPref()
  const { theme } = useTheme()
  const parallax = fine && !reduce
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!parallax) return
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.9, delay: ready ? delay : 0, ease },
  })

  return (
    <section
      id="top"
      aria-label="Introduction"
      onPointerMove={onMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-clip"
    >
      {/* Leaf-shadow background, swapped per theme */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* only the active theme's image is requested */}
        <img
          key={theme}
          src={`/images/bg-hero-${theme}.webp`}
          srcSet={`/images/bg-hero-${theme}-sm.webp 900w, /images/bg-hero-${theme}.webp 1672w`}
          sizes="100vw"
          alt=""
          className="animate-sway size-full object-cover dark:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-transparent max-lg:bg-gradient-to-b max-lg:from-bg/30 max-lg:via-bg/70 max-lg:to-bg/90" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
        <div className="absolute top-[10%] -left-[10%] size-[40vw] rounded-full bg-sage/25 blur-3xl" />
        <div className="absolute -right-[5%] bottom-[5%] size-[30vw] rounded-full bg-leaf/60 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 pt-28 pb-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:px-8 lg:pt-32">
        {/* Text column */}
        <div className="order-2 lg:order-1">
          <motion.p
            {...show(0.05)}
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold text-ink"
          >
            <span className="relative flex size-2.5">
              <span className="animate-ping-soft absolute inline-flex size-full rounded-full bg-warm" />
              <span className="relative inline-flex size-2.5 rounded-full bg-warm" />
            </span>
            {profile.status}
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(4rem,15vw,10rem)] leading-[0.88] font-normal tracking-[-0.035em]">
            <span className="sr-only">
              {profile.name}, {profile.role}
            </span>
            <span aria-hidden className="-mb-[0.14em] block overflow-hidden pb-[0.16em]">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={ready ? { y: 0 } : { y: '105%' }}
                transition={{ duration: 1.1, delay: ready ? 0.1 : 0, ease }}
              >
                {profile.firstName}
              </motion.span>
            </span>
            <span aria-hidden className="-mb-[0.1em] block overflow-hidden pb-[0.14em]">
              <motion.span
                className="flex items-end gap-4 font-light text-moss italic"
                initial={{ y: '105%' }}
                animate={ready ? { y: 0 } : { y: '105%' }}
                transition={{ duration: 1.1, delay: ready ? 0.2 : 0, ease }}
              >
                {profile.lastName}
                <LeafMark className="mb-[0.18em] size-[0.32em] text-sage" />
              </motion.span>
            </span>
          </h1>

          <motion.div {...show(0.35)} className="mt-6 font-display text-[clamp(1.5rem,3.2vw,2.25rem)] leading-tight">
            <span className="sr-only">I build {profile.rotatingWords.join(', ')}.</span>
            <span aria-hidden>
              I build <RotatingWord words={profile.rotatingWords} active={ready} />
            </span>
          </motion.div>

          <motion.p {...show(0.45)} className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            {profile.tagline} Computer Science at VJTI, building with LLMs, knowledge graphs and a designer&rsquo;s eye.
          </motion.p>

          <motion.div {...show(0.55)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('work')
                }}
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-accent pr-2 pl-7 text-base font-bold text-on-accent shadow-soft transition hover:shadow-xl"
              >
                Explore work
                <span className="grid size-10 place-items-center rounded-full bg-on-accent/15 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="size-[18px]" aria-hidden />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('contact')
                }}
                className="glass inline-flex h-14 items-center rounded-full px-7 text-base font-bold text-ink transition hover:bg-surface"
              >
                Let&rsquo;s talk
              </a>
            </Magnetic>
          </motion.div>

          <motion.p {...show(0.65)} className="mt-8 flex items-center gap-2 text-sm font-medium text-muted">
            <MapPin className="size-4" aria-hidden /> Based in {profile.location}
          </motion.p>
        </div>

        {/* Avatar column */}
        <div className="order-1 flex justify-center lg:order-2">
          <AvatarStage ready={ready} introPlayed={introPlayed} sx={sx} sy={sy} />
        </div>
      </div>

      {/* Tilted skills ribbon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: ready ? 0.8 : 0 }}
        className="relative z-10 -mx-[5%] mb-10 -rotate-[2deg] bg-forest py-4 text-cream shadow-[0_20px_40px_-20px_rgb(31_58_46/0.6)] sm:py-5"
      >
        <span className="sr-only">Skills: {skills.slice(0, 12).map((s) => s.name).join(', ')}</span>
        <div aria-hidden>
          <Marquee items={skills.filter((s) => s.category !== 'Design').slice(0, 14).map((s) => s.name)} />
        </div>
      </motion.div>
    </section>
  )
}

function RotatingWord({ words, active }: { words: string[]; active: boolean }) {
  const [i, setI] = useState(0)
  const reduce = useReducedMotionPref()
  const { paused } = useMotionPaused()
  useEffect(() => {
    if (!active || reduce || paused) return
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), 2400)
    return () => window.clearInterval(t)
  }, [active, reduce, paused, words.length])
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className="relative inline-grid align-bottom">
      {/* invisible longest word reserves the width so the line never jumps */}
      <span className="invisible col-start-1 row-start-1 italic">{longest}</span>
      <span className="col-start-1 row-start-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[i]}
            className="inline-block font-light text-moss italic"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      <svg
        className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full text-warm/80"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        aria-hidden
      >
        <motion.path
          key={i}
          d="M2 8 C 50 2, 120 2, 198 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
        />
      </svg>
    </span>
  )
}

function useLayer(v: MotionValue<number>, depth: number) {
  return useTransform(v, (n) => n * depth)
}

function AvatarStage({
  ready,
  introPlayed,
  sx,
  sy,
}: {
  ready: boolean
  introPlayed: boolean
  sx: MotionValue<number>
  sy: MotionValue<number>
}) {
  const [fact, setFact] = useState<number | null>(null)
  const [clicked, setClicked] = useState(false)
  const hideTimer = useRef<number | undefined>(undefined)

  const avatarX = useLayer(sx, -18)
  const avatarY = useLayer(sy, -14)
  const ringX = useLayer(sx, 10)
  const ringY = useLayer(sy, 10)
  const b1x = useLayer(sx, 42)
  const b1y = useLayer(sy, 30)
  const b2x = useLayer(sx, -36)
  const b2y = useLayer(sy, 26)
  const b3x = useLayer(sx, 30)
  const b3y = useLayer(sy, -34)
  const badgeMotion = [
    { x: b1x, y: b1y },
    { x: b2x, y: b2y },
    { x: b3x, y: b3y },
  ]

  const sayHi = () => {
    setClicked(true)
    setFact((f) => (f === null ? 0 : (f + 1) % profile.funFacts.length))
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setFact(null), 5000)
  }
  useEffect(() => () => window.clearTimeout(hideTimer.current), [])

  // Badges sit in the corners / over the shoulders, never across the face.
  const badgePos = [
    'left-0 top-[2%] sm:-left-[4%] sm:top-[4%]',
    'right-0 bottom-[17%] sm:-right-[6%] sm:bottom-[24%]',
    'left-0 bottom-[1%] sm:-left-[2%] sm:bottom-[2%]',
  ]

  return (
    <div className="relative aspect-square w-[min(84vw,460px)]">
      {/* backdrop circle + rotating dashed ring */}
      <motion.div aria-hidden style={{ x: ringX, y: ringY }} className="absolute inset-[7%]">
        <div className="absolute inset-0 rounded-full bg-leaf/80 shadow-[inset_0_0_60px_rgb(168_188_148/0.35)] dark:bg-leaf" />
        <div className="animate-spin-slow absolute -inset-[5%] rounded-full border-[1.5px] border-dashed border-moss/35" />
      </motion.div>

      {/* the avatar itself (a button: click for a fun fact) */}
      <motion.div style={{ x: avatarX, y: avatarY }} className="absolute inset-0 flex items-center justify-center">
        <motion.button
          type="button"
          onClick={sayHi}
          aria-label="Say hi to Kavya’s avatar for a fun fact"
          data-cursor="Hi!"
          className="relative w-[72%] rounded-full"
          initial={introPlayed ? false : { scale: 0.6, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : { scale: introPlayed ? 1 : 0.6, opacity: 0 }}
          transition={introPlayed ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 16, delay: 0.2 }}
          whileHover={{ scale: 1.03, rotate: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <div id="hero-avatar" className="aspect-[586/626] w-full">
            <img
              src="/images/avatar.webp"
              alt="Cartoon avatar of Kavya: dark messy hair, round glasses and an orange scarf"
              width={586}
              height={626}
              fetchPriority="high"
              className="size-full object-contain drop-shadow-[0_24px_30px_rgb(31_58_46/0.25)]"
            />
          </div>
        </motion.button>
      </motion.div>

      {/* speech bubble */}
      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 -top-3 z-20 flex justify-end sm:-top-6">
        <AnimatePresence mode="wait">
          {fact !== null && (
            <motion.p
              key={fact}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              className="relative max-w-[11rem] rounded-2xl bg-forest px-4 py-3 text-center text-sm sm:max-w-[14rem] font-semibold text-cream shadow-xl dark:bg-cream dark:text-forest"
            >
              {profile.funFacts[fact]}
              <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-inherit" />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* "click me" signifier, disappears after first use */}
      <AnimatePresence>
        {ready && !clicked && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 1.6 }}
            className="pointer-events-none absolute top-[4%] right-[2%] z-20 sm:top-[6%] sm:right-[8%]"
          >
            <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-ink">
              <MousePointerClick className="size-3.5" /> Click me
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      {/* floating badges */}
      {heroBadges.map((b, i) => {
        const Icon = badgeIcons[b.icon]
        return (
          <motion.div
            key={b.value}
            style={badgeMotion[i]}
            className={`absolute z-10 ${badgePos[i]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: ready ? 0.5 + i * 0.12 : 0, ease }}
          >
            <div
              className="animate-bob glass flex items-center gap-2.5 rounded-2xl py-2 pr-3 pl-2 shadow-soft sm:gap-3 sm:py-2.5 sm:pr-4 sm:pl-2.5"
              style={{ animationDelay: `${i * -1.6}s` }}
            >
              <span className="grid size-8 place-items-center rounded-xl bg-accent text-on-accent sm:size-10">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-extrabold text-ink sm:text-base">{b.value}</span>
                <span className="block text-[11px] font-medium text-muted sm:text-xs">{b.label}</span>
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
