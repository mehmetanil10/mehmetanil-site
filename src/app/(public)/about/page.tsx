import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımda",
  description:
    "Backend ve full-stack geliştirme, SQL Server optimizasyonu, kurumsal sistemler ve veri odaklı ürünler üzerine çalışan Mehmet Anıl hakkında.",
};

const techStack = [
  "Node.js", "TypeScript", "Next.js", "FastAPI",
  "SQL Server", "PostgreSQL", "MongoDB", "Prisma",
  "Python", "XGBoost", "OpenCV", "REST API",
];

const education = [
  {
    school: "Dokuz Eylül Üniversitesi",
    degree: "Bilgisayar Mühendisliği Yüksek Lisans (Tezli)",
    period: "Eylül 2025 – Devam ediyor",
  },
  {
    school: "Manisa Celal Bayar Üniversitesi",
    degree: "Bilgisayar Mühendisliği Lisans",
    period: "Eylül 2020 – Temmuz 2024",
    note: "GPA: 3.09/4",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        {/* Header */}
        <p className="mb-3 font-mono text-sm text-primary">/ hakkımda</p>
        <h1 className="text-3xl font-semibold tracking-tight">Mehmet Anıl</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Backend ve Full-Stack Yazılım Mühendisi
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          SQL ve Veri Sistemleri · İzmir, Türkiye
        </p>

        {/* Summary */}
        <div className="mt-10 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Backend ve full-stack geliştirme odaklı bir bilgisayar mühendisiyim.
            Kurumsal ERP sistemleri ve canlı üretim ortamlarında; SQL Server
            sorguları, view&apos;lar, raporlama çözümleri, execution plan analizi,
            sorgu optimizasyonu ve index tuning konularında uygulamalı deneyim
            kazandım.
          </p>
          <p>
            Yazılım geliştirme sürecinde yalnızca kod üretmeye değil; iş
            ihtiyacını anlamaya, doğru veri modelini oluşturmaya ve
            sürdürülebilir çözümler geliştirmeye odaklanıyorum. Node.js,
            TypeScript, Next.js, FastAPI, PostgreSQL ve SQL Server başta olmak
            üzere backend ve veri odaklı teknolojilerle çalışıyorum.
          </p>
          <p>
            Son dönemde XGBoost tabanlı kestirimci araç bakım platformu
            VehicleGuard ve oyunlaştırılmış dil çalışma uygulaması YDSXP gibi
            uçtan uca ürünler geliştirdim. Şu anda Dokuz Eylül Üniversitesi&apos;nde
            Bilgisayar Mühendisliği tezli yüksek lisans eğitimime devam ediyor;
            backend, full-stack, SaaS ve veri odaklı ürün ekiplerinde katkı
            sağlayabileceğim fırsatlara odaklanıyorum.
          </p>
        </div>

        {/* Current focus */}
        <div className="mt-10 rounded-lg border border-border/50 bg-card p-6">
          <h2 className="mb-4 text-sm font-medium">Şu anda odaklandığım alanlar</h2>
          <ul className="space-y-2">
            {[
              "Backend ve full-stack ürün geliştirme",
              "FastAPI, Next.js ve PostgreSQL tabanlı uygulamalar",
              "SQL sorgu ve veritabanı performans optimizasyonu",
              "Makine öğrenmesi ve veri odaklı sistemler",
              "Bilgisayar Mühendisliği tezli yüksek lisans eğitimi",
              "Ürün odaklı yazılım ekiplerinde yeni fırsatlar",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary">›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech stack */}
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-medium">Teknolojiler</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-sm bg-secondary px-2.5 py-1 text-xs font-mono text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-medium">Eğitim</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.school}
                className="rounded-lg border border-border/50 bg-card p-5"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <div>
                    <p className="text-sm font-medium">{edu.school}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {edu.degree}
                    </p>
                    {edu.note && (
                      <p className="text-xs text-muted-foreground">{edu.note}</p>
                    )}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground shrink-0">
                    {edu.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex gap-3">
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Deneyimime bak <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            İletişim
          </Link>
        </div>
      </div>
    </div>
  );
}
