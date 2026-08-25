import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Shell } from '../components/Shell'
import { PageHeader } from '../components/PageHeader'
import { Container, Section } from '../components/Section'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { Reveal } from '../components/motion/Reveal'
import { whatsappLink } from '../lib/whatsapp'
import { company } from '../data/company'
import { varieties } from '../data/varieties'
import type { VarietySlug } from '../data/types'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FormState {
  name: string
  company: string
  email: string
  phone: string
  country: string
  port: string
  varieties: VarietySlug[]
  quantity: string
  packing: string
  incoterm: string
  message: string
  sample: boolean
}

const initialState: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  port: '',
  varieties: [],
  quantity: '',
  packing: '',
  incoterm: '',
  message: '',
  sample: false,
}

type Errors = Partial<Record<keyof FormState, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(f: FormState): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Enter your name.'
  if (!f.company.trim()) e.company = 'Enter your company.'
  if (!f.email.trim()) e.email = 'Enter your email.'
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email address.'
  if (!f.phone.trim()) e.phone = 'Enter a phone number.'
  if (!f.country.trim()) e.country = 'Enter the destination country.'
  if (f.varieties.length === 0) e.varieties = 'Select at least one variety.'
  if (!f.quantity.trim()) e.quantity = 'Enter a quantity.'
  else if (Number.isNaN(Number(f.quantity)) || Number(f.quantity) < 1)
    e.quantity = 'Minimum order is 1 MT.'
  return e
}

const inputBase =
  'w-full rounded-md border bg-paper-50 px-3.5 py-2.5 text-navy-900 transition-colors placeholder:text-navy-500 hover:border-navy-200'

