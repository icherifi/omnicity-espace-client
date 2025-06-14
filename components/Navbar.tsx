import Link from "next/link";
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
  Lock as LockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarProps } from "@/types/dashboard.types";
import * as React from "react";
import { useRouter } from "next/navigation";
function Navbar({ content, setContent }: NavbarProps) {
  const isSelected = (key: string) => content === key;
  const itemClass = (key: string) =>
    isSelected(key)
      ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary font-semibold"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:cursor-pointer";
  const router = useRouter();
      return (
    <div className="hidden border-r bg-background md:block sticky top-0">
      <div className="flex h-screen flex-col gap-2">
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
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-4">
            <div>
              <div onClick={() => setContent("main")} className={itemClass("main")}>
                <Home className="h-4 w-4" />
                <span className="text-[15px]">Tableau de bord</span>
              </div>
              <div onClick={() => setContent("projects")} className={itemClass("projects")}> <FolderKanban className="h-4 w-4" /> Projets </div>
              <div onClick={() => setContent("import")} className={itemClass("import")}> <Import className="h-4 w-4" /> Import </div>
              <div onClick={() => router.push("/design")} className={itemClass("design")}> <PencilRuler className="h-4 w-4" /> Design </div>
              <div onClick={() => setContent("bilan")} className={itemClass("bilan")}> <List className="h-4 w-4" /> Bilan DPE </div>
            </div>
            <div>
              <div onClick={() => router.push("/design")} className={itemClass("design")}>
                <PencilRuler className="h-4 w-4" />
                <span className="text-[15px]">Design</span>
              </div>
              <div onClick={() => setContent("gestion")} className={itemClass("gestion")}> <FolderKanban className="h-4 w-4" /> Gestion </div>
              <div onClick={() => setContent("modelisation")} className={itemClass("modelisation")}> <Import className="h-4 w-4" /> Modélisation </div>
              <div onClick={() => setContent("decoration")} className={itemClass("decoration")}> <PencilRuler className="h-4 w-4" /> Décoration </div>
              <div onClick={() => setContent("form")} className={itemClass("form")}> <List className="h-4 w-4" /> Formulaire </div>
            </div>
            <div>
              <div onClick={() => setContent("relation")} className={itemClass("relation")}>
                <LockIcon className="h-4 w-4" />
                <span className="text-[15px]">Mise en Relation</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground opacity-60 cursor-not-allowed">
                  <Home className="h-4 w-4" /> Architecte
                </span>
                <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground opacity-60 cursor-not-allowed">
                  <PencilRuler className="h-4 w-4" /> Décorateur
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Navbar;