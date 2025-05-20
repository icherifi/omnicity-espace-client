import type { ProjectType } from "@/types/project.types"
import { Card } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ResponsiveContainer } from "recharts"

interface CarbonImpactProps {
  project: ProjectType
}

const KM_PER_TONNE = 1_000
const CO2_PARIS_NY_TONNES = 1.7
const HORIZON = 20

export const CarbonImpactChart = ({ project }: CarbonImpactProps) => {
  const surface = Number(project.dpe?.dpeData?.surfaceHabitable) || 0

  const egesBeforeM2 = Number(project.iziResponse?.EGES) || 0
  const gesBeforeKg = egesBeforeM2 * surface

  const egesAfterM2 = Number(project.dpe?.dpeData?.travaux.pack?.emissionGes5UsagesApresTravaux) || 0
  const gesAfterKg = egesAfterM2 * surface

  const beforeT = (gesBeforeKg * HORIZON) / 1_000
  const afterT = (gesAfterKg * HORIZON) / 1_000
  const avoided = Math.max(beforeT - afterT, 0)

  const chartData = Array.from({ length: 21 }, (_, i) => {
    const year = i
    const avant = (beforeT / HORIZON) * year
    const apres = (afterT / HORIZON) * year
    return {
      year: year === 0 ? "0" : year === 5 ? "5 ANS" : year === HORIZON ? `${year} Années` : `${year}`,
      avant,
      apres,
      annotation: year === 5 ? "40 Tonnes" : year === HORIZON ? `${Math.round(avant)} Tonnes` : "",
      annotationApres: year === HORIZON ? `${Math.round(apres)} Tonnes` : "",
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border text-sm">
          <p className="font-medium">Année {label}</p>
          <p className="text-[#0084ff]">Avant: {Math.round(payload[0].value)} tonnes</p>
          <p className="text-[#65a30d]">Après: {Math.round(payload[1].value)} tonnes</p>
        </div>
      )
    }
    return null
  }

  const HighlightDot = (
    highlightIdx: number[],
    color: string
  ) => (props: any) => {
    const { cx, cy, index } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={highlightIdx.includes(index) ? 5 : 0}
        fill={color}
        stroke="white"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 40, right: 30, left: 0, bottom: 20 }}>
            <defs>
            <linearGradient id="colorAvant" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0084ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0084ff" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorApres" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#65a30d" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#65a30d" stopOpacity={0.05} />
            </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            fontSize={12}
            stroke="#94a3b8"
            />
            <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            fontSize={12}
            stroke="#94a3b8"
            domain={[0, "dataMax + 20"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
            type="natural"
            dataKey="avant"
            stroke="#0084ff"
            strokeWidth={2}
            fill="url(#colorAvant)"
            dot={HighlightDot([5, 20], "#0084ff")}
            activeDot={{ r: 6, fill: "#0084ff", stroke: "white", strokeWidth: 2 }}
            />
            <Area
            type="natural"
            dataKey="apres"
            stroke="#65a30d"
            strokeWidth={2}
            fill="url(#colorApres)"
            dot={HighlightDot([20], "#65a30d")}
            activeDot={{ r: 6, fill: "#65a30d", stroke: "white", strokeWidth: 2 }}
            />
        </AreaChart>
        </ResponsiveContainer>

        {chartData.map((entry, index) => {

        if (index === 5) {
            const valueAvant = Math.round(entry.avant)
            const valueApres = Math.round(entry.apres)
            return (
            <>
              <div
                  key={`annotation-${index}`}
                  className="absolute text-[#0084ff] font-medium bg-[#e6f2ff] px-3 py-1 rounded-full text-sm shadow-sm"
                  style={{
                  left: `${(index / 20) * 100}%`,
                  top: `${40}%`,
                  transform: "translate(-50%, -50%)",
                  }}
              >
                  {valueAvant} Tonnes
              </div>
              <div
                key={`annotation-apres-${index}`}
                className="absolute text-[#65a30d] font-medium bg-[#f0f9e8] px-3 py-1 rounded-full text-sm shadow-sm"
                style={{
                  left: `${(index / 20) * 100}%`,
                  bottom: `${25}%`,
                  transform: "translate(-50%, 50%)",
                }}
              >
                {valueApres} Tonnes
              </div>
            </>
            )
        }

        if (index === 20) {
            const valueAvant = Math.round(entry.avant)
            const valueApres = Math.round(entry.apres)
            return (
            <>
                <div
                key={`annotation-avant-${index}`}
                className="absolute text-[#0084ff] font-medium bg-[#e6f2ff] px-3 py-1 rounded-full text-sm shadow-sm"
                style={{
                    right: "5%",
                    top: "10%",
                    transform: "translate(0, -50%)",
                }}
                >
                {valueAvant} Tonnes
                </div>
                <div
                key={`annotation-apres-${index}`}
                className="absolute text-[#65a30d] font-medium bg-[#f0f9e8] px-3 py-1 rounded-full text-sm shadow-sm"
                style={{
                    right: "5%",
                    bottom: "25%",
                    transform: "translate(0, 50%)",
                }}
                >
                {valueApres} Tonnes
                </div>
            </>
        )
      }

      return null
    })}
    </div>
  )
}
