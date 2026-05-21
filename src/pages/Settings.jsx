import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    company: 'Northstar',
    timezone: 'Europe/London',
    emails: true,
    density: 'Comfortable'
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  function save() {
    if (!settings.company.trim()) {
      setError('Company name is required.')
      return
    }
    setError('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Settings" description="Company preferences and configuration." />
      <section className="panel settings-form">
        <label htmlFor="settings-company">
          Company name
          <input
            id="settings-company"
            value={settings.company}
            onChange={(e) => updateField('company', e.target.value)}
            required
          />
        </label>

        <label htmlFor="settings-timezone">
          Timezone
          <select
            id="settings-timezone"
            value={settings.timezone}
            onChange={(e) => updateField('timezone', e.target.value)}
          >
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
          </select>
        </label>

        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={settings.emails}
            onChange={(e) => updateField('emails', e.target.checked)}
          />
          Send email reports
        </label>

        <label htmlFor="settings-density">
          Density
          <select
            id="settings-density"
            value={settings.density}
            onChange={(e) => updateField('density', e.target.value)}
          >
            <option>Compact</option>
            <option>Comfortable</option>
            <option>Spacious</option>
          </select>
        </label>

        {error && <p style={{ color: '#b42318', margin: 0 }}>{error}</p>}

        <button className="primary-btn" onClick={save}>Save settings</button>
        {saved && <p className="toast" role="status">Settings saved successfully.</p>}
      </section>
    </>
  )
}
