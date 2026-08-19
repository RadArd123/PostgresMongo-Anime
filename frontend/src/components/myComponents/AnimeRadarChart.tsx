// @ts-nocheck
import { useMemo } from "react";
import { motion } from "framer-motion";

interface RadarMetric {
  key: string;
  label: string;
}

interface RadarSeries {
  label: string;
  color: string;
  values: Record<string, number>;
}

interface Props {
  metrics: RadarMetric[];
  data: RadarSeries[];
  size?: number;
  levels?: number;
}

const AnimeRadarChart = ({ metrics, data, size = 340, levels = 5 }: Props) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 56;
  const n = metrics.length;

  const angleStep = (2 * Math.PI) / n;

  const getPoint = (metricIdx: number, value: number) => {
    const angle = metricIdx * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (metricIdx: number) => {
    const angle = metricIdx * angleStep - Math.PI / 2;
    const r = radius + 28;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const getAxisEnd = (metricIdx: number) => {
    const angle = metricIdx * angleStep - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  const buildPolygonPath = (series: RadarSeries) => {
    const points = metrics.map((m, i) => {
      const val = series.values[m.key] ?? 0;
      const p = getPoint(i, val);
      return `${p.x},${p.y}`;
    });
    return `M ${points.join(" L ")} Z`;
  };

  const gridLevels = Array.from({ length: levels }, (_, i) => ((i + 1) / levels) * 100);

  const buildGridPolygon = (pct: number) => {
    const points = metrics.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (pct / 100) * radius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return `M ${points.join(" L ")} Z`;
  };

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid polygons */}
      {gridLevels.map((pct, i) => (
        <path
          key={i}
          d={buildGridPolygon(pct)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {metrics.map((_, i) => {
        const end = getAxisEnd(i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        );
      })}

      {/* Data areas */}
      {data.map((series, si) => (
        <motion.path
          key={series.label}
          d={buildPolygonPath(series)}
          fill={series.color}
          fillOpacity={0.18}
          stroke={series.color}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: si * 0.15, duration: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* Data points */}
      {data.map((series) =>
        metrics.map((m, i) => {
          const val = series.values[m.key] ?? 0;
          const p = getPoint(i, val);
          return (
            <motion.circle
              key={`${series.label}-${m.key}`}
              cx={p.x}
              cy={p.y}
              r={4}
              fill={series.color}
              stroke="#0d1117"
              strokeWidth={2}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: 4 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            />
          );
        })
      )}

      {/* Labels */}
      {metrics.map((m, i) => {
        const lp = getLabelPoint(i);
        const textAnchor =
          Math.abs(lp.x - cx) < 10
            ? "middle"
            : lp.x < cx
            ? "end"
            : "start";
        return (
          <text
            key={m.key}
            x={lp.x}
            y={lp.y}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            fontSize={11}
            fill="rgba(255,255,255,0.6)"
            fontFamily="Nunito, sans-serif"
            fontWeight={600}
          >
            {m.label}
          </text>
        );
      })}
    </svg>
  );
};

export default AnimeRadarChart;
