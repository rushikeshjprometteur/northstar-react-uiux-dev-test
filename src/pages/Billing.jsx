import { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { invoices } from '../data/mockData.js'

export default function Billing({ search }) {
  const [rows, setRows] = useState(invoices)
  const [discount, setDiscount] = useState('')

  const filtered = useMemo(() => {
    if (!search) return rows
    return rows.filter((r) =>
      r.client.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    )
  }, [rows, search])

  const subtotal = filtered.reduce((sum, r) => sum + r.amount, 0)
  const discountNum = parseFloat(discount) || 0
  const total = Math.max(0, subtotal - discountNum)

  function handleDiscountChange(e) {
    const val = e.target.value
    // Allow empty or valid numeric input only
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setDiscount(val)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Finance" title="Billing" description="Invoices, payment state, and discount calculations." />
      <section className="panel billing-summary">
        <label>
          Discount (£)
          <input
            value={discount}
            onChange={handleDiscountChange}
            placeholder="0.00"
            inputMode="decimal"
            aria-label="Discount amount in pounds"
          />
        </label>
        <strong>Total: £{total.toLocaleString()}</strong>
      </section>
      <div className="invoice-list">
        {filtered.length > 0 ? (
          filtered.map((invoice) => (
            <article className="invoice-card" key={invoice.id}>
              <div>
                <h3>{invoice.id}</h3>
                <p>{invoice.client}</p>
              </div>
              <strong>£{invoice.amount.toLocaleString()}</strong>
              <span className={invoice.paid ? 'pill paid' : 'pill unpaid'}>
                {invoice.paid ? 'Paid' : 'Due'}
              </span>
              <button
                className="secondary-btn"
                onClick={() => setRows(rows.map((r) => r.id === invoice.id ? { ...r, paid: !r.paid } : r))}
                aria-label={`Mark ${invoice.id} as ${invoice.paid ? 'unpaid' : 'paid'}`}
              >
                {invoice.paid ? 'Mark Due' : 'Mark Paid'}
              </button>
            </article>
          ))
        ) : (
          <div className="empty-state panel">
            <p>No invoices match your search.</p>
          </div>
        )}
      </div>
    </>
  )
}
