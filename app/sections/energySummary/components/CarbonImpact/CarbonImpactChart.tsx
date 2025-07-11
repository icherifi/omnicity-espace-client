import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts"

interface Props {
  before: number
  after: number
}

export function CarbonImpactChart({ before, after }: Props) {
  const years = 20
  const data = Array.from({ length: years }, (_, i) => ({
    year: 2025 + i,
    beforeValue: before * (i + 1),
    afterValue: after * (i + 1)
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18}/>
            <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="year" tick={{ fontSize: 16, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 14, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={80}
          tickFormatter={v => v.toLocaleString()}
          label={{
            value: 'Cumul tonnes CO₂ évitées',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
          }}
        />
        <Area
          type="monotone"
          dataKey="beforeValue"
          stroke="#2563eb"
          strokeWidth={4}
          fill="url(#blueArea)"
          dot={false}
          activeDot={false}
        />
        <Area
          type="monotone"
          dataKey="afterValue"
          stroke="#22c55e"
          strokeWidth={4}
          fill="#bbf7d0"
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
