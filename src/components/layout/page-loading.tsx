import { Loader2 } from "lucide-react";

type PageLoadingProps = {
  variant?: "public" | "admin";
};

export function PageLoading({ variant = "public" }: PageLoadingProps) {
  if (variant === "admin") {
    return (
      <div className="p-6 md:p-8 animate-pulse" aria-label="Sayfa yükleniyor">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-40 rounded-md bg-secondary" />
            <div className="h-3 w-64 rounded bg-secondary/60" />
          </div>
          <div className="h-9 w-28 rounded-md bg-primary/15" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 rounded-xl border border-border/50 bg-card"
            />
          ))}
        </div>
        <div className="mt-6 overflow-hidden rounded-xl border border-border/50 bg-card">
          <div className="h-12 border-b border-border/50 bg-secondary/20" />
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex h-14 items-center gap-4 border-b border-border/30 px-5 last:border-0"
            >
              <div className="h-3 w-2/5 rounded bg-secondary" />
              <div className="ml-auto h-3 w-20 rounded bg-secondary/60" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex min-h-[55vh] max-w-6xl flex-col px-6 py-20"
      aria-label="Sayfa yükleniyor"
    >
      <div className="flex items-center gap-2 text-xs font-mono text-primary">
        <Loader2 size={14} className="animate-spin" />
        içerik yükleniyor
      </div>
      <div className="mt-5 animate-pulse space-y-4">
        <div className="h-9 w-56 rounded-md bg-secondary" />
        <div className="h-4 w-full max-w-xl rounded bg-secondary/60" />
        <div className="h-4 w-4/5 max-w-lg rounded bg-secondary/40" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="h-44 rounded-xl border border-border/40 bg-card" />
          <div className="h-44 rounded-xl border border-border/40 bg-card" />
        </div>
      </div>
    </div>
  );
}
