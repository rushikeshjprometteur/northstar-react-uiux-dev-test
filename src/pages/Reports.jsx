import PageHeader from '../components/PageHeader.jsx'
import { reportRows } from '../data/mockData.js'

export default function Reports({ search }) {
  const maxRevenue = Math.max(...reportRows.map((r) => r.revenue))

  const filtered = search
    ? reportRows.filter((r) => r.month.toLowerCase().includes(search.toLowerCase()))
    : reportRows

  return (
    <>
      <PageHeader eyebrow="Insights" title="Reports" description="Revenue, churn, and user trends over recent months." />
      <section className="panel chart-panel">
        <h2>Revenue</h2>
        <div className="bar-chart" role="img" aria-label="Revenue bar chart">
          {filtered.map((row) => (
            <button
              key={row.month}
              className="chart-bar"
              style={{ height: `${(row.revenue / maxRevenue) * 100}%` }}
              title={`${row.month}: £${row.revenue.toLocaleString()}`}
              aria-label={`${row.month}: £${row.revenue.toLocaleString()} revenue`}
            >
              <span>{row.month}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="panel table-wrap">
        <table className="data-table compact">
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Revenue</th>
              <th scope="col">Churn</th>
              <th scope="col">Users</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>£{row.revenue.toLocaleString()}</td>
                <td>{row.churn}%</td>
                <td>{row.users.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
