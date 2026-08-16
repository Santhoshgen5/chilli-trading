import { company } from '../data/company'

const DEFAULT_MESSAGE =
  'Hello MAVEH WORLD. I would like a quote for dry red chilli.'

/** Build a wa.me click-to-chat link with an optional prefilled message. */
export function whatsappLink(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`
}
