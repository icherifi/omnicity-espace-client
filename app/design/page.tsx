"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PanelLeft,
  FolderKanban,
  Home,
  Import,
  LifeBuoy,
  List,
  Menu,
  Package2,
  PencilRuler,
  Search,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DesignNavbar from "@/components/DesignNavbar";
import { useDesignPageContext } from "@/contexts/designPage.context";
import EstimationCard from "./components/EstimationCard";
import { Unity } from "react-unity-webgl";
import ModelTypeSelect from "./components/ModelTypeSelect";
import { useUnity } from "./components/unityContext";
import { useTheme } from "@/contexts/theme.context";
import { Switch } from "@/components/ui/switch";

export default function Design() {
  const { setIsDesignPageAssetsDisplayed } = useDesignPageContext();
  const { theme, setTheme } = useTheme();
  const { unityProvider, isLoaded, sendMessage } = useUnity();

  React.useEffect(() => {
    if (isLoaded) {
      sendMessage("GameController", "LoadPlanEvent", "send");
    }
  }, [isLoaded, sendMessage]);

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-muted/40"
      onClick={() => {
        setIsDesignPageAssetsDisplayed(false);
      }}
    >
      <DesignNavbar />
      <div className="flex h-screen flex-col sm:gap-4 sm:py-4 sm:pl-28">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Omnicity</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Tableau de bord
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <FolderKanban className="h-5 w-5" />
                  Projets
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Import className="h-5 w-5" />
                  Import
                </Link>
                <Link
                  href="/design"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground"
                >
                  <PencilRuler className="h-5 w-5" />
                  Design
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <List className="h-5 w-5" />
                  Formulaire
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Design</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Chercher un projet..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/placeholder-user.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Parametres</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
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
        </header>
        <main className="grid h-full flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex h-full  items-start gap-4 md:gap-8 lg:col-span-3">
            <div className="relative flex flex-col items-center h-full w-full ml-0">
              <Unity
                className="h-[600px] w-full xl:h-[100%]"
                unityProvider={unityProvider}
              />
              {isLoaded && <ModelTypeSelect />}
            </div>
          </div>

          <EstimationCard />
        </main>
      </div>
    </div>
  );
}
