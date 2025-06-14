"use client";

import { CircleUser, File, Info, Sun, Moon, Lock, FileText } from "lucide-react";
import { useDashboardContext } from "@/contexts/dashboard.context";
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

export default function ProjectsSection() {
  const router = useRouter();
  const { currentProjectDisplayed } = useDashboardContext();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/login"); 
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-center flex-row justify-end gap-4 mb-4">
        <Button onClick={() => router.push(`/projects/${currentProjectDisplayed?.id}`)} variant="outline" size={"lg"} className="w-fit rounded-[12px]">Récapitulatif <FileText className="ml-2 w-4 h-4" /></Button>
        <p className="text-figma-secondary-color text-center text-[20px] font-bold leading-[26.4px]">
          {currentProjectDisplayed?.authorName ?? "John Doe"}
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
      <ProjectsTable />
    </div>
  );
} 