import Link from "next/link";
import {
  ArrowRight,
  Database,
  Server,
  Code2,
  Brain,
  ExternalLink,
} from "lucide-react";
import { projects, experiences } from "@/lib/data";
import { getPosts } from "@/actions/post-actions";

export const dynamic = "force-dynamic";
import { formatDate } from "@/lib/utils";
import { HeroAnimated } from "@/components/home/hero-animated";
import { AnimatedCard } from "@/components/home/animated-card";

const expertiseItems = [
  {
    icon: Database,
    title: "SQL Optimization",
    desc: "Execution plan analizi, index tuning, slow query optimizasyonu",
  },
  {
    icon: Server,
    title: "ERP & Sistem Desteği",
    desc: "Logo ERP kurumsal destek, production veritabanı bakımı",
  },
  {
    icon: Code2,
    title: "Full-Stack Geliştirme",
    desc: "Next.js, Node.js, TypeScript ile uçtan uca uygulama geliştirme",
  },
  {
    icon: Brain,
    title: "AI & Veri Projeleri",
    desc: "NLP, Computer Vision, web scraping ve veri odaklı sistemler",
  },
];

export default async function HomePage() {
  let latestPosts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    latestPosts = await getPosts("PUBLISHED");
    latestPosts = latestPosts.slice(0, 3);
  } catch {}

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const featuredExperiences = experiences.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* ── Hero (client — typing + floating blob) ── */}
      <HeroAnimated />

      {/* ── Expertise ── */}
      <section className="py-16 border-t border-border/50">
        <h2 className="mb-10 text-sm font-mono text-muted-foreground uppercase tracking-widest">
          Uzmanlık Alanları
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {expertiseItems.map((item) => (
            <AnimatedCard
              key={item.title}
              className="rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/40 hover:shadow-[0_0_18px_-4px_hsl(var(--primary)/0.15)] cursor-default"
            >
              <item.icon size={20} className="text-primary mb-3" />
              <h3 className="font-medium text-sm">{item.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ── Featured Experience ── */}
      <section className="py-16 border-t border-border/50">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            Deneyim
          </h2>
          <Link
            href="/experience"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Tümünü gör <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-4">
          {featuredExperiences.map((exp) => (
            <AnimatedCard
              key={exp.company}
              className="rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/40 hover:shadow-[0_0_18px_-4px_hsl(var(--primary)/0.15)] cursor-default"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                <div>
                  <span className="font-medium text-sm">{exp.company}</span>
                  <span className="text-muted-foreground text-sm">
                    {" "}
                    · {exp.role}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-1">
                {exp.highlights.slice(0, 2).map((h, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex gap-2"
                  >
                    <span className="text-primary mt-0.5">›</span>
                    {h}
                  </li>
                ))}
              </ul>
              {exp.stack && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.stack.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section className="py-16 border-t border-border/50">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            Öne Çıkan Projeler
          </h2>
          <Link
            href="/projects"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Tümünü gör <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <AnimatedCard
              key={project.slug}
              className="rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/40 hover:shadow-[0_0_18px_-4px_hsl(var(--primary)/0.15)] cursor-default"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{project.title}</h3>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {project.year}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary transition-colors hover:text-primary/80"
                >
                  Canlı demo <ExternalLink size={12} />
                </Link>
              )}
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ── Latest Blog Posts ── */}
      {latestPosts.length > 0 && (
        <section className="py-16 border-t border-border/50">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
              Son Yazılar
            </h2>
            <Link
              href="/blog"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Tümünü gör <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-5 py-4 transition-all hover:border-primary/40 hover:shadow-[0_0_14px_-4px_hsl(var(--primary)/0.12)] hover:translate-x-1 group"
              >
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {post.title}
                  </p>
                  {post.excerpt && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono text-muted-foreground ml-4 shrink-0">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Contact CTA ── */}
      <section className="py-16 border-t border-border/50 pb-24">
        <div className="rounded-lg border border-border/50 bg-card p-8 md:p-12 text-center transition-all hover:border-primary/30 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.15)]">
          <h2 className="text-xl font-semibold mb-2">İletişime geç</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Proje fikrin mi var, işbirliği mi arıyorsun, ya da sadece merhaba mı
            demek istiyorsun?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.04] active:scale-[0.98]"
          >
            Mesaj gönder <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
