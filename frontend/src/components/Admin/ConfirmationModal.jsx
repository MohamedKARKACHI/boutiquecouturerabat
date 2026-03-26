import { motion, AnimatePresence } from 'framer-motion'
import { HiExclamation } from 'react-icons/hi'

export default function ConfirmationModal({ isOpen, onConfirm, onCancel, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl border border-sand overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <HiExclamation className="w-8 h-8" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-charcoal mb-2 uppercase tracking-widest">
                {title || "Confirmation"}
              </h3>
              
              <p className="text-smoke text-sm mb-8 leading-relaxed">
                {message || "Êtes-vous sûr de vouloir effectuer cette action ?"}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 border border-sand text-smoke rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-cream transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
