type ActionCardProps = {
  title: string;
  subtitle: string;
  onClick?: () => void;
};
const ActionCard: React.FC<ActionCardProps> = ({title,subtitle, onClick}) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 py-6 hover:border-blue-500 hover:bg-slate-900 transition"
    >
      <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-lg group-hover:bg-blue-600">
        +
      </div>
      <div className="mt-2 text-sm font-semibold">{title}</div>
      <div className="text-[11px] text-slate-400">{subtitle}</div>
    </button>
  );
};
export default ActionCard;
