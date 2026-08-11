import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Database,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Network,
  Search,
  Server,
  Settings2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımda",
  description:
    "Backend sistemleri, veritabanı performansı, kurumsal yazılımlar ve veri odaklı ürünler geliştiren Bilgisayar Mühendisi Mehmet Anıl hakkında.",
};

const education = [
  {
    level: "M.Sc.",
    school: "Dokuz Eylül Üniversitesi",
    degree: "Bilgisayar Mühendisliği Yüksek Lisans (Tezli)",
    period: "Eylül 2025 – Devam ediyor",
    status: "Devam ediyor",
  },
  {
    level: "B.Sc.",
    school: "Manisa Celal Bayar Üniversitesi",
    degree: "Bilgisayar Mühendisliği Lisans",
    period: "Eylül 2020 – Temmuz 2024",
    status: "GPA 3.09/4",
  },
];

const engineeringProcess = [
  {
    icon: Search,
    title: "Problemi anla",
    description:
      "İş ihtiyacını, kullanıcı beklentisini ve sistem kısıtlarını birlikte analiz ederim.",
  },
  {
    icon: Network,
    title: "Sistemi tasarla",
    description:
      "Veri modelini, servis sınırlarını ve uygulamanın çalışma akışını oluştururum.",
  },
  {
    icon: Code2,
    title: "Uygula",
    description:
      "Backend, veritabanı ve kullanıcı arayüzünü çalışan bir ürün hâline getiririm.",
  },
  {
    icon: Settings2,
    title: "Ölç ve iyileştir",
    description:
      "Performansı gözlemler, darboğazları tespit eder ve sistemi sürdürülebilir biçimde geliştiririm.",
  },
];

const disciplines = [
  {
    icon: Server,
    code: "01 · SYSTEM DESIGN",
    title: "Backend Sistemleri",
    description:
      "REST API'ler, kimlik doğrulama akışları ve sürdürülebilir servis mimarileri.",
  },
  {
    icon: Database,
    code: "02 · DATA ENGINEERING",
    title: "Veritabanı ve Performans",
    description:
      "Veri modelleme, SQL raporlama, execution plan analizi ve sorgu optimizasyonu.",
  },
  {
    icon: Code2,
    code: "03 · PRODUCT ENGINEERING",
    title: "Uçtan Uca Ürün Geliştirme",
    description:
      "Arayüzden backend ve veritabanına kadar birlikte çalışan web ürünleri.",
  },
  {
    icon: BrainCircuit,
    code: "04 · INTELLIGENT SYSTEMS",
    title: "Yapay Zekâ ve Veri Sistemleri",
    description:
      "Tahmin modellerini ve veri odaklı özellikleri gerçek uygulamalara entegre etme.",
  },
];

const evidence = [
  {
    label: "Production sistemleri",
    title: "ERP ve canlı veritabanı deneyimi",
    description:
      "Logo ERP kullanılan kurumsal ortamlarda yazılım desteği, SQL raporlama, sorgu optimizasyonu ve veritabanı bakım çalışmaları.",
    href: "/experience",
    linkLabel: "Deneyimi incele",
  },
  {
    label: "Uçtan uca ürün",
    title: "Fikirden çalışan uygulamaya",
    description:
      "VehicleGuard ve YDSXP projelerinde ürün tasarımı, backend, veritabanı, kullanıcı arayüzü ve yayınlama süreçleri.",
    href: "/projects",
    linkLabel: "Projeleri incele",
  },
  {
    label: "Akademik gelişim",
    title: "Mühendislik temelini derinleştirme",
    description:
      "Bilgisayar Mühendisliği lisans eğitiminin ardından tezli yüksek lisans çalışmalarıyla teknik uzmanlığın geliştirilmesi.",
    href: "#egitim",
    linkLabel: "Eğitimi görüntüle",
  },
];

