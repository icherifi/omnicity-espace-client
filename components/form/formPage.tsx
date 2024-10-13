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
} from "@/components/ui/carousel"
import { useEffect, useState, useRef } from "react"
import Construction from "./components/construction"
import EnergySaving from "./components/energySaving"
import GreenValue from "./components/greenValue"
import CarbonImpact from "./components/carbonImpact"
import Aids from "./components/aids"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FormPage() {
  const [emblaApi, setEmblaApi] = useState<CarouselApi>()
  const categories = [
    { label: "Travaux", component: <Construction /> },
    { label: "Economie d'énergie", component: <EnergySaving /> },
    { label: "Valeur verte", component: <GreenValue /> },
    { label: "Impact carbone", component: <CarbonImpact /> },
    { label: "Aides", component: <Aids /> },
  ]
  const [activeCategory, setActiveCategory] = useState<string>("Travaux")
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const SCROLL_SENSITIVITY_THRESHOLD = 50

  function updateActiveCategory() {
    if (emblaApi) {
      const currentIndex = emblaApi.selectedScrollSnap()
      setActiveCategory(categories[currentIndex].label)
    }
  }

  function handleWheelScroll(event: WheelEvent) {
    if (!emblaApi) return

    event.preventDefault() 
    
    if (Math.abs(event.deltaY) < SCROLL_SENSITIVITY_THRESHOLD) return

    if (!wheelTimeoutRef.current) {
      if (event.deltaY > 0) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollPrev()
      }

      wheelTimeoutRef.current = setTimeout(() => {
        wheelTimeoutRef.current = null
      }, 300)
    }
  }

  function handleScroll() {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log("Scrolling...", emblaApi?.scrollProgress())
    }, 100)
  }

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", updateActiveCategory)

      emblaApi.on("scroll", handleScroll)

      emblaApi.containerNode().addEventListener("wheel", handleWheelScroll)
    }

    return () => {
      if (emblaApi) {
        emblaApi.off("select", updateActiveCategory)
        emblaApi.off("scroll", handleScroll)
        emblaApi.containerNode().removeEventListener("wheel", handleWheelScroll)
      }
    }
  }, [emblaApi])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">{activeCategory}</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            {categories.map((category, i) => (
              <div
                key={i}
                onClick={() => {
                  emblaApi?.scrollTo(i)
                  setActiveCategory(category.label)
                }}
                className={`${
                  activeCategory == category.label && "font-semibold text-primary"
                } hover:cursor-pointer`}
              >
                {category.label}
              </div>
            ))}
              <div className="flex flex-col">
                <p className="p-2 font-bold pl-0 mb-2 text-base">Choix du bouquet</p>
                <RadioGroup defaultValue="balanced">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="simplicity" id="r1" />
                    <Label htmlFor="r1">Simplicité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="r2" />
                    <Label htmlFor="r2">Equilibrée</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="efficient" id="r3" />
                    <Label htmlFor="r3">Performante</Label>
                  </div>
                </RadioGroup>
              </div>
          </nav>

          <div className="grid gap-6">
            <Carousel
              opts={{
                align: "start",
              }}
              orientation="vertical"
              className="w-full"
              setApi={setEmblaApi}
            >
              <CarouselContent className="-mt-1 h-[650px]">
                {categories.map((category, index) => (
                  <CarouselItem key={index} className="pt-1">
                    <div className="p-1">
                      <Card className="h-[600px]">{category.component}</Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </main>
    </div>
  )
}
