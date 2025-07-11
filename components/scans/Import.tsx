import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { useProjectsContext } from "@/contexts/projects.context"
import { useDashboardContext } from "@/contexts/dashboard.context"
import ModelViewer from "./ModelViewer3D"
import Link from "next/link"
import { Box, DraftingCompass, FileText, Scale3D } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"

export default function ImportPage() {
  const { projects } = useProjectsContext()
  const { currentProjectDisplayed, setCurrentProjectDisplayed } = useDashboardContext()
  return (
    <ScrollArea className="h-svh">
      <div className="flex flex-col w-full items-center h-svh p-4 mb-40">
      <div className="flex justify-around w-full">
        <Card className="border-0 w-1/4">
          <CardContent className="flex flex-col items-center p-6 w-full">            
            <div className="p-4 bg-white shadow-md rounded-md mt-2 w-full">
              <h2 className="text-lg font-bold">Caractéristiques</h2>
              <ul>
                <li>Taille : {currentProjectDisplayed!.features.size}</li>
                <li>Nb de pièces : {currentProjectDisplayed!.features.roomsNumber}</li>
                <li>Nb d'étages : {currentProjectDisplayed!.features.floorsNumber}</li>
              </ul>
            </div>
            <div className="p-4 bg-white shadow-md rounded-md mt-2 w-full">
              <h2 className="text-lg font-bold">Caractéristiques</h2>
              <ul>
                <li>Taille : {currentProjectDisplayed!.features.size}</li>
                <li>Nb de pièces : {currentProjectDisplayed!.features.roomsNumber}</li>
                <li>Nb d'étages : {currentProjectDisplayed!.features.floorsNumber}</li>
              </ul>
            </div>
            <div className="p-4 bg-white shadow-md rounded-md mt-2 w-full">
              <h2 className="text-lg font-bold">Caractéristiques</h2>
              <ul>
                <li>Taille : {currentProjectDisplayed!.features.size}</li>
                <li>Nb de pièces : {currentProjectDisplayed!.features.roomsNumber}</li>
                <li>Nb d'étages : {currentProjectDisplayed!.features.floorsNumber}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <ModelViewer />

        <Card className="border-0 w-1/4">
          <CardContent className="flex flex-col items-center p-6 w-full">
            <div className="p-4 bg-white w-full shadow-md rounded-md mt-2 w-full">
              <h2 className="text-lg font-bold">Tailles</h2>
              <p className="mt-2 mb-2">Estimation: 2 MB</p>
              <p className="mb-2">Image 3D: 10 MB</p>
              <p className="mb-2">Modèle 3D: 100 MB</p>
              <p>Plan 2D: 5 MB</p>
            </div>
              
              <div className="flex flex-col items-start bg-muted/50 px-6 py-3">
                <div className="text-lg text-muted-foreground">
                Téléchargement
                </div>
                <div className="flex flex-col gap-3 mt-4">
                    <Link href={"#"} className="flex items-center">
                        <FileText className="mr-4 h-8 w-8"/>
                        Estimation {`(pdf/excel)`}
                    </Link>
                    <Link href={"#"} className="flex items-center">
                        <Box className="mr-4 h-8 w-8"/>
                        Image 3D {`(pdf/jpg/glb)`}
                    </Link>
                    <Link href={"#"} className="flex items-center">
                        <Scale3D className="mr-4 h-8 w-8"/>
                        Modèle 3D {`(fbx/dxf)`}
                    </Link>
                    <Link href={"#"} className="flex items-center">
                        <DraftingCompass className="mr-4 h-8 w-8"/>
                        Plan 2D {`(pdf/jpg)`}
                    </Link>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true
        }}
        className="w-full max-w-[80%] mt-4"
      >
        <CarouselContent>
          {projects.map((project, index) => (
            <CarouselItem key={index} onClick={() => {
              setCurrentProjectDisplayed(project)
            }} className={`md:basis-1/2 lg:basis-1/3 hover:cursor-pointer`}>
              <div className="p-1">
                <Card className={`${currentProjectDisplayed!.id == project.id && "border-2 border-violet-500"}`}>
                  <CardContent className="flex flex-col items-center p-6">
                    <Image src={`/dalle${index+1}.png`} width={300} height={300} alt="3d model" />
                    <h1 className="text-2xl font-semibold mt-2">{project.firstName} {project.lastName}</h1>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
    </ScrollArea>
  )
}
