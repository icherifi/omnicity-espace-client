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
import ProjectsDataTable from "@/components/omnicity/table/projectsDataTable";
import DashboardScrollCarousel from "@/components/omnicity/carousel/DashboardScrollCarousel";

export default function MainComponent() {
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <main className="grid h-full gap-4 p-4 sm:px-6 sm:py-4 md:gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 md:gap-8 lg:col-span-2">
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

            <Card>
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

            <Card>
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

        <div className="max-h-screen overflow-auto">
          <ProjectDetails />
        </div>
      </main>
    </div>
  );
}
