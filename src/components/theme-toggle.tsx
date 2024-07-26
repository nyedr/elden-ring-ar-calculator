"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="lg"
      className="rounded-full p-2 w-14 h-14"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[2.1rem] w-[1.9rem] dark:hidden" />
      <Moon className="hidden w-8 h-8 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
