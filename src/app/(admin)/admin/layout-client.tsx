"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Tag,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AdminPresenceHeartbeat } from "@/components/analytics/admin-presence-heartbeat";
import { ThemeToggle } from "@/components/layout/home-theme-toggle";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "mehmetanil-admin-sidebar-collapsed";

function AdminSidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onMobileClose,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/messages/unread", { cache: "no-store" })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(new Error("Request failed")),
      )
      .then((data) => setUnreadCount(data.count ?? 0))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    setThemeMenuOpen(false);
    onMobileClose();
  }, [pathname, onMobileClose]);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/posts", label: "Yazılar", icon: FileText },
    { href: "/admin/categories", label: "Kategoriler", icon: Tag },
    {
      href: "/admin/messages",
      label: "Mesajlar",
      icon: Inbox,
      badge: unreadCount,
    },
  ];

  return (
    <aside
      id="admin-sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-border/50 bg-card shadow-2xl transition-[transform,width] duration-200 ease-out md:sticky md:top-0 md:z-30 md:translate-x-0 md:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "md:w-20" : "md:w-56",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-between border-b border-border/50 p-5",
          collapsed && "md:flex-col md:gap-3 md:px-2 md:py-4",
        )}
      >
        <Link
          href="/admin"
          className={cn("min-w-0", collapsed && "md:text-center")}
          title={collapsed ? "Admin Dashboard" : undefined}
        >
          <span
            className={cn(
              "block truncate font-mono text-sm text-primary",
              collapsed && "md:hidden",
            )}
          >
            mehmetanil
          </span>
          <span
            className={cn(
              "hidden font-mono text-sm font-semibold text-primary",
              collapsed && "md:block",
            )}
          >
            MA
          </span>
          <span
            className={cn(
              "mt-0.5 block text-xs text-muted-foreground",
              collapsed && "md:hidden",
            )}
          >
            Admin
          </span>
        </Link>

        <button
          type="button"
          onClick={() => {
            setThemeMenuOpen(false);
            onCollapse();
          }}
          aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
          title={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
          className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>

        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Menüyü kapat"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        >
          <X size={19} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                collapsed && "md:justify-center md:px-2",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <link.icon size={16} className="shrink-0" />
                <span className={cn("truncate", collapsed && "md:hidden")}>
                  {link.label}
                </span>
              </span>
              {link.badge ? (
                <span
                  className={cn(
                    "rounded-full bg-primary/20 px-1.5 py-0.5 font-mono text-xs text-primary",
                    collapsed &&
                      "md:absolute md:right-1 md:top-1 md:h-2 md:w-2 md:p-0 md:text-[0px]",
                  )}
                  aria-label={`${link.badge} okunmamış mesaj`}
                >
                  {link.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="relative shrink-0 space-y-1 border-t border-border/50 bg-card p-3">
        <div
          className={cn(
            "flex items-center justify-between rounded-md px-3 py-1.5",
            collapsed && "md:hidden",
          )}
        >
          <span className="text-xs text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>

        <div className={cn("hidden justify-center", collapsed && "md:flex")}>
          <button
            type="button"
            onClick={() => setThemeMenuOpen((open) => !open)}
            aria-label="Tema ayarlarını aç"
            aria-expanded={themeMenuOpen}
            title="Tema ayarları"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Palette size={16} />
          </button>

          {themeMenuOpen ? (
            <div className="absolute bottom-3 left-[calc(100%+0.75rem)] z-50 flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                Tema
              </span>
              <ThemeToggle />
            </div>
          ) : null}
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          title={collapsed ? "Siteyi görüntüle" : undefined}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
            collapsed && "md:justify-center md:px-2",
          )}
        >
          <ExternalLink size={16} className="shrink-0" />
          <span className={cn(collapsed && "md:hidden")}>Siteyi görüntüle</span>
        </Link>

        <Link
          href="/api/auth/signout"
          title={collapsed ? "Çıkış yap" : undefined}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500",
            collapsed && "md:justify-center md:px-2",
          )}
        >
          <LogOut size={16} className="shrink-0" />
          <span className={cn(collapsed && "md:hidden")}>Çıkış yap</span>
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileSidebar = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    try {
      setCollapsed(
        window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true",
      );
    } catch {
      // Depolama kapalıysa menü varsayılan geniş görünümle çalışır.
    }
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;

      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // Seçim bu oturumda uygulanmaya devam eder.
      }

      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminPresenceHeartbeat />

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] md:hidden"
        />
      ) : null}

      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={toggleCollapsed}
        onMobileClose={closeMobileSidebar}
      />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/90 px-4 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Admin menüsünü aç"
            aria-controls="admin-sidebar"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          >
            <Menu size={19} />
          </button>
          <span className="font-mono text-sm text-primary">Admin Paneli</span>
        </div>
        {children}
      </main>
    </div>
  );
}
