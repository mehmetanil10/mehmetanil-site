import type { Metadata } from "next";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { projects } from "@/lib/data";
import type { Project } from "@/types";

export const metadata: Metadata = {
  title: "Projeler",
  description: "Mehmet Anıl'ın full-stack, SQL, AI ve veri odaklı projeleri.",
};

const typeLabels: Record<Project["type"], string> = {
  "full-stack": "Full-Stack",
  ai: "AI / ML",
  sql: "SQL / DB",
  scraping: "Otomasyon",
};

function ProjectCover({ project }: { project: Project }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,hsl(var(--primary)/0.2),transparent_32%),radial-gradient(circle_at_20%_85%,hsl(var(--premium)/0.13),transparent_30%)]" />
      <div
        className="absolute inset-0 opacity-[0.14] dark:opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "linear-gradient(to bottom right, black, transparent 78%)",
          WebkitMaskImage: "linear-gradient(to bottom right, black, transparent 78%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 md:p-10">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{typeLabels[project.type]}</span>
          <span>{project.year}</span>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs text-primary">&gt; {project.slug}</p>
          <h3 className="max-w-2xl text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            {project.title}
          </h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-border/80 bg-background/65 px-3 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-sm"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <section className="max-w-3xl">
        <p className="mb-4 font-mono text-sm text-primary">/ projeler</p>
        <h1 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
          Ürettiğim dijital ürünler ve mühendislik çalışmaları.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Fikir aşamasından çalışan ürüne kadar geliştirdiğim full-stack, yapay zekâ,
          veritabanı ve otomasyon projeleri.
        </p>
      </section>

      <section className="mt-16 border-b border-border/60" aria-label="Projeler">
        {projects.map((project, index) => (
          <article key={project.slug} className="border-t border-border/60 py-12 md:py-16">
            <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-start gap-4 sm:gap-6">
                <span className="pt-1 font-mono text-xs text-[hsl(var(--premium))]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {typeLabels[project.type]}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                    {project.title}
                  </h2>
                </div>
              </div>
              <span className="pl-10 font-mono text-xs text-muted-foreground sm:pl-0">
                {project.year}
              </span>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:items-start lg:gap-10">
              {project.gallery?.length ? (
                <ProjectGallery
                  images={project.gallery}
                  projectTitle={project.title}
                  priority={index === 0}
                />
              ) : (
                <ProjectCover project={project} />
              )}

              <div className="flex h-full flex-col">
                <p className="text-sm leading-7 text-muted-foreground md:text-base">
                  {project.longDescription ?? project.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {project.stack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-border/70 bg-card/60 px-3 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                {(project.liveUrl || project.githubUrl) && (
                  <div className="mt-8 flex flex-wrap gap-3 border-t border-border/60 pt-6 lg:mt-auto">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_rgba(59,130,246,0.9)]"
                      >
                        <ExternalLink size={14} /> Canlı Demo
                        <ArrowUpRight
                          size={13}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50"
                      >
                        <Github size={14} /> GitHub
                        <ArrowUpRight
                          size={13}
                          className="text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
