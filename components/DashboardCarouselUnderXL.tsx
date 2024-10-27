"use client"
import React, { useEffect, useState } from 'react'
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
import Image from 'next/image'
import { Badge } from './ui/badge'
import { ProjectType, useDashboardContext } from '@/contexts/dashboard.context'
import { useProjectsContext } from '@/contexts/projects.context'


function DashboardCarouselUnderXL() {
    const {currentProjectDisplayed, setCurrentProjectDisplayed} = useDashboardContext()

    const { projects } = useProjectsContext()

  return (
    <Carousel className="w-9/12 self-center mt-8" opts={{loop: true}}>
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
                        {Array.from({ length: 3 }).map((_, index) => {
                            const imageNumber = i * 3 + index + 1; // Par exemple: i=0 -> dalle1, dalle2, dalle3; i=1 -> dalle4, dalle5, dalle6, etc.
                            return (
                            <CarouselItem key={index} className="pr-4">
                                <Image src={`/dalle${imageNumber}.png`} alt="property image" width={250} height={250} />
                            </CarouselItem>
                            )
                        })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    <CardTitle className="text-center mt-8">
                        {project.name}
                    </CardTitle>
                    <CardDescription className="text-center mt-4">
                        <span className="font-semibold mt-4">{project.features.roomsNumber} pièce{project.features.roomsNumber > 1 && "s"} &bull;
                        {` `} {project.features.size} &bull;
                        {` `} {project.features.floorsNumber} étages</span>
                    </CardDescription>
                    <CardFooter className='flex flex-col p-0 pb-4'>
                        <Badge variant={project.status} className="mt-4 mb-4 text-black">{project.status == "completed" ? "Terminé" : "En cours..."}</Badge>
                        <p className="text-xs text-muted-foreground">Dernière modification: <br></br> {project.lastUpdate}</p>
                    </CardFooter>
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