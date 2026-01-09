

interface StatProps {
  label: string;
  value: string;
  badge: string;
  color: string; // Tailwind gradient classes: e.g. "from-fuchsia-500 to-pink-500"
}

const StatCard: React.FC<StatProps> = ({ label, value, badge, color }) => (
  <div
    className={`rounded-2xl px-4 py-3 bg-linear-to-br ${color} text-white shadow-lg shadow-black/40`}
  >
    <div className="flex items-center justify-between text-xs">
      <span className="opacity-80">{label}</span>
      <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
        {badge}
      </span>
    </div>
    <div className="mt-3 text-2xl font-bold">{value}</div>
  </div>
);

export default StatCard;