import { motion, AnimatePresence } from 'framer-motion'
import { HiExclamation } from 'react-icons/hi'

export default function StorefrontModal({ isOpen, onClose, title = "Attention", message, type = 'info' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gold/10 overflow-hidden text-center"
          >
            <div className={`w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center ${type === 'error' ? 'bg-red-50 text-red-500' : 'bg-gold/10 text-gold'}`}>
              <HiExclamation className="w-8 h-8" />
            </div>
            
            <h3 className="font-display text-xl font-bold text-charcoal mb-3 uppercase tracking-widest">
              {title}
            </h3>
            
            <p className="text-smoke text-sm mb-10 leading-relaxed font-medium">
              {message}
            </p>
            
            <button
              onClick={onClose}
              className="w-full py-4 bg-charcoal text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:shadow-lg shadow-gold/20 transition-all active:scale-95"
            >
              Continuer
            </button>

            {/* Subtle ivory gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-ivory/50 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
