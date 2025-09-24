import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts"

export interface GreenValueChartProps {
  before: number
  after: number
}

export function GreenValueChart({ before, after }: GreenValueChartProps) {
  const years = 5
  const data = [
    { year: 2025, value: before },
    { year: 2026, value: before + (after - before) * 0.20 },
    { year: 2027, value: before + (after - before) * 0.40 },
    { year: 2028, value: before + (after - before) * 0.60 },
    { year: 2029, value: before + (after - before) * 0.80 },
    { year: 2030, value: after }
  ]
  const min = Math.min(...data.map(d => d.value))
  const max = Math.max(...data.map(d => d.value))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4BAF47" stopOpacity={0.18}/>
            <stop offset="100%" stopColor="#4BAF47" stopOpacity={0.08}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="year" tick={{ fontSize: 16, fill: '#6b7280' }} axisLine={false} tickLine={false} interval={0} allowDuplicatedCategory={false} padding={{ left: 20, right: 20 }} />
        <YAxis
          domain={[min - 10000, max + 10000]}
          axisLine={false}
          tickLine={false}
          tick={false}
          width={0}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#4BAF47"
          strokeWidth={4}
          fill="url(#greenArea)"
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
} 