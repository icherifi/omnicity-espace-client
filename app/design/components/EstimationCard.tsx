import Link from "next/link"
import {
  FileText,
  Box,
  Scale3D,
  DraftingCompass
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion"
import { useDesignPageContext } from "@/contexts/designPage.context";

function EstimationCard() {
    const {selectedAssets} = useDesignPageContext()
    const selectedSalon = selectedAssets.filter(asset => (asset.roomType == "salon"))
    const selectedCuisine = selectedAssets.filter(asset => (asset.roomType == "cuisine"))
    const {costEstimation, setCostEstimation} = useDesignPageContext()
  return (
    <div>
        <Card
        className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
        >
        <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-3xl">
                Estimation
            </CardTitle>
            </div>
        </CardHeader>

        <CardContent className="p-6 text-sm">
            <Accordion type="single" className="pb-4" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold text-base">Energétique</AccordionTrigger>
                    <AccordionContent>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                        <dt className="flex flex-col">
                            <span className="font-semibold text-lg text-muted-foreground">Cuisine</span>
                            <span className="text-sm text-muted-foreground">Style élégante</span>
                        </dt>
                        <dd>{selectedCuisine[0]?.price.toLocaleString('fr-FR')}</dd>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                        <dt className="flex flex-col">
                            <span className="font-semibold text-lg text-muted-foreground">Salon</span>
                            <span className="text-sm text-muted-foreground">Style élégante</span>
                        </dt>
                        <dd>{selectedSalon[0]?.price.toLocaleString('fr-FR')}</dd>
                        </div>
                    </dl>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" className="pb-4" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold text-base">Agencement</AccordionTrigger>
                    <AccordionContent>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                        <dt className="flex flex-col">
                            <span className="font-semibold text-lg text-muted-foreground">Cuisine</span>
                            <span className="text-sm text-muted-foreground">Style élégante</span>
                        </dt>
                        <dd>{selectedCuisine[0]?.price.toLocaleString('fr-FR')}</dd>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                        <dt className="flex flex-col">
                            <span className="font-semibold text-lg text-muted-foreground">Salon</span>
                            <span className="text-sm text-muted-foreground">Style élégante</span>
                        </dt>
                        <dd>{selectedSalon[0]?.price.toLocaleString('fr-FR')}</dd>
                        </div>
                    </dl>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" className="pb-4" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold text-base">Ameublement</AccordionTrigger>
                    <AccordionContent>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                        <dt className="flex flex-col">
                            <span className="font-semibold text-lg text-muted-foreground">Cuisine</span>
                            <span className="text-sm text-muted-foreground">Style élégante</span>
                        </dt>
                        <dd>{selectedCuisine[0]?.price.toLocaleString('fr-FR')}</dd>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                        <dt className="flex flex-col">
                            <span className="font-semibold text-lg text-muted-foreground">Salon</span>
                            <span className="text-sm text-muted-foreground">Style élégante</span>
                        </dt>
                        <dd>{selectedSalon[0]?.price.toLocaleString('fr-FR')}</dd>
                        </div>
                    </dl>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="grid gap-3">
            <div className="font-semibold text-lg">Budget</div>
            <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-md text-muted-foreground">
                    Avec aides
                </dt>
                <dd className="font-semibold text-lg">{costEstimation.withAid.toLocaleString('fr-FR')}€</dd>
                </div>
            </dl>
            <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                <dt className="flex items-center text-md gap-1 text-muted-foreground">
                    Sans aides
                </dt>
                <dd className="font-semibold text-lg">{costEstimation.withoutAid.toLocaleString('fr-FR')}€</dd>
                </div>
            </dl>
            </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start border-t bg-muted/50 px-6 py-3">
            <div className="text-lg text-muted-foreground">
            Téléchargement
            </div>
            <div className="flex flex-col gap-3 mt-4">
                <Link href={"#"} className="flex items-center p-2">
                    <FileText className="mr-2 h-6 w-6"/>
                    Estimation {`(pdf/excel)`}
                </Link>
                <Link href={"#"} className="flex items-center p-2">
                    <Box className="mr-2 h-6 w-6"/>
                    Image 3D {`(pdf/jpg/glb)`}
                </Link>
                <Link href={"#"} className="flex items-center p-2">
                    <Scale3D className="mr-2 h-6 w-6"/>
                    Modèle 3D {`(fbx/dxf)`}
                </Link>
                <Link href={"#"} className="flex items-center p-2">
                    <DraftingCompass className="mr-2 h-6 w-6"/>
                    Plan 2D {`(pdf/jpg)`}
                </Link>
            </div>
        </CardFooter>
        </Card>
    </div>
  )
}

export default EstimationCard