import Link from "next/link";
import {
  ArrowRight,
  Database,
  Server,
  Code2,
  Brain,
} from "lucide-react";
import { projects, experiences } from "@/lib/data";
import { getPosts } from "@/actions/post-actions";

export const dynamic = "force-dynamic";
import { formatDate } from "@/lib/utils";
import { HeroAnimated } from "@/components/home/hero-animated";
import { AnimatedCard } from "@/components/home/animated-card";
import { SelectedProducts } from "@/components/home/selected-products";

const expertiseItems = [
  {
    icon: Server,
    discipline: "01 · SYSTEM DESIGN",
    title: "Backend Sistemleri",
    desc: "Güvenli REST API’ler, kimlik doğrulama süreçleri ve sürdürülebilir servis mimarileri geliştiriyorum.",
  },
  {
    icon: Database,
    discipline: "02 · DATA ENGINEERING",
    title: "Veritabanı ve Performans",
    desc: "Veri modelleme, execution plan analizi, sorgu optimizasyonu ve index tuning ile sistem performansını iyileştiriyorum.",
  },
  {
    icon: Code2,
    discipline: "03 · PRODUCT ENGINEERING",
    title: "Full-Stack Ürün Geliştirme",
    desc: "Kullanıcı arayüzünden backend ve veritabanına kadar uçtan uca çalışan web ürünleri geliştiriyorum.",
  },
  {
    icon: Brain,
    discipline: "04 · INTELLIGENT SYSTEMS",
    title: "Yapay Zekâ ve Veri Sistemleri",
    desc: "Tahmin modelleri, telemetri verileri, bilgisayarlı görü ve NLP tabanlı özellikleri gerçek uygulamalara entegre ediyorum.",
  },
];

export default async function HomePage() {
  let latestPosts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    latestPosts = await getPosts("PUBLISHED");
    latestPosts = latestPosts.slice(0, 3);
  } catch {}

  const selectedProjects = projects.filter(
    (project) => project.slug === "vehicleguard" || project.slug === "ydsxp",
  );
  const featuredExperiences = experiences.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* ── Hero (client — typing + floating blob) ── */}
      <HeroAnimated />

      {/* ── Expertise ── */}
      <section className="py-16 border-t border-border/50">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            Mühendislik Yetkinlikleri
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Production deneyimiyle güvenilir, sürdürülebilir ve veri odaklı
            yazılım sistemleri geliştiriyorum.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {expertiseItems.map((item) => (
            <AnimatedCard
              key={item.title}
              className="h-full rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/40 hover:shadow-[0_0_18px_-4px_hsl(var(--primary)/0.15)] cursor-default"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] tracking-[0.12em] text-primary">
                  {item.discipline}
                </span>
                <item.icon size={19} className="shrink-0 text-primary" />
              </div>
              <h3 className="text-sm font-medium leading-snug">{item.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
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

      {/* ── Selected Products ── */}
      <section className="py-16 border-t border-border/50">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            Seçili Ürünler
          </h2>
          <Link
            href="/projects"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Tümünü gör <ArrowRight size={12} />
          </Link>
        </div>
        <SelectedProducts projects={selectedProjects} />
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
