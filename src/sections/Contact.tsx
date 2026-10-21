import { useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, ArrowUpRight, Check, Copy, Loader, Mail, Send } from 'lucide-react'
import { profile } from '../data/profile'
import { useToast } from '../components/Toast'
import { GitHubIcon, LinkedInIcon, Magnetic, Reveal, SectionHeading, srcSetOf } from '../components/ui'

/**
 * Messages are delivered to the inbox by FormSubmit (no backend needed). The very first
 * submission sends a one-time "Activate Form" email to the inbox; after that, messages arrive
 * directly. If delivery ever fails, the visitor is offered their email app as a fallback.
 */
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`

type Field = 'name' | 'email' | 'message'
const MAX_MESSAGE = 1000

function validate(values: Record<Field, string>): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'That email doesn’t look right. Example: name@domain.com'
  if (values.message.trim().length < 10) errors.message = 'A little more detail please (at least 10 characters).'
  return errors
}

export function Contact() {
  const toast = useToast()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      toast.show('Email copied to clipboard')
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 px-2 pb-6 sm:px-4">
      <div className="relative isolate overflow-clip rounded-[2rem] bg-forest text-cream sm:rounded-[3rem]">
        <img
          src="/images/bg-contact.webp"
          srcSet="/images/bg-contact-sm.webp 900w, /images/bg-contact.webp 1672w"
          sizes="100vw"
          alt=""
          loading="lazy"
          className="animate-sway absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest/30 via-forest/50 to-forest/85" />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-20 pb-10 sm:px-8 sm:pt-28 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-10 lg:pb-20">
          <div className="flex flex-col">
            <SectionHeading
              id="contact-title"
              tone="onDark"
              index="07"
              eyebrow="Contact"
              title={
                <>
                  Let&rsquo;s build something <em>thoughtful.</em>
                </>
              }
              intro="Research collaborations, internships, a project idea, or just to say hi: my inbox is open."
            />

            <Reveal delay={0.1} className="mt-10">
              <p className="text-xs font-bold tracking-[0.2em] text-sage uppercase">Click to copy</p>
              <button
                type="button"
                onClick={copyEmail}
                className="group mt-2 flex max-w-full items-center gap-3 text-left font-display text-[clamp(1.35rem,3.6vw,2.4rem)] break-all"
                aria-label={`Copy email address ${profile.email}`}
              >
                <span className="underline decoration-sage/50 decoration-2 underline-offset-[10px] transition group-hover:decoration-cream">
                  {profile.email}
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/10 ring-1 ring-cream/20 transition group-hover:bg-cream group-hover:text-forest">
                  <Copy className="size-[18px]" aria-hidden />
                </span>
              </button>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-cream px-5 text-sm font-bold text-forest"
                  >
                    <Mail className="size-4" aria-hidden /> Open mail app
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-bold ring-1 ring-cream/30 transition hover:bg-cream/10"
                  >
                    <GitHubIcon className="size-4" /> GitHub
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-bold ring-1 ring-cream/30 transition hover:bg-cream/10"
                  >
                    <LinkedInIcon className="size-4" /> LinkedIn
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </Magnetic>
              </div>
            </Reveal>

            <motion.img
              src="/images/avatar-wave.webp"
              srcSet={srcSetOf('/images/avatar-wave.webp', 360, 640)}
              sizes="288px"
              alt="Illustration of Kavya waving hello"
              loading="lazy"
              width={640}
              height={640}
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 -mb-10 hidden w-64 self-start lg:-mb-20 lg:block xl:w-72"
            />
          </div>

          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactForm() {
  const id = useId()
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle')
  const errors = validate(values)
  const show = (f: Field) => touched[f] && errors[f]

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Hello from ${values.name.trim()}`)
    const body = encodeURIComponent(`${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`)
    return `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(errors).length > 0) {
      const first = (['name', 'email', 'message'] as Field[]).find((f) => errors[f])
      document.getElementById(`${id}-${first}`)?.focus()
      return
    }
    if (!FORM_ENDPOINT) {
      window.location.href = mailtoHref()
      setStatus('mailto')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: `Portfolio message from ${values.name.trim()}`,
          _template: 'table',
          _replyto: values.email.trim(),
        }),
      })
      const data: { success?: string | boolean } = await res.json().catch(() => ({}))
      setStatus(res.ok && String(data.success) === 'true' ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setValues({ name: '', email: '', message: '' })
    setTouched({})
    setStatus('idle')
  }

  return (
    <div className="card relative overflow-hidden p-6 text-ink sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' || status === 'mailto' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[460px] flex-col items-center justify-center text-center"
            role="status"
          >
            <svg viewBox="0 0 52 52" className="size-20 text-moss" aria-hidden>
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.path
                d="M15 27 l7 7 l15 -15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />
            </svg>
            <h3 className="mt-6 font-display text-3xl">{status === 'sent' ? 'Message sent!' : 'Almost there!'}</h3>
            <p className="mt-3 max-w-xs text-muted">
              {status === 'sent'
                ? 'Thanks for reaching out. I’ll get back to you soon.'
                : 'Your email app should have opened with the message ready. Just press send.'}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 h-11 rounded-full px-5 text-sm font-bold ring-1 ring-line transition hover:bg-leaf"
            >
              Write another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={submit}
            noValidate
            aria-describedby={`${id}-hint`}
          >
            <h3 className="font-display text-3xl">Send a message</h3>
            <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
              All fields are required. Your message goes straight to my inbox.
            </p>

            <div className="mt-7 space-y-5">
              <FloatField
                id={`${id}-name`}
                label="Your name"
                autoComplete="name"
                value={values.name}
                error={show('name') ? errors.name : undefined}
                valid={!errors.name}
                onChange={(v) => setValues((s) => ({ ...s, name: v }))}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
              <FloatField
                id={`${id}-email`}
                label="Email address"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                error={show('email') ? errors.email : undefined}
                valid={!errors.email}
                onChange={(v) => setValues((s) => ({ ...s, email: v }))}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
              <FloatField
                id={`${id}-message`}
                label="Your message"
                multiline
                value={values.message}
                error={show('message') ? errors.message : undefined}
                valid={!errors.message}
                counter={`${values.message.length}/${MAX_MESSAGE}`}
                onChange={(v) => setValues((s) => ({ ...s, message: v.slice(0, MAX_MESSAGE) }))}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
              />
            </div>

            {status === 'error' && (
              <p role="alert" className="mt-5 flex items-center gap-2 rounded-xl bg-[#fbe9e7] px-4 py-3 text-sm font-semibold text-[#8a2c1d]">
                <AlertCircle className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">The message couldn’t be delivered just now.</span>
                <a href={mailtoHref()} className="inline-flex min-h-11 shrink-0 items-center underline underline-offset-2">
                  Send with your email app
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="group mt-7 flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-accent text-base font-bold text-on-accent transition hover:shadow-lg disabled:opacity-70"
            >
              {status === 'sending' ? (
                <>
                  <Loader className="size-5 animate-spin" aria-hidden /> Sending…
                </>
              ) : (
                <>
                  Send message
                  <Send className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden />
                </>
              )}
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
              Prefer LinkedIn?
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-0.5 font-bold text-ink underline underline-offset-2">
                Message me there <ArrowUpRight className="size-3" aria-hidden />
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function FloatField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  valid,
  multiline,
  counter,
  type = 'text',
  autoComplete,
  inputMode,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  error?: string
  valid: boolean
  multiline?: boolean
  counter?: string
  type?: string
  autoComplete?: string
  inputMode?: 'email' | 'text'
}) {
  const base = `peer w-full rounded-2xl border-[1.5px] bg-surface-2 px-4 pt-6 pb-2 text-base text-ink outline-none transition focus:bg-surface ${
    error ? 'border-[#c0412c] focus:border-[#c0412c]' : 'border-line focus:border-moss'
  }`
  const shared = {
    id,
    value,
    placeholder: ' ',
    required: true,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
    onBlur,
    autoComplete,
  }
  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={5} className={`${base} resize-none`} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input {...shared} type={type} inputMode={inputMode} className={`${base} h-14`} onChange={(e) => onChange(e.target.value)} />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute top-2 left-4 text-xs font-bold text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-moss"
        >
          {label}
        </label>
        {valid && value && (
          <span className="absolute top-4 right-4 grid size-6 place-items-center rounded-full bg-leaf text-moss" aria-hidden>
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="mt-1.5 flex min-h-5 items-start justify-between gap-3 px-1">
        <AnimatePresence>
          {error && (
            <motion.p
              id={`${id}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#b03a26] dark:text-[#f0a090]"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {counter && <span className="ml-auto text-xs text-muted tabular-nums">{counter}</span>}
      </div>
    </div>
  )
}
