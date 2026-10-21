import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { BriefcaseBusiness, GraduationCap } from 'lucide-react'
import { journey } from '../data/profile'
import { SectionHeading, SpotlightCard, srcSetOf } from '../components/ui'

export function Journey() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })

  return (
    <section id="journey" aria-labelledby="journey-title" className="scroll-mt-24 overflow-x-clip py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="journey-title"
          index="05"
          eyebrow="Journey"
          className="mx-auto text-center [&_p]:justify-center"
          title={
            <>
              How I <em>got here</em>
            </>
          }
        />

        <ol ref={ref} className="relative mt-16">
          {/* track + scroll-linked fill */}
          <span aria-hidden className="absolute top-0 bottom-0 left-5 w-0.5 rounded-full bg-line lg:left-1/2 lg:-translate-x-1/2" />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute top-0 bottom-0 left-5 w-0.5 origin-top rounded-full bg-gradient-to-b from-sage via-moss to-forest lg:left-1/2 lg:-translate-x-1/2 dark:to-sage"
          />

          {journey.map((item, i) => {
            const right = i % 2 === 1
            const Icon = item.kind === 'work' ? BriefcaseBusiness : GraduationCap
            return (
              <li key={item.title} className="relative grid pb-12 pl-14 last:pb-0 lg:grid-cols-2 lg:gap-16 lg:pl-0">
                {/* node on the line */}
                <motion.span
                  aria-hidden
                  initial={{ scale: 0.4, backgroundColor: 'var(--surface)' }}
                  whileInView={{ scale: 1, backgroundColor: 'var(--accent)' }}
                  viewport={{ once: true, margin: '0px 0px -40% 0px' }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-6 left-5 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full text-on-accent ring-4 ring-bg lg:left-1/2"
                >
                  <Icon className="size-4" />
                </motion.span>

                <motion.div
                  initial={{ opacity: 0, x: right ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={right ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right'}
                >
                  <SpotlightCard className="overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        srcSet={srcSetOf(item.image, 600, 1000)}
                        sizes="(min-width: 1024px) 500px, 100vw"
                        alt={item.imageAlt}
                        loading="lazy"
                        className="aspect-[16/8] w-full object-cover"
                      />
                    )}
                    <div className="relative z-10 p-6 sm:p-7">
                      <div className={`flex flex-wrap items-center gap-2 ${right ? '' : 'lg:justify-end'}`}>
                        <span className="text-xs font-bold tracking-[0.18em] text-moss uppercase">{item.year}</span>
                        <span className="rounded-full bg-leaf px-2.5 py-0.5 text-xs font-bold text-moss">{item.badge}</span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl sm:text-[1.7rem]">{item.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-muted">{item.place}</p>
                      <p className="mt-3 leading-relaxed">{item.detail}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
