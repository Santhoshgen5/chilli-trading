import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { Container, Section } from '../components/Section'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { whatsappLink } from '../lib/whatsapp'
import { company } from '../data/company'
import { varieties } from '../data/varieties'
import type { VarietySlug } from '../data/types'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

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
  else if (Number(f.quantity) < 1 || Number.isNaN(Number(f.quantity)))
    e.quantity = 'Minimum order is 1 MT.'
  return e
}

// Field label + inline error wrapper.
function fieldError(id: string, error?: string) {
  return error ? (
    <p id={`${id}-error`} className="mt-1.5 font-mono text-xs text-red-700">
      {error}
    </p>
  ) : null
}

const inputBase =
  'w-full rounded-sm border bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-500 focus:border-navy-400 transition-colors'

function inputCls(hasError?: boolean) {
  return `${inputBase} ${hasError ? 'border-red-500' : 'border-paper-line'}`
}

export default function Enquiry() {
  const [params] = useSearchParams()
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const botcheckRef = useRef<HTMLInputElement>(null)

  // Prefill variety from ?variety=slug (arriving from a product page).
  useEffect(() => {
    const q = params.get('variety')
    if (q && varieties.some((v) => v.slug === q)) {
      setForm((f) => (f.varieties.includes(q as VarietySlug) ? f : { ...f, varieties: [q as VarietySlug] }))
    }
  }, [params])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    // Clear a field's error as the user corrects it.
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

  // A WhatsApp fallback message pre-filled with everything the buyer entered, so
  // a failed submit never loses their details.
  const fallbackMessage = useMemo(() => {
    const names = form.varieties
      .map((s) => varieties.find((v) => v.slug === s)?.name)
      .filter(Boolean)
      .join(', ')
    const who = [form.name, form.company].filter(Boolean).join(', ')
    const parts = [
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
    ].filter(Boolean)
    return parts.join(' ')
  }, [form])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const validation = validate(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      // Move focus to the first field with an error.
      const firstKey = Object.keys(validation)[0]
      document.getElementById(firstKey)?.focus()
      return
    }

    if (!ACCESS_KEY) {
      // No key configured — send them to WhatsApp rather than failing silently.
      console.warn('VITE_WEB3FORMS_KEY is not set. See README.')
      setStatus('error')
      return
    }

    setStatus('submitting')

    const selectedNames = form.varieties
      .map((s) => varieties.find((v) => v.slug === s)?.fullName)
      .filter(Boolean)
      .join(', ')

    const payload = {
      access_key: ACCESS_KEY,
      subject: `RFQ — ${selectedNames || 'Dry red chilli'} — ${form.quantity} MT to ${form.country}`,
      from_name: `${form.name} (${form.company})`,
      replyto: form.email,
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      destination_country: form.country,
      destination_port: form.port || '—',
      varieties: selectedNames,
      quantity_mt: form.quantity,
      preferred_packing: form.packing || '—',
      incoterm: form.incoterm || '—',
      sample_requested: form.sample ? 'Yes' : 'No',
      message: form.message || '—',
      // Web3Forms honeypot: non-empty when a bot ticks the hidden box.
      botcheck: botcheckRef.current?.checked ? 'true' : '',
    }

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Seo
        title="Request a Quote — Dry Red Chilli RFQ | MAVEH WORLD"
        description="Request a quote for Teja, Byadgi or Sannam S4 dry red chilli. Send destination, quantity (min 1 MT), packing and Incoterm. We reply with pricing and specification."
        path="/enquiry"
      />

      <PageHeader
        eyebrow="Request a quote"
        title="Tell us what you need"
        intro="Send the details below and we reply with pricing and the available specification. Minimum order is 1 MT."
      />

      <Section>
        <Container>
          {status === 'success' ? (
            <SuccessPanel email={form.email} fallbackMessage={fallbackMessage} />
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
              <form onSubmit={handleSubmit} noValidate className="order-2 lg:order-1">
                {status === 'error' && <ErrorBanner fallbackMessage={fallbackMessage} />}

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="label-mono text-navy-700">Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={`mt-2 ${inputCls(!!errors.name)}`}
                    />
                    {fieldError('name', errors.name)}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="label-mono text-navy-700">Company *</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? 'company-error' : undefined}
                      className={`mt-2 ${inputCls(!!errors.company)}`}
                    />
                    {fieldError('company', errors.company)}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="label-mono text-navy-700">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`mt-2 ${inputCls(!!errors.email)}`}
                    />
                    {fieldError('email', errors.email)}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="label-mono text-navy-700">Phone *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      className={`mt-2 ${inputCls(!!errors.phone)}`}
                    />
                    {fieldError('phone', errors.phone)}
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="label-mono text-navy-700">Destination country *</label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      autoComplete="country-name"
                      placeholder="e.g. United Arab Emirates"
                      value={form.country}
                      onChange={(e) => update('country', e.target.value)}
                      aria-invalid={!!errors.country}
                      aria-describedby={errors.country ? 'country-error' : undefined}
                      className={`mt-2 ${inputCls(!!errors.country)}`}
                    />
                    {fieldError('country', errors.country)}
                  </div>

                  {/* Port */}
                  <div>
                    <label htmlFor="port" className="label-mono text-navy-700">Destination port</label>
                    <input
                      id="port"
                      name="port"
                      type="text"
                      placeholder="e.g. Jebel Ali"
                      value={form.port}
                      onChange={(e) => update('port', e.target.value)}
                      className={`mt-2 ${inputCls(false)}`}
                    />
                  </div>
                </div>

                {/* Varieties */}
                <fieldset id="varieties" tabIndex={-1} className="mt-5" aria-describedby={errors.varieties ? 'varieties-error' : undefined}>
                  <legend className="label-mono text-navy-700">Variety * <span className="normal-case tracking-normal text-navy-400">(select one or more)</span></legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {varieties.map((v) => {
                      const checked = form.varieties.includes(v.slug)
                      return (
                        <label
                          key={v.slug}
                          className={`cursor-pointer select-none rounded-sm border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-500 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-paper ${
                            checked
                              ? 'border-navy-700 bg-navy-700 text-paper'
                              : 'border-paper-line bg-white text-navy-700 hover:border-navy-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="variety"
                            value={v.slug}
                            checked={checked}
                            onChange={() => toggleVariety(v.slug)}
                            className="sr-only"
                          />
                          {v.fullName}
                        </label>
                      )
                    })}
                  </div>
                  {fieldError('varieties', errors.varieties)}
                </fieldset>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="label-mono text-navy-700">Quantity (MT) *</label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={1}
                      step="any"
                      inputMode="decimal"
                      placeholder="Minimum 1"
                      value={form.quantity}
                      onChange={(e) => update('quantity', e.target.value)}
                      aria-invalid={!!errors.quantity}
                      aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                      className={`mt-2 font-mono tabular-nums ${inputCls(!!errors.quantity)}`}
                    />
                    {fieldError('quantity', errors.quantity)}
                  </div>

                  {/* Packing */}
                  <div>
                    <label htmlFor="packing" className="label-mono text-navy-700">Preferred packing</label>
                    <select
                      id="packing"
                      name="packing"
                      value={form.packing}
                      onChange={(e) => update('packing', e.target.value)}
                      className={`mt-2 ${inputCls(false)}`}
                    >
                      <option value="">No preference</option>
                      {company.packingOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Incoterm */}
                  <div>
                    <label htmlFor="incoterm" className="label-mono text-navy-700">Incoterm</label>
                    <select
                      id="incoterm"
                      name="incoterm"
                      value={form.incoterm}
                      onChange={(e) => update('incoterm', e.target.value)}
                      className={`mt-2 ${inputCls(false)}`}
                    >
                      <option value="">No preference</option>
                      {company.incoterms.map((code) => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-5">
                  <label htmlFor="message" className="label-mono text-navy-700">Message</label>
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

                {/* Sample */}
                <label className="mt-5 flex items-center gap-3 text-sm text-navy-700">
                  <input
                    type="checkbox"
                    name="sample"
                    checked={form.sample}
                    onChange={(e) => update('sample', e.target.checked)}
                    className="h-4 w-4 rounded-sm border-paper-line accent-navy-700"
                  />
                  I&rsquo;d like a sample before ordering
                </label>

                {/* Honeypot (hidden from users, catches bots) */}
                <input ref={botcheckRef} type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-navy-700 px-7 py-3.5 text-base font-medium text-paper transition-colors hover:bg-navy-900 disabled:opacity-60 sm:w-auto"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
                </button>
                <p className="mt-3 font-mono text-xs text-navy-400">Fields marked * are required.</p>
              </form>

              {/* Aside — reassurance + direct contact */}
              <aside className="order-1 lg:order-2">
                <div className="rounded-sm border border-paper-line bg-white p-6">
                  <h2 className="label-mono text-navy-500">What happens next</h2>
                  <ul className="mt-4 space-y-3 text-sm text-navy-700">
                    <li className="flex gap-3"><span className="font-mono text-navy-700">01</span> We review your requirement and confirm availability.</li>
                    <li className="flex gap-3"><span className="font-mono text-navy-700">02</span> We reply with pricing on your Incoterm and the specification.</li>
                    <li className="flex gap-3"><span className="font-mono text-navy-700">03</span> Samples can be arranged before you commit to an order.</li>
                  </ul>
                </div>

                <div className="mt-5 rounded-sm border border-paper-line bg-white p-6">
                  <h2 className="label-mono text-navy-500">Prefer to message?</h2>
                  <p className="mt-3 text-sm text-navy-500">Reach us directly — we usually reply fastest on WhatsApp.</p>
                  <a
                    href={whatsappLink(fallbackMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-sm border border-navy-700 px-5 py-3 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-700 hover:text-paper"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    WhatsApp
                  </a>
                  <p className="mt-4 text-sm">
                    <a href={`mailto:${company.email}`} className="font-mono text-navy-700 underline underline-offset-4 hover:text-cyan-700">
                      {company.email}
                    </a>
                  </p>
                </div>
              </aside>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}

function ErrorBanner({ fallbackMessage }: { fallbackMessage: string }) {
  return (
    <div role="alert" className="mb-6 rounded-sm border border-gold-700/40 bg-gold-500/10 p-5">
      <p className="font-display text-lg text-navy-900">The form didn&rsquo;t send.</p>
      <p className="mt-1 text-sm text-navy-700">
        Your details are still here — send them straight to us on WhatsApp, or email{' '}
        <a href={`mailto:${company.email}`} className="underline underline-offset-4">{company.email}</a>. We&rsquo;ll pick it up right away.
      </p>
      <a
        href={whatsappLink(fallbackMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-sm bg-navy-700 px-5 py-2.5 text-sm font-medium text-paper hover:bg-navy-900"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Send on WhatsApp
      </a>
    </div>
  )
}

function SuccessPanel({ email, fallbackMessage }: { email: string; fallbackMessage: string }) {
  return (
    <div className="max-w-2xl rounded-sm border border-paper-line bg-white p-8 sm:p-12">
      <p className="label-mono text-navy-500">Enquiry received</p>
      <h2 className="mt-3 text-3xl">Thank you — we have your enquiry.</h2>
      <p className="mt-4 text-navy-500">
        We&rsquo;ll reply to <span className="font-mono text-navy-900">{email}</span> with pricing and
        the available specification. If it&rsquo;s urgent, message us on WhatsApp and quote your company name.
      </p>
      <a
        href={whatsappLink(fallbackMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-sm border border-navy-700 px-5 py-3 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-700 hover:text-paper"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp us
      </a>
    </div>
  )
}
