import type { Metadata } from "next";
import "../app/globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import NewProjectStandardFormContextProvider from "@/contexts/newProjectStandardForm.context";
import EnergyFormContextProvider from "@/contexts/energyForm.context";
import DashboardContextProvider from "@/contexts/dashboard.context";
import DesignPageContextProvider from "@/contexts/designPage.context";
import { UnityContextProvider } from "./design/components/unityContext";
import ProjectsContextProvider from "@/contexts/projects.context";
import { headers } from "next/headers"; // Import the headers module
import SidebarContextProvider from "@/contexts/sidebar.context";
import { bricolage } from "./fonts";

export interface useCustomHook {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Omnicity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPath =
    headers().get("x-nextjs-rewrite-path") ||
    headers().get("x-next-url") ||
    "/";

  return (
    <ProjectsContextProvider>
      <NewProjectStandardFormContextProvider>
        <EnergyFormContextProvider>
          <SidebarContextProvider>
          <DashboardContextProvider>
            <DesignPageContextProvider>
              <UnityContextProvider>
                <html lang="fr">
                  <body
                    className={cn(
                      "min-h-screen antialiased bg-body-gradient",
                      bricolage.className
                    )}
                  >
                    <Providers>{children}</Providers>
                  </body>
                </html>
              </UnityContextProvider>
            </DesignPageContextProvider>
          </DashboardContextProvider>
          </SidebarContextProvider>
        </EnergyFormContextProvider>
      </NewProjectStandardFormContextProvider>
    </ProjectsContextProvider>
  );
}
