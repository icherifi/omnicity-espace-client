"use client"
import React from 'react'
import {
Carousel,
CarouselContent,
CarouselItem,
CarouselNext,
CarouselPrevious,
} from "@/components/ui/carousel"
import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import { projects } from "@/components/ProjectsTable"
import Image from 'next/image'
import { Badge } from './ui/badge'
import { useDashboardContext } from '@/contexts/dashboard.context'


function DashboardCarouselUnderXL() {
    const {currentProjectDisplayed, setCurrentProjectDisplayed} = useDashboardContext()
  return (
    <Carousel className="w-9/12 justify-self-center mt-8" opts={{loop: true}}>
        <CarouselContent className="-ml-1">
            {projects.map((project, i) => (
            <CarouselItem key={i} className="pl-1 2xl:basis-1/3 hover:cursor-pointer" onClick={() => {
                setCurrentProjectDisplayed(project)
            }}>
                <div className="p-1">
                    <Card className={`${currentProjectDisplayed.id == project.id && "border-violet-500 border-2"}`}>
                    <CardContent className="flex flex-col items-center justify-center p-2">
                    <Carousel className="max-w-32 max-h-40" opts={{loop: true}}>
                        <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="pr-4">
                                <Image src={"/immo1.jpg"} alt="immo" width={250} height={250} />
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    <CardTitle className="text-center mt-8">
                        <p>{project.name}</p>
                    </CardTitle>
                    <CardDescription className="text-center mt-4">
                        <p className="font-semibold mt-4">{project.features.roomsNumber} pièce{project.features.roomsNumber > 1 && "s"} &bull;
                           {` `} {project.features.size} &bull;
                           {` `} {project.features.floorsNumber} étages</p>
                        <Badge variant={project.status} className="mt-4 mb-4 text-black">{project.status == "completed" ? "Terminé" : "En cours..."}</Badge>
                        <p className="text-xs text-muted-foreground">Dernière modification: <br></br> {project.lastUpdate}</p>
                    </CardDescription>
                    </CardContent>
                    </Card>
                </div>
            </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </Carousel>
  )
}

export default DashboardCarouselUnderXL