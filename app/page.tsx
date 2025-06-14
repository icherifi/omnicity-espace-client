"use client";
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useSidebarContext } from "@/contexts/sidebar.context";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import ProjectsSection from "@/app/sections/ProjectsSection";
import DashboardSection from "@/app/sections/DashboardSection";
import DocumentsSection from "@/app/sections/DocumentsSection";

const sectionsMap = {
  projects: <ProjectsSection />,
  dashboard: <DashboardSection />,
  documents: <DocumentsSection />,
  renovation: <div className="p-8">Rénovation</div>,
  relation: <div className="p-8">Mise en relation</div>,
  assistance: <div className="p-8">Assistance</div>,
  settings: <div className="p-8">Paramètres</div>,
};

export default function Page() {
  const [loading, setLoading] = React.useState(true);
  const { section } = useSidebarContext();
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

  const renderContent = () => {
    // @ts-ignore
    return sectionsMap[section] || <div className="flex w-full mt-6 justify-center items-center">En cours de développement...</div>;
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center mt-16">
        <Progress value={progress} className="w-[60%]" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full grid-cols-[200px_1fr]">
        <div className="sticky top-0 h-screen w-full flex justify-center">
          <AppSidebar />
        </div>
        <div className="flex flex-col bg-card text-card-foreground rounded-2xl shadow-xl m-6 p-6 flex-1">
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}