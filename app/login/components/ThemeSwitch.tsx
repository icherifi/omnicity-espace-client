"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/theme.context";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-50">
      <Sun className="h-4 w-4 text-foreground" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="h-4 w-4 text-foreground" />
    </div>
  );
} 