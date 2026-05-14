import PageHeader from '../components/PageHeader.jsx'
import { reportRows } from '../data/mockData.js'

export default function Reports() {
  const maxRevenue = 70000
  return (
    <>
      <PageHeader eyebrow="Insights" title="Reports" description="Revenue, churn, and user trends shown with deliberately fragile charts." />
      <section className="panel chart-panel">
        <h2>Revenue</h2>
        <div className="bar-chart" aria-label="Revenue bar chart">
          {reportRows.map((row) => (
            <button key={row.month} className="chart-bar" style={{ height: `${(row.revenue / maxRevenue) * 100}%` }} title={`${row.month}: £${row.revenue}`}>
              <span>{row.month}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="panel table-wrap">
        <table className="data-table compact">
          <thead><tr><th>Month</th><th>Revenue</th><th>Churn</th><th>Users</th></tr></thead>
          <tbody>{reportRows.map((row) => <tr key={row.month}><td>{row.month}</td><td>£{row.revenue}</td><td>{row.churn}%</td><td>{row.users}</td></tr>)}</tbody>
        </table>
      </section>
    </>
  )
}
