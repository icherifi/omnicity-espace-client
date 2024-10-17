"use client"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DateRangePicker from "@/components/DateRangePicker"
import ProjectsDataTable from "./components/projectsDataTable"
import NewProjectForm from "../NewProjectForm"
import { Separator } from "../ui/separator"
import { Pagination, PaginationContent, PaginationItem } from "../ui/pagination"
import { ScrollArea } from "../ui/scroll-area"
import { useDashboardContext } from "@/contexts/dashboard.context"

export default function ProjectsPage() {
  const { currentProjectDisplayed } = useDashboardContext()
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 p-4 pt-8">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="active">En cours</TabsTrigger>
                <TabsTrigger value="draft">Terminé</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filtrer
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Par date</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DateRangePicker />
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Par auteur</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>Saikou</DropdownMenuItem>
                          <DropdownMenuItem>Kevin</DropdownMenuItem>
                          <DropdownMenuItem>Ilyas</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" className="h-7 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <NewProjectForm onProjectsPage={true}  />
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardContent className="flex justify-around p-4 max-[1550px]:flex-col">
                  <div>
                    <CardHeader>
                      <CardTitle>Projets</CardTitle>
                      <CardDescription>
                        Gérer et manager vos projets à partir d'ici.
                      </CardDescription>
                    </CardHeader>
                    <ProjectsDataTable />
                  </div>
                  <ScrollArea>
                    <Card
                      className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
                    >
                      <CardHeader className="flex flex-row items-start bg-muted/50">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            Projet {currentProjectDisplayed.id}
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copier ID projet</span>
                            </Button>
                          </CardTitle>
                          <CardDescription>Date: {currentProjectDisplayed.date}</CardDescription>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <Button size="sm" variant="outline" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                              Exporter
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
                          <div className="font-semibold">Estimation des coûts</div>
                          <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Travaux
                              </span>
                              <span>17 890€</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Bien immobilier
                              </span>
                              <span>{currentProjectDisplayed.costEstimation.withoutAid.toLocaleString("fr-FR")}€</span>
                            </li>
                          </ul>
                          <Separator className="my-2" />
                          <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">Sous-total</span>
                              <span>{(currentProjectDisplayed.costEstimation.withoutAid + 17890).toLocaleString("fr-FR")}€</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">Aides</span>
                              <span>- {(currentProjectDisplayed.costEstimation.withoutAid - currentProjectDisplayed.costEstimation.withAid).toLocaleString("fr-FR")}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">Taxes</span>
                              <span>{Math.round(((currentProjectDisplayed.costEstimation.withoutAid + 17890)*21/100)).toLocaleString("fr-FR")}€</span>
                            </li>
                            <li className="flex items-center justify-between font-semibold">
                              <span className="text-muted-foreground">Total</span>
                              <span>{((Math.round(((currentProjectDisplayed.costEstimation.withoutAid + 17890)*21/100)) + (currentProjectDisplayed.costEstimation.withoutAid + 17890)) - (currentProjectDisplayed.costEstimation.withoutAid - currentProjectDisplayed.costEstimation.withAid)).toLocaleString("fr-FR")}€</span>
                            </li>
                          </ul>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-3">
                            <div className="font-semibold">Adresse du bien</div>
                            <address className="grid gap-0.5 not-italic text-muted-foreground">
                              {currentProjectDisplayed.address.split(', ').map((part, i) => (
                                <span key={i}>{part}</span>
                              ))}
                            </address>
                          </div>
                          <div className="grid auto-rows-max gap-3">
                            <div className="font-semibold">Billing Information</div>
                            <div className="text-muted-foreground">
                              Same as shipping address
                            </div>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid gap-3">
                          <div className="font-semibold">Information cliente</div>
                          <dl className="grid gap-3">
                            <div className="flex items-center justify-between">
                              <dt className="text-muted-foreground">Client</dt>
                              <dd>Liam Dupont</dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt className="text-muted-foreground">Email</dt>
                              <dd>
                                <a href="mailto:">liam@acme.com</a>
                              </dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt className="text-muted-foreground">Phone</dt>
                              <dd>
                                <a href="tel:">+33 485 00 54 12</a>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                          Mis à jour le <time>{currentProjectDisplayed.lastUpdate}</time>
                        </div>
                        <Pagination className="ml-auto mr-0 w-auto">
                          <PaginationContent>
                            <PaginationItem>
                              <Button size="icon" variant="outline" className="h-6 w-6">
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="sr-only">Previous Order</span>
                              </Button>
                            </PaginationItem>
                            <PaginationItem>
                              <Button size="icon" variant="outline" className="h-6 w-6">
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="sr-only">Next Order</span>
                              </Button>
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </CardFooter>
                    </Card>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
