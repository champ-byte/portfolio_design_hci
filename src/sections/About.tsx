import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { BookOpen, Clock, GitMerge, GraduationCap, MapPin, Sparkles } from 'lucide-react'
import { profile, stats } from '../data/profile'
import { useReducedMotionPref } from '../hooks/useMediaQuery'
import { CountUp, LeafMark, Reveal, SectionHeading, SpotlightCard, srcSetOf } from '../components/ui'

const statIcons = [GraduationCap, BookOpen, GitMerge, Sparkles]

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate scroll-mt-24 py-24 sm:py-32">
      <img
        src="/images/bg-about.webp"
        srcSet="/images/bg-about-sm.webp 900w, /images/bg-about.webp 1672w"
        sizes="100vw"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover opacity-80 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] dark:opacity-[0.05]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About"
          title={
            <>
              A builder who cares <em>how it feels.</em>
            </>
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {/* Bio */}
          <Reveal className="sm:col-span-2 lg:row-span-2">
            <SpotlightCard className="flex h-full flex-col justify-between gap-10 p-7 sm:p-10">
              <div className="relative z-10">
                <p className="mb-6 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-moss uppercase">
                  <LeafMark className="size-3.5" /> Hello there
                </p>
                <ScrollWords text={profile.bio} />
              </div>
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
                <span className="font-display text-2xl text-moss italic">— Kavya</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted">
                  <MapPin className="size-4" aria-hidden /> {profile.location}
                </span>
              </div>
            </SpotlightCard>
          </Reveal>

          {stats.slice(0, 2).map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}

          {/* Avatar at desk */}
          <Reveal className="sm:col-span-2" delay={0.08}>
            <SpotlightCard tilt className="flex h-full min-h-[300px] items-end overflow-hidden bg-leaf p-0">
              <div className="relative z-10 flex-1 self-start p-7">
                <p className="font-display text-2xl leading-tight sm:text-[1.75rem]">
                  Where ideas <em className="font-light text-moss">turn into code.</em>
                </p>
                <p className="mt-3 max-w-[15rem] text-sm leading-relaxed text-muted">
                  Editor open, ideas brewing, plants watered.
                </p>
              </div>
              <img
                src="/images/avatar-desk.webp"
                srcSet={srcSetOf('/images/avatar-desk.webp', 360, 640)}
                sizes="(min-width: 640px) 300px, 50vw"
                alt="Illustration of Kavya coding on a laptop at a wooden desk with plants and a cup of matcha"
                loading="lazy"
                width={640}
                height={800}
                className="relative z-10 -mb-2 w-[52%] max-w-[300px] self-end object-contain"
              />
            </SpotlightCard>
          </Reveal>

          {/* Mumbai + live clock */}
          <Reveal className="sm:col-span-2" delay={0.05}>
            <SpotlightCard className="group h-full min-h-[260px] text-cream">
              <img
                src="/images/card-mumbai.webp"
                srcSet={srcSetOf('/images/card-mumbai.webp', 600, 1000)}
                sizes="(min-width: 1024px) 600px, 100vw"
                alt="Illustrated Mumbai skyline with the Bandra–Worli Sea Link and Marine Drive"
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/35 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end p-7">
                <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-cream/80 uppercase">
                  <MapPin className="size-3.5" aria-hidden /> Based in
                </p>
                <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
                  <p className="font-display text-4xl">Mumbai, India</p>
                  <LiveClock />
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          {stats.slice(2).map((s, i) => (
            <StatCard key={s.label} stat={s} index={i + 2} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  const Icon = statIcons[index]
  return (
    <Reveal delay={0.06 * index}>
      <SpotlightCard tilt className="flex h-full min-h-[180px] flex-col justify-between p-6 sm:p-7">
        <span className="relative z-10 grid size-10 place-items-center self-end rounded-xl bg-leaf text-moss">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="relative z-10">
          <CountUp
            value={stat.value}
            decimals={stat.decimals}
            suffix={stat.suffix}
            className="block font-display text-[clamp(2.75rem,5vw,3.75rem)] leading-none"
          />
          <p className="mt-2 text-sm font-semibold text-muted">{stat.label}</p>
        </div>
      </SpotlightCard>
    </Reveal>
  )
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: profile.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)
  return (
    <span className="glass flex items-center gap-2 rounded-full border-cream/20! bg-forest/40! px-4 py-2 text-sm font-bold text-cream">
      <Clock className="size-4" aria-hidden />
      <time className="tabular-nums" aria-label={`Local time in Mumbai: ${time.slice(0, 5)}`}>
        {time}
      </time>
      <span className="text-cream/70">IST</span>
    </span>
  )
}

/** Words brighten one by one as the paragraph scrolls through the viewport. */
function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 65%'] })
  const words = text.split(' ')
  const cls = 'font-display text-[clamp(1.3rem,2.3vw,1.85rem)] leading-[1.45] text-ink'

  if (reduce) return <p className={cls}>{text}</p>

  return (
    <p ref={ref} className={cls}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.22, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  )
}
