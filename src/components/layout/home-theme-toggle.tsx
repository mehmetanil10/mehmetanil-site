"use client";

import { useEffect, useState } from "react";
import { Clock3, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
type ThemeMode = "auto" | Theme;

const STORAGE_KEY = "mehmetanil-home-theme";
const LIGHT_THEME_START_HOUR = 7;
const DARK_THEME_START_HOUR = 19;

const themeOptions: Array<{
  mode: ThemeMode;
  label: string;
  shortLabel: string;
  icon: typeof Sun;
}> = [
  {
    mode: "auto",
    label: "Otomatik tema",
    shortLabel: "Otomatik",
    icon: Clock3,
  },
  {
    mode: "light",
    label: "Açık tema",
    shortLabel: "Açık",
    icon: Sun,
  },
  {
    mode: "dark",
    label: "Koyu tema",
    shortLabel: "Koyu",
    icon: Moon,
  },
];

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "auto" || value === "light" || value === "dark";
}

function getStoredThemeMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isThemeMode(stored) ? stored : "auto";
  } catch {
    return "auto";
  }
}

function resolveTheme(mode: ThemeMode, date = new Date()): Theme {
  if (mode !== "auto") return mode;

  const hour = date.getHours();
  return hour >= LIGHT_THEME_START_HOUR && hour < DARK_THEME_START_HOUR
    ? "light"
    : "dark";
}

function applyTheme(mode: ThemeMode) {
  const theme = resolveTheme(mode);
  const root = document.documentElement;

  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.dataset.themeMode = mode;
  root.style.colorScheme = theme;
}

function getMillisecondsUntilNextThemeChange(date = new Date()) {
  const nextChange = new Date(date);
  const hour = date.getHours();

  if (hour < LIGHT_THEME_START_HOUR) {
    nextChange.setHours(LIGHT_THEME_START_HOUR, 0, 0, 50);
  } else if (hour < DARK_THEME_START_HOUR) {
    nextChange.setHours(DARK_THEME_START_HOUR, 0, 0, 50);
  } else {
    nextChange.setDate(nextChange.getDate() + 1);
    nextChange.setHours(LIGHT_THEME_START_HOUR, 0, 0, 50);
  }

  return Math.max(1_000, nextChange.getTime() - date.getTime());
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(getStoredThemeMode());
    setMounted(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setMode(isThemeMode(event.newValue) ? event.newValue : "auto");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let changeTimer: ReturnType<typeof setTimeout> | undefined;

    const synchronizeTheme = () => {
      applyTheme(mode);

      if (changeTimer) clearTimeout(changeTimer);
      if (mode === "auto") {
        changeTimer = setTimeout(
          synchronizeTheme,
          getMillisecondsUntilNextThemeChange(),
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") synchronizeTheme();
    };

    synchronizeTheme();
    window.addEventListener("focus", synchronizeTheme);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (changeTimer) clearTimeout(changeTimer);
      window.removeEventListener("focus", synchronizeTheme);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [mode, mounted]);

  const selectMode = (nextMode: ThemeMode) => {
    setMode(nextMode);
    applyTheme(nextMode);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextMode);
    } catch {
      // Tema seçimi yine uygulanır; yalnızca tarayıcı yeniden açıldığında hatırlanmaz.
    }
  };

  return (
    <div
      role="group"
      aria-label="Tema seçimi"
      className={cn(
        "relative flex h-8 w-[94px] shrink-0 items-center rounded-full border border-border bg-secondary/80 p-1 shadow-inner transition-all duration-300 hover:border-primary/40",
        mounted ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 h-[22px] w-[26px] rounded-full border border-border/70 bg-background shadow-sm transition-transform duration-300 ease-out",
          mode === "light" && "translate-x-7",
          mode === "dark" && "translate-x-14",
        )}
      />

      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = mode === option.mode;

        return (
          <button
            key={option.mode}
            type="button"
            onClick={() => selectMode(option.mode)}
            aria-label={option.label}
            aria-pressed={isActive}
            title={option.label}
            className="relative z-10 flex h-[22px] w-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon
              size={option.mode === "dark" ? 13 : 14}
              aria-hidden="true"
              className={cn(
                "transition-colors duration-300",
                !isActive && "text-muted-foreground/50",
                isActive && option.mode === "auto" && "text-primary",
                isActive && option.mode === "light" && "text-amber-500",
                isActive && option.mode === "dark" && "text-blue-300",
              )}
            />
            <span className="sr-only">{option.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
