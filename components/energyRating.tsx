"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EnergyRatingProps {
    energyRatingValue?: "a"|"b"|"c"|"d"|"e"|"f"|"g",
    state?: "Actuel" | "Visé"
}

const desktopData = [
  { month: "a", desktop: 100, fill: "var(--color-a)" },
  { month: "b", desktop: 100, fill: "var(--color-b)" },
  { month: "c", desktop: 100, fill: "var(--color-c)" },
  { month: "d", desktop: 100, fill: "var(--color-d)" },
  { month: "e", desktop: 100, fill: "var(--color-e)" },
  { month: "f", desktop: 100, fill: "var(--color-f)" },
  { month: "g", desktop: 100, fill: "var(--color-g)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  a: {
    label: "A",
    color: "rgb(var(--grade-a))",
  },
  b: {
    label: "B",
    color: "rgb(var(--grade-b))",
  },
  c: {
    label: "C",
    color: "rgb(var(--grade-c))",
  },
  d: {
    label: "D",
    color: "rgb(var(--grade-d))",
  },
  e: {
    label: "E",
    color: "rgb(var(--grade-e))",
  },
  f: {
    label: "F",
    color: "rgb(var(--grade-f))",
  },
  g: {
    label: "G",
    color: "rgb(var(--grade-g))",
  }
} satisfies ChartConfig

export default function EnergyRating (props: EnergyRatingProps) {
    const id = "pie-interactive"
    const [activeMonth, setActiveMonth] = React.useState(`${props.energyRatingValue}`)
  
    const activeIndex = React.useMemo(
      () => desktopData.findIndex((item) => item.month === activeMonth),
      [activeMonth]
    )
    const months = React.useMemo(() => desktopData.map((item) => item.month), [])
  
    return (
        <ChartContainer
        id={id}
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[200px]"  // Réduction de la taille
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={desktopData}
            dataKey="desktop"
            nameKey="month"
            innerRadius={40}  // Taille réduite
            outerRadius={60}  // Taille réduite
            strokeWidth={5}
            activeIndex={activeIndex}
            activeShape={({
              outerRadius = 0,
              ...props
            }: PieSectorDataItem) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 8} />  // Taille réduite
                <Sector
                  {...props}
                  outerRadius={outerRadius + 18}  // Taille réduite
                  innerRadius={outerRadius + 10}  // Taille réduite
                />
              </g>
            )}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"  // Taille de texte réduite
                      >
                        {props.energyRatingValue?.toLocaleUpperCase()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 16}  // Ajustement de la position
                        className="fill-muted-foreground text-sm"  // Taille de texte réduite
                      >
                        {props.state}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    )
  }
