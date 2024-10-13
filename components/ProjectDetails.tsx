"use client"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
  File
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react"
import { Separator } from "@/components/ui/separator"
import MarksUsed from "@/components/marksUsed"
import EnergyRating from "@/components/energyRating"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDashboardContext } from "@/contexts/dashboard.context"

interface ProjectDetailsProps {
    underXlScreenWidth?: boolean
}

function ProjectDetails(props: ProjectDetailsProps) {
    const { currentProjectDisplayed } = useDashboardContext()
    
    if (!currentProjectDisplayed?.id) {
        return <p>Chargement du projet...</p> 
    }

    return (
    <ScrollArea className={`${props.underXlScreenWidth ? "h-[550px] w-1/2" : "h-svh"}`}>
        <Card>
            <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                Projet {currentProjectDisplayed.id}
                </CardTitle>
                <CardDescription>Date: {currentProjectDisplayed.date}</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Exporter devis
                </span>
                </Button>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">Plus</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir</DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
            <div className="grid gap-3">                  
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Notes énergétiques</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center lg:flex-col 3xl:flex-row">
                    <EnergyRating energyRatingValue={currentProjectDisplayed.actualEnergyRating} state="Actuel" />
                    <EnergyRating energyRatingValue={currentProjectDisplayed.targetedEnergyRating} state="Visé" />
                    </div>
                </CardContent>
                </Card>
                <Separator className="my-2" />
                
                <div className="text-lg font-semibold">Caractéristiques</div>
                <div className="grid grid-cols-2 gap-4">

                <div className="flex flex-col gap-3">
                    <div className="font-semibold">Services et accessibilité</div>
                    <div className="grid gap-0.5 not-italic text-muted-foreground">
                        {currentProjectDisplayed.features.servicesAndAccessibility.map((service, i) => (
                            <span key={i}>{service}</span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-semibold">Extérieur</div>
                    <div className="grid gap-0.5 not-italic text-muted-foreground">
                        {currentProjectDisplayed.features.outsite.map((outsideElement, i) => (
                            <span key={i}>{outsideElement}</span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-semibold">Surfaces annexes</div>
                    <div className="grid gap-0.5 not-italic text-muted-foreground">
                        {currentProjectDisplayed.features.additionalAres.map((additionalArea, i) => (
                            <span key={i}>{additionalArea}</span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-semibold">Hygiène</div>
                    <div className="grid gap-0.5 not-italic text-muted-foreground">
                        {currentProjectDisplayed.features.hygiene.map((hygieneElement, i) => (
                            <span key={i}>{hygieneElement}</span>
                        ))}
                    </div>
                </div>
                </div>

            </div>
            <Separator className="my-4" />
            <Card>
                <CardHeader>
                <CardTitle>
                    Etat des lieux
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p>{currentProjectDisplayed.stateOfPlay}</p>
                </CardContent>
            </Card>

            <Separator className="my-4" />
                <MarksUsed marksUsedData={currentProjectDisplayed.marksMostUsed} />
            <Separator className="my-4" />
            
                <div className="font-semibold pb-4">Estimation des coûts</div>
                <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sans aides</span>
                    <span>{currentProjectDisplayed.costEstimation.withoutAid.toLocaleString('fr-FR')}€</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Avec aides</span>
                    <span>{currentProjectDisplayed.costEstimation.withAid.toLocaleString('fr-FR')}€</span>
                </li>
                </ul>
            </CardContent>

            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
                Mis à jour le <time>{currentProjectDisplayed.lastUpdate}</time>
            </div>
            </CardFooter>
        </Card>
    </ScrollArea>
  )
}

export default ProjectDetails