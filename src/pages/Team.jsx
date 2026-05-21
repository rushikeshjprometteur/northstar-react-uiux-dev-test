import { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { team } from '../data/mockData.js'

export default function Team({ search }) {
  const [members, setMembers] = useState(team)
  const [showInactive, setShowInactive] = useState(false)

  const visible = useMemo(() => {
    let filtered = members.filter((m) => showInactive ? true : m.active)
    if (search) {
      filtered = filtered.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase())
      )
    }
    return filtered
  }, [members, showInactive, search])

  function removeMember(id) {
    // Fixed: creates new array with filter instead of mutating with splice
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id))
    }
  }

  return (
    <>
      <PageHeader eyebrow="People" title="Team capacity" description="Review active team members and workload balance." />
      <label className="toggle-row panel">
        <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
        Show inactive members
      </label>
      <div className="card-grid">
        {visible.length > 0 ? (
          visible.map((member) => (
            <article className="person-card" key={member.id}>
              <div className="avatar" aria-hidden="true">{member.name[0]}</div>
              <div>
                <h3>{member.name}</h3>
                <p>{member.role} · {member.location}</p>
                <div
                  className="meter"
                  role="progressbar"
                  aria-valuenow={member.capacity}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${member.name} capacity`}
                >
                  <span style={{ width: `${Math.min(member.capacity, 100)}%` }} />
                </div>
                <small>{member.capacity}% allocated{member.capacity > 100 ? ' ⚠️ overloaded' : ''}</small>
              </div>
              <button className="danger-btn" onClick={() => removeMember(member.id)} aria-label={`Remove ${member.name}`}>
                Remove
              </button>
            </article>
          ))
        ) : (
          <div className="empty-state panel">
            <p>No team members match your criteria.</p>
          </div>
        )}
      </div>
    </>
  )
}
