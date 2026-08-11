import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Database,
  FileText,
  Mail,
  Workflow,
} from "lucide-react";
import { experiences } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Deneyim",
  description:
    "Mehmet Anıl'ın ERP, SQL Server, raporlama, iş analizi ve yazılım geliştirme odaklı profesyonel deneyimi.",
};

const engineeringFocus = [
  {
    icon: BriefcaseBusiness,
    label: "Kurumsal sistemler",
    value: "ERP & Production",
  },
  {
    icon: Database,
    label: "Veri çözümleri",
    value: "SQL & Raporlama",
  },
  {
    icon: Workflow,
    label: "İhtiyaçtan çözüme",
    value: "İş Analizi",
  },
];

const careerPath = [
  "IT Operasyonları",
  "Süreç ve Raporlama",
  "AI Uygulamaları",
  "ERP ve Veri Sistemleri",
  "Full-Stack Ürün Geliştirme",
];

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
      <section className="max-w-5xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-primary" />
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            Kariyer & Mühendislik
          </p>
        </div>

        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.12] tracking-[-0.035em] md:text-6xl">
          Sistem desteğinden ürün geliştirmeye uzanan mühendislik yolculuğu.
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
          Kurumsal ERP sistemleri, canlı veritabanları, süreç otomasyonu ve
          yapay zekâ destekli uygulamalar üzerinde çalıştım. Operasyonel
          ihtiyaçları analiz ederek güvenilir, ölçülebilir ve sürdürülebilir
          yazılım çözümlerine dönüştürüyorum.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {engineeringFocus.map((item) => (
            <div
              key={item.value}
              className="group rounded-xl border border-border/60 bg-card/75 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_40px_-28px_hsl(var(--primary)/0.45)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <item.icon size={17} />
                </span>
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 border-t border-border/50 pt-14 md:mt-28">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Profesyonel Deneyim
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Problemler, sorumluluklar ve katkılar
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Her rol, operasyonel ihtiyaçları anlamaktan teknik çözüm üretmeye
            uzanan kariyer gelişimimin bir parçası.
          </p>
        </div>

        <div className="relative">
          <div className="absolute bottom-8 left-[7px] top-2 w-px bg-gradient-to-b from-primary via-primary/35 to-border md:left-[169px]" />

          <div className="space-y-10">
            {experiences.map((experience, index) => {
              const isPrimary = index === 0;

              return (
                <article key={experience.company} className="relative">
                  <div className="absolute left-0 top-7 z-10 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-primary/50 bg-background md:left-[162px]">
                    <span
                      className={cn(
                        "block rounded-full bg-primary",
                        isPrimary ? "h-[7px] w-[7px]" : "h-1.5 w-1.5",
                      )}
                    />
                  </div>

                  <div className="absolute left-0 top-6 hidden w-[145px] text-right md:block">
                    <p className="font-mono text-xs leading-5 text-muted-foreground">
                      {experience.period}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-primary">
                      {experience.type === "full-time" ? "Tam zamanlı" : "Staj"}
                    </p>
                  </div>

                  <div className="ml-10 md:ml-[205px]">
                    <div
                      className={cn(
                        "overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_22px_55px_-38px_hsl(var(--primary)/0.55)]",
                        isPrimary
                          ? "border-primary/25 bg-gradient-to-br from-primary/[0.055] via-card to-card"
                          : "border-border/60",
                      )}
                    >
                      <div className="p-5 sm:p-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                                {experience.company}
                              </h3>
                              {isPrimary ? (
                                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                                  Production deneyimi
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1.5 text-sm font-medium">
                              {experience.role}
                            </p>
                            {experience.positioning ? (
                              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                                {experience.positioning}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2 md:hidden">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {experience.period}
                            </span>
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] uppercase tracking-wider text-primary">
                              {experience.type === "full-time" ? "Tam zamanlı" : "Staj"}
                            </span>
                          </div>
                        </div>

                        {experience.summary ? (
                          <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
                            {experience.summary}
                          </p>
                        ) : null}

                        {experience.focusAreas?.length ? (
                          <div
                            className={cn(
                              "mt-7 grid gap-3",
                              experience.focusAreas.length >= 3
                                ? "lg:grid-cols-3"
                                : "sm:grid-cols-2",
                            )}
                          >
                            {experience.focusAreas.map((area, areaIndex) => (
                              <div
                                key={area.title}
                                className="rounded-lg border border-border/50 bg-background/45 p-4"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] text-primary">
                                    {String(areaIndex + 1).padStart(2, "0")}
                                  </span>
                                  <h4 className="text-xs font-medium">
                                    {area.title}
                                  </h4>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                  {area.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-7 border-t border-border/50 pt-5">
                          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            Teknik kapsam
                          </p>
                          <ul className="grid gap-2 md:grid-cols-2">
                            {experience.highlights
                              .slice(0, isPrimary ? 4 : 2)
                              .map((highlight) => (
                                <li
                                  key={highlight}
                                  className="flex gap-2 text-xs leading-5 text-muted-foreground"
                                >
                                  <span className="mt-[3px] text-primary">›</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                          </ul>
                        </div>

                        {experience.stack?.length ? (
                          <div className="mt-6 flex flex-wrap gap-1.5">
                            {experience.stack.map((technology) => (
                              <span
                                key={technology}
                                className="rounded-md border border-border/50 bg-secondary/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                              >
                                {technology}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-24 border-y border-border/50 py-12">
        <div className="flex items-center gap-3">
          <Code2 size={18} className="text-primary" />
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Kariyer gelişimi
          </h2>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2 md:gap-3">
          {careerPath.map((step, index) => (
            <div key={step} className="flex items-center gap-2 md:gap-3">
              <span
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs",
                  index === careerPath.length - 1
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/60 bg-card text-muted-foreground",
                )}
              >
                {step}
              </span>
              {index < careerPath.length - 1 ? (
                <ArrowRight size={13} className="text-muted-foreground/45" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 overflow-hidden rounded-2xl border border-border/60 bg-card p-7 md:p-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Sonraki adım
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Deneyimimi çalışan ürünlere nasıl dönüştürdüğümü inceleyin.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ürün geliştirme yaklaşımımı projelerimde görebilir veya uygun bir
              rol ve iş birliği için benimle iletişime geçebilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              Projeleri gör <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/35 hover:text-primary"
            >
              <Mail size={15} /> İletişime geç
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/50 pt-5">
          <span className="text-xs text-muted-foreground">CV’yi görüntüle:</span>
          <a
            href="/resume/tr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-foreground transition-colors hover:text-primary"
          >
            <FileText size={13} /> Türkçe CV
          </a>
          <a
            href="/resume/en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-foreground transition-colors hover:text-primary"
          >
            <FileText size={13} /> English CV
          </a>
        </div>
      </section>
    </div>
  );
}
