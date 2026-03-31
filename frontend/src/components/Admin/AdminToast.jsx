import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiCheckCircle, HiExclamationCircle, HiXCircle, HiX } from 'react-icons/hi'

const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

const ICONS = {
  success: HiCheckCircle,
  error: HiXCircle,
  warning: HiExclamationCircle,
}

const COLORS = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
}

function Toast({ id, type = 'success', message, onDismiss }) {
  const Icon = ICONS[type]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 3500)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl ${COLORS[type]}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium text-[var(--a-text)]/90 flex-1">{message}</span>
      <button onClick={() => onDismiss(id)} className="p-1 hover:bg-[var(--a-hover-2)] rounded-lg transition-colors">
        <HiX className="w-3.5 h-3.5 text-[var(--a-text)]/40" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, message }])
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => addToast('success', msg),
    error: (msg) => addToast('error', msg),
    warning: (msg) => addToast('warning', msg),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <Toast {...t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
