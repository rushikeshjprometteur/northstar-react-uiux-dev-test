export default function StatCard({ label, value, trend }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span className={trend > 0 ? 'good' : 'bad'} aria-label={`Trend: ${trend > 0 ? 'up' : 'down'} ${Math.abs(trend)}%`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </span>
    </article>
  )
}
