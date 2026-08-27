"use client";

import type { CSSProperties, MouseEvent } from "react";
import { Clock3, MapPin, MessageSquare, Radio, ShieldCheck } from "lucide-react";
import { useAdminAvailability } from "@/components/analytics/use-admin-availability";

type ConsoleStyle = CSSProperties & {
  "--console-x": string;
  "--console-y": string;
  "--console-shift-x": string;
  "--console-shift-y": string;
};

export function ContactConsole() {
  const adminOnline = useAdminAvailability();

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    const panel = event.currentTarget;
    const rect = panel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    panel.style.setProperty("--console-x", `${x * 100}%`);
    panel.style.setProperty("--console-y", `${y * 100}%`);
    panel.style.setProperty("--console-shift-x", `${(x - 0.5) * 10}px`);
    panel.style.setProperty("--console-shift-y", `${(y - 0.5) * 10}px`);
  };

  const resetPointer = (event: MouseEvent<HTMLElement>) => {
    const panel = event.currentTarget;
    panel.style.setProperty("--console-x", "50%");
    panel.style.setProperty("--console-y", "42%");
    panel.style.setProperty("--console-shift-x", "0px");
    panel.style.setProperty("--console-shift-y", "0px");
  };

  const style: ConsoleStyle = {
    "--console-x": "50%",
    "--console-y": "42%",
    "--console-shift-x": "0px",
    "--console-shift-y": "0px",
  };

  return (
    <aside
      aria-label="İletişim durumu"
      className="contact-console group relative isolate overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.07] via-card to-card p-5 shadow-[0_28px_75px_-50px_hsl(var(--primary)/0.7)] sm:p-6 md:col-span-2 lg:sticky lg:top-28 lg:col-span-1"
      style={style}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
    >
      <div className="contact-console-pointer absolute inset-0 -z-10 opacity-70" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-35" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            İletişim hattı
          </p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
          hazır
        </span>
      </div>

      <div className="relative mx-auto my-6 flex h-48 max-w-[250px] items-center justify-center" aria-hidden="true">
        <div className="contact-console-grid absolute inset-0 opacity-45" />
        <div className="contact-console-orbit contact-console-orbit-outer absolute h-40 w-40 rounded-full border border-primary/15" />
        <div className="contact-console-orbit contact-console-orbit-inner absolute h-28 w-28 rounded-full border border-dashed border-primary/35" />
        <div className="absolute h-20 w-20 rounded-full bg-primary/15 blur-2xl" />

        <div className="contact-console-core relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-background/90 text-primary shadow-[0_0_38px_-12px_hsl(var(--primary)/0.85)] backdrop-blur-sm">
          <MessageSquare size={25} strokeWidth={1.7} />
          <span className="contact-console-core-pulse absolute inset-[-7px] rounded-[1.25rem] border border-primary/25" />
        </div>

        <span className="contact-signal-node contact-signal-node-a absolute left-[14%] top-[28%] h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
        <span className="contact-signal-node contact-signal-node-b absolute bottom-[22%] right-[12%] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        <span className="absolute right-[18%] top-[18%] h-1 w-1 rounded-full bg-primary/70" />

        <div className="absolute bottom-0 rounded-full border border-primary/20 bg-background/75 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
          signal / connected
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-background/45 px-3.5 py-3">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Radio size={14} className="text-primary" /> Durum
          </span>
          <span className={`text-xs font-medium ${adminOnline ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
            {adminOnline ? "Şu an çevrimiçi" : "Mesajlara açık"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-background/45 px-3.5 py-3">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 size={14} className="text-primary" /> Yanıt süresi
          </span>
          <span className="text-xs font-medium text-foreground">24 saat içinde</span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-background/45 px-3.5 py-3">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin size={14} className="text-primary" /> Çalışma
          </span>
          <span className="text-xs font-medium text-foreground">İzmir · Remote</span>
        </div>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          Çalışma alanları
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Backend", "Full-Stack", "AI & Veri"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-5 flex items-center gap-2 text-[10px] leading-relaxed text-muted-foreground">
        <ShieldCheck size={13} className="shrink-0 text-emerald-500" />
        Mesajınız güvenli doğrulamadan sonra iletilir.
      </p>
    </aside>
  );
}
