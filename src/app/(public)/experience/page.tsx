import type { Metadata } from "next";
import { experiences } from "@/lib/data";

export const metadata: Metadata = {
  title: "Deneyim",
  description: "Mehmet Anıl'ın profesyonel iş deneyimi — ERP, SQL optimizasyon ve yazılım geliştirme.",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="mb-3 font-mono text-sm text-primary">/ deneyim</p>
        <h1 className="text-3xl font-semibold tracking-tight">İş Deneyimi</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kurumsal ERP sistemlerinden full-stack projelere uzanan süreç.
        </p>

        <div className="mt-12 space-y-6">
          {experiences.map((exp, idx) => (
            <div
              key={exp.company}
              className="relative rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-border"
            >
              {/* Timeline dot */}
              {idx < experiences.length - 1 && (
                <div className="absolute left-6 -bottom-6 h-6 w-px bg-border/50" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-medium">{exp.company}</h2>
                  <p className="text-sm text-muted-foreground">{exp.role}</p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                  <span className="text-xs font-mono text-muted-foreground">
                    {exp.period}
                  </span>
                  <span
                    className={`text-xs rounded-sm px-2 py-0.5 ${
                      exp.type === "full-time"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {exp.type === "full-time" ? "Tam zamanlı" : "Staj"}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 shrink-0">›</span>
                    {h}
                  </li>
                ))}
              </ul>

              {exp.stack && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
