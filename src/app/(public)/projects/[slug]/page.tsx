import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Github,
  Layers3,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { projectCaseStudies, projects } from "@/lib/data";
import type { Project } from "@/types";

type ProjectDetailPageProps = {
  params: { slug: string };
};

const typeLabels: Record<Project["type"], string> = {
  "full-stack": "Full-Stack",
  ai: "AI / ML",
  sql: "SQL / DB",
  scraping: "Otomasyon",
};

function getProject(slug: string) {
  const project = projects.find((item) => item.slug === slug);
  const caseStudy = projectCaseStudies.find((item) => item.slug === slug);

  return project && caseStudy ? { project, caseStudy } : null;
}

export function generateStaticParams() {
  return projectCaseStudies.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: ProjectDetailPageProps): Metadata {
  const result = getProject(params.slug);
  if (!result) return { title: "Proje bulunamadı" };

  return {
    title: result.project.title,
    description: result.project.description,
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const result = getProject(params.slug);
  if (!result) notFound();

  const { project, caseStudy } = result;

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,hsl(var(--primary)/0.16),transparent_28%),radial-gradient(circle_at_12%_75%,hsl(var(--premium)/0.1),transparent_30%)]" />
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} /> Tüm projeler
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                {caseStudy.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                {caseStudy.overview}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.githubUrl ? (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-15px_hsl(var(--primary))]"
                  >
                    <Github size={16} /> GitHub&apos;da incele
                    <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ) : null}
                {project.liveUrl ? (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/45"
                  >
                    Canlı ürünü aç
                    <ArrowUpRight size={14} className="text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>SYSTEM PROFILE</span>
                <span>{project.year}</span>
              </div>
              <div className="divide-y divide-border/60">
                <div className="flex items-center justify-between gap-4 py-4 text-sm">
                  <span className="text-muted-foreground">Kategori</span>
                  <span className="font-medium">{typeLabels[project.type]}</span>
                </div>
                {caseStudy.signals.map((signal) => (
                  <div key={signal.label} className="flex items-center justify-between gap-4 py-4 text-sm">
                    <span className="text-muted-foreground">{signal.label}</span>
                    <span className="text-right font-medium">{signal.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        {project.gallery?.length ? (
          <section aria-labelledby="product-view-title">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">01 · PRODUCT VIEW</p>
                <h2 id="product-view-title" className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  Çalışan ürün, gerçek ekranlar.
                </h2>
              </div>
              <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                {String(project.gallery.length).padStart(2, "0")} ekran
              </span>
            </div>
            <ProjectGallery images={project.gallery} projectTitle={project.title} priority />
          </section>
        ) : null}

        <section className="border-b border-border/60 py-20" aria-labelledby="problem-title">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">02 · PROBLEM</p>
              <h2 id="problem-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Neyi çözmek için geliştirildi?
              </h2>
            </div>
            <div className="divide-y divide-border/60 border-y border-border/60">
              {caseStudy.challenge.map((item, index) => (
                <article key={item.title} className="grid gap-3 py-6 sm:grid-cols-[44px_1fr] sm:gap-5">
                  <span className="font-mono text-xs text-[hsl(var(--premium))]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-20" aria-labelledby="architecture-title">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">03 · ARCHITECTURE</p>
            <h2 id="architecture-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Sistem nasıl çalışıyor?
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 md:grid-cols-2 xl:grid-cols-4">
            {caseStudy.architecture.map((item) => (
              <article key={item.step} className="relative bg-background p-6 md:min-h-[260px] md:p-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">{item.step}</span>
                  <Layers3 size={17} className="text-muted-foreground/60" />
                </div>
                <h3 className="mt-12 text-lg font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-20" aria-labelledby="flow-title">
          <div className="overflow-hidden rounded-3xl border border-primary/20 bg-[linear-gradient(135deg,hsl(var(--primary)/0.11),hsl(var(--card))_42%,hsl(var(--premium)/0.08))] p-6 sm:p-9 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Workflow size={20} />
                </div>
                <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">04 · DECISION FLOW</p>
                <h2 id="flow-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  {caseStudy.flowTitle}
                </h2>
                <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
                  {caseStudy.flowDescription}
                </p>
              </div>

              <div className="space-y-3">
                {caseStudy.flow.map((item) => (
                  <article key={item.step} className="grid gap-3 rounded-xl border border-border/70 bg-background/70 p-5 backdrop-blur-sm sm:grid-cols-[46px_1fr] sm:items-start">
                    <span className="font-mono text-xs text-primary">{item.step}</span>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 py-20" aria-labelledby="engineering-title">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">05 · ENGINEERING</p>
              <h2 id="engineering-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Mühendislik kararları.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Ürünün yalnızca çalışan bir demo değil; güvenilir, anlaşılır ve geliştirilebilir bir sistem olması hedeflendi.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {caseStudy.engineering.map((item, index) => {
                const Icon = index === 0 ? ShieldCheck : index === 1 ? Workflow : CheckCircle2;
                return (
                  <article key={item.title} className="rounded-2xl border border-border/70 bg-card/55 p-6">
                    <Icon size={19} className="text-primary" />
                    <h3 className="mt-8 font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20" aria-labelledby="stack-title">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">06 · TECHNOLOGY</p>
          <div className="mt-3 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="stack-title" className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Teknoloji seti.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                Ürün ihtiyaçlarına göre seçilen servis, veri ve teslimat araçları.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:max-w-2xl md:justify-end">
              {project.stack.map((technology) => (
                <span key={technology} className="rounded-full border border-border/70 bg-card px-4 py-2 font-mono text-xs text-muted-foreground">
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-border/70 bg-card/65 px-6 py-12 text-center sm:px-10 md:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">EXPLORE THE BUILD</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Kod, mimari ve ürün kararları birlikte.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Projenin kaynak kodunu inceleyebilir veya diğer mühendislik çalışmalarına dönebilirsin.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {project.githubUrl ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <Github size={16} /> GitHub deposu <ArrowUpRight size={14} />
              </Link>
            ) : null}
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/45"
            >
              <ArrowLeft size={14} /> Tüm projeler
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
