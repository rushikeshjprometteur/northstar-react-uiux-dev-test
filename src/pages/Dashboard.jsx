import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import Modal from '../components/BuggyModal.jsx'
import { projects, invoices } from '../data/mockData.js'

export default function Dashboard({ search }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('Review blocked work, confirm invoices, and update client-facing status.')
  const [summaryName, setSummaryName] = useState('')

  const totalBudget = useMemo(() => projects.reduce((sum, p) => sum + p.budget, 0), [])
  const unpaid = invoices.filter((inv) => !inv.paid).reduce((sum, inv) => sum + inv.amount, 0)

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes((search || '').toLowerCase())),
    [search]
  )

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Executive Dashboard"
        description="A compact operations dashboard showing project health, budgets, and outstanding invoices."
        action={<button className="primary-btn" onClick={() => setOpen(true)}>Create summary</button>}
      />

      <div className="stats-grid">
        <StatCard label="Active projects" value={projects.length} trend={12} />
        <StatCard label="Total budget" value={`£${totalBudget.toLocaleString()}`} trend={-4} />
        <StatCard label="Unpaid invoices" value={`£${unpaid.toLocaleString()}`} trend={8} />
        <StatCard label="Avg health" value="62%" trend={-11} />
      </div>

      <div className="content-grid two-col">
        <section className="panel">
          <h2>Project health</h2>
          <div className="health-list">
            {filtered.length > 0 ? (
              filtered.map((project) => (
                <div className="health-row" key={project.id}>
                  <span>{project.name}</span>
                  <div className="health-bar" role="progressbar" aria-valuenow={project.health} aria-valuemin={0} aria-valuemax={100} aria-label={`${project.name} health`}>
                    <div style={{ width: `${Math.min(project.health, 100)}%` }} />
                  </div>
                  <b>{project.health}%</b>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No projects match your search.</p>
              </div>
            )}
          </div>
        </section>

        <section className="panel notes-panel">
          <h2>Today</h2>
          <p>Review blocked work, confirm invoices, and update client-facing status.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label="Daily notes"
          />
        </section>
      </div>

      <Modal title="Generate summary" open={open} onClose={() => setOpen(false)}>
        <p>Create a summary report for stakeholders.</p>
        <input
          placeholder="Summary name"
          value={summaryName}
          onChange={(e) => setSummaryName(e.target.value)}
          aria-label="Summary name"
        />
        <button className="primary-btn" onClick={() => { if (summaryName.trim()) setOpen(false) }}>
          Generate
        </button>
      </Modal>
    </>
  )
}
