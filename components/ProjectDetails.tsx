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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import MarksUsed from "@/components/MarksUsed"
import EnergyRating from "@/components/EnergyRating"
import { ScrollArea } from "@/components/ui/scroll-area"

function ProjectDetails() {
  return (
    <ScrollArea>
        <Card
            className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
        >
            <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                Projet #Oe31b70H
                <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copier l'ID du projet</span>
                </Button>
                </CardTitle>
                <CardDescription>Date: 23 Novembre 2023</CardDescription>
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
                    <div className="flex justify-center items-center 1.5xl:flex-col 3xl:flex-row">
                    <EnergyRating energyRatingValue="e" state="Actuel"/>
                    <EnergyRating energyRatingValue="b" state="Visé"/>
                    </div>
                </CardContent>
                </Card>
                <Separator className="my-2" />
                
                <div className="text-lg font-semibold">Caractéristiques</div>
                <div className="grid grid-cols-2 gap-4">

                <div className="flex flex-col gap-3">
                    <div className="font-semibold">Services et accessibilité</div>
                    <div className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>Ascenseur</span>
                    <span>Gardien</span>
                    <span>Digicode</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-semibold">Extérieur</div>
                    <div className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>Balcon</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-semibold">Surfaces annexes</div>
                    <div className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>Parking</span>
                    <span>Cave</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-semibold">Hygiène</div>
                    <div className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>Salle de bain</span>
                    <span>Toilettes</span>
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
                <p>QUARTIER GARE-JEAN-JAURÈS - VITRY SUR SEINE (94400)
                Dans une copropriété sécurisé avec gardien et espace vert, studio comprenant : entrée, séjour donnant sur balcon, cuisine, et une salle de bains avec wc, et une cave. 10 min du métro Mairie d'Ivry et du RERC et proche de toutes commodites.

                Référence agence : 563</p>
                </CardContent>
            </Card>

            <Separator className="my-4" />
                <MarksUsed />
            <Separator className="my-4" />
            
                <div className="font-semibold pb-4">Estimation des coûts</div>
                <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avant travaux</span>
                    <span>178 000€</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Apres travaux</span>
                    <span>213 000€</span>
                </li>
                </ul>
            </CardContent>

            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
                Mis à jour le <time dateTime="2023-11-23">23 Novembre 2023</time>
            </div>
            <Pagination className="ml-auto mr-0 w-auto">
                <PaginationContent>
                <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="sr-only">Projet précédent</span>
                    </Button>
                </PaginationItem>
                <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="sr-only">Prochain Projet</span>
                    </Button>
                </PaginationItem>
                </PaginationContent>
            </Pagination>
            </CardFooter>
        </Card>
        </ScrollArea>
  )
}

export default ProjectDetails