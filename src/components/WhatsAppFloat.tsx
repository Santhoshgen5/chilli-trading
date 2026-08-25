import { whatsappLink } from '../lib/whatsapp'
import { WhatsAppIcon } from './WhatsAppIcon'

/** Persistent click-to-chat button, fixed to the corner on every page. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MAVEH WORLD on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-pill bg-navy-700 py-3 pl-3.5 pr-4 text-paper shadow-lift transition-[background-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-navy-900 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden text-sm font-medium sm:inline">WhatsApp</span>
    </a>
  )
}
