"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function CompareBars({ data }: { data: Array<{ segment: string; actual: number; evidence: number }> }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="segment" tick={{ fontSize: 12, fill: "#475569" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "rgba(79, 111, 82, 0.08)" }} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
          <Legend iconType="circle" />
          <Bar dataKey="actual" fill="#4f6f52" radius={[6, 6, 0, 0]} name="Actual population" />
          <Bar dataKey="evidence" fill="#d56b4a" radius={[6, 6, 0, 0]} name="Evidence population" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendLine({ data }: { data: Array<{ label: string; score: number }> }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#475569" }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
          <Line type="monotone" dataKey="score" stroke="#4f6f52" strokeWidth={3} dot={{ r: 4, fill: "#4f6f52" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
