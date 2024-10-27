import Link from "next/link"
import {
  Bell,
  FolderKanban,
  Home,
  Import,
  LifeBuoy,
  List,
  Package2,
  PencilRuler,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavbarProps } from "@/types/dashboard.types" 
import * as React from "react"

function Navbar({ content, setContent }: NavbarProps) {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="">Omnicity</span>
        </Link>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <div
            onClick={() => setContent("main")}
            className={`${content == "main" ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary" : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:cursor-pointer"}`}
          >
            <Home className="h-4 w-4" />
            Tableau de bord
          </div>
          <div
            onClick={() => setContent("projects")}
            className={`${content == "projects" ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary" : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:cursor-pointer"}`}
          >
            <FolderKanban className="h-4 w-4" />
            Projets
          </div>
          <div
            onClick={() => setContent("import")}
            className={`${content == "import" ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary" : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:cursor-pointer"}`}
          >
            <Import className="h-4 w-4" />
            Import
          </div>
          <Link
            //onClick={() => setContent("design")}
            href="/design"
            className={`${content == "design" ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary" : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:cursor-pointer"}`}
          >
            <PencilRuler className="h-4 w-4" />
            Design
          </Link>
          <div
            onClick={() => setContent("form")}
            className={`${content == "form" ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary" : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:cursor-pointer"}`}
          >
            <List className="h-4 w-4" />
            Formulaire
          </div>
        </nav>
      </div>

      <div className="flex-col mt-auto mb-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <LifeBuoy className="h-4 w-4" />
            Aide
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Settings className="h-4 w-4" />
            Paramètres
          </Link>
        </nav>
      </div>
    </div>
  </div>
  )
}

export default Navbar