const technologyGroups = [
  {
    title: "Backend",
    technologies: ["Node.js", "FastAPI", "REST API", "Prisma"],
  },
  {
    title: "Frontend & Product",
    technologies: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
  },
  {
    title: "Data",
    technologies: ["SQL Server", "PostgreSQL", "MongoDB", "T-SQL"],
  },
  {
    title: "AI & Engineering",
    technologies: ["Python", "XGBoost", "OpenCV", "Git"],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
      <section className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-start">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Mehmet Anıl · Bilgisayar Mühendisi
            </p>
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.12] tracking-[-0.035em] md:text-6xl">
            Problemleri çalışan yazılım sistemlerine dönüştüren bir Bilgisayar
            Mühendisiyim.
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Backend sistemleri, veritabanı performansı, kurumsal yazılımlar ve
            veri odaklı ürünler geliştiriyorum. Bir ihtiyacı anlamaktan sistemi
            tasarlamaya, uygulamayı geliştirip yayına almaya kadar ürünün
            tamamıyla ilgileniyorum.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              Mühendislik projeleri <ArrowRight size={15} />
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/35 hover:text-primary"
            >
              Deneyimi incele
            </Link>
          </div>
        </div>

        <aside
          id="egitim"
          className="scroll-mt-28 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.075] via-card to-card shadow-[0_24px_70px_-48px_hsl(var(--primary)/0.65)]"
        >
          <div className="border-b border-border/50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap size={20} />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    Engineer profile
                  </p>
                  <p className="mt-1 text-sm font-medium">Bilgisayar Mühendisliği</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin size={12} /> İzmir
              </span>
            </div>
          </div>

          <div className="space-y-3 p-5">
            {education.map((item) => (
              <div
                key={item.level}
                className="rounded-xl border border-border/50 bg-background/50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {item.level}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] uppercase tracking-wider text-primary">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium leading-5">{item.degree}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.school}</p>
                <p className="mt-3 font-mono text-[10px] text-muted-foreground/75">
                  {item.period}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border/50 px-5 py-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Lisans + devam eden tezli yüksek lisans
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-24 border-t border-border/50 pt-14 md:mt-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Mühendislik yaklaşımım
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Koddan önce sistemi düşünürüm.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Yazılım geliştirmeyi yalnızca özellik üretmek olarak değil; problemi
            analiz etme, doğru modeli kurma ve sonuçları ölçerek sistemi
            geliştirme süreci olarak ele alıyorum.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {engineeringProcess.map((step, index) => (
            <div
              key={step.title}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_22px_55px_-38px_hsl(var(--primary)/0.55)]"
            >
              <span className="absolute right-4 top-3 font-mono text-3xl font-semibold text-primary/[0.075] transition-colors group-hover:text-primary/[0.13]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <step.icon size={18} />
              </span>
              <h3 className="mt-5 text-sm font-medium">{step.title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 border-t border-border/50 pt-14">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Mühendislik geçmişim
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Teoriden production sistemlerine
            </h2>

            <div className="mt-7 space-y-5 text-sm leading-7 text-muted-foreground">
              <p>
                Bilgisayar mühendisliği eğitimim boyunca yazılımı yalnızca kod
                üretmek olarak değil; problemi analiz etme, doğru veri yapısını
                kurma ve sürdürülebilir sistemler tasarlama süreci olarak ele
                aldım.
              </p>
              <p>
                Kurumsal ERP sistemleri ve canlı SQL Server ortamlarında
                edindiğim deneyim; performans, güvenilirlik, raporlama ve
                operasyonel süreklilik ihtiyaçlarını gerçek sistemler üzerinde
                görmemi sağladı.
              </p>
              <p>
                Bu birikimi bugün backend, full-stack ve veri odaklı ürünler
                geliştirirken kullanıyor; iş ihtiyacını teknik gereksinimlere
                dönüştürmekten yayına alma sürecine kadar ürünün tamamıyla
                ilgileniyorum.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {evidence.map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/35 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      {item.label}
                    </p>
                    <h3 className="mt-2 text-base font-medium">{item.title}</h3>
                    <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover:text-primary"
                  >
                    {item.linkLabel} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-24 border-t border-border/50 pt-14">
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Mühendislik disiplinleri
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Teknolojiler araçtır; odağım çalışan sistemdir.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {disciplines.map((discipline) => (
            <div
              key={discipline.title}
              className="rounded-xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/35 md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-primary">
                    {discipline.code}
                  </p>
                  <h3 className="mt-3 text-base font-medium">{discipline.title}</h3>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <discipline.icon size={18} />
                </span>
              </div>
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                {discipline.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 border-t border-border/50 pt-14">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Teknik araçlar
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Çalıştığım teknoloji ekosistemi
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              İhtiyaca göre doğru aracı seçiyor; backend, veri, ürün ve yapay
              zekâ katmanlarını birlikte ele alıyorum.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {technologyGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-xl border border-border/60 bg-card p-5"
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                  {group.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-md border border-border/50 bg-secondary/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 overflow-hidden rounded-2xl border border-border/60 bg-card p-7 md:p-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Birlikte çalışalım
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Mühendislik deneyimimi yeni bir ürüne veya ekibe taşıyalım.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Backend, full-stack, SaaS ve veri odaklı ürün ekiplerinde katkı
              sağlayabileceğim fırsatlara açığım.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              <Mail size={15} /> İletişime geç
            </Link>
            <a
              href="/resume/tr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/35 hover:text-primary"
            >
              <FileText size={15} /> CV’yi görüntüle
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
