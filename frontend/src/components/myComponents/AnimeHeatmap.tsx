import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Group } from "@visx/group";

export interface HeatmapDay {
  date: Date;
  count: number;
}

interface Props {
  data: HeatmapDay[];
  totalVisits?: number;
}

// ─── Constants ───────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// LeetCode / Brighter Green Colors
const LEVEL_COLORS = [
  "#262a33", // 0 - empty (lighter dark grey)
  "#14532d", // 1 - low (green-900)
  "#16a34a", // 2 (green-600)
  "#22c55e", // 3 (green-500)
  "#4ade80", // 4 - high (green-400)
];

const getLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
};

const getCellColor = (count: number) => LEVEL_COLORS[getLevel(count)];

// ─── Tooltip ─────────────────────────────────────────────
const Tooltip = ({ cell, x, y }: any) => {
  if (!cell) return null;
  const label = cell.count === 0
    ? "No visits"
    : `${cell.count} visit${cell.count !== 1 ? "s" : ""}`;
  const dateStr = cell.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <AnimatePresence>
      <motion.div
        key={dateStr}
        initial={{ opacity: 0, y: 4, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.12 }}
        className="pointer-events-none absolute z-50"
        style={{ left: x, top: y, transform: "translate(-50%, -100%) translateY(-8px)" }}
      >
        <div className="bg-[#1c2128] border border-[#30363d] rounded-lg px-3 py-2 shadow-2xl text-center min-w-[120px]">
          <p className="text-white text-xs font-bold">{label}</p>
          <p className="text-gray-400 text-[10px] mt-0.5">{dateStr}</p>
        </div>
        <div className="w-2 h-2 bg-[#1c2128] border-r border-b border-[#30363d] rotate-45 mx-auto -mt-[5px]" />
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Inner SVG chart ──────────────────────────────────────
const HeatmapInner = ({ data, width }: { data: HeatmapDay[]; width: number }) => {
  const countByDate: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      counts[d.date.toDateString()] = (counts[d.date.toDateString()] || 0) + d.count;
    });
    return counts;
  }, [data]);

  const { columns, numCols, numRows, cellW, cellH, GAP, MARGIN } = useMemo(() => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    let cols: any[] = [];
    const nc = 52, nr = 7, cw = 13, ch = 13, gap = 4; // increased gap slightly for LC feel
    
    // No left margin needed since Y axis is gone. Bottom margin increased for months.
    const marg = { top: 10, left: 10, right: 10, bottom: 24 };

    // Start exactly 52 weeks ago from the end of the current week
    const start = new Date(endOfWeek);
    start.setDate(endOfWeek.getDate() - (52 * 7) + 1);
    
    // Align start to Sunday
    start.setDate(start.getDate() - start.getDay());

    const cur = new Date(start);
    for (let w = 0; w < 52; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(cur);
        col.push({ bin: d, count: countByDate[cellDate.toDateString()] || 0, date: cellDate });
        cur.setDate(cur.getDate() + 1);
      }
      cols.push({ bin: w, bins: col });
    }

    return { columns: cols, numCols: nc, numRows: nr, cellW: cw, cellH: ch, GAP: gap, MARGIN: marg };
  }, [countByDate]);

  // Dimensions
  const stepX = cellW + GAP;
  const stepY = cellH + GAP;
  const actualSvgW = MARGIN.left + numCols * stepX + MARGIN.right;
  const plotH = numRows * stepY - GAP;
  const svgH = MARGIN.top + plotH + MARGIN.bottom;
  
  // Center grid horizontally if container is wider than the SVG
  const extraWidth = Math.max(0, width - actualSvgW);
  const offsetLeft = MARGIN.left + extraWidth / 2;

  // X-axis labels (bottom)
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let last = -1;
    columns.forEach((col, ci) => {
      const m = col.bins[0].date.getMonth();
      if (m !== last) { 
        labels.push({ label: MONTHS[m], col: ci }); 
        last = m; 
      }
    });
    if (labels.length > 1 && labels[1].col - labels[0].col < 4) labels.shift();
    return labels;
  }, [columns]);

  // Hover state
  const [hovered, setHovered] = useState<{ cell: any; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the rightmost edge on load
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
      }, 50);
    }
  }, [columns]);

  const handleMouseEnter = useCallback((cell: any, ci: number, di: number) => {
    if (!containerRef.current) return;
    const x = offsetLeft + ci * stepX + cellW / 2;
    const y = MARGIN.top + di * stepY;
    setHovered({ cell, x, y });
  }, [offsetLeft, MARGIN.top, stepX, stepY, cellW]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#30363d] [&::-webkit-scrollbar-thumb]:rounded-full pb-2" 
      style={{ minHeight: svgH }}
    >
      <Tooltip cell={hovered?.cell} x={hovered?.x} y={hovered?.y} />

      <svg width={Math.max(width, actualSvgW)} height={svgH} onMouseLeave={() => setHovered(null)}>
        <Group left={offsetLeft} top={MARGIN.top}>
          {/* Cells */}
          {columns.map((col, ci) =>
            col.bins.map((cell, di) => {
              const isHovered = hovered?.cell?.date?.toDateString() === cell.date.toDateString();

              return (
                <motion.rect
                  key={`${ci}-${di}`}
                  x={ci * stepX}
                  y={di * stepY}
                  width={cellW}
                  height={cellH}
                  rx={2.5}
                  fill={getCellColor(cell.count)}
                  opacity={hovered && !isHovered ? 0.45 : 1}
                  scale={isHovered ? 1.15 : 1}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: hovered && !isHovered ? 0.45 : 1, scale: isHovered ? 1.15 : 1 }}
                  transition={{ duration: 0.15, type: "spring", stiffness: 300 }}
                  style={{ cursor: "pointer", transformOrigin: `${ci * stepX + cellW / 2}px ${di * stepY + cellH / 2}px` }}
                  onMouseEnter={() => handleMouseEnter(cell, ci, di)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })
          )}

          {/* X Axis Labels at the bottom */}
          {monthLabels.map(({ label, col }) => (
            <text 
              key={`${label}-${col}`} 
              x={col * stepX} 
              y={plotH + 16} // Positioned below the plot
              fontSize={11} 
              fill="rgba(255,255,255,0.4)" 
              fontFamily="Nunito, sans-serif"
            >
              {label}
            </text>
          ))}
        </Group>
      </svg>
    </div>
  );
};

