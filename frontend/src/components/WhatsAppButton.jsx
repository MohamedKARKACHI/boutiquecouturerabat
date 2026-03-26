import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/212666780147?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20créations"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      className="hidden md:flex fixed bottom-5 right-5 z-50 group"
      aria-label="WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-[0_4px_20px_rgba(34,197,94,0.4)] flex items-center justify-center group-hover:shadow-[0_4px_30px_rgba(34,197,94,0.6)] group-hover:scale-110 transition-all duration-300">
        <FaWhatsapp className="text-white text-2xl" />
      </div>
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-charcoal text-ivory text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        Chat on WhatsApp
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-charcoal rotate-45" />
      </div>
    </motion.a>
  )
}
