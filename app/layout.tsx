import type { Metadata } from "next";
import "../app/globals.css"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import Providers from "./providers";
import NewProjectFormContextProvider from "@/contexts/newProjectForm.context";
import EnergyFormContextProvider from "@/contexts/energyForm.context";
import DashboardContextProvider from "@/contexts/dashboard.context";
import DesignPageContextProvider from "@/contexts/designPage.context";
import { UnityContextProvider } from "./temp/components/unityContext";

export interface useCustomHook {
  children: React.ReactNode
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Omnicity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NewProjectFormContextProvider>
    <EnergyFormContextProvider>
    <DashboardContextProvider>
    <DesignPageContextProvider>
    <UnityContextProvider>
    <html lang="en">
      <body
        className={cn(
          "overflow-scroll min-h-screen bg-background font-sans antialiased md:overflow-hidden",
          fontSans.variable
        )}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
    </UnityContextProvider>
    </DesignPageContextProvider>
    </DashboardContextProvider>
    </EnergyFormContextProvider>
    </NewProjectFormContextProvider>
  )
}
