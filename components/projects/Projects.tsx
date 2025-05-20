"use client";
import { ListFilter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateRangePicker from "@/components/omnicity/table/DateRangePicker";
import ProjectsDataTable from "../omnicity/table/projectsDataTable";
import NewProjectDialog from "../dialogs/NewProjectDialog";
import { useState } from "react";
import { useProjectsContext } from "@/contexts/projects.context";
import { DateRange } from "react-day-picker";

export default function ProjectsPage() {
  const { projects } = useProjectsContext();
  const [tab, setTab] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const authors = Array.from(new Set(projects.map(p => p.authorName).filter(Boolean)));

  return (
    <div className="w-full h-full p-8">
      <Tabs defaultValue={tab} onValueChange={setTab}>
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
                      <DateRangePicker value={dateRange} onChange={setDateRange} />
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Par auteur</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {authors.map(author => (
                        <DropdownMenuItem
                          key={author}
                          onClick={() => setSelectedAuthor(author)}
                          className={selectedAuthor === author ? "font-bold" : ""}
                        >
                          {author}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        onClick={() => setSelectedAuthor(null)}
                        className={!selectedAuthor ? "font-bold" : ""}
                      >
                        Tous
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <NewProjectDialog onProjectsPage={true} />
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card className="w-full">
            <CardContent className="w-full p-0">
                <CardHeader>
                  <CardTitle>Projets</CardTitle>
                  <CardDescription>
                    Gérer et manager vos projets à partir d'ici.
                  </CardDescription>
                </CardHeader>
              <ProjectsDataTable
                onlyInProgress={false}
                onlyCompleted={false}
                author={selectedAuthor}
                dateRange={dateRange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card className="w-full">
            <CardContent className="w-full p-0">
              <CardHeader>
                <CardTitle>Projets en cours</CardTitle>
                <CardDescription>
                  Retrouvez ici vos projets en cours.
                </CardDescription>
              </CardHeader>
              <ProjectsDataTable onlyInProgress={true} author={selectedAuthor} dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="draft">
          <Card className="w-full">
            <CardContent className="w-full p-0">
              <CardHeader>
                <CardTitle>Projets terminés</CardTitle>
                <CardDescription>
                  Retrouvez ici vos projets terminés.
                </CardDescription>
              </CardHeader>
              <ProjectsDataTable onlyCompleted={true} author={selectedAuthor} dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
