import type { Metadata } from "next";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projeler",
  description: "Mehmet Anıl'ın full-stack, SQL, AI ve veri odaklı projeleri.",
};

const typeLabels: Record<string, string> = {
  "full-stack": "Full-Stack",
  ai: "AI / ML",
  sql: "SQL / DB",
  scraping: "Otomasyon",
};

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-3 font-mono text-sm text-primary">/ projeler</p>
      <h1 className="text-3xl font-semibold tracking-tight">Projeler</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xl">
        Full-stack uygulamalardan SQL optimizasyon çalışmalarına, AI projelerine kadar.
      </p>

      {/* Featured */}
      <div className="mt-12">
        <h2 className="mb-6 text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Öne çıkanlar
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featured.map((project) => (
            <div
              key={project.slug}
              className="rounded-lg border border-border/50 bg-card p-6 flex flex-col transition-colors hover:border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs rounded-sm bg-primary/10 text-primary px-2 py-0.5 font-mono">
                  {typeLabels[project.type]}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {project.year}
                </span>
              </div>

              <h3 className="font-medium mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {project.longDescription ?? project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {(project.githubUrl || project.liveUrl) && (
                <div className="mt-4 flex flex-col items-start gap-2 pt-4 border-t border-border/50">
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="order-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github size={14} /> GitHub
                    </Link>
                  )}
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="order-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={14} /> Canlı Demo
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Others */}
      {others.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Diğer projeler
          </h2>
          <div className="space-y-3">
            {others.map((project) => (
              <div
                key={project.slug}
                className="rounded-lg border border-border/50 bg-card px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors hover:border-border"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium">{project.title}</h3>
                    <span className="text-xs rounded-sm bg-secondary text-muted-foreground px-1.5 py-0.5 font-mono">
                      {typeLabels[project.type]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {project.stack.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs font-mono text-muted-foreground">
                      {s}
                    </span>
                  ))}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
