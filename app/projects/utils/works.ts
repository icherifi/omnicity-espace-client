import { ProjectType } from "@/types/project.types"

// TODO: récupérer les vraies prix des travaux

const UNIT_PRICE = {
  walls:     165,
  window:    650,
  vmcSF:     750,
  vmcDF:    2500,
  pacKW:    1100,
  combles:    45,
  plancher:   85,
} as const

export type Code =
  | "renovationMurs"
  | "typeVentilationExterieur"
  | "renoMenuiserie"
  | "pompeChaleur"
  | "renoComblesPerdus"
  | "renoPlancherBasSousSol"

export interface WorkBreakdown {
  code:     Code
  title:    string
  quantity: number
  unit:     string
  rawCost:  number          
  cost:     number          
  details?: string          
}

const MAP: Record<string, Code> = {
  "murs":                    "renovationMurs",
  "portes et fenêtres":      "renoMenuiserie",
  "système de ventilation":  "typeVentilationExterieur",
  "système de chauffage":    "pompeChaleur",
  "toiture/plafond":         "renoComblesPerdus",
  "planchers bas":           "renoPlancherBasSousSol",
}

function pickDetails(project: ProjectType, code: Code): string | undefined {
  const rapport = project.dpe?.dpeData?.travaux?.rapportTravaux
  if (!rapport) return undefined

  const lotKey = Object.entries(MAP).find(([, c]) => c === code)?.[0] as
    | keyof typeof rapport
    | undefined

  const t = lotKey ? rapport[lotKey] : undefined
  if (!t) return undefined

  const perf    = (t as any).perf ?? (t as any).performance
  const warning = (t as any).warning

  return [
    t.description,
    //perf     && `• Perf : ${perf}`,
    //warning  && `⚠️ ${warning}`,
  ]
    .filter(Boolean)
    .join("\n\n")
}


export function computeWorkBreakdown(project: ProjectType): WorkBreakdown[] {
  const { energyMixChoice: c, dpe } = project
  if (!c || !dpe?.dpeData?.mesures) return []

  const q = dpe.dpeData.mesures
  const list: WorkBreakdown[] = []

  if (c.renovationMurs && q.murs?.total) {
    list.push({
      code     : "renovationMurs",
      title    : "Isolation des murs",
      quantity : q.murs.total,
      unit     : "m²",
      rawCost  : q.murs.total * UNIT_PRICE.walls,
      cost     : 0,
      details  : pickDetails(project, "renovationMurs"),
    })
  }

  if (c.typeVentilationExterieur) {
    const df = c.typeVentilationExterieur.includes("DF")
    list.push({
      code     : "typeVentilationExterieur",
      title    : df ? "VMC double-flux" : "VMC simple-flux hygro B",
      quantity : 1,
      unit     : "forfait",
      rawCost  : df ? UNIT_PRICE.vmcDF : UNIT_PRICE.vmcSF,
      cost     : 0,
      details  : pickDetails(project, "typeVentilationExterieur"),
    })
  }

  if (c.renoMenuiserie && q.fenetres?.nombre) {
    list.push({
      code     : "renoMenuiserie",
      title    : "Remplacement des fenêtres",
      quantity : q.fenetres.nombre,
      unit     : "pc",
      rawCost  : q.fenetres.nombre * UNIT_PRICE.window,
      cost     : 0,
      details  : pickDetails(project, "renoMenuiserie"),
    })
  }

  if ((c.appareilChauffage1 || c.appareilChauffage2) && q.chauffage?.besoinKWh) {
    const powerKw = +(q.chauffage.besoinKWh / 600).toFixed(1) // ΔT & η simplifiés
    list.push({
      code     : "pompeChaleur",
      title    : "Installation d'une PAC",
      quantity : powerKw,
      unit     : "kW",
      rawCost  : powerKw * UNIT_PRICE.pacKW,
      cost     : 0,
      details  : pickDetails(project, "pompeChaleur"),
    })
  }

  if (c.renoComblesPerdus) {
    const s = Math.round(+project.features.size * 1.2)
    list.push({
      code     : "renoComblesPerdus",
      title    : "Isolation des combles perdus",
      quantity : s,
      unit     : "m²",
      rawCost  : s * UNIT_PRICE.combles,
      cost     : 0,
      details  : pickDetails(project, "renoComblesPerdus"),
    })
  }

  if (c.renoPlancherBasSousSol) {
    const s = Math.round(+project.features.size)
    list.push({
      code     : "renoPlancherBasSousSol",
      title    : "Isolation du plancher bas",
      quantity : s,
      unit     : "m²",
      rawCost  : s * UNIT_PRICE.plancher,
      cost     : 0,
      details  : pickDetails(project, "renoPlancherBasSousSol"),
    })
  }

  const rawTotal = list.reduce((s, w) => s + w.rawCost, 0)
  if (!rawTotal) return list

  const targetTotal = c.coutTotal
  const factor      = targetTotal / rawTotal

  for (const w of list) w.cost = Math.round(w.rawCost * factor)
  return list
}
