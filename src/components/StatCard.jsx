export default function StatCard({ label, value, trend }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span className={trend > 0 ? 'good' : 'bad'}>{trend > 0 ? '+' : ''}{trend}%</span>
    </article>
  )
}