const inputCls = (hasError?: boolean) =>
  `${inputBase} ${hasError ? 'border-red-600' : 'border-paper-line-strong'}`

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={`${id}-error`} className="mt-1.5 font-mono text-xs text-red-700">
      {message}
    </p>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const botcheckRef = useRef<HTMLInputElement>(null)

  // Prefill the variety from ?variety=slug — the quote buttons on the product
  // pages arrive here with one selected. Read from location rather than a
  // router: there isn't one, and this must not run during prerendering.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('variety')
    if (slug && varieties.some((v) => v.slug === slug)) {
      setForm((f) =>
        f.varieties.includes(slug as VarietySlug)
          ? f
          : { ...f, varieties: [slug as VarietySlug] },
      )
    }
  }, [])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }

  function toggleVariety(slug: VarietySlug) {
    setForm((f) => ({
      ...f,
      varieties: f.varieties.includes(slug)
        ? f.varieties.filter((s) => s !== slug)
        : [...f.varieties, slug],
    }))
    setErrors((e) => (e.varieties ? { ...e, varieties: undefined } : e))
  }

  // A WhatsApp message prefilled with everything entered, so a failed submit
  // never costs the buyer their typing.
  const fallbackMessage = useMemo(() => {
    const names = form.varieties
      .map((s) => varieties.find((v) => v.slug === s)?.name)
      .filter(Boolean)
      .join(', ')
    const who = [form.name, form.company].filter(Boolean).join(', ')
    return [
      'Hello MAVEH WORLD, I would like a quote for dry red chilli.',
      who && `From: ${who}.`,
      names && `Varieties: ${names}.`,
      form.quantity && `Quantity: ${form.quantity} MT.`,
      form.country && `Destination: ${form.country}${form.port ? `, ${form.port}` : ''}.`,
      form.packing && `Packing: ${form.packing}.`,
      form.incoterm && `Incoterm: ${form.incoterm}.`,
      form.sample && 'Please include a sample before ordering.',
      form.email && `Email: ${form.email}.`,
      form.phone && `Phone: ${form.phone}.`,
      form.message && `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join(' ')
  }, [form])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Without JS this handler never runs and the form posts natively to
    // Web3Forms via its `action` — see the <form> below.
    event.preventDefault()

    const validation = validate(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      document.getElementById(Object.keys(validation)[0])?.focus()
      return
    }

    if (!ACCESS_KEY) {
      // No key configured. Surface the WhatsApp route rather than failing quietly.
      console.warn('VITE_WEB3FORMS_KEY is not set — see README.')
      setStatus('error')
      return
    }

    setStatus('submitting')

    const selected = form.varieties
      .map((s) => varieties.find((v) => v.slug === s)?.fullName)
      .filter(Boolean)
      .join(', ')

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `RFQ — ${selected || 'Dry red chilli'} — ${form.quantity} MT to ${form.country}`,
          from_name: `${form.name} (${form.company})`,
          replyto: form.email,
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          destination_country: form.country,
          destination_port: form.port || '—',
          varieties: selected,
          quantity_mt: form.quantity,
          preferred_packing: form.packing || '—',
          incoterm: form.incoterm || '—',
          sample_requested: form.sample ? 'Yes' : 'No',
          message: form.message || '—',
          botcheck: botcheckRef.current?.checked ? 'true' : '',
        }),
      })
      const data = await res.json().catch(() => ({}))
      setStatus(res.ok && data.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Shell current="contact" overHero>
      <PageHeader
        eyebrow="Contact"
        title="Request a quote"
        intro="Send the details below and we reply with pricing and the available specification. Minimum order is 1 MT. WhatsApp is usually the fastest way to reach us."
        breadcrumb={[{ label: 'Contact' }]}
      />

      <Section>
        <Container>
          {status === 'success' ? (
            <SuccessPanel email={form.email} fallbackMessage={fallbackMessage} />
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
              {/* Form */}
              <div className="order-2 lg:order-1">
                <h2 className="sr-only">Quote request form</h2>
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  // Native fallback: with JS off the browser posts straight to
                  // Web3Forms and their page confirms it. The handler above
                  // takes over whenever JS is available.
                  action={WEB3FORMS_ENDPOINT}
                  method="POST"
                >
                  <input type="hidden" name="access_key" value={ACCESS_KEY ?? ''} />
                  <input
                    type="hidden"
                    name="subject"
                    value="RFQ — dry red chilli — MAVEH WORLD website"
                  />

                  {status === 'error' && <ErrorBanner fallbackMessage={fallbackMessage} />}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="label-mono">
                        Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`mt-2 ${inputCls(!!errors.name)}`}
                      />
                      <FieldError id="name" message={errors.name} />
                    </div>

                    <div>
                      <label htmlFor="company" className="label-mono">
                        Company *
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        required
                        value={form.company}
                        onChange={(e) => update('company', e.target.value)}
                        aria-invalid={!!errors.company}
                        aria-describedby={errors.company ? 'company-error' : undefined}
                        className={`mt-2 ${inputCls(!!errors.company)}`}
                      />
                      <FieldError id="company" message={errors.company} />
                    </div>

                    <div>
                      <label htmlFor="email" className="label-mono">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`mt-2 ${inputCls(!!errors.email)}`}
                      />
                      <FieldError id="email" message={errors.email} />
                    </div>

                    <div>
                      <label htmlFor="phone" className="label-mono">
                        Phone *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className={`mt-2 ${inputCls(!!errors.phone)}`}
                      />
                      <FieldError id="phone" message={errors.phone} />
                    </div>

                    <div>
                      <label htmlFor="country" className="label-mono">
                        Destination country *
                      </label>
                      <input
                        id="country"
                        name="destination_country"
                        type="text"
                        autoComplete="country-name"
                        placeholder="e.g. United Arab Emirates"
                        required
                        value={form.country}
                        onChange={(e) => update('country', e.target.value)}
                        aria-invalid={!!errors.country}
                        aria-describedby={errors.country ? 'country-error' : undefined}
                        className={`mt-2 ${inputCls(!!errors.country)}`}
                      />
                      <FieldError id="country" message={errors.country} />
                    </div>

                    <div>
                      <label htmlFor="port" className="label-mono">
                        Destination port
                      </label>
                      <input
                        id="port"
                        name="destination_port"
                        type="text"
                        placeholder="e.g. Jebel Ali"
                        value={form.port}
                        onChange={(e) => update('port', e.target.value)}
                        className={`mt-2 ${inputCls(false)}`}
                      />
                    </div>
                  </div>

                  {/* Varieties */}
                  <fieldset
                    id="varieties"
                    tabIndex={-1}
                    className="mt-6"
                    aria-describedby={errors.varieties ? 'varieties-error' : undefined}
                  >
                    <legend className="label-mono">
                      Variety *{' '}
                      <span className="normal-case tracking-normal text-navy-500">
                        (select one or more)
                      </span>
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {varieties.map((v) => {
                        const checked = form.varieties.includes(v.slug)
                        return (
                          <label
                            key={v.slug}
                            className={`cursor-pointer select-none rounded-md border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan-600 ${
                              checked
                                ? 'border-navy-700 bg-navy-700 text-paper'
                                : 'border-paper-line-strong bg-paper-50 text-navy-700 hover:border-navy-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="varieties"
                              value={v.fullName}
                              checked={checked}
                              onChange={() => toggleVariety(v.slug)}
                              className="sr-only"
                            />
                            {v.fullName}
                          </label>
                        )
                      })}
                    </div>
                    <FieldError id="varieties" message={errors.varieties} />
                  </fieldset>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label htmlFor="quantity" className="label-mono">
                        Quantity (MT) *
                      </label>
                      <input
                        id="quantity"
                        name="quantity_mt"
                        type="number"
                        min={1}
                        step="any"
                        inputMode="decimal"
                        placeholder="Minimum 1"
                        required
                        value={form.quantity}
                        onChange={(e) => update('quantity', e.target.value)}
                        aria-invalid={!!errors.quantity}
                        aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                        className={`mt-2 font-mono tabular-nums ${inputCls(!!errors.quantity)}`}
                      />
                      <FieldError id="quantity" message={errors.quantity} />
                    </div>

                    <div>
                      <label htmlFor="packing" className="label-mono">
                        Preferred packing
                      </label>
                      <select
                        id="packing"
                        name="preferred_packing"
                        value={form.packing}
                        onChange={(e) => update('packing', e.target.value)}
                        className={`mt-2 ${inputCls(false)}`}
                      >
                        <option value="">No preference</option>
                        {company.packingOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="incoterm" className="label-mono">
                        Incoterm
                      </label>
                      <select
                        id="incoterm"
                        name="incoterm"
                        value={form.incoterm}
                        onChange={(e) => update('incoterm', e.target.value)}
                        className={`mt-2 ${inputCls(false)}`}
                      >
                        <option value="">No preference</option>
                        {company.incoterms.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="message" className="label-mono">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Any specification requirements, timelines or questions."
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className={`mt-2 ${inputCls(false)}`}
                    />
                  </div>

                  <label className="mt-6 flex items-center gap-3 text-sm text-navy-700">
                    <input
                      type="checkbox"
                      name="sample_requested"
                      checked={form.sample}
                      onChange={(e) => update('sample', e.target.checked)}
                      className="h-4 w-4 rounded border-paper-line-strong accent-navy-700"
                    />
                    I&rsquo;d like a sample before ordering
                  </label>

                  {/* Web3Forms honeypot — hidden from people, ticked by bots. */}
                  <input
                    ref={botcheckRef}
                    type="checkbox"
                    name="botcheck"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden
                  />

                  <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
                    {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
                  </Button>
                  <p className="mt-3 font-mono text-xs text-navy-500">
                    Fields marked * are required.
                  </p>
                </form>
              </div>

              {/* Aside */}
              <aside className="order-1 space-y-6 lg:order-2">
                <Reveal>
                  <Card className="p-6">
                    <h2 className="label-mono">What happens next</h2>
                    <ol className="mt-5 space-y-3 text-sm text-navy-700">
                      <li className="flex gap-3">
                        <span className="font-mono tabular-nums text-navy-500">01</span>
                        We review your requirement and confirm availability.
                      </li>
                      <li className="flex gap-3">
                        <span className="font-mono tabular-nums text-navy-500">02</span>
                        We reply with pricing on your Incoterm and the specification.
                      </li>
                      <li className="flex gap-3">
                        <span className="font-mono tabular-nums text-navy-500">03</span>
                        Samples can be arranged before you commit to an order.
                      </li>
                    </ol>
                  </Card>
                </Reveal>

                <Reveal delay={0.06}>
                  <Card className="p-6">
                    <h2 className="label-mono">Reach us directly</h2>
                    <ul className="mt-5 space-y-3 text-sm">
                      {company.phones.map((phone) => (
                        <li key={phone}>
                          <a
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="font-mono tabular-nums text-navy-900 transition-colors hover:text-cyan-700"
                          >
                            {phone}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href={`mailto:${company.email}`}
                          className="text-navy-900 underline underline-offset-4 transition-colors hover:text-cyan-700"
                        >
                          {company.email}
                        </a>
                      </li>
                      {company.linkedin && (
                        <li>
                          <a
                            href={company.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy-900 underline underline-offset-4 transition-colors hover:text-cyan-700"
                          >
                            LinkedIn
                          </a>
                        </li>
                      )}
                    </ul>
                    <Button
                      href={whatsappLink(fallbackMessage)}
                      external
                      variant="secondary"
                      className="mt-5"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      Chat on WhatsApp
                    </Button>
                  </Card>
                </Reveal>

                <Reveal delay={0.1}>
                  <Card className="p-6">
                    <h2 className="label-mono">Registered address</h2>
                    <address className="mt-5 text-sm not-italic leading-relaxed text-navy-900">
                      {company.address.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                      <span className="block">
                        {company.address.postalCode}, {company.address.country}
                      </span>
                    </address>
                  </Card>
                </Reveal>
              </aside>
            </div>
          )}
        </Container>
      </Section>
    </Shell>
  )
}

function ErrorBanner({ fallbackMessage }: { fallbackMessage: string }) {
  return (
    <div role="alert" className="mb-6 rounded-card border border-gold-700/40 bg-gold-500/10 p-5">
      <p className="font-display text-lg text-navy-900">The form didn&rsquo;t send.</p>
      <p className="mt-1.5 text-sm text-navy-700">
        Your details are still here — send them straight to us on WhatsApp, or email{' '}
        <a href={`mailto:${company.email}`} className="underline underline-offset-4">
          {company.email}
        </a>
        . We&rsquo;ll pick it up right away.
      </p>
      <Button href={whatsappLink(fallbackMessage)} external className="mt-4">
        <WhatsAppIcon className="h-5 w-5" />
        Send on WhatsApp
      </Button>
    </div>
  )
}

function SuccessPanel({ email, fallbackMessage }: { email: string; fallbackMessage: string }) {
  return (
    <Card className="max-w-2xl p-8 sm:p-12">
      <p className="label-mono">Enquiry received</p>
      <h2 className="mt-4 text-3xl text-navy-900">Thank you — we have your enquiry.</h2>
      <p className="mt-4 text-navy-500">
        We&rsquo;ll reply to <span className="font-mono text-navy-900">{email}</span> with pricing
        and the available specification. If it&rsquo;s urgent, message us on WhatsApp and quote
        your company name.
      </p>
      <Button href={whatsappLink(fallbackMessage)} external variant="secondary" className="mt-7">
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp us
      </Button>
    </Card>
  )
}
