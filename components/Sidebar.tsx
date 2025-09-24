"use client";

import {
  LifeBuoy,
  FileText,
  Home,
  Hammer,
  Link as LinkIcon,
  Settings,
  Folder,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebarContext, SidebarSection } from "@/contexts/sidebar.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useAppRouter } from "@/hooks/useAppRouter";

const navItems = [
  {
    key: "dashboard",
    label: "Tableau de bord",
    icon: Home,
  },
  {
    key: "documents",
    label: "Documents",
    icon: FileText,
  },
  {
    key: "renovation",
    label: "Rénovation",
    icon: Hammer,
  },
  {
    key: "relation",
    label: "Mise en relation",
    icon: LinkIcon,
  },
];

const bottomItems = [
  {
    key: "assistance",
    label: "Assistance",
    icon: LifeBuoy,
  },
  {
    key: "settings",
    label: "Paramètres",
    icon: Settings,
  },
];

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { section, setSection, setShowEnergySummary } = useSidebarContext();
  const { currentProjectDisplayed } = useDashboardContext();
  const { navigateToProjects, navigateToProject, navigateToDocuments, navigateToRenovation, navigateToRelation, navigateToAssistance, navigateToSettings } = useAppRouter();
  const isSelected = (key: string) => section === key;

  const getClientDisplayName = () => {
    if (currentProjectDisplayed && currentProjectDisplayed.firstName && currentProjectDisplayed.lastName) {
      const firstName = currentProjectDisplayed.firstName;
      const lastName = currentProjectDisplayed.lastName;
      return `${firstName.charAt(0)}. ${lastName}`;
    }
    return "Projets";
  };

  const handleDashboardClick = () => {
    if (currentProjectDisplayed) {
      navigateToProject(currentProjectDisplayed.id);
    } else {
      setSection("dashboard" as SidebarSection);
      setShowEnergySummary(false);
    }
  };

  return (
    <Sidebar
      {...props}
      className="h-screen w-56 border-none bg-transparent pt-4 px-4 flex justify-center items-start [&_[data-sidebar=sidebar]]:bg-transparent"
    >
      <div className="flex flex-col h-full">
        <div 
          className="flex items-center justify-center mb-10 cursor-pointer"
          onClick={() => navigateToProjects()}
        >
          <Image src="/logo_omnicity_navbar.png" alt="OmniCity" width={220} height={100} priority />
        </div>
        <SidebarHeader>
          <SidebarMenuButton
            isActive={isSelected("projects")}
            onClick={() => navigateToProjects()}
            className={
              `font-bold px-4 py-2 flex items-center gap-3 transition-colors duration-150 rounded-lg text-[16px] leading-[17.6px] text-gray-900 dark:text-white ` +
              (isSelected("projects")
                ? "bg-black dark:bg-gray-800 text-purple-400 dark:text-purple-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-400 dark:hover:text-purple-300 focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-purple-400 dark:focus:text-purple-300")
            }
            size="lg"
          >
            <Folder className={`h-5 w-5 ${isSelected("projects") ? "text-[#AF80FF]" : "text-black dark:text-white"}`} />
            <span className="text-[16px] leading-[17.6px] font-bold text-gray-900 dark:text-white uppercase tracking-wide">{getClientDisplayName()}</span>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent className="self-center overflow-hidden">
          <div className="relative pl-2">
            <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-900 dark:bg-white" style={{zIndex:0}} />
            <SidebarGroup>
              <SidebarMenu className="gap-0 xl:gap-1">
                {navItems.map(({ key, label, icon: Icon }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      isActive={isSelected(key)}
                      onClick={key === "dashboard" ? handleDashboardClick : key === "documents" ? () => {
                        if (currentProjectDisplayed) {
                          navigateToDocuments(currentProjectDisplayed.id);
                        } else {
                          setSection("documents" as SidebarSection);
                        }
                      } : key === "renovation" ? () => {
                        if (currentProjectDisplayed) {
                          navigateToRenovation(currentProjectDisplayed.id);
                        } else {
                          setSection("renovation" as SidebarSection);
                        }
                      } : key === "relation" ? () => {
                        if (currentProjectDisplayed) {
                          navigateToRelation(currentProjectDisplayed.id);
                        } else {
                          setSection("relation" as SidebarSection);
                        }
                      } : key === "assistance" ? () => {
                        navigateToAssistance();
                      } : key === "settings" ? () => {
                        navigateToSettings();
                      } : () => setSection(key as SidebarSection)}
                      className={
                        `font-bold px-4 py-2 flex items-center gap-3 transition-colors duration-150 rounded-lg text-[16px] leading-[17.6px] text-gray-900 dark:text-white ` +
                        (isSelected(key)
                          ? "bg-black dark:bg-gray-800 text-purple-400 dark:text-purple-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-400 dark:hover:text-purple-300 focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-purple-400 dark:focus:text-purple-300")
                      }
                      size="lg"
                    >
                      <Icon className={`h-5 w-5 ${isSelected(key) ? "text-[#AF80FF]" : "text-black dark:text-white"}`} />
                      <span className="text-[16px] leading-[17.6px] font-bold text-gray-900 dark:text-white">{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </div>
        </SidebarContent>
        <div className="flex-1" />
        <SidebarGroup className="w-full self-center">
          <SidebarMenu className="self-center">
            {bottomItems.map(({ key, label, icon: Icon }) => (
              <SidebarMenuItem key={key} className="self-center">
                <SidebarMenuButton
                  isActive={isSelected(key)}
                  onClick={key === "assistance" ? () => navigateToAssistance() : key === "settings" ? () => navigateToSettings() : () => setSection(key as SidebarSection)}
                  className={
                    `font-bold px-4 py-2 flex items-center gap-3 transition-colors duration-150 rounded-lg text-[16px] leading-[17.6px] text-gray-900 dark:text-white ` +
                    (isSelected(key)
                      ? "bg-black dark:bg-gray-800 text-purple-400 dark:text-purple-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-400 dark:hover:text-purple-300 focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-purple-400 dark:focus:text-purple-300")
                  }
                  size="lg"
                >
                  <Icon className={`h-5 w-5 ${isSelected(key) ? "text-[#AF80FF]" : "text-black dark:text-white"}`} />
                  <span className="text-[16px] leading-[17.6px] font-bold text-gray-900 dark:text-white">{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </div>
    </Sidebar>
  );
} 