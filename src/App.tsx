import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import Lenis from 'lenis'
import { ToastProvider } from './components/Toast'
import { Intro } from './components/Intro'
import { Navbar, ScrollProgress } from './components/Navbar'
import { CommandMenu } from './components/CommandMenu'
import { Cursor } from './components/Cursor'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Now } from './sections/Now'
import { Work } from './sections/Work'
import { Skills } from './sections/Skills'
import { Journey } from './sections/Journey'
import { Beyond } from './sections/Beyond'
import { Contact } from './sections/Contact'
import { BackToTop, Footer } from './sections/Footer'
import { prefersReducedMotion, setLenis } from './lib/scroll'

const INTRO_KEY = 'kz-intro-seen'

function shouldPlayIntro() {
  if (prefersReducedMotion()) return false
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1'
  } catch {
    return true
  }
}

export default function App() {
  const [playIntro] = useState(shouldPlayIntro)
  const [introDone, setIntroDone] = useState(!playIntro)
  const [commandOpen, setCommandOpen] = useState(false)

  // Smooth scrolling (skipped entirely for reduced-motion users).
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  // Ctrl/⌘ + K opens the quick-navigation palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* ignore */
    }
    setIntroDone(true)
  }, [])

  const closeCommand = useCallback(() => setCommandOpen(false), [])

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-forest px-5 py-3 font-semibold text-cream focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        {!introDone && <Intro onDone={finishIntro} />}
        <ScrollProgress />
        <Cursor />

        <div inert={!introDone}>
          <Navbar ready={introDone} onOpenCommand={() => setCommandOpen(true)} />
          <main id="main" tabIndex={-1} className="outline-none">
            <Hero ready={introDone} introPlayed={playIntro} />
            <About />
            <Now />
            <Work />
            <Skills />
            <Journey />
            <Beyond />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
        </div>

        <AnimatePresence>{commandOpen && <CommandMenu onClose={closeCommand} />}</AnimatePresence>
      </ToastProvider>
    </MotionConfig>
  )
}
