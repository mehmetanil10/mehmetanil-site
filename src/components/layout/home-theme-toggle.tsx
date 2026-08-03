"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const STORAGE_KEY = "mehmetanil-home-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function getPreferredTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    applyTheme(preferredTheme);
    setMounted(true);

    return () => applyTheme("dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Koyu temaya geç" : "Açık temaya geç"}
      aria-pressed={isLight}
      title={isLight ? "Koyu tema" : "Açık tema"}
      className={cn(
        "relative h-8 w-[62px] shrink-0 rounded-full border border-border bg-secondary/80 p-1 shadow-inner transition-all duration-300 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        mounted ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Sun
        size={14}
        aria-hidden="true"
        className={cn(
          "absolute left-[8px] top-1/2 z-10 -translate-y-1/2 transition-colors duration-300",
          isLight ? "text-amber-500" : "text-muted-foreground/50",
        )}
      />
      <Moon
        size={13}
        aria-hidden="true"
        className={cn(
          "absolute right-[8px] top-1/2 z-10 -translate-y-1/2 transition-colors duration-300",
          isLight ? "text-muted-foreground/45" : "text-blue-300",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 h-[22px] w-[26px] rounded-full border border-border/70 bg-background shadow-sm transition-transform duration-300 ease-out",
          isLight ? "translate-x-0" : "translate-x-7",
        )}
      />
    </button>
  );
}
