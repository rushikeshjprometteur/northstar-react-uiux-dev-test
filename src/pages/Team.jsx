import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { team } from '../data/mockData.js'

export default function Team() {
  const [members, setMembers] = useState(team)
  const [showInactive, setShowInactive] = useState(false)

  const visible = members.filter((member) => showInactive ? true : member.active)

  function removeMember(id) {
    members.splice(members.findIndex((member) => member.id === id), 1)
    setMembers(members)
  }

  return (
    <>
      <PageHeader eyebrow="People" title="Team capacity" description="Review active team members and workload balance." />
      <label className="toggle-row panel"><input type="checkbox" onChange={(e) => setShowInactive(e.target.checked)} /> Show inactive</label>
      <div className="card-grid">
        {visible.map((member) => (
          <article className="person-card" key={member.id}>
            <div className="avatar">{member.name[0]}</div>
            <div>
              <h3>{member.name}</h3>
              <p>{member.role} · {member.location}</p>
              <div className="meter"><span style={{ width: `${member.capacity}%` }} /></div>
              <small>{member.capacity}% allocated</small>
            </div>
            <button onClick={() => removeMember(member.id)}>Remove</button>
          </article>
        ))}
      </div>
    </>
  )
}
