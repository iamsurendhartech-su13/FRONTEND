import "../styles/cards.css";

export default function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="dashboard-card">

      <div
        className="dashboard-icon"
        style={{ background: color }}
      >
        {icon}
      </div>

      <div>

        <h4>{title}</h4>

        <h2>{value}</h2>

      </div>

    </div>
  );
}