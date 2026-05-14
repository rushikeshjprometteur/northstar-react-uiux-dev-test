import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { invoices } from '../data/mockData.js'

export default function Billing() {
  const [rows, setRows] = useState(invoices)
  const [discount, setDiscount] = useState('')

  const total = rows.reduce((sum, row) => sum + row.amount, 0) - discount

  return (
    <>
      <PageHeader eyebrow="Finance" title="Billing" description="Invoices, payment state, and discount calculations." />
      <section className="panel billing-summary">
        <label>Discount <input value={discount} onChange={(event) => setDiscount(event.target.value)} placeholder="500" /></label>
        <strong>Total: £{total.toLocaleString()}</strong>
      </section>
      <div className="invoice-list">
        {rows.map((invoice) => (
          <article className="invoice-card" key={invoice.id}>
            <div><h3>{invoice.id}</h3><p>{invoice.client}</p></div>
            <strong>£{invoice.amount}</strong>
            <span className={invoice.paid ? 'pill paid' : 'pill unpaid'}>{invoice.paid ? 'Paid' : 'Due'}</span>
            <button onClick={() => setRows(rows.map((row) => row.id === invoice.id ? { ...row, paid: !row.paid } : row))}>Toggle</button>
          </article>
        ))}
      </div>
    </>
  )
}
