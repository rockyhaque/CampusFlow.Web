import { useId } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area,
} from 'recharts';
import { cfBg } from '../../utils/cfDynamic.js';
import { CHART_COLORS, CHART_PALETTE } from './chartColors.js';

const axisStyle = { stroke: 'var(--slate-500)', fontSize: 11, fill: 'var(--slate-500)' };

function ChartTooltip({ active, label, payload, labelFormatter }) {
  if (!active || !payload?.length) return null;
  const labelText = labelFormatter ? labelFormatter(label) : label;
  return (
    <div className="rounded-xl border border-slate-900/10 bg-white/96 px-3 py-2.5 text-xs text-slate-900 shadow-[0_16px_42px_rgba(2,6,23,0.12)]">
      {labelText != null && labelText !== '' && <div className="mb-1.5 text-xs font-semibold text-slate-900">{labelText}</div>}
      {payload.map((p) => (
        <div key={p.dataKey || p.name} className="flex items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex min-w-0 items-center gap-2">
            <span className="cf-var-bg h-2.5 w-2.5 shrink-0 rounded-full" style={cfBg(p.color || p.fill || 'var(--accent)')} />
            <span>{p.name}</span>
          </div>
          <div className="font-bold text-slate-900">{p.value}</div>
        </div>
      ))}
    </div>
  );
}

function ChartLegend({ payload }) {
  if (!payload?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-[18px] gap-y-3 px-1.5">
      {payload.map((p) => (
        <div key={p.value} className="inline-flex items-center gap-2 text-xs text-slate-500">
          <span className="cf-var-bg h-2.5 w-2.5 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.9)]" style={cfBg(p.color)} />
          <span>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function LineTrend({ data, xKey = 'x', yKey = 'y', color = CHART_COLORS.cyan, formatX }) {
  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis dataKey={xKey} {...axisStyle} tickFormatter={formatX} />
        <YAxis {...axisStyle} />
        <Tooltip content={<ChartTooltip labelFormatter={formatX} />} cursor={{ stroke: 'rgba(34,211,238,0.2)' }} />
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaTrend({ data, xKey = 'x', yKey = 'y', color = CHART_COLORS.cyan, formatX }) {
  const gradId = useId().replace(/:/g, '');
  return (
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis dataKey={xKey} {...axisStyle} tickFormatter={formatX} />
        <YAxis {...axisStyle} />
        <Tooltip content={<ChartTooltip labelFormatter={formatX} />} cursor={{ stroke: 'rgba(34,211,238,0.2)' }} />
        <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2.5} fill={`url(#${gradId})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarSeries({ data, xKey = 'x', yKey = 'y', color = CHART_COLORS.cyan, multiKeys }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis dataKey={xKey} {...axisStyle} interval={0} tick={{ ...axisStyle, fontSize: 10 }} />
        <YAxis {...axisStyle} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(34,211,238,0.08)' }} />
        {multiKeys ? (
          <>
            <Legend content={<ChartLegend />} />
            {multiKeys.map((k, i) => (
              <Bar key={k.key} dataKey={k.key} fill={k.color || CHART_PALETTE[i % CHART_PALETTE.length]} radius={[4, 4, 0, 0]} name={k.label || k.key} />
            ))}
          </>
        ) : (
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PieBreakdown({ data, colors = CHART_PALETTE, innerRadius = 58, outerRadius = 86, centerLabel = 'Total' }) {
  const total = Array.isArray(data) ? data.reduce((sum, d) => sum + (Number(d.value) || 0), 0) : 0;
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          cornerRadius={999}
          startAngle={90}
          endAngle={-270}
          stroke="rgba(255,255,255,0.95)"
          strokeWidth={6}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name ?? i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 text-xl font-extrabold">
          {total}
        </text>
        <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-xs">
          {centerLabel}
        </text>
        <Tooltip content={<ChartTooltip />} />
        <Legend content={<ChartLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
