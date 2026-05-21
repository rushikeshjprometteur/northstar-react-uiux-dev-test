import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { projects } from '../data/mockData.js'

export default function Projects({ search }) {
  const [status, setStatus] = useState('All')
  const [sortAsc, setSortAsc] = useState(true)
  const [selected, setSelected] = useState([])

  const visible = useMemo(() => {
    let rows = projects
    if (status !== 'All') rows = rows.filter((p) => p.status === status)
    rows = rows.filter((p) => p.name.toLowerCase().includes((search || '').toLowerCase()))
    return [...rows].sort((a, b) => sortAsc ? a.budget - b.budget : b.budget - a.budget)
  }, [status, sortAsc, search])

  function toggle(id) {
    // Fixed: functional update prevents stale closure + proper toggle
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <>
      <PageHeader eyebrow="Work" title="Projects" description="Manage project status, ownership, deadlines, and budget." />
      <section className="toolbar panel">
        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
        <select id="status-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Blocked</option>
          <option>Paused</option>
        </select>
        <button className="secondary-btn" onClick={() => setSortAsc(!sortAsc)}>
          Sort by budget {sortAsc ? '↑' : '↓'}
        </button>
        <span>{selected.length} selected</span>
      </section>
      <section className="panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Select</span></th>
              <th scope="col">Name</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
              <th scope="col">Budget</th>
              <th scope="col">Due</th>
            </tr>
          </thead>
          <tbody>
            {visible.length > 0 ? (
              visible.map((project) => (
                <tr key={project.id} className={project.status === 'Blocked' ? 'danger-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(project.id)}
                      onChange={() => toggle(project.id)}
                      aria-label={`Select ${project.name}`}
                    />
                  </td>
                  <td>{project.name}</td>
                  <td>{project.owner}</td>
                  <td>
                    <span className={`pill ${project.status === 'Active' ? 'paid' : project.status === 'Blocked' ? 'unpaid' : ''}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>£{project.budget.toLocaleString()}</td>
                  <td>{project.due}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#667085' }}>
                  No projects match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  )
}
