"use client";

import Link from "next/link";
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
  const { section, setSection } = useSidebarContext();
  const isSelected = (key: string) => section === key;

  return (
    <Sidebar
      {...props}
      className="h-screen w-56 border-none bg-transparent pt-4 px-4 flex justify-center items-start [&_[data-sidebar=sidebar]]:bg-transparent"
    >
      <div className="flex flex-col h-full">
        <Link href="/" className="flex items-center justify-center mb-10">
          <Image src="/logo_omnicity_navbar.png" alt="OmniCity" width={220} height={100} priority />
        </Link>
        <SidebarHeader>
          <SidebarMenuButton
            isActive={isSelected("projects")}
            onClick={() => setSection("projects" as SidebarSection)}
            className={
              `font-bold px-4 py-2 flex items-center gap-3 transition-colors duration-150 rounded-lg text-[16px] leading-[17.6px] text-[var(--Couleur-Secondaire,#2B313B)] ` +
              (isSelected("projects")
                ? "bg-black text-[#a78bfa]"
                : "hover:bg-black hover:text-[#a78bfa] focus:bg-black focus:text-[#a78bfa]")
            }
            size="lg"
          >
            <Folder className="h-5 w-5" />
            <span className="text-[16px] leading-[17.6px] font-bold text-[var(--Couleur-Secondaire,#2B313B)] uppercase tracking-wide">Projets</span>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent className="self-center overflow-hidden">
          <div className="relative pl-2">
            <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-black" style={{zIndex:0}} />
            <SidebarGroup>
              <SidebarMenu className="gap-0 xl:gap-1">
                {navItems.map(({ key, label, icon: Icon }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      isActive={isSelected(key)}
                      onClick={() => setSection(key as SidebarSection)}
                      className={
                        `font-bold px-4 py-2 flex items-center gap-3 transition-colors duration-150 rounded-lg text-[16px] leading-[17.6px] text-[var(--Couleur-Secondaire,#2B313B)] ` +
                        (isSelected(key)
                          ? "bg-black text-[#a78bfa]"
                          : "hover:bg-black hover:text-[#a78bfa] focus:bg-black focus:text-[#a78bfa]")
                      }
                      size="lg"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[16px] leading-[17.6px] font-bold text-[var(--Couleur-Secondaire,#2B313B)]">{label}</span>
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
                  onClick={() => setSection(key as SidebarSection)}
                  className={
                    `font-bold px-4 py-2 flex items-center gap-3 transition-colors duration-150 rounded-lg text-[16px] leading-[17.6px] text-[var(--Couleur-Secondaire,#2B313B)] ` +
                    (isSelected(key)
                      ? "bg-black text-[#a78bfa]"
                      : "hover:bg-black hover:text-[#a78bfa] focus:bg-black focus:text-[#a78bfa]")
                  }
                  size="lg"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[16px] leading-[17.6px] font-bold text-[var(--Couleur-Secondaire,#2B313B)]">{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </div>
    </Sidebar>
  );
} 