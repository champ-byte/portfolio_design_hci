import { useEffect, useMemo, useRef, useState, type ComponentType, type SVGProps } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, ArrowUp, Copy, CornerDownLeft, Moon, Pause, Search } from 'lucide-react'
import { profile, sections } from '../data/profile'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { lockScroll, scrollToId } from '../lib/scroll'
import { useTheme } from '../lib/theme'
import { useMotionPaused } from '../lib/motion'
import { useToast } from './Toast'
import { GitHubIcon, LinkedInIcon } from './ui'

type Item = {
  id: string
  label: string
  group: 'Navigate' | 'Actions' | 'Links'
  icon: ComponentType<SVGProps<SVGSVGElement>>
  run: () => void
}

/** Ctrl/⌘ + K palette: an accelerator for expert users (Nielsen #7). */
export function CommandMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const { toggle } = useTheme()
  const anim = useMotionPaused()
  const toast = useToast()
  useFocusTrap(ref, true, onClose)

  useEffect(() => {
    lockScroll(true)
    return () => lockScroll(false)
  }, [])

  const items: Item[] = useMemo(
    () => [
      ...sections.map((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        group: 'Navigate' as const,
        icon: ArrowRight,
        run: () => scrollToId(s.id),
      })),
      { id: 'top', label: 'Back to top', group: 'Navigate', icon: ArrowUp, run: () => scrollToId('top') },
      { id: 'theme', label: 'Toggle light / dark theme', group: 'Actions', icon: Moon, run: () => toggle() },
      { id: 'motion', label: anim.paused ? 'Play animations' : 'Pause animations', group: 'Actions', icon: Pause, run: anim.toggle },
      {
        id: 'copy',
        label: 'Copy email address',
        group: 'Actions',
        icon: Copy,
        run: () =>
          navigator.clipboard
            ?.writeText(profile.email)
            .then(() => toast.show('Email copied to clipboard'))
            .catch(() => toast.show(profile.email)),
      },
      { id: 'gh', label: 'Open GitHub', group: 'Links', icon: GitHubIcon, run: () => window.open(profile.github, '_blank') },
      {
        id: 'li',
        label: 'Open LinkedIn',
        group: 'Links',
        icon: LinkedInIcon,
        run: () => window.open(profile.linkedin, '_blank'),
      },
    ],
    [toggle, toast, anim],
  )

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.trim().toLowerCase()))
  const current = Math.min(index, Math.max(filtered.length - 1, 0))

  const runItem = (item: Item) => {
    onClose()
    // let the overlay unlock scrolling before navigating
    window.setTimeout(item.run, 60)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[115] flex items-start justify-center bg-forest/40 px-4 pt-[14vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Quick navigation"
        initial={{ opacity: 0, y: -16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search className="size-5 text-muted" aria-hidden />
          <input
            data-autofocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIndex(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setIndex((current + 1) % Math.max(filtered.length, 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setIndex((current - 1 + filtered.length) % Math.max(filtered.length, 1))
              } else if (e.key === 'Enter' && filtered[current]) {
                e.preventDefault()
                runItem(filtered[current])
              }
            }}
            placeholder="Where to? Try “work” or “email”"
            className="h-16 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={filtered[current] ? `cmd-${filtered[current].id}` : undefined}
            aria-label="Search sections and actions"
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[11px] font-semibold text-muted">Esc</kbd>
        </div>

        <ul id="command-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
          {filtered.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">No matches. Try “skills”.</li>}
          {filtered.map((item, i) => {
            const Icon = item.icon
            const selected = i === current
            const showGroup = i === 0 || filtered[i - 1].group !== item.group
            return (
              <li key={item.id} role="presentation">
                {showGroup && (
                  <p className="px-3 pt-3 pb-1.5 text-[11px] font-bold tracking-[0.18em] text-muted uppercase">{item.group}</p>
                )}
                <div
                  id={`cmd-${item.id}`}
                  role="option"
                  aria-selected={selected}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => runItem(item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    selected ? 'bg-accent text-on-accent' : 'text-ink'
                  }`}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  {selected && <CornerDownLeft className="size-4 opacity-70" aria-hidden />}
                </div>
              </li>
            )
          })}
        </ul>
        <div className="flex gap-4 border-t border-line px-5 py-3 text-xs text-muted">
          <span>
            <kbd className="font-semibold">↑↓</kbd> move
          </span>
          <span>
            <kbd className="font-semibold">↵</kbd> open
          </span>
          <span>
            <kbd className="font-semibold">Esc</kbd> close
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
