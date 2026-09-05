import React, { useState } from 'react';
import { Card } from '../common/Card';
import { SpendingDataPoint } from '../../types/analytics';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, DollarSign } from 'lucide-react';

export interface SpendingChartProps {
  data: SpendingDataPoint[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<SpendingDataPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 25, bottom: 35, left: 55 };

  const maxAmount = Math.max(...data.map((d) => d.amount), 9000);
  const minAmount = 0;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate coordinates for each point
  const points = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.amount - minAmount) / (maxAmount - minAmount)) * chartHeight;
    return { ...d, x, y };
  });

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (point.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (point.x - prev.x) / 2;
      const cy2 = point.y;
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${point.x},${point.y}`;
    }, '');
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0},${padding.top + chartHeight} L ${
    points[0]?.x || 0
  },${padding.top + chartHeight} Z`;

  const yTicks = [0, 3000, 6000, 9000];

  return (
    <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 relative shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Spending Overview</span>
            <span className="text-xs font-mono font-normal text-slate-500 dark:text-slate-400">• Time Series</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Transaction amount over time</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-cyan-800 dark:text-cyan-400 font-mono bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-200 dark:border-cyan-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Volume Tracker</span>
        </div>
      </div>

      {/* SVG Responsive Chart Viewport */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-64 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const y = padding.top + chartHeight - ((tick - minAmount) / (maxAmount - minAmount)) * chartHeight;
            return (
              <g key={tick} className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
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
                  {tick === 0 ? '₹0' : `₹${tick / 1000}k`}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#spendingGradient)" />

          {/* Smooth Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points & Vertical Guide on Hover */}
          {points.map((pt, i) => (
            <g key={i}>
              {hoveredPoint?.displayDate === pt.displayDate && (
                <line
                  x1={pt.x}
                  y1={padding.top}
                  x2={pt.x}
                  y2={padding.top + chartHeight}
                  stroke="#06b6d4"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.8"
                />
              )}

              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.displayDate === pt.displayDate ? 6 : 4}
                className="fill-white dark:fill-slate-900 stroke-cyan-600 dark:stroke-cyan-400 transition-all cursor-pointer"
                strokeWidth="2"
                onMouseEnter={() => {
                  setHoveredPoint(pt);
                  setHoverPos({ x: pt.x, y: pt.y });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* X-Axis Dates */}
              <text
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400"
              >
                {pt.displayDate}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && hoverPos && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-500/40 shadow-xl rounded-lg p-2 text-xs font-mono animate-in fade-in zoom-in-95 duration-100"
            style={{
              left: `${(hoverPos.x / width) * 100}%`,
              top: `${(hoverPos.y / height) * 100 - 8}%`,
            }}
          >
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-sans">{hoveredPoint.displayDate}</p>
            <p className="font-bold text-sm text-cyan-800 dark:text-cyan-300">
              {formatCurrency(hoveredPoint.amount)}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              {hoveredPoint.transactionCount} transactions
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
