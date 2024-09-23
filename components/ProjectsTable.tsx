"use client"
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Badge } from './ui/badge'
import { ProjectType, useDashboardContext } from '@/contexts/dashboard.context'

interface ProjectsTableProps {
  underXlScreenWidth?: boolean
}

export const projects: ProjectType[] = [
  //Récuperer de la db
  {
      id: "#Oe31b70H",
      name: "T2 VITRY",
      date: "23 Juin 2024",
      address: "337 Centre Cial V Deux, 94400",
      actualEnergyRating: "e",
      targetedEnergyRating: "b",
      features: {
          servicesAndAccessibility: ["Ascenseur", "Gardien", "Digicode"],
          outsite: ["Balcon"],
          additionalAres: ["Parking", "Cave"],
          hygiene: ["Salle de bain", "Toilettes"],
          size: "65m²",
          roomsNumber: 5,
          floorsNumber: 2
      },
      stateOfPlay: "QUARTIER GARE-JEAN-JAURÈS - VITRY SUR SEINE (94400) Dans une copropriété sécurisé avec gardien et espace vert, studio comprenant : entrée, séjour donnant sur balcon, cuisine, et une salle de bains avec wc, et une cave. 10 min du métro Mairie d'Ivry et du RERC et proche de toutes commodites. Référence agence : 563",
      marksMostUsed: [{mark: "Ikea", percentage: 26}, {mark: "H&M home", percentage: 14}, {mark: "Diptyque", percentage: 19}, {mark: "Zara home", percentage: 32}, {mark: "Benatura", percentage: 9}],
      costEstimation: {
          withAid: 178000,
          withoutAid: 213000
      },
      status: "inprogress",
      lastUpdate: "17 September 2024",
      id_bouquet: "#Oe31b70k",
      id_design: "#Zk41b70H"
  },
  {
      id: "#SkP548LM",
      name: "Studio Paris",
      date: "11 Octobre 2023",
      address: "196 Rue Marcadet, 75018 Paris, France",
      actualEnergyRating: "d",
      targetedEnergyRating: "a",
      features: {
          servicesAndAccessibility: ["Ascenseur", "Gardien", "Digicode"],
          outsite: ["Balcon"],
          additionalAres: ["Parking", "Cave", "Grenier"],
          hygiene: ["Salle de bain", "Toilettes", "Baignoire"],
          size: "42m²",
          roomsNumber: 6,
          floorsNumber: 0
      },
      stateOfPlay: "Dans un secteur retiré sécurisé , venez découvrir cet appartement en R+1 de type 4 de 92,83 m² comprenant un séjour climatisé, une cuisine indépendante aménagée, trois chambres climatisées dont deux avec placard, une salle de bains; un wc, une véranda de 22.65 m²",
      marksMostUsed: [{mark: "Ikea", percentage: 14}, {mark: "H&M home", percentage: 26}, {mark: "Diptyque", percentage: 32}, {mark: "Zara home", percentage: 19}, {mark: "Benatura", percentage: 9}],
      costEstimation: {
          withAid: 37000,
          withoutAid: 102000
      },
      status: "inprogress",
      lastUpdate: "17 September 2024",
      id_bouquet: "#SAa785m",
      id_design: "#kZrKO8a"
  },
  {
    id: "#8olHJ6m",
    name: "Duplex Bordeaux",
    date: "5 mai 2024",
    address: "6 Rue Léonce Jugla, 33800 Bordeaux",
    actualEnergyRating: "f",
    targetedEnergyRating: "c",
    features: {
        servicesAndAccessibility: ["Ascenseur", "Gardien", "Digicode"],
        outsite: ["Balcon"],
        additionalAres: ["Parking", "Cave", "Grenier"],
        hygiene: ["Salle de bain", "Toilettes", "Baignoire"],
        size: "87m²",
        roomsNumber: 9,
        floorsNumber: 1
    },
    stateOfPlay: "Quartier familial, authentique et dynamique à l'identité affirmée, Caudéran est une ancienne commune de Bordeaux Métropole qui a su conserver son patrimoine architectural avec ses traditionnelles échoppes et ses nombreux espaces verts. À seulement quelques minutes en vélo du centre-ville historique de Bordeaux, ses habitants profitent du calme résidentiel et des multiples commerces de proximité Ces nombreux atouts font de Caudéran, un quartier de charme, très attractif",
    marksMostUsed: [{mark: "Ikea", percentage: 18}, {mark: "H&M home", percentage: 22}, {mark: "Diptyque", percentage: 32}, {mark: "Zara home", percentage: 9}, {mark: "Benatura", percentage: 19}],
    costEstimation: {
        withAid: 45600,
        withoutAid: 98630
    },
    status: "inprogress",
    lastUpdate: "14 September 2024",
    id_bouquet: "#eR5mL9",
    id_design: "#nB89mk"
}
]

function ProjectsTable(props: ProjectsTableProps) {
  const {currentProjectDisplayed, setCurrentProjectDisplayed} = useDashboardContext()
  
  return (
        <Tabs defaultValue="week" className={`${props.underXlScreenWidth && "p-8"}`}>
              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Projets</CardTitle>
                    <CardDescription>
                      {/* Recent orders from your store. */}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            ID bouquet
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            ID design
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Cout total
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Aide total
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Info projet
                          </TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project, i) => (
                          <TableRow className={`hover:cursor-pointer ${currentProjectDisplayed.id == project.id && "bg-accent"}`} key={i} onClick={() => {
                            setCurrentProjectDisplayed(project)
                          }}>
                            <TableCell>
                              <div className="font-medium">{project.name}</div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                  {project.address}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {project.id_design}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {project.id_bouquet}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {project.costEstimation.withAid.toLocaleString('fr-FR')}€
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {project.costEstimation.withoutAid.toLocaleString('fr-FR')}€
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ????
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant={project.status} className="mt-4 mb-4 text-black">{project.status == "completed" ? "Terminé" : "En cours"}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
        </Tabs>
  )
}

export default ProjectsTable