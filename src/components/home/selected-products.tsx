import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types";
import { AnimatedCard } from "@/components/home/animated-card";

export function SelectedProducts({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {projects.map((project) => (
        <AnimatedCard
          key={project.slug}
          className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_45px_-28px_hsl(var(--primary)/0.55)]"
        >
          {project.gallery?.[0] && (
            <Link
              href={`/projects#${project.slug}`}
              className="relative block aspect-video overflow-hidden border-b border-border/60 bg-secondary/30"
              aria-label={`${project.title} projesini incele`}
            >
              <Image
                src={project.gallery[0].src}
                alt={project.gallery[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 576px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.018]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-30" />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1.5 text-[10px] font-medium text-white/90 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 group-focus-visible:opacity-100">
                Projeyi incele <ArrowRight size={11} />
              </span>
            </Link>
          )}

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                {project.type === "ai" ? "AI / ML" : "Full-Stack"}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
            </div>

            <Link href={`/projects#${project.slug}`} className="w-fit">
              <h3 className="text-lg font-semibold tracking-[-0.02em] transition-colors hover:text-primary">
                {project.title}
              </h3>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.description}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-border/70 bg-secondary/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                >
                  {technology}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border/60 pt-5 md:mt-auto">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/75"
                >
                  Canlı Demo <ExternalLink size={12} />
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github size={13} /> GitHub
                </Link>
              )}
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}
