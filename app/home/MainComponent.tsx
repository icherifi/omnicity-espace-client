import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import NewProjectForm from "@/components/form/NewProjectForm";
import ProjectDetails from "@/components/details/ProjectDetails";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProjectsDataTable from "@/components/omnicity/table/projectsDataTable";
import DashboardScrollCarousel from "@/components/omnicity/carousel/DashboardScrollCarousel";

export default function MainComponent() {
  return (
    <ScrollArea className="flex h-full w-full flex-col bg-muted/40">
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
            <ProjectsDataTable />
          </div>
          <ProjectDetails />
        </main>
      </div>
      <ScrollBar orientation="vertical" className="w-4" />
    </ScrollArea>
  );
}
