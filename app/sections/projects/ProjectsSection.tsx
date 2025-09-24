"use client";

import { CircleUser, File, Info, Sun, Moon, Lock, FileText, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme.context";
import { createClient } from "@/utils/supabase/client";
import ProjectsTable from "@/components/projects/ProjectsTable";
import { useProjectsContext } from "@/contexts/projects.context";
import NewProjectDialog from "@/components/dialogs/NewProjectDialog";

export default function ProjectsSection() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { projects } = useProjectsContext();
  const [navigateToProjectId, setNavigateToProjectId] = React.useState<string | undefined>();

  React.useEffect(() => {
    const projectId = localStorage.getItem('newProjectId');
    if (projectId) {
      setNavigateToProjectId(projectId);
      localStorage.removeItem('newProjectId');
    }
  }, []);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/login"); 
  };

  return (
    <>
      <div className="flex items-center flex-row justify-end gap-4 mb-4">
        <p className="text-gray-900 dark:text-white text-center text-[20px] font-bold leading-[26.4px]">
          Omnicity Admin
        </p>
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
            <DropdownMenuItem onClick={handleLogout}>
              Se déconnecter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-center p-2">
              <Sun className="h-4 w-4 mr-2" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4 ml-2" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {projects.length === 0 ? (
        <div className="w-full h-full p-4 pt-0 flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl sm:text-4xl font-bold mb-6">Projets</h1>
          <div className="text-center">
            <div className="mb-8">
              <Plus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                Aucun projet pour le moment
              </p>
              <p 
                className="text-xl font-semibold text-purple-600 dark:text-purple-400 animate-bounce-x"
                style={{
                  animation: 'bounceX 2s ease-in-out infinite'
                }}
              >
                Cliquez sur "Nouveau projet" pour commencer !
              </p>
            </div>
            <NewProjectDialog />
          </div>
        </div>
      ) : (
        <ProjectsTable navigateToProjectId={navigateToProjectId} />
      )}
      
      <style jsx>{`
        @keyframes bounceX {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(20px);
          }
        }
      `}</style>
    </>
  );
} 