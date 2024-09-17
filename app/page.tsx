"use client";
import {
  CircleUser,
  Search,
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
import * as React from "react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ProjectsTable, { projects } from "@/components/ProjectsTable"
import NewProjectForm from "@/components/NewProjectForm"
import ProjectDetails from "@/components/ProjectDetails"
<<<<<<< HEAD
import DashboardNavbar from "@/components/DashboardNavbar"
import { ScrollArea } from "@/components/ui/scroll-area"
import DashboardCarousel from "@/components/DashboardCarousel"
import DashboardCarouselUnderXL from "@/components/DashboardCarouselUnderXL"

export default async function Dashboard() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardNavbar />
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
                  href="/design"
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
=======
import Navbar from "@/components/Navbar"
import { ComponentsMap } from "@/types/dashboard.types"
import ImportPage from "@/components/scans/Import";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const componentsMap: ComponentsMap = {
  main:         
  <div className="grid flex-1 gap-4 p-4 lg:gap-6 lg:p-6 xl:gap-8 1.5xl:grid-cols-3">
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
                      <p>T4 Villeneuve</p>
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
    <ProjectDetails />
  </div>,
  import:   
  <div>
    <ImportPage/>
  </div>,
  design: <div>Loading...</div>,
  form: <div>Form Comming Soon</div>,
  projects: <div>Projects Comming Soon</div>,
};

export default function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const [content, setContent] = React.useState<keyof typeof componentsMap>("main");
  const router = useRouter();
  const renderContent = () => {
    return componentsMap[content] || <div>Dashboard Content</div>;
  };

  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await createClient().auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push('/login'); // Redirect to login page after logging out
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar setContent={setContent}/>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
>>>>>>> 36cf0fb05a29b9f6b3be769b05e67450b144753b
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
              <DropdownMenuItem onClick={handleLogout}>Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
<<<<<<< HEAD
        
        <ScrollArea className="md:h-svh hidden xl:block">
          <main className="flex-1 mb-20 gap-4 p-4 lg:gap-6 lg:p-6 xl:gap-8 lg:grid-cols-3 lg:flex 2xl:grid">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2"> 
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
                <Card
                  className="2xl:col-span-2" x-chunk="dashboard-05-chunk-0"
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
                <Card x-chunk="dashboard-05-chunk-2" className="xl:hidden 2xl:block">
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

              <DashboardCarousel />
              
              <ProjectsTable />
            </div>

            <ProjectDetails />
          </main>
        </ScrollArea>

        <ScrollArea className="md:h-svh xl:hidden">
          <main className="flex flex-col">

            <div className="flex w-full justify-around p-8"> 
              <div className="flex flex-col items-center w-5/12">
                <Card> 
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
                <DashboardCarouselUnderXL />
              </div>
              <ProjectDetails underXlScreenWidth={true} />
            </div>

            <ProjectsTable underXlScreenWidth={true} />

          </main>
        </ScrollArea>
=======
        {renderContent()}
>>>>>>> 36cf0fb05a29b9f6b3be769b05e67450b144753b
      </div>
    </div>
  )
}
