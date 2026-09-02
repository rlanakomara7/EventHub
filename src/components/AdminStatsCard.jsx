function AdminStatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-secondary">{title}</p>

        {icon && <span className="text-gray-secondary">{icon}</span>}
      </div>

      <h2 className="mt-4 text-2xl font-bold text-gray-900">{value}</h2>

      <p className="mt-1 text-xs text-gray-secondary">{subtitle}</p>
    </div>
  );
}

export default AdminStatsCard;
