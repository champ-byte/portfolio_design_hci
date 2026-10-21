import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useFinePointer, useReducedMotionPref } from '../hooks/useMediaQuery'

type Variant = 'default' | 'link' | 'label'

/**
 * A soft ring that trails the pointer and reacts to what's underneath.
 * The system cursor stays visible on purpose: the ring is a cue, not a replacement.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotionPref()
  if (!fine || reduce) return null
  return <CursorRing />
}

function CursorRing() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })
  const [variant, setVariant] = useState<Variant>('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target as Element | null
      const labelled = target?.closest<HTMLElement>('[data-cursor]')
      if (labelled) {
        setVariant('label')
        setLabel(labelled.dataset.cursor ?? '')
      } else if (target?.closest('a, button, [role="option"], input, textarea, label, select')) {
        setVariant('link')
      } else {
        setVariant('default')
      }
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [x, y])

  const size = variant === 'label' ? 88 : variant === 'link' ? 52 : 34

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[130]"
    >
      <motion.div
        animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold tracking-wide uppercase transition-colors duration-200 ${
          variant === 'label'
            ? 'bg-forest text-cream shadow-lg dark:bg-sage dark:text-forest'
            : variant === 'link'
              ? 'border border-transparent bg-sage/30'
              : 'border border-ink/30'
        }`}
      >
        {variant === 'label' && label}
      </motion.div>
    </motion.div>
  )
}
