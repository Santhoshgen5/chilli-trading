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
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-navy-700 py-3 pl-3 pr-4 text-paper shadow-lg shadow-navy-900/20 transition-colors hover:bg-navy-900 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-medium sm:inline">WhatsApp</span>
    </a>
  )
}
