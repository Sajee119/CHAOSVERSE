import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useBodyLock, useEscape } from '../lib/hooks'

export default function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  className = '',
  maxWidth = 'max-w-3xl',
  accent = '#c8ff3d',
  closeLabel = 'Close',
}) {
  const titleId = useId()
  const closeRef = useRef(null)

  useBodyLock(open)
  useEscape(onClose, open)

  useEffect(() => {
    if (!open) return undefined
    const timer = window.setTimeout(() => closeRef.current?.focus(), 120)
    return () => window.clearTimeout(timer)
  }, [open])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto bg-[#04020a]/80 p-4 py-8 backdrop-blur-xl sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            className={`glass-strong relative my-auto w-full overflow-hidden rounded-[26px] shadow-[0_40px_160px_rgba(0,0,0,.65)] ${maxWidth} ${className}`}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
              <div className="min-w-0">
                {eyebrow && <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: accent }}>{eyebrow}</p>}
                {title && <h2 id={titleId} className="mt-1 truncate font-display text-3xl leading-none tracking-wide sm:text-4xl">{title}</h2>}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
