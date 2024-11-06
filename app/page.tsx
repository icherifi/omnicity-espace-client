"use client";
import { CircleUser, CreditCard, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import NewProjectForm from "@/components/NewProjectForm";
import ProjectDetails from "@/components/ProjectDetails";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import { ComponentsMap } from "@/types/dashboard.types";
import ImportPage from "@/components/scans/Import";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ProjectsPage from "@/components/projects/Projects";
import ProjectsTable from "@/components/ProjectsTable/projectsTable";
import FormPage from "@/components/form/formPage";
import DashboardScrollCarousel from "@/components/DashboardScrollCarousel";
import { cn } from "@/lib/utils";

const componentsMap: ComponentsMap = {
  main: (
    <ScrollArea className="flex h-svh w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                  <CardTitle>Vos projets</CardTitle>
                  <CardDescription className="text-balance max-w-lg leading-relaxed">
                    Créez votre prochain projet en quelques clics. Donnez vie à
                    vos idées dès maintenant !
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

            <DashboardScrollCarousel />

            <ProjectsTable />
          </div>
          <ProjectDetails />
        </main>
      </div>
      <ScrollBar orientation="vertical" className="w-4" />
    </ScrollArea>
  ),
  import: (
    <div>
      <ImportPage />
    </div>
  ),
  form: <FormPage />,
  projects: (
    <div>
      <ProjectsPage />
    </div>
  ),
};

export default function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const [content, setContent] =
    React.useState<keyof typeof componentsMap>("main");
  const renderContent = () => {
    return componentsMap[content] || <div>Dashboard Content</div>;
  };
  const router = useRouter();

  React.useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await createClient().auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center mt-16">
        <Progress value={progress} className="w-[60%]" />
      </div>
    ); // Show a loading state while checking authentication
  }

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/login"); // Redirect to login page after logging out
  };

  return (
    <div
      className={cn(
        "grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]",
        content === "main" ? "overflow-hidden" : "overflow-auto" // Dynamically apply overflow-hidden if content is 'main'
      )}
    >
      <Navbar content={content} setContent={setContent} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Chercher un projet..."
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
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {renderContent()}
      </div>
    </div>
  );
}
