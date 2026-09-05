import React, { useState } from 'react';
import { Card } from '../common/Card';
import { RiskTrendPoint } from '../../types/analytics';
import { Activity } from 'lucide-react';

export interface RiskTrendChartProps {
  data: RiskTrendPoint[];
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 600;
  const height = 240;
  const padding = { top: 25, right: 25, bottom: 35, left: 45 };

  const maxVal = 2; // scale up to 2 incidents for clean resolution
  const minVal = 0;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getPoints = (key: 'reviewCount' | 'highRiskCount') => {
    return data.map((d, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d[key] - minVal) / (maxVal - minVal)) * chartHeight;
      return { x, y, val: d[key], date: d.displayDate };
    });
  };

  const reviewPoints = getPoints('reviewCount');
  const highRiskPoints = getPoints('highRiskCount');

  const generateLinePath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
  };

  return (
    <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 relative shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Risk Trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Risk activity across recent transactions</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400" />
            <span className="text-slate-700 dark:text-slate-300">Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 dark:bg-rose-400" />
            <span className="text-slate-700 dark:text-slate-300">High Risk</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-64 overflow-visible select-none"
        >
          {/* Grid lines */}
          {[0, 1, 2].map((val) => {
            const y = padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
            return (
              <g key={val} className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  className="text-slate-200 dark:text-slate-800"
                />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" fill="currentColor">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Hover Column Guide */}
          {hoveredIndex !== null && (
            <line
              x1={reviewPoints[hoveredIndex].x}
              y1={padding.top}
              x2={reviewPoints[hoveredIndex].x}
              y2={padding.top + chartHeight}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="text-slate-400 dark:text-slate-600"
            />
          )}

          {/* Review Line Path (Amber) */}
          <path
            d={generateLinePath(reviewPoints)}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* High Risk Line Path (Rose) */}
          <path
            d={generateLinePath(highRiskPoints)}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((d, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Invisible Hit Target */}
              <rect
                x={reviewPoints[i].x - 15}
                y={padding.top}
                width="30"
                height={chartHeight}
                fill="transparent"
              />

              {/* Review Dot */}
              <circle
                cx={reviewPoints[i].x}
                cy={reviewPoints[i].y}
                r={hoveredIndex === i ? 5 : 3.5}
                className="fill-white dark:fill-slate-900 stroke-amber-500 dark:stroke-amber-400 transition-all"
                strokeWidth="2"
              />

              {/* High Risk Dot */}
              <circle
                cx={highRiskPoints[i].x}
                cy={highRiskPoints[i].y}
                r={hoveredIndex === i ? 5 : 3.5}
                className="fill-white dark:fill-slate-900 stroke-rose-500 dark:stroke-rose-400 transition-all"
                strokeWidth="2"
              />

              {/* X Axis Label */}
              <text
                x={reviewPoints[i].x}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400"
              >
                {d.displayDate}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg p-2.5 text-xs font-mono animate-in fade-in zoom-in-95 duration-100"
            style={{
              left: `${(reviewPoints[hoveredIndex].x / width) * 100}%`,
              top: '25%',
            }}
          >
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-sans border-b border-slate-100 dark:border-slate-800 pb-1">
              {data[hoveredIndex].displayDate}
            </p>
            <div className="pt-1.5 space-y-0.5">
              <p className="text-amber-700 dark:text-amber-400 font-bold flex items-center justify-between gap-3">
                <span>Review:</span>
                <span>{data[hoveredIndex].reviewCount}</span>
              </p>
              <p className="text-rose-700 dark:text-rose-400 font-bold flex items-center justify-between gap-3">
                <span>High Risk:</span>
                <span>{data[hoveredIndex].highRiskCount}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
