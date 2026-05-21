import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'

export default function Support({ search }) {
  const [tickets, setTickets] = useState([
    { id: 1, title: 'Client cannot export report', priority: 'High' },
    { id: 2, title: 'Invoice duplicate after refresh', priority: 'Medium' },
    { id: 3, title: 'Mobile menu overlaps content', priority: 'Low' }
  ])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Low')
  const [error, setError] = useState('')

  function addTicket() {
    if (!title.trim()) {
      setError('Ticket title is required.')
      return
    }
    setError('')
    setTickets([{ id: Date.now(), title: title.trim(), priority }, ...tickets])
    setTitle('')
    setPriority('Low')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addTicket()
  }

  const filtered = search
    ? tickets.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    : tickets

  return (
    <>
      <PageHeader eyebrow="Helpdesk" title="Support" description="Create and manage support tickets." />
      <article className="prose prose-lg max-w-none panel">
        <h2>How tickets work</h2>
        <p>
          Use the composer below to log a new issue. Each ticket is triaged by priority so the team can respond in the
          right order.
        </p>
        <ul>
          <li><strong>High</strong> — production outages or blocked revenue.</li>
          <li><strong>Medium</strong> — degraded experience with a workaround.</li>
          <li><strong>Low</strong> — polish, questions, or non-urgent improvements.</li>
        </ul>
      </article>
      <section className="panel ticket-composer">
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError('') }}
          onKeyDown={handleKeyDown}
          placeholder="New ticket title"
          aria-label="New ticket title"
          aria-invalid={!!error}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Ticket priority">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button className="primary-btn" onClick={addTicket}>Add ticket</button>
      </section>
      {error && <p style={{ color: '#b42318', margin: '0 0 12px', fontSize: '14px' }}>{error}</p>}
      <section className="ticket-list">
        {filtered.length > 0 ? (
          filtered.map((ticket) => (
            <article className="ticket" key={ticket.id}>
              <strong>{ticket.title}</strong>
              <span className={`pill ${ticket.priority === 'High' ? 'unpaid' : ticket.priority === 'Medium' ? '' : 'paid'}`}>
                {ticket.priority}
              </span>
            </article>
          ))
        ) : (
          <div className="empty-state panel">
            <p>No tickets found.</p>
          </div>
        )}
      </section>
    </>
  )
}
