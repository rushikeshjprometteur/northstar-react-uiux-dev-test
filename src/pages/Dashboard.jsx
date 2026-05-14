import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import BuggyModal from '../components/BuggyModal.jsx'
import { projects, invoices } from '../data/mockData.js'

export default function Dashboard({ search }) {
  const [open, setOpen] = useState(false)
  const totalBudget = useMemo(() => projects.reduce((sum, project) => sum + project.budget, 0), [])
  const unpaid = invoices.filter((invoice) => !invoice.paid).reduce((sum, invoice) => sum + invoice.amount, 0)
  const filtered = projects.filter((project) => project.name.toLowerCase().includes(search))

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Executive Dashboard"
        description="A compact operations dashboard with many hidden UI and state issues for candidates to improve."
        action={<button className="primary-btn" onClick={() => setOpen(true)}>Create summary</button>}
      />
      <div className="stats-grid">
        <StatCard label="Active projects" value={projects.length} trend={12} />
        <StatCard label="Total budget" value={`£${totalBudget.toLocaleString()}`} trend={-4} />
        <StatCard label="Unpaid invoices" value={`£${unpaid.toLocaleString()}`} trend={8} />
        <StatCard label="Avg health" value="62%" trend={-11} />
      </div>
      <div className="content-grid two-col">
        <section className="panel oversized-panel">
          <h2>Project health</h2>
          <div className="health-list">
            {filtered.map((project) => (
              <div className="health-row" key={project.id}>
                <span>{project.name}</span>
                <div className="health-bar"><i style={{ width: `${project.health}%` }} /></div>
                <b>{project.health}%</b>
              </div>
            ))}
          </div>
        </section>
        <section className="panel notes-panel">
          <h2>Today</h2>
          <p>Review blocked work, confirm invoices, and update client-facing status.</p>
          <textarea defaultValue="Candidate should notice this textarea is uncontrolled and causes reset issues." />
        </section>
      </div>
      <BuggyModal title="Generate summary" open={open} onClose={() => setOpen(false)}>
        <p>This modal intentionally has focus, escape-key, and click propagation problems.</p>
        <input placeholder="Summary name" autoFocus />
        <button className="primary-btn">Generate</button>
      </BuggyModal>
    </>
  )
}
