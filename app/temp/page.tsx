import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  PanelLeft,
  ShoppingCart,
  Truck,
  Users2,
  CircleUser,
  FolderKanban,
  Home,
  Import,
  LifeBuoy,
  List,
  Menu,
  Package2,
  PencilRuler,
  Search,
  Settings,
  FileText,
  Box,
  Scale3D,
  DraftingCompass
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion"
import DesignNavbar from "@/components/DesignNavbar"

export default function Design () {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DesignNavbar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-28">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                    >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Omnicity</span>
                    </Link>
                    <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-muted-foreground hover:text-foreground"
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
                    href="/design"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground"
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
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Design</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/placeholder-user.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
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
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">

          </div>

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
                              <dd>3375€</dd>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <dt className="flex flex-col">
                                <span className="font-semibold text-lg text-muted-foreground">Salon</span>
                                <span className="text-sm text-muted-foreground">Style élégante</span>
                              </dt>
                              <dd>2275€</dd>
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
                              <dd>3375€</dd>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <dt className="flex flex-col">
                                <span className="font-semibold text-lg text-muted-foreground">Salon</span>
                                <span className="text-sm text-muted-foreground">Style élégante</span>
                              </dt>
                              <dd>2275€</dd>
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
                              <dd>3375€</dd>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <dt className="flex flex-col">
                                <span className="font-semibold text-lg text-muted-foreground">Salon</span>
                                <span className="text-sm text-muted-foreground">Style élégante</span>
                              </dt>
                              <dd>2275€</dd>
                            </div>
                          </dl>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="grid gap-3">
                  <div className="font-semibold text-lg">Budget</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        Avec aides
                      </dt>
                      <dd>2 850€</dd>
                    </div>
                  </dl>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        Sans aides
                      </dt>
                      <dd>18 090€</dd>
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
        </main>
      </div>
    </div>
  )
}
