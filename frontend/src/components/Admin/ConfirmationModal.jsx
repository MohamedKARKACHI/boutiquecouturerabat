import { motion, AnimatePresence } from 'framer-motion'
import { HiExclamation, HiQuestionMarkCircle, HiInformationCircle } from 'react-icons/hi'

export default function ConfirmationModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Confirmation", 
  message = "Êtes-vous sûr de vouloir effectuer cette action ?", 
  confirmText = "Confirmer", 
  cancelText = "Annuler",
  type = 'danger' // 'danger', 'info', 'warning', 'question'
}) {
  const ICONS = {
    danger: HiExclamation,
    warning: HiExclamation,
    info: HiInformationCircle,
    question: HiQuestionMarkCircle
  }

  const COLORS = {
    danger: 'text-red-400 bg-red-500/10 border-red-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    question: 'text-gold bg-gold/10 border-gold/20'
  }

  const BTN_COLORS = {
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20',
    info: 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/20',
    question: 'bg-gold text-black hover:bg-gold/80 shadow-gold/20'
  }

  const Icon = ICONS[type] || HiExclamation

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm bg-[#0d0d14]/90 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 w-full h-1 opacity-30 ${type === 'danger' ? 'bg-red-500' : 'bg-gold'}`} />
            
            <div className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center mb-8 ${COLORS[type]}`}>
                <Icon className="w-10 h-10" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-white mb-3 uppercase tracking-[0.2em] leading-tight">
                {title}
              </h3>
              
              <p className="text-white/40 text-sm mb-10 leading-relaxed font-medium">
                {message}
              </p>
              
              {/* Actions */}
              <div className="flex flex-col gap-3 w-full">
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${BTN_COLORS[type]}`}
                  >
                    {confirmText}
                  </button>
                )}
                <button
                  onClick={onCancel}
                  className="w-full py-4 text-white/30 hover:text-white hover:bg-white/5 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all"
                >
                  {cancelText}
                </button>
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gold/5 rounded-full blur-[60px] pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
