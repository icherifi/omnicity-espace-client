"use client";
import { MoreVertical, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import EnergyRating from "@/components/energy/components/EnergyRating";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardContext } from "@/contexts/dashboard.context";
import PropertyState from "@/components/energy//components/PropertyState";
import ExportView from "./ExportView";
import { StateOfPlay } from "./component/StateOfPlay";

function ProjectDetails() {
  const { currentProjectDisplayed } = useDashboardContext();
  const [showDetail, setShowDetail] = React.useState(false);

  if (!currentProjectDisplayed?.id) {
    return <p>Chargement du projet...</p>;  
  }

  if(!currentProjectDisplayed.iziResponse) {
    return (
      <ScrollArea>
        <Card className="overflow-hidden mb-16">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Projet {currentProjectDisplayed!.id}
              </CardTitle>
              <CardDescription>
                {currentProjectDisplayed!.created_at &&
                  new Date(currentProjectDisplayed!.created_at).toLocaleDateString(
                    "fr-FR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span onClick={() => setShowDetail(true)} className="xl:whitespace-nowrap max-[1500px]:hidden">
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
                  <DropdownMenuItem onClick={() => setShowDetail(true)} className="min-[1500px]:hidden">
                    Exporter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDetail(true)}>
                    Voir
                  </DropdownMenuItem>
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <StateOfPlay currentProjectDisplayed={currentProjectDisplayed} />
          </CardContent>
        </Card>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea>
      {showDetail && <ExportView onClose={() => setShowDetail(false)} />}
      <Card className="overflow-hidden mb-16">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Projet {currentProjectDisplayed!.id}
            </CardTitle>
            <CardDescription>
              {currentProjectDisplayed!.created_at &&
                new Date(currentProjectDisplayed!.created_at).toLocaleDateString(
                  "fr-FR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span onClick={() => setShowDetail(true)} className="xl:whitespace-nowrap max-[1500px]:hidden">
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
                <DropdownMenuItem onClick={() => setShowDetail(true)} className="min-[1500px]:hidden">
                  Exporter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDetail(true)}>
                  Voir
                </DropdownMenuItem>
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
                <div className="flex justify-center items-center flex-col min-[1765px]:flex-row">
                  <EnergyRating
                    energyRatingValue={
                      currentProjectDisplayed!.actualEnergyRating?.toLocaleLowerCase()! as "a" | "b" | "c" | "d" | "e" | "f" | "g" 
                    }
                    state="Actuel"
                  />
                  <EnergyRating
                    energyRatingValue={
                      currentProjectDisplayed!.targetedEnergyRating?.toLocaleLowerCase()! as "a" | "b" | "c" | "d" | "e" | "f" | "g" 
                    }
                    state="Visé"
                  />
                </div>
              </CardContent>
            </Card>
            <Separator className="my-2" />
          </div>

          <Separator className="my-4" />
          <StateOfPlay currentProjectDisplayed={currentProjectDisplayed} />
          <Card className="mt-4">
            <PropertyState project={currentProjectDisplayed} />
          </Card>
          <Separator className="my-4" />

          <div className="font-semibold pb-4">Estimation des coûts</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Sans aides</span>
              <span>
                {currentProjectDisplayed!.costEstimation?.withoutAid.toLocaleString(
                  "fr-FR"
                )}
                €
              </span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Avec aides</span>
              <span>
                {currentProjectDisplayed!.costEstimation?.withAid.toLocaleString(
                  "fr-FR"
                )}
                €
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}

export default ProjectDetails;
