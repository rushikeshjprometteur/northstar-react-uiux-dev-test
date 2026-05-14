import { useEffect } from 'react'

export default function BuggyModal({ title, children, open, onClose }) {
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', closeOnEscape)
    // BUG: listener is never removed if open changes quickly
  }, [open])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* BUG: clicking inside modal also closes it because propagation is not stopped */}
      <section className="modal-card" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>x</button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  )
}
