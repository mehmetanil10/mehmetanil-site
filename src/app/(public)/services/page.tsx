import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  Server,
  Zap,
  Bot,
  GraduationCap,
  PanelsTopLeft,
  Palette,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "Web uygulama geliştirme, marka kimliği tasarımı, backend geliştirme ve SQL performans optimizasyonu hizmetleri.",
};

const services = [
  {
    icon: PanelsTopLeft,
    badge: "Web",
    title: "Web Uygulama Geliştirme",
    tagline:
      "İşletmenize özel, kullanıcı dostu ve performanslı web uygulamaları geliştiriyorum. Tasarımdan backend altyapısına ve yayına alma sürecine kadar uçtan uca çözüm sunuyorum.",
    outcome: "Fikrinizi hızlı, güvenli ve ölçeklenebilir bir dijital ürüne dönüştürün.",
    items: [
      "Web uygulamaları",
      "Yönetim panelleri",
      "API ve backend geliştirme",
      "Responsive tasarım",
      "Yayınlama ve bakım",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    cta: "Web projesi için iletişime geç",
  },
  {
    icon: Palette,
    badge: "Tasarım",
    title: "Marka Kimliği Tasarımı",
    tagline:
      "Markanızın dijital dünyada tutarlı ve profesyonel görünmesini sağlayan görsel kimlik çözümleri hazırlıyorum.",
    outcome: "Markanızın tüm dijital temas noktalarında güven veren bir bütünlük oluşturun.",
    items: [
      "Logo tasarımı",
      "Renk paleti",
      "Tipografi",
      "Sosyal medya şablonları",
      "Dijital marka rehberi",
    ],
    stack: ["Logo", "Tipografi", "Renk Sistemi", "Sosyal Medya", "Marka Rehberi"],
    cta: "Marka kimliği için iletişime geç",
  },
  {
    icon: Server,
    badge: "Backend",
    title: "Node.js Backend Geliştirme",
    tagline: "Mobil uygulamanız, web projeniz veya SaaS ürününüz için sıfırdan backend geliştiririm ya da mevcut sisteminizi büyütürüm.",
    outcome: "Ürününüzü taşıyacak güvenli, sürdürülebilir ve büyümeye hazır bir altyapı kurun.",
    items: [
      "REST API tasarımı ve geliştirilmesi (Node.js + Express)",
      "MongoDB veya PostgreSQL ile veritabanı entegrasyonu",
      "Kullanıcı kimlik doğrulama (JWT, session yönetimi)",
      "3. parti API entegrasyonları",
      "Web scraping ve otomasyon araçları",
    ],
    stack: ["Node.js", "Express", "MongoDB", "PostgreSQL", "JavaScript", "Vue.js"],
    cta: "Backend projesi için iletişime geç",
  },
  {
    icon: Database,
    badge: "SQL",
    title: "SQL Sorgu & Performans Optimizasyonu",
    tagline: "Üretim ortamındaki yavaş sorgularınızı analiz eder, execution plan incelemesi ve index optimizasyonu ile performansı artırırım.",
    outcome: "Yavaş sorguları ve darboğazları gidererek daha hızlı, kararlı sistemler elde edin.",
    items: [
      "Yavaş sorguların tespiti ve yeniden yazılması",
      "Index analizi ve düzenlenmesi",
      "Execution plan üzerinden darboğaz tespiti",
      "View ve stored procedure optimizasyonu",
      "Canlı sistemlerde kesinti olmadan müdahale",
    ],
    stack: ["SQL Server", "T-SQL", "Execution Plans", "Index Tuning"],
    forWhom: [
      "SQL Server kullanan KOBİ'ler",
      "Logo ERP kullanan firmalar",
      "Raporları yavaş çalışan işletmeler",
    ],
    cta: "SQL optimizasyonu için iletişime geç",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Keşif",
    description: "İhtiyacınızı, hedef kitlenizi ve başarı ölçütlerini birlikte netleştiririz.",
  },
  {
    number: "02",
    title: "Planlama",
    description: "Kapsamı, teknik yaklaşımı ve teslim adımlarını şeffaf bir plana dönüştürürüz.",
  },
  {
    number: "03",
    title: "Üretim",
    description: "Tasarım ve geliştirme sürecini düzenli geri bildirimlerle ilerletirim.",
  },
  {
    number: "04",
    title: "Teslim & Destek",
    description: "Testleri tamamlar, yayına alır ve ihtiyaç duyulan desteği sürdürürüm.",
  },
];

const fullProfile = [
  {
    icon: Database,
    title: "SQL Server & Veritabanı",
    color: "text-amber-600 dark:text-amber-400",
    items: [
      "Execution plan analizi ile sorgu optimizasyonu — yüksek trafikli production ortamlarında yanıt sürelerini önemli ölçüde kısalttım",
      "Canlı veritabanlarında index analizi, yeniden yapılandırma ve tuning",
      "Karar destek ve operasyonel izleme için özel rapor geliştirme",
      "ERP desteği ve minimal downtime ile veritabanı bakımı",
    ],
  },
  {
    icon: Server,
    title: "Backend & Full-Stack",
    color: "text-blue-600 dark:text-blue-400",
    items: [
      "Node.js ve Express ile REST API geliştirme",
      "MongoDB ve PostgreSQL ile veritabanı tasarımı",
      "Full-stack projeler (JavaScript, Vue.js, Node.js)",
      "Web scraping ve veri otomasyon araçları",
    ],
  },
  {
    icon: Bot,
    title: "AI & Python",
    color: "text-purple-600 dark:text-purple-400",
    items: [
      "OpenCV ve YOLOv4 ile computer vision projeleri",
      "NLP tabanlı sesli asistan geliştirme",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Editorial hero */}
      <section className="relative overflow-hidden border-b border-border/60 pb-16 md:pb-24">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-[110px]" />
        <div className="relative max-w-4xl">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-[hsl(var(--premium))]" />
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[hsl(var(--premium))]">
              Dijital ürün & teknoloji
            </p>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl">
            Fikirleri çalışan, ölçeklenebilir ve etkileyici ürünlere dönüştürüyorum.
          </h1>
          <div className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Stratejiden tasarıma, geliştirmeden yayına alma sürecine kadar ihtiyaç
              duyduğunuz dijital çözümü özenli ve sonuç odaklı bir yaklaşımla oluşturuyorum.
            </p>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground"
            >
              Projenizi konuşalım
              <ArrowUpRight
                size={16}
                className="text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Premium service rows */}
      <section className="border-b border-border/60" aria-label="Hizmetler">
        {services.map((service, index) => (
          <article
            key={service.title}
            className="group relative border-b border-border/60 py-10 last:border-b-0 md:py-14"
          >
            <div className="pointer-events-none absolute inset-x-[-1.5rem] inset-y-0 bg-gradient-to-r from-primary/[0.045] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative grid gap-8 md:grid-cols-[52px_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10 lg:grid-cols-[64px_minmax(220px,0.75fr)_minmax(360px,1.25fr)] lg:gap-14">
              <span className="font-mono text-sm text-[hsl(var(--premium))]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card/70 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_-12px_rgba(59,130,246,0.75)]">
                  <service.icon size={19} className="text-primary" />
                </div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {service.badge}
                </p>
                <h2 className="max-w-xs text-2xl font-medium leading-tight tracking-[-0.025em] md:text-3xl">
                  {service.title}
                </h2>
              </div>

              <div className="flex flex-col">
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                  {service.tagline}
                </p>
                <div className="mt-6 border-l border-[hsl(var(--premium)/0.5)] pl-4">
                  <p className="text-sm leading-6 text-foreground/90">{service.outcome}</p>
                </div>

                <ul className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                {service.forWhom && (
                  <p className="mt-6 text-xs leading-6 text-muted-foreground">
                    <span className="mr-2 font-medium uppercase tracking-wider text-foreground/80">
                      Kimler için
                    </span>
                    {service.forWhom.join(" · ")}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-2">
                  {service.stack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-border/70 bg-card/50 px-3 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="mt-8 inline-flex w-fit items-center gap-2 border-b border-primary/40 pb-1 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {service.cta}
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Process */}
      <section className="py-20 md:py-24">
        <div className="mb-10 flex items-center gap-3">
          <Sparkles size={15} className="text-[hsl(var(--premium))]" />
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[hsl(var(--premium))]">
            Çalışma süreci
          </p>
        </div>
        <div className="grid border-y border-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="border-b border-border/60 px-0 py-7 last:border-b-0 sm:px-6 sm:first:pl-0 sm:[&:nth-child(2)]:border-l lg:border-b-0 lg:border-l lg:first:border-l-0 lg:last:pr-0"
            >
              <span className="font-mono text-xs text-primary">{step.number}</span>
              <h3 className="mt-4 text-base font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full profile section */}
      <section className="border-t border-border/60 pt-16 md:pt-20">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-primary" />
          <p className="text-xs font-mono text-primary uppercase tracking-widest">Tam Profil</p>
        </div>
        <h2 className="text-xl font-semibold mb-2">Projenize neler katarım?</h2>
        <p className="text-sm text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          SQL Server optimizasyonu ve Node.js backend geliştirme konusunda uzmanlaşmış bilgisayar mühendisiyim.
          Kurumsal ERP sistemlerine (Logo Software) destek verme konusunda sahadan deneyimim var.
          Sadece kod yazan biri değil, gerçek sonuçlara odaklanan biri olarak çalışıyorum.
        </p>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 md:grid-cols-3">
          {fullProfile.map((section) => (
            <div
              key={section.title}
              className="bg-background p-6 transition-colors duration-300 hover:bg-card/80"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <section.icon size={18} className={section.color} />
                <h3 className="text-sm font-medium">{section.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className={`${section.color} shrink-0 mt-0.5`}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* MSc note */}
      <div className="mt-8 flex items-center gap-3 border-y border-border/50 px-1 py-5">
        <GraduationCap size={18} className="text-primary shrink-0" />
        <p className="text-sm text-muted-foreground">
          Şu an{" "}
          <span className="text-foreground font-medium">
            Bilgisayar Mühendisliği Yüksek Lisansı
          </span>{" "}
          yapıyorum — modern teknolojileri ve en iyi pratikleri yakından takip ediyorum.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="relative mt-16 overflow-hidden rounded-2xl border border-primary/20 bg-card/70 p-8 text-center md:p-12">
        <div className="pointer-events-none absolute inset-x-0 -top-28 mx-auto h-56 w-96 rounded-full bg-primary/15 blur-[90px]" />
        <h2 className="relative mb-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Bir fikriniz mi var? Birlikte hayata geçirelim.
        </h2>
        <p className="relative mx-auto mb-7 max-w-lg text-sm leading-6 text-muted-foreground">
          İhtiyacınızı ve hedefinizi anlatın; projeniz için en doğru yaklaşımı birlikte belirleyelim.
        </p>
        <Link
          href="/contact"
          className="relative inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_-14px_rgba(59,130,246,0.9)]"
        >
          İletişime geç <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
