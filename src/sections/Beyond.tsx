import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCw } from 'lucide-react'
import { beyond } from '../data/profile'
import { useFinePointer } from '../hooks/useMediaQuery'
import { SectionHeading, srcSetOf } from '../components/ui'

export function Beyond() {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const fine = useFinePointer()

  const update = () => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth
    setActive(Math.min(beyond.length - 1, Math.round(el.scrollLeft / step)))
    setAtStart(el.scrollLeft < 8)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8)
  }
  useEffect(update, [])

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current
    const card = el?.querySelector('li')
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: 'smooth' })
  }

  // Mouse drag-to-scroll (touch already swipes natively).
  const onDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
  }
  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    const el = track.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 5) {
      d.moved = true
      el.style.scrollSnapType = 'none'
      el.style.cursor = 'grabbing'
    }
    el.scrollLeft = d.left - dx
  }
  const onUp = () => {
    const el = track.current
    if (el) {
      el.style.scrollSnapType = ''
      el.style.cursor = ''
    }
    setTimeout(() => (drag.current = null), 0)
  }

  return (
    <section id="beyond" aria-labelledby="beyond-title" className="scroll-mt-24 overflow-clip pb-24 sm:pb-32">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="beyond-title"
          index="06"
          eyebrow="Achievements"
          title={
            <>
              Off the <em>editor</em>
            </>
          }
          intro={fine ? 'Hover a card to flip it. Drag or use the arrows to browse.' : 'Tap “Flip” to read more. Swipe to browse.'}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Previous card"
            className="grid size-12 place-items-center rounded-full ring-1 ring-line transition hover:bg-leaf disabled:opacity-35"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Next card"
            className="grid size-12 place-items-center rounded-full bg-accent text-on-accent transition disabled:opacity-35"
          >
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        onScroll={update}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        tabIndex={0}
        aria-label="Achievements and roles, scrollable"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scroll-padding-inline:1rem] select-none sm:px-6 sm:[scroll-padding-inline:1.5rem] lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:[scroll-padding-inline:max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {beyond.map((b, i) => (
          <FlipCard key={b.title} item={b} index={i} />
        ))}
      </ul>

      <div className="mt-6 flex justify-center gap-2" aria-hidden>
        {beyond.map((b, i) => (
          <span
            key={b.title}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-moss' : 'w-1.5 bg-line'}`}
          />
        ))}
      </div>
    </section>
  )
}

function FlipCard({ item, index }: { item: (typeof beyond)[number]; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const isIllustration = 'illustration' in item && item.illustration
  const link = 'link' in item ? item.link : undefined

  return (
    <li className="flip h-[460px] w-[82vw] max-w-[340px] shrink-0 snap-start" data-flipped={flipped}>
      <div className="flip-inner">
        {/* Front */}
        <article className="flip-face card flex flex-col overflow-hidden">
          <div className={`relative h-[62%] overflow-hidden ${isIllustration ? 'bg-leaf' : ''}`}>
            <img
              src={item.image}
              srcSet={isIllustration ? srcSetOf(item.image, 360, 640) : srcSetOf(item.image, 400, 640)}
              sizes="340px"
              alt={item.imageAlt}
              loading="lazy"
              draggable={false}
              className={`absolute inset-0 size-full ${isIllustration ? 'translate-y-[8%] object-contain' : 'object-cover'}`}
            />
            <span className="absolute top-4 left-4 rounded-full bg-surface/85 px-3 py-1 text-xs font-bold text-moss backdrop-blur">
              0{index + 1}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <p className="text-xs font-bold tracking-[0.16em] text-moss uppercase">{item.kicker}</p>
            <h3 className="mt-2 font-display text-[1.65rem] leading-tight">{item.title}</h3>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              aria-label={`Flip card: more about ${item.title}`}
              className="mt-auto flex min-h-11 items-center gap-2 self-start text-sm font-bold text-muted transition hover:text-ink"
            >
              <RotateCw className="size-4" aria-hidden /> Flip
            </button>
          </div>
        </article>

        {/* Back */}
        <article className="flip-face flip-back card flex flex-col overflow-hidden bg-forest p-7 text-cream">
          <img
            src="/images/bg-contact-sm.webp"
            alt=""
            loading="lazy"
            draggable={false}
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-40"
          />
          <div className="relative flex h-full flex-col">
            <p className="text-xs font-bold tracking-[0.16em] text-sage uppercase">{item.kicker}</p>
            <h3 className="mt-2 font-display text-3xl leading-tight">{item.title}</h3>
            <p className="mt-5 text-[17px] leading-relaxed text-cream/85">{item.text}</p>
            <div className="mt-auto flex flex-wrap items-center gap-3">
              {link && (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-cream px-5 text-sm font-bold text-forest"
                >
                  {link.label} <ArrowUpRight className="size-4" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setFlipped(false)}
                aria-label={`Flip back: ${item.title}`}
                className="flex min-h-11 items-center gap-2 text-sm font-bold text-cream/80 hover:text-cream"
              >
                <RotateCw className="size-4 -scale-x-100" aria-hidden /> Back
              </button>
            </div>
          </div>
        </article>
      </div>
    </li>
  )
}
