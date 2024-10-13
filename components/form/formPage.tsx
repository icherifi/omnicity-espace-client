import { type CarouselApi } from "@/components/ui/carousel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import Construction from "./components/construction"
import EnergySaving from "./components/energySaving"
import GreenValue from "./components/greenValue"
import CarbonImpact from "./components/carbonImpact"
import Aids from "./components/aids"

export default function FormPage() {
  const [emblaApi, setEmblaApi] = useState<CarouselApi>()
  const categories = [{
    label: "Travaux",
    component: <Construction />
  }, {
    label: "Economie d'énergie",
    component: <EnergySaving />
  }, {
    label: "Valeur verte",
    component: <GreenValue />
  }, {
    label: "Impact carbone",
    component: <CarbonImpact />
  }, {
    label: "Aides",
    component: <Aids />
  }]
  const [activeCategory, setActiveCategory] = useState<string>("Travaux")
  
  function updateActiveCategory() {
    if (emblaApi) {
      const currentIndex = emblaApi.selectedScrollSnap(); 
      setActiveCategory(categories[currentIndex].label); 
    }
  }

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", updateActiveCategory); 
    }

    return () => {
      if (emblaApi) {
        emblaApi.off("select", updateActiveCategory); 
      }
    };
  }, [emblaApi]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
          >
            {categories.map((category, i) => (
            <div key={i} onClick={() => {
              emblaApi?.scrollTo(i)
              setActiveCategory(category.label)
            }} className={`${activeCategory == category.label && "font-semibold text-primary"} hover:cursor-pointer`}>
              {category.label}
            </div>
            ))}
          </nav>
          
          <div className="grid gap-6">
            <Carousel
              opts={{
                align: "start"
              }}
              orientation="vertical"
              className="w-full"
              setApi={setEmblaApi}
            >
              <CarouselContent className="-mt-1 h-[600px]">
                {categories.map((category, index) => (
                  <CarouselItem key={index} className="pt-1">
                    <div className="p-1">
                      <Card className="h-[550px]">
                        {category.component}
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </main>
    </div>
  )
}
