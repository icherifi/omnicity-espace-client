import React from 'react'
import { Badge } from './ui/badge'

function EnergyPerformanceBadge(props: {
    state: "verywell" | "well" | "average" | "bad"
    badgeValue: "Très bien" | "Bien" | "Moyen" | "Mauvais"
}) {
  return (
    <div className="pl-2 w-min">
        <Badge variant={props.state}>{props.badgeValue}</Badge>
    </div>
)
}

export default EnergyPerformanceBadge