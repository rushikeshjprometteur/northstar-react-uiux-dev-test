import { useEffect, useRef, useCallback } from 'react'

export default function Modal({ title, children, open, onClose }) {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Escape key handler with proper cleanup
  useEffect(() => {
    if (!open) return

    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  // Focus management: trap focus inside modal
  useEffect(() => {
    if (!open) return

    // Save the previously focused element
    previousFocusRef.current = document.activeElement

    // Focus the first focusable element in the modal
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length > 0) focusable[0].focus()
      }
    }, 50)

    return () => {
      clearTimeout(timer)
      // Restore focus when modal closes
      if (previousFocusRef.current) previousFocusRef.current.focus()
    }
  }, [open])

  // Focus trap: keep Tab cycling within the modal
  const handleKeyDown = useCallback((event) => {
    if (event.key !== 'Tab' || !modalRef.current) return

    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }, [])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={handleKeyDown} role="presentation">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- section has role="dialog" making it interactive */}
      <section
        ref={modalRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          ×
        </button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </section>
    </div>
  )
}
