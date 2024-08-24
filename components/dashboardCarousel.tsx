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

export default function DashboardCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-11/12 justify-self-center"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className=" hover:cursor-pointer">
                <CardContent className="flex-col aspect-square items-center justify-center p-6">
                    <Image width={290} height={290} src={`/immo${index+1}.jpg`} alt="3d models of real estate" />
                    <CardTitle className="text-center mt-4">
                        <h1>T4 Villeneuve</h1>
                    </CardTitle>
                    <CardDescription className="text-center mt-4">
                        <p>1 pièce
                            45 m²
                            Étage 1/4</p>
                        <p>Status...</p>
                        <p>Last update...</p>
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
