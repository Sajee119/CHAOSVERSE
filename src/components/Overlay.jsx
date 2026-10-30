import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useBodyLock, useEscape } from '../lib/hooks'

export default function Overlay({
  open,
  onClose,
  children,
  label = 'Fictional experience',
  tone = '#c8ff3d',
  className = '',
  closeText = 'Exit experience',
  hideClose = false,
  escapeHint = true,
}) {
  const labelId = useId()
  const closeRef = useRef(null)

  useBodyLock(open)
  useEscape(onClose, open)

  useEffect(() => {
    if (!open) return undefined
    const timer = window.setTimeout(() => closeRef.current?.focus(), 150)
    return () => window.clearTimeout(timer)
  }, [open])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          className={`fixed inset-0 z-[400] overflow-y-auto bg-[#04020a] ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span id={labelId} className="sr-only">{label}</span>
          {!hideClose && (
            <div className="fixed right-4 top-4 z-[420] flex items-center gap-2 sm:right-6 sm:top-6">
              {escapeHint && (
                <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 sm:inline-flex">
                  ESC to escape
                </span>
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70 backdrop-blur transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                style={{ borderColor: `${tone}30` }}
                aria-label={closeText}
              >
                <X size={14} />
                {closeText}
              </button>
            </div>
          )}
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
