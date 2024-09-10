import Link from "next/link"
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Copy,
  CreditCard,
  FolderKanban,
  Home,
  Import,
  LifeBuoy,
  LineChart,
  List,
  Menu,
  MoreVertical,
  Package,
  Package2,
  PencilRuler,
  Search,
  Settings,
  ShoppingCart,
  Users,
  File
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import * as React from "react"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import DashboardCarousel from "@/components/DashboardCarousel"
import MarksUsed from "@/components/MarksUsed"
import EnergyRating from "@/components/EnergyRating"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ProjectsTable from "@/components/ProjectsTable"
import { Label } from "@/components/ui/label"
import NewProjectForm from "@/components/NewProjectForm"


export default function Dashboard() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Omnicity</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Tableau de bord
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FolderKanban className="h-4 w-4" />
                Projets
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Import className="h-4 w-4" />
                Import
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <PencilRuler className="h-4 w-4" />
                Design
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <List className="h-4 w-4" />
                Formulaire
              </Link>
            </nav>
          </div>

          <div className="flex-col mt-auto mb-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LifeBuoy className="h-4 w-4" />
                Aide
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Omnicity</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Tableau de bord
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <FolderKanban className="h-5 w-5" />
                  Projets
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Import className="h-5 w-5" />
                  Import
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <PencilRuler className="h-5 w-5" />
                  Design
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <List className="h-5 w-5" />
                  Formulaire
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LifeBuoy className="h-5 w-5" />
                  Aide
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Parametres
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projets..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Parametres</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        <main className="grid flex-1 gap-4 p-4 lg:gap-6 lg:p-6 xl:gap-8 1.5xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 3xl:grid-cols-4">
              <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
              > 
                <CardHeader className="pb-3">
                  <CardTitle>Vos projets</CardTitle>
                  <CardDescription className="text-balance max-w-lg leading-relaxed">
                    Créez votre prochain projet en quelques clics. Donnez vie à vos idées dès maintenant !
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <NewProjectForm />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Projets en cours</CardDescription>
                  <CardTitle className="text-4xl">3</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% depuis la semaine passée
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>Projets finis</CardDescription>
                  <CardTitle className="text-4xl">14</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% depuis le mois passé
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>

            <Carousel className="2xl:w-11/12 justify-self-center w-9/12" opts={{loop: true}}>
              <CarouselContent className="-ml-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index} className="pl-1 sm:basis-full 2xl:basis-1/2 3xl:basis-1/3">
                    <div className="p-1">
                      <Card>
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
            
            <ProjectsTable />

          </div>

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

        </main>
      </div>
    </div>
  )
}
