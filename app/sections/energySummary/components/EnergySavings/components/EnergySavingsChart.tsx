"use client"

import { useMemo } from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Scatter, LabelList } from "recharts"

interface Props {
  beforeAnnual: number
  afterAnnual: number
  years: number
  priceRate: number
  gainPercent: number
  unit?: 'kWh' | '€'
  beforeLabel?: string
  afterLabel?: string
}

export function EnergySavingsChart({ beforeAnnual, afterAnnual, years, priceRate, unit = '€', beforeLabel = 'Avant', afterLabel = 'Après' }: Props) {
  const data = useMemo(() => {
    return Array.from({ length: years + 1 }, (_, y) => {
      const factor = (1 + priceRate) ** y
      return {
        year: 2025 + y,
        beforeValue: Math.round(beforeAnnual * factor),
        afterValue : Math.round(afterAnnual  * factor),
      }
    })
  }, [beforeAnnual, afterAnnual, years, priceRate])

  // const midIndex = Math.floor(data.length / 2)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="beforeArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fecaca" stopOpacity={0.5}/>
            <stop offset="100%" stopColor="#fee2e2" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="afterArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bbf7d0" stopOpacity={0.5}/>
            <stop offset="100%" stopColor="#dcfce7" stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 14, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={60}
          tickFormatter={v => `${Number(v).toLocaleString('fr-FR')}${unit === '€' ? '€' : ''}`}
          domain={[0, (dataMax:number)=> Math.ceil(dataMax/100)*100]}
          label={{
            value: unit === '€' ? 'Prix / mois' : 'Consommation / mois',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 14 }
          }}
        />
        <Area
          type="basis"
          dataKey="beforeValue"
          stroke="#dc2626"
          strokeWidth={3}
          fill="url(#beforeArea)"
          dot={false}
        />
        <Area
          type="basis"
          dataKey="afterValue"
          stroke="#16a34a"
          strokeWidth={3}
          fill="url(#afterArea)"
          dot={false}
        />

        {/* Points + badges prix */}
        <Scatter data={[data[0], data[data.length-1]]} fill="#dc2626">
          <LabelList dataKey="beforeValue" content={({x = 0, y = 0, value = 0})=> (
            <g>
              <circle cx={x} cy={y} r={5} fill="#dc2626" />
              <foreignObject x={(x as number)-35} y={(y as number)-30} width="70" height="24">
                <div style={{background:'#fee2e2',color:'#dc2626',fontSize:12,fontWeight:700,borderRadius:12,padding:'2px 6px',textAlign:'center'}}>
                  {value.toLocaleString('fr-FR')} €
                </div>
              </foreignObject>
            </g>
          )}/>
        </Scatter>
        <Scatter data={[data[0], data[data.length-1]]} fill="#16a34a">
          <LabelList dataKey="afterValue" content={({x = 0, y = 0, value = 0})=> (
            <g>
              <circle cx={x} cy={y} r={5} fill="#16a34a" />
              <foreignObject x={(x as number)-35} y={(y as number)-30} width="70" height="24">
                <div style={{background:'#dcfce7',color:'#16a34a',fontSize:12,fontWeight:700,borderRadius:12,padding:'2px 6px',textAlign:'center'}}>
                  {value.toLocaleString('fr-FR')} €
                </div>
              </foreignObject>
            </g>
          )}/>
        </Scatter>

        {/* pastilles étiquette énergétique supprimées */}
      </AreaChart>
    </ResponsiveContainer>
  )
}
