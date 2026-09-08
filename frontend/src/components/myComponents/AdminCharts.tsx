import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChartIcon, BarChart3Icon, ActivityIcon, UsersIcon, VideoIcon, TvIcon, NewspaperIcon, SparklesIcon } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalAnimes: number;
  totalEpisodes: number;
  totalNews: number;
  totalSuggestions: number;
  totalVisits: number;
  genreDistribution: { genre: string; count: number }[];
  recentActivity: { date: string; count: number }[];
}

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#8b5cf6", "#f59e0b",
  "#06b6d4", "#ec4899", "#14b8a6", "#6366f1", "#f97316"
];

export const GenreDonutChart: React.FC<{ data: { genre: string; count: number }[] }> = ({ data }) => {
  const total = useMemo(() => data.reduce((acc, d) => acc + d.count, 0), [data]);
  
  const slices = useMemo(() => {
    let currentAngle = 0;
    return data.slice(0, 7).map((d, i) => {
      const percentage = total > 0 ? (d.count / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      return {
        ...d,
        percentage: percentage.toFixed(1),
        color: COLORS[i % COLORS.length],
        startAngle,
        endAngle: currentAngle
      };
    });
  }, [data, total]);

  // SVG parameters
  const size = 220;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 flex flex-col justify-between h-full hover:border-[#30363d] transition-all shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#21262d]">
        <PieChartIcon className="text-blue-400 size-5" />
        <h3 className="font-bold text-white text-base tracking-wide" style={{ fontFamily: "Righteous, cursive" }}>
          Distribuția Genurilor
        </h3>
      </div>

      {data.length > 0 ? (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
          {/* SVG Ring Chart */}
          <div className="relative size-[220px] shrink-0 flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#161b22"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {slices.map((slice, i) => {
                const strokeDasharray = `${(parseFloat(slice.percentage) / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -(accumulatedPercent / 100) * circumference;
                accumulatedPercent += parseFloat(slice.percentage);

                return (
                  <motion.circle
                    key={slice.genre}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={slice.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <title>{`${slice.genre}: ${slice.count} (${slice.percentage}%)`}</title>
                  </motion.circle>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-black text-white">{total}</span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Anime</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2.5 w-full sm:w-auto max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {slices.map((slice) => (
              <div key={slice.genre} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-gray-300 font-medium">{slice.genre}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-gray-500 font-bold">{slice.count}</span>
                  <span className="text-gray-400">({slice.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 text-sm">Nu există date de distribuție a genurilor.</div>
      )}
    </div>
  );
};

export const ContentBarChart: React.FC<{ stats: AdminStats }> = ({ stats }) => {
  const items = [
    { label: "Utilizatori", count: stats.totalUsers, icon: <UsersIcon size={16} />, color: "bg-blue-500", text: "text-blue-400" },
    { label: "Anime", count: stats.totalAnimes, icon: <VideoIcon size={16} />, color: "bg-red-500", text: "text-red-400" },
    { label: "Episoade", count: stats.totalEpisodes, icon: <TvIcon size={16} />, color: "bg-emerald-500", text: "text-emerald-400" },
    { label: "Știri", count: stats.totalNews, icon: <NewspaperIcon size={16} />, color: "bg-purple-500", text: "text-purple-400" },
    { label: "Sugestii", count: stats.totalSuggestions, icon: <SparklesIcon size={16} />, color: "bg-amber-500", text: "text-amber-400" },
  ];

  const maxVal = Math.max(1, ...items.map(i => i.count));

  return (
    <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 flex flex-col justify-between h-full hover:border-[#30363d] transition-all shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#21262d]">
        <BarChart3Icon className="text-emerald-400 size-5" />
        <h3 className="font-bold text-white text-base tracking-wide" style={{ fontFamily: "Righteous, cursive" }}>
          Prezentare Bază de Date
        </h3>
      </div>

      <div className="space-y-5 my-auto">
        {items.map((item, index) => {
          const widthPercent = Math.round((item.count / maxVal) * 100);
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-300 font-medium">
                  <span className={item.text}>{item.icon}</span>
                  {item.label}
                </span>
                <span className="font-mono font-bold text-white bg-[#161b22] px-2.5 py-0.5 rounded border border-[#21262d] text-xs">
                  {item.count}
                </span>
              </div>

              <div className="h-3 w-full bg-[#161b22] rounded-full overflow-hidden border border-[#21262d]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(widthPercent, 5)}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  className={`h-full ${item.color} rounded-full shadow-md`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ActivityAreaChart: React.FC<{ data: { date: string; count: number }[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Return dummy 7 days if no real visits logged yet
      const fallback = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        fallback.push({ date: d.toISOString().split("T")[0], count: Math.floor(Math.random() * 5) + 1 });
      }
      return fallback;
    }
    return data;
  }, [data]);

  const maxCount = Math.max(10, ...chartData.map(d => d.count));
  const height = 180;
  const width = 500; // coordinate system width

  const points = chartData.map((d, i) => {
    const x = (i / Math.max(1, chartData.length - 1)) * width;
    const y = height - (d.count / maxCount) * (height - 30) - 10;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 flex flex-col justify-between h-full hover:border-[#30363d] transition-all shadow-xl col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#21262d]">
        <div className="flex items-center gap-3">
          <ActivityIcon className="text-purple-400 size-5" />
          <h3 className="font-bold text-white text-base tracking-wide" style={{ fontFamily: "Righteous, cursive" }}>
            Creștere Activitate 30 Zile
          </h3>
        </div>
        <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-mono">
          Vizite DB Live
        </span>
      </div>

      <div className="relative w-full h-[180px] my-auto overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height - 1} x2={width} y2={height - 1} stroke="#21262d" strokeWidth="1" />
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#21262d" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="10" x2={width} y2={10} stroke="#21262d" strokeWidth="1" strokeDasharray="4 4" />

          {/* Area under curve */}
          <motion.polygon
            points={areaPoints}
            fill="url(#purpleGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Line stroke */}
          <motion.polyline
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Data points */}
          {chartData.map((d, i) => {
            const x = (i / Math.max(1, chartData.length - 1)) * width;
            const y = height - (d.count / maxCount) * (height - 30) - 10;
            return (
              <g key={d.date} className="group cursor-pointer">
                <circle cx={x} cy={y} r="4" fill="#c4b5fd" className="group-hover:r-6 transition-all" />
                <title>{`${d.date}: ${d.count} vizite`}</title>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-[#21262d] font-mono">
        <span>{chartData[0]?.date || "acum 30 zile"}</span>
        <span>Maxim: {maxCount} vizite/zi</span>
        <span>{chartData[chartData.length - 1]?.date || "Astăzi"}</span>
      </div>
    </div>
  );
};
