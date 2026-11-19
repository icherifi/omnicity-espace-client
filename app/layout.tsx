import type { Metadata } from "next";
import "../app/globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import NewProjectStandardFormContextProvider from "@/contexts/newProjectStandardForm.context";
import SimulationResultsContextProvider from "@/contexts/simulationResults.context";
import DashboardContextProvider from "@/contexts/dashboard.context";
import DesignPageContextProvider from "@/contexts/designPage.context";
import { UnityContextProvider } from "./design/components/unityContext";
import ProjectsContextProvider from "@/contexts/projects.context";
import AccountContextProvider from "@/contexts/account.context";
import SidebarContextProvider from "@/contexts/sidebar.context";
import { bricolage } from "./fonts";

export interface useCustomHook {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "OmniCity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AccountContextProvider>
    <ProjectsContextProvider>
      <NewProjectStandardFormContextProvider>
        <SimulationResultsContextProvider>
          <SidebarContextProvider>
            <DashboardContextProvider>
              <DesignPageContextProvider>
                <UnityContextProvider>
                  <html lang="fr">
                    <body
                      className={cn(
                        "min-h-screen antialiased bg-body-gradient",
                        bricolage.className,
                      )}
                    >
                      <Providers>{children}</Providers>
                    </body>
                  </html>
                </UnityContextProvider>
              </DesignPageContextProvider>
            </DashboardContextProvider>
          </SidebarContextProvider>
        </SimulationResultsContextProvider>
      </NewProjectStandardFormContextProvider>
    </ProjectsContextProvider>
    </AccountContextProvider>
  );
}
