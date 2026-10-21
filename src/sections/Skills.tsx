import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BookOpen, Compass } from 'lucide-react'
import { coursework, projects, skillCategories, skills, type SkillCategory } from '../data/profile'
import { LeafMark, Reveal, SectionHeading, SpotlightCard } from '../components/ui'

type Filter = 'All' | SkillCategory
const filters: Filter[] = ['All', ...skillCategories]
const projectName = Object.fromEntries(projects.map((p) => [p.id, p.short]))

export function Skills() {
  const [filter, setFilter] = useState<Filter>('All')
  const visible = skills.filter((s) => filter === 'All' || s.category === filter)

  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="skills-title"
          index="04"
          eyebrow="Skills"
          title={
            <>
              My <em>toolkit</em>
            </>
          }
          intro="Filter by area. Hover or tap a skill to see where I&rsquo;ve used it."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <SpotlightCard className="h-full p-6 sm:p-9">
              <div className="relative z-10">
                <div role="group" aria-label="Filter skills by category" className="flex flex-wrap gap-2">
                  {filters.map((f) => {
                    const active = f === filter
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        aria-pressed={active}
                        className={`relative h-11 rounded-full px-4 text-sm font-bold transition-colors ${
                          active ? 'text-on-accent' : 'text-muted ring-1 ring-line hover:text-ink'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="skill-filter"
                            className="absolute inset-0 rounded-full bg-accent"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                        <span className="relative">{f}</span>
                      </button>
                    )
                  })}
                </div>

                <p aria-live="polite" className="mt-6 text-sm font-medium text-muted">
                  Showing {visible.length} {visible.length === 1 ? 'skill' : 'skills'}
                  {filter !== 'All' && ` in ${filter}`}
                </p>

                <motion.ul layout className="mt-4 flex min-h-[220px] flex-wrap content-start gap-2.5">
                  <AnimatePresence mode="popLayout">
                    {visible.map((s) => (
                      <motion.li
                        key={s.name}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        className="group relative"
                      >
                        {s.usedIn ? (
                          <button
                            type="button"
                            aria-describedby={`tip-${s.name}`}
                            className="flex h-11 items-center gap-2 rounded-full bg-surface-2 px-4 text-[15px] font-semibold ring-1 ring-line transition hover:-translate-y-0.5 hover:bg-leaf hover:ring-sage"
                          >
                            <LeafMark className="size-3 text-sage" />
                            {s.name}
                          </button>
                        ) : (
                          <span className="flex h-11 items-center rounded-full bg-surface-2 px-4 text-[15px] font-semibold ring-1 ring-line">
                            {s.name}
                          </span>
                        )}
                        {s.usedIn && (
                          <span
                            id={`tip-${s.name}`}
                            role="tooltip"
                            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 rounded-xl bg-forest px-3 py-2 text-xs font-semibold whitespace-nowrap text-cream opacity-0 shadow-lg transition group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-cream dark:text-forest"
                          >
                            Used in {s.usedIn.map((id) => projectName[id]).join(' · ')}
                          </span>
                        )}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
                <p className="mt-6 flex items-center gap-2 text-xs text-muted">
                  <LeafMark className="size-3 text-sage" /> Leaf-marked skills link to projects
                </p>
              </div>
            </SpotlightCard>
          </Reveal>

          <div className="grid gap-5">
            <Reveal delay={0.08}>
              <SpotlightCard className="h-full p-7">
                <div className="relative z-10">
                  <span className="grid size-11 place-items-center rounded-2xl bg-leaf text-moss">
                    <BookOpen className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-2xl">Coursework</h3>
                  <ul className="mt-4 space-y-2.5">
                    {coursework.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-[15px]">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="card relative h-full overflow-hidden bg-forest p-7 text-cream">
                <Compass className="absolute -right-6 -bottom-6 size-36 text-cream/10" aria-hidden />
                <h3 className="font-display text-2xl">Currently exploring</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {['Active inference', 'Embodied HRI', 'Multimodal RAG', 'Agent orchestration'].map((t) => (
                    <li key={t} className="rounded-full bg-cream/10 px-3 py-1.5 text-sm font-semibold ring-1 ring-cream/20">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
