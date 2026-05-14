import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'

export default function SettingsPage() {
  const [settings, setSettings] = useState({ company: 'Northstar', timezone: 'Europe/London', emails: true, density: 'Comfortable' })
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 900)
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Settings" description="Company preferences with intentionally inconsistent form behavior." />
      <section className="panel settings-form">
        <label>Company name<input defaultValue={settings.company} onChange={(e) => setSettings({ ...settings, company: e.target.value })} /></label>
        <label>Timezone<select defaultValue={settings.timezone}><option>Europe/London</option><option>America/New_York</option><option>Asia/Tokyo</option></select></label>
        <label className="checkbox-line"><input type="checkbox" checked={settings.emails} /> Send email reports</label>
        <label>Density<select value={settings.density} onChange={(e) => setSettings({ density: e.target.value })}><option>Compact</option><option>Comfortable</option><option>Spacious</option></select></label>
        <button className="primary-btn" onClick={save}>Save settings</button>
        {saved && <p className="toast">Settings saved, maybe.</p>}
      </section>
    </>
  )
}