// ─── Public Export ────────────────────────────────────────
const AnimeHeatmap = ({ data, totalVisits = 0 }: Props) => {
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current && containerRef.current.clientWidth > 0) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const effectiveWidth = Math.max(containerWidth || 800, 400);

  // Compute streaks and active days
  const { totalActiveDays, maxStreak } = useMemo(() => {
    let activeDays = 0;
    let currentStreak = 0;
    let maxStr = 0;
    
    // Data passed is likely last 365 days, sort just in case
    const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    sortedData.forEach(d => {
      if (d.count > 0) {
        activeDays++;
        currentStreak++;
        maxStr = Math.max(maxStr, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return { totalActiveDays: activeDays, maxStreak: maxStr };
  }, [data]);

  return (
    <div className="flex flex-col w-full">
      {/* Header matching LeetCode style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-gray-300">
          <span className="text-xl font-bold text-white">{totalVisits}</span>
          <span className="text-sm">visits in the past one year</span>
          <svg className="w-4 h-4 text-gray-500 ml-1 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01"></path>
          </svg>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
          <div>
            Total active days: <span className="text-white font-bold">{totalActiveDays}</span>
          </div>
          <div>
            Max streak: <span className="text-white font-bold">{maxStreak}</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="w-full flex flex-col gap-3 min-h-[160px]">
        <HeatmapInner data={data} width={effectiveWidth} />
      </div>
    </div>
  );
};

export default AnimeHeatmap;
