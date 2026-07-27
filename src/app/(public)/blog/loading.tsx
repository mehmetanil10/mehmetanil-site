export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 animate-pulse">
      {/* Başlık */}
      <div className="h-3 w-16 rounded bg-primary/20 mb-3" />
      <div className="h-8 w-24 rounded bg-secondary mb-2" />
      <div className="h-3 w-72 rounded bg-secondary/60" />

      {/* Kategori filtreleri */}
      <div className="mt-8 flex gap-2">
        {[40, 56, 48, 64, 44].map((w, i) => (
          <div
            key={i}
            className="h-6 rounded bg-secondary/60"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Featured post skeleton */}
      <div className="mt-10">
        <div className="h-3 w-24 rounded bg-secondary/40 mb-4" />
        <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
          <div className="h-36 md:h-44 bg-secondary/40" />
          <div className="p-6 space-y-3">
            <div className="flex gap-3">
              <div className="h-3 w-16 rounded bg-secondary/60" />
              <div className="h-3 w-24 rounded bg-secondary/40" />
              <div className="h-3 w-20 rounded bg-secondary/40" />
            </div>
            <div className="h-6 w-2/3 rounded bg-secondary" />
            <div className="h-3 w-full rounded bg-secondary/50" />
            <div className="h-3 w-4/5 rounded bg-secondary/40" />
          </div>
        </div>
      </div>

      {/* Grid kartlar skeleton */}
      <div className="mt-10">
        <div className="h-3 w-20 rounded bg-secondary/40 mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/30 bg-card overflow-hidden"
            >
              <div className="h-1.5 w-full bg-secondary/40" />
              <div className="p-5 space-y-2.5">
                <div className="flex gap-2">
                  <div className="h-3 w-14 rounded bg-secondary/60" />
                  <div className="h-3 w-20 rounded bg-secondary/40" />
                </div>
                <div className="h-4 w-3/4 rounded bg-secondary" />
                <div className="h-3 w-full rounded bg-secondary/50" />
                <div className="h-3 w-2/3 rounded bg-secondary/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
