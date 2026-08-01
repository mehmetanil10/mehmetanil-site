import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  Server,
  TrendingUp,
  CheckCircle2,
  Users,
  Zap,
  Bot,
  GraduationCap,
  PanelsTopLeft,
  Palette,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "SQL Server optimizasyonu, Node.js backend geliştirme ve ERP sistem desteği hizmetleri. Mehmet Anıl ile çalışın.",
};

const services = [
  {
    icon: PanelsTopLeft,
    badge: "Web",
    title: "Web Uygulama Geliştirme",
    tagline:
      "İşletmenize özel, kullanıcı dostu ve performanslı web uygulamaları geliştiriyorum. Tasarımdan backend altyapısına ve yayına alma sürecine kadar uçtan uca çözüm sunuyorum.",
    accentColor: "text-cyan-400",
    borderColor: "border-cyan-400/20",
    bgColor: "bg-cyan-400/5",
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
    accentColor: "text-rose-400",
    borderColor: "border-rose-400/20",
    bgColor: "bg-rose-400/5",
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
    accentColor: "text-blue-400",
    borderColor: "border-blue-400/20",
    bgColor: "bg-blue-400/5",
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
    accentColor: "text-amber-400",
    borderColor: "border-amber-400/20",
    bgColor: "bg-amber-400/5",
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

const fullProfile = [
  {
    icon: Database,
    title: "SQL Server & Veritabanı",
    color: "text-amber-400",
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
    color: "text-blue-400",
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
    color: "text-purple-400",
    items: [
      "OpenCV ve YOLOv4 ile computer vision projeleri",
      "NLP tabanlı sesli asistan geliştirme",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      {/* Header */}
      <p className="mb-3 font-mono text-sm text-primary">/ hizmetler</p>
      <h1 className="text-3xl font-semibold tracking-tight">Hizmetler</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xl">
        SQL optimizasyonundan backend geliştirmeye — gerçek sonuçlar odaklı çalışıyorum.
      </p>

      {/* Main service cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.title}
            className={`rounded-xl border ${service.borderColor} ${service.bgColor} p-7 flex flex-col`}
          >
            {/* Card header */}
            <div className="flex items-start gap-4 mb-5">
              <div className={`p-2.5 rounded-lg border ${service.borderColor} bg-background/60`}>
                <service.icon size={20} className={service.accentColor} />
              </div>
              <div>
                <span className={`text-xs font-mono ${service.accentColor}`}>
                  {service.badge}
                </span>
                <h2 className="text-base font-semibold mt-0.5">{service.title}</h2>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {service.tagline}
            </p>

            {/* What I do */}
            <div className="mb-5">
              <p className="text-xs font-medium text-foreground mb-3">Ne yapıyorum?</p>
              <ul className="space-y-2">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2
                      size={14}
                      className={`${service.accentColor} mt-0.5 shrink-0`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* For whom (SQL card only) */}
            {service.forWhom && (
              <div className="mb-5">
                <p className="text-xs font-medium text-foreground mb-3 flex items-center gap-1.5">
                  <Users size={12} className={service.accentColor} /> Kimler için?
                </p>
                <ul className="space-y-1.5">
                  {service.forWhom.map((who) => (
                    <li key={who} className="flex gap-2 text-sm text-muted-foreground">
                      <span className={service.accentColor}>›</span>
                      {who}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stack */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {service.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 rounded-md border ${service.borderColor} px-4 py-2 text-sm font-medium ${service.accentColor} hover:bg-background/60 transition-colors`}
              >
                {service.cta} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Full profile section */}
      <div className="mt-16 border-t border-border/50 pt-14">
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {fullProfile.map((section) => (
            <div
              key={section.title}
              className="rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-border"
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
      </div>

      {/* MSc note */}
      <div className="mt-8 rounded-lg border border-border/50 bg-card px-6 py-4 flex items-center gap-3">
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
      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 md:p-10 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Veritabanınız daha hızlı çalışsın, backend&apos;iniz doğru kurulsun?
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Projenizi anlat, nasıl yardımcı olabileceğimi konuşalım.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          İletişime geç <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
