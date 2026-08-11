"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowUpRight, FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/home-theme-toggle";
import { CvMenu, cvLinks } from "@/components/layout/cv-menu";
import { useAdminAvailability } from "@/components/analytics/use-admin-availability";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/about", label: "Hakkımda" },
  { href: "/experience", label: "Deneyim" },
  { href: "/projects", label: "Projeler" },
  { href: "/services", label: "Hizmetler" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "İletişim" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const adminOnline = useAdminAvailability();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-sm font-medium text-primary">
          mehmetanil
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={
                link.href === "/contact" && adminOnline
                  ? "Şu an çevrimiçi"
                  : undefined
              }
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                pathname === link.href
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {link.label}
              {link.href === "/contact" && adminOnline ? (
                <>
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.75)]" />
                  </span>
                  <span className="sr-only">Şu an çevrimiçi</span>
                </>
              ) : null}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2 border-l border-border/60 pl-3">
            <CvMenu />
            <Link
              href="/contact"
              className="hidden items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_hsl(var(--primary))] xl:inline-flex"
            >
              Birlikte Çalışalım <ArrowUpRight size={13} />
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menü"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/50 bg-background px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                  pathname === link.href
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{link.label}</span>
                {link.href === "/contact" && adminOnline ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_7px_rgba(16,185,129,0.7)]" />
                    Çevrimiçi
                  </span>
                ) : null}
              </Link>
            ))}

            <div className="mt-3 border-t border-border/60 pt-3">
              <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                CV / Resume
              </p>
              <div className="grid grid-cols-2 gap-2">
                {cvLinks.map((link) => (
                  <a
                    key={link.language}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md border border-border/70 bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <FileText size={13} className="text-primary" />
                    {link.label}
                  </a>
                ))}
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2.5 text-xs font-medium text-primary-foreground"
              >
                Birlikte Çalışalım <ArrowUpRight size={13} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
