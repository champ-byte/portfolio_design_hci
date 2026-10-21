import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, Check, ChevronDown, MapPin } from 'lucide-react'
import { nowItems } from '../data/profile'
import { Reveal, SectionHeading, SpotlightCard, srcSetOf } from '../components/ui'

export function Now() {
  return (
    <section id="now" aria-labelledby="now-title" className="scroll-mt-24 pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="now-title"
          index="02"
          eyebrow="Currently"
          title={
            <>
              What I&rsquo;m <em>working on</em>
            </>
          }
          intro="Two places I spend my days right now: teaching a robot to talk, and studying how intelligent agents grow."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {nowItems.map((item, i) => (
            <Reveal key={item.org} delay={i * 0.1}>
              <NowCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function NowCard({ item }: { item: (typeof nowItems)[number] }) {
  const [open, setOpen] = useState(false)
  const panelId = `now-${item.org.toLowerCase()}`

  return (
    <SpotlightCard className="h-full p-6 sm:p-8">
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-full bg-leaf sm:size-32">
            <img
              src={item.image}
              srcSet={srcSetOf(item.image, 360, 640)}
              sizes="128px"
              alt={item.imageAlt}
              loading="lazy"
              className="absolute inset-x-0 bottom-0 w-full translate-y-[6%] object-contain"
            />
          </div>
          <span className="flex items-center gap-2 rounded-full bg-leaf px-3 py-1.5 text-xs font-bold text-moss">
            <span className="relative flex size-2">
              <span className="animate-ping-soft absolute inline-flex size-full rounded-full bg-warm" />
              <span className="relative inline-flex size-2 rounded-full bg-warm" />
            </span>
            Live
          </span>
        </div>

        <h3 className="mt-6 font-display text-4xl">{item.org}</h3>
        <p className="mt-1 text-sm font-semibold text-moss">{item.role}</p>
        <p className="mt-4 leading-relaxed text-muted">{item.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
          {item.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1 text-xs font-semibold">
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex min-h-11 w-full items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 text-sm font-bold transition hover:bg-leaf"
          >
            {open ? 'Hide details' : 'What I focus on'}
            <ChevronDown className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <ul className="space-y-2.5 px-1 pt-4">
                  {item.focus.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium">
                      <span className="grid size-6 place-items-center rounded-full bg-accent text-on-accent">
                        <Check className="size-3.5" strokeWidth={3} aria-hidden />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-4 px-1 text-xs font-semibold text-muted">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden /> {item.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden /> {item.place}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SpotlightCard>
  )
}
