"use client"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { Badge } from "./ui/badge"

export default function DashboardCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-11/12 justify-self-center"
      style={{maxWidth: "945px"}}
    >
      <CarouselContent className="h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className={`h-full xl:basis-1/2 3xl:basis-1/3 carousel-item`}>
            <div className="p-1 h-full">
              <Card className="h-full hover:cursor-pointer">
                <CardContent className="flex flex-col items-center p-6 h-full">
                  
                  <Carousel className="w-44" opts={{loop: true}}>
                    <CarouselContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-4xl font-semibold">{index + 1}</span>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                    <CardTitle className="text-center mt-8">
                        <h1>T4 Villeneuve</h1>
                    </CardTitle>
                    <CardDescription className="text-center mt-4">
                        <p className="font-semibold mt-4">1 pièce &bull;
                            45 m² &bull;
                            Étage 1/4</p>
                        <Badge variant={"inprogress"} className="mt-4 mb-4 text-black">En cours...</Badge>
                        <p className="text-xs text-muted-foreground">Dernière modification: <br></br> 23 Novembre 2023</p>
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
