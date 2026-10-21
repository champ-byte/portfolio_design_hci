import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight, ArrowUpRight, Users, X } from 'lucide-react'
import { projects, type Project } from '../data/profile'
import { useMediaQuery, useReducedMotionPref } from '../hooks/useMediaQuery'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { lockScroll } from '../lib/scroll'
import { GitHubIcon, LeafMark, Reveal, SectionHeading } from '../components/ui'

export function Work() {
  const [openId, setOpenId] = useState<Project['id'] | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const desktop = useMediaQuery('(min-width: 1024px)')
  const reduce = useReducedMotionPref()
  const stack = desktop && !reduce
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })
  const open = projects.find((p) => p.id === openId) ?? null

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-24 px-2 sm:px-4">
      <div className="relative isolate overflow-clip rounded-[2rem] bg-forest sm:rounded-[3rem]">
        <img
          src="/images/bg-work.webp"
          srcSet="/images/bg-work-sm.webp 900w, /images/bg-work.webp 1672w"
          sizes="100vw"
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-10 size-full object-cover opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/40 via-forest/70 to-forest" />

        <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-32 lg:px-8">
          <SectionHeading
            id="work-title"
            tone="onDark"
            index="03"
            eyebrow="Selected Work"
            title={
              <>
                Things I&rsquo;ve <em>built</em>
              </>
            }
            intro="Three projects that show how I think: agentic tools, retrieval that understands structure, and AI that refuses to guess."
          />

          <div ref={container} className={`mt-14 ${stack ? '' : 'space-y-6'}`}>
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                total={projects.length}
                stack={stack}
                progress={scrollYProgress}
                onOpen={() => setOpenId(p.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <CaseStudyModal
            project={open}
            onClose={() => setOpenId(null)}
            onNext={() => {
              const next = projects[(projects.indexOf(open) + 1) % projects.length]
              setOpenId(next.id)
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  total,
  stack,
  progress,
  onOpen,
}: {
  project: Project
  index: number
  total: number
  stack: boolean
  progress: MotionValue<number>
  onOpen: () => void
}) {
  // Each card shrinks a little as the next one slides over it.
  const targetScale = 1 - (total - 1 - index) * 0.05
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])

  const card = (
    <motion.article
      style={stack ? { scale, top: `${index * 28}px` } : undefined}
      className="card relative grid origin-top overflow-hidden lg:min-h-[min(600px,76vh)] lg:grid-cols-[1fr_1.1fr]"
      aria-labelledby={`${project.id}-title`}
    >
      {/* Text side */}
      <div className="flex flex-col p-6 sm:p-9 lg:p-11">
        <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-moss uppercase">
          <span className="tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {project.team && (
            <span className="flex items-center gap-1.5 rounded-full bg-leaf px-2.5 py-1 tracking-normal normal-case">
              <Users className="size-3.5" aria-hidden /> Team project
            </span>
          )}
        </div>
        <h3 id={`${project.id}-title`} className="mt-4 font-display text-[clamp(2rem,3.2vw,2.6rem)] leading-[1.05] text-balance">
          {project.title}
        </h3>
        <p className="mt-3 text-lg text-muted">{project.tagline}</p>
        <p className="sr-only">
          Key result: {project.metric.value} {project.metric.label}.
        </p>

        <ul className="mt-6 space-y-3">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[15px] leading-snug">
              <LeafMark className="mt-1 size-3.5 shrink-0 text-sage" />
              {h}
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.stack.map((s) => (
            <li key={s} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-muted ring-1 ring-line">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
          <button
            type="button"
            onClick={onOpen}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-on-accent transition hover:shadow-lg"
          >
            Read case study
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </button>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-bold ring-1 ring-line transition hover:bg-leaf"
          >
            <GitHubIcon className="size-4" />
            Code
            <span className="sr-only">for {project.title} on GitHub (opens in a new tab)</span>
          </a>
        </div>
      </div>

      {/* Image side: a mouse/touch shortcut to the case study. Keyboard and screen-reader users
          get the same action from the "Read case study" button, so this copy stays out of their way. */}
      <div
        onClick={onOpen}
        data-cursor="View"
        aria-hidden="true"
        className="group relative order-first m-3 cursor-pointer overflow-hidden rounded-[1.4rem] bg-leaf p-3 text-left lg:order-none lg:ml-0"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-soft">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-[#f27b6b]" />
            <span className="size-2.5 rounded-full bg-[#f2c46b]" />
            <span className="size-2.5 rounded-full bg-sage" />
            <span className="ml-2 truncate rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted">
              github.com/{project.repoLabel}
            </span>
          </div>
          <div className="relative aspect-[16/10] flex-1 overflow-hidden lg:aspect-auto">
            <img
              src={project.imageSm}
              srcSet={`${project.imageSm} 800w, ${project.image} 1400w`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={project.imageAlt}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            />
          </div>
        </div>
        <span className="glass absolute bottom-6 left-6 max-w-[15rem] rounded-2xl px-4 py-3 shadow-soft">
          <span className="block font-display text-3xl leading-none text-ink">{project.metric.value}</span>
          <span className="mt-1 block text-xs font-semibold text-muted">{project.metric.label}</span>
        </span>
      </div>
    </motion.article>
  )

  if (!stack) return <Reveal>{card}</Reveal>
  return <div className="sticky top-24 h-[calc(100vh-6rem)] pt-2">{card}</div>
}

function CaseStudyModal({ project, onClose, onNext }: { project: Project; onClose: () => void; onNext: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, true, onClose)

  useEffect(() => {
    lockScroll(true)
    return () => lockScroll(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[110] flex items-end justify-center bg-forest/50 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        initial={{ y: 80, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="relative flex h-[94svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[2rem] bg-bg shadow-2xl sm:h-[90vh] sm:rounded-[2rem]"
      >
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Close case study"
          className="absolute top-4 right-4 z-20 grid size-12 place-items-center rounded-full bg-surface text-ink shadow-soft transition hover:rotate-90"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div ref={scroller} className="overflow-y-auto overscroll-contain" data-lenis-prevent>
          <div className="relative h-[34vh] min-h-[220px] overflow-hidden sm:h-[42vh]">
            <img src={project.image} alt={project.imageAlt} className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
          </div>

          <div className="relative -mt-20 px-6 pb-12 sm:px-12">
            <div className="flex flex-wrap items-center gap-2">
              {project.team && (
                <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">
                  <Users className="size-3.5" aria-hidden /> Team project
                </span>
              )}
              {project.stack.map((s) => (
                <span key={s} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted ring-1 ring-line">
                  {s}
                </span>
              ))}
            </div>
            <h2 id="case-title" className="mt-5 font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.02]">
              {project.title}
            </h2>
            <p className="mt-3 max-w-2xl text-xl text-muted">{project.tagline}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="card p-5">
                  <p className="font-display text-3xl text-moss">{m.value}</p>
                  <p className="mt-1.5 text-sm font-medium text-muted">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-moss uppercase">The problem</h3>
                <p className="mt-3 font-display text-2xl leading-snug">{project.problem}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-moss uppercase">What I built</h3>
                <ol className="mt-4 space-y-4">
                  {project.approach.map((a, i) => (
                    <li key={a} className="flex gap-4">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-leaf text-sm font-bold text-moss">
                        {i + 1}
                      </span>
                      <span className="pt-1 leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-on-accent"
              >
                <GitHubIcon className="size-4" /> View on GitHub
                <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  onNext()
                  scroller.current?.scrollTo({ top: 0 })
                }}
                className="group inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-bold ring-1 ring-line transition hover:bg-leaf"
              >
                Next project
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
