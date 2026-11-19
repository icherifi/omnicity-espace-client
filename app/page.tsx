"use client";
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "@/contexts/account.context";
import PendingActivation from "@/components/PendingActivation";
import { useSidebarContext } from "@/contexts/sidebar.context";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import ProjectsSection from "@/app/sections/projects/ProjectsSection";
import DashboardSection from "@/app/sections/dashboard/DashboardSection";
import EnergySummarySection from "@/app/sections/energySummary/EnergySummarySection";
import DocumentsSection from "@/app/sections/documents/DocumentsSection";
import RelationSection from "@/app/sections/relation/RelationSection";
import RenovationSection from "@/app/sections/renovation/RenovationSection";
import AssistanceSection from "@/app/sections/assistance/AssistanceSection";
import SettingsSection from "@/app/sections/settings/SettingsSection";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useProjectsContext } from "@/contexts/projects.context";

const sectionsMap = {
  projects: <ProjectsSection />,
  documents: <DocumentsSection />,
  renovation: <RenovationSection />,
  relation: <RelationSection />,
  assistance: <AssistanceSection />,
  settings: <SettingsSection />,
};

export default function Page() {
  const { status } = useAccount();
  const loading = status !== "active";
  const { section, showEnergySummary, toggleEnergySummary } =
    useSidebarContext();
  const { setCurrentProjectDisplayed } = useDashboardContext();
  const { projects } = useProjectsContext();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (status === "signedOut") {
      router.push("/login");
    }
  }, [status, router]);

  React.useEffect(() => {
    if (loading) return;

    const projectMatch = pathname.match(
      /^\/project\/([0-9a-fA-F-]{36})(?:\/(energy|documents|renovation|relation))?$/
    );
    if (projectMatch) {
      const projectId = projectMatch[1];
      const sub = projectMatch[2];

      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProjectDisplayed(project);
      } else if (projects.length > 0) {
        // Only bounce home once the projects list has actually loaded -
        // on a fresh page load `projects` starts empty while the fetch
        // is still in flight, and this effect re-runs once it resolves.
        router.push("/");
      }
    }
  }, [pathname, projects, loading, router, setCurrentProjectDisplayed]);

  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (section === "dashboard") {
      return showEnergySummary ? (
        <EnergySummarySection onClose={toggleEnergySummary} />
      ) : (
        <DashboardSection onToggleSummary={toggleEnergySummary} />
      );
    }
    // @ts-ignore
    return (
      sectionsMap[section] || (
        <div className="flex w-full mt-6 justify-center items-center">
          En cours de développement...
        </div>
      )
    );
  };

  if (status === "pending") {
    return <PendingActivation />;
  }

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
