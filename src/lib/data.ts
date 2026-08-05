import type { Project, Experience } from "@/types";

export const projects: Project[] = [
  {
    title: "VehicleGuard — Öngörülü Filo Bakım Platformu",
    slug: "vehicleguard",
    year: 2026,
    description:
      "Araç filoları için makine öğrenmesi destekli öngörülü bakım ve gerçek zamanlı sağlık izleme platformu.",
    longDescription:
      "FastAPI, Next.js, PostgreSQL ve XGBoost kullanarak araç filoları için uçtan uca bir öngörülü bakım paneli geliştirdim. Düşük, Orta ve Yüksek seviyeli risk sınıflandırması ile Kalan Faydalı Ömür (RUL) tahmini yapan makine öğrenmesi işlem hatları oluşturdum. OBD-II telemetri simülasyonu, otomatik alarm üretimi, JWT tabanlı kimlik doğrulama ve 5 saniyelik sorgulama aralığıyla gerçek zamanlı araç sağlık skoru görselleştirmesi entegre ettim. Uygulama Vercel ve Render üzerinde yayına alındı.",
    stack: [
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "XGBoost",
      "JWT",
      "Vercel",
      "Render",
    ],
    featured: true,
    type: "ai",
    liveUrl: "https://vehicleguard-three.vercel.app/",
    githubUrl: "https://github.com/mehmetanil10/vehicleguard",
    gallery: [
      {
        src: "/images/projects/vehicleguard/landing.png",
        alt: "VehicleGuard Türkçe açılış sayfası",
      },
      {
        src: "/images/projects/vehicleguard/landing-en.png",
        alt: "VehicleGuard İngilizce açılış sayfası",
      },
      {
        src: "/images/projects/vehicleguard/dashboard.png",
        alt: "VehicleGuard filo sağlık paneli",
      },
      {
        src: "/images/projects/vehicleguard/vehicle-detail.png",
        alt: "VehicleGuard araç detay ve tahmin ekranı",
      },
    ],
  },
  {
    title: "YDSXP – YDS/YÖKDİL Study Tracker",
    slug: "ydsxp",
    year: 2026,
    description:
      "YDS/YÖKDİL sınavı için gamified, full-stack çalışma takip uygulaması.",
    longDescription:
      "XP ilerleme sistemi, günlük hedef takibi ve SM-2 spaced repetition flashcard özelliklerini içeren tam yığın proje. Next.js 14, TypeScript, Prisma ve PostgreSQL ile geliştirildi. Vercel + Supabase üzerinde deploy edildi.",
    stack: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "Supabase", "Vercel"],
    featured: true,
    type: "full-stack",
    liveUrl: "https://yds-tracker.vercel.app/landing",
    githubUrl: "https://github.com/mehmetanil10/yds-tracker",
    gallery: [
      {
        src: "/images/projects/ydsxp/overview.jpg",
        alt: "YDSXP özelliklerini gösteren ürün tanıtım görseli",
      },
      {
        src: "/images/projects/ydsxp/landing.jpg",
        alt: "YDSXP açılış sayfası",
      },
      {
        src: "/images/projects/ydsxp/dashboard.jpg",
        alt: "YDSXP çalışma ve ilerleme paneli",
      },
    ],
  },
  {
    title: "SQL Reporting & Database Optimization",
    slug: "sql-optimization",
    year: 2025,
    description:
      "Kurumsal ERP sistemlerinde SQL tabanlı raporlama ve veritabanı performans optimizasyonu.",
    longDescription:
      "Execution plan analizi ve index optimizasyonu ile sorgu performansı iyileştirildi. Canlı production sistemlerinde minimal downtime ile veritabanı bakım ve optimizasyon süreçleri yürütüldü.",
    stack: ["SQL Server", "T-SQL", "Execution Plans", "Index Tuning"],
    featured: true,
    type: "sql",
  },
  {
    title: "Bostorek – Kitap Değerlendirme Platformu",
    slug: "bostorek",
    year: 2024,
    description: "Kullanıcıların kitap incelemesi yapabileceği topluluk bazlı platform.",
    stack: ["JavaScript", "Node.js", "MongoDB", "Express"],
    featured: true,
    type: "full-stack",
    githubUrl: "https://github.com/mehmetanil10/mevnProject/tree/main",
  },
  {
    title: "Social Media Web Scraping",
    slug: "social-scraping",
    year: 2024,
    description: "Sosyal medya verilerini periyodik olarak toplayan ve depolayan scraping aracı.",
    stack: ["JavaScript", "Node.js", "PostgreSQL"],
    featured: false,
    type: "scraping",
    githubUrl: "",
  },
  {
    title: "VoiceNav Assist",
    slug: "voicenav-assist",
    year: 2024,
    description: "Python ve NLP ile geliştirilmiş sesli navigasyon asistanı. (Mezuniyet Projesi 2)",
    stack: ["Python", "NLP", "Speech Recognition", "AI"],
    featured: true,
    type: "ai",
    githubUrl: "",
  },
  {
    title: "Driver Field Detection",
    slug: "driver-detection",
    year: 2024,
    description:
      "OpenCV ve YOLOv4 ile gerçek zamanlı sürücü dikkat dağınıklığı tespit sistemi. (Mezuniyet Projesi 1)",
    stack: ["Python", "OpenCV", "YOLOv4", "Computer Vision"],
    featured: false,
    type: "ai",
    githubUrl: "",
  },
];

export const experiences: Experience[] = [
  {
    company: "Uzser Teknoloji",
    role: "Software Support Specialist",
    period: "Kasım 2024 – Şubat 2026",
    type: "full-time",
    highlights: [
      "Logo Software iş ortağı olarak kurumsal müşterilere ERP sistem desteği sağlandı",
      "SQL Server üzerinde karmaşık sorgular, view'lar ve raporlar geliştirildi",
      "Karar destek ve operasyonel izleme amaçlı veri odaklı özel raporlar oluşturuldu",
      "Müşteri veritabanlarında index analizi, yeniden yapılandırma ve tuning gerçekleştirildi",
      "Execution plan analizi ile yavaş sorgular tespit edilerek optimize edildi",
      "Yüksek trafikli production ortamlarında sorgu optimizasyonu uygulandı",
      "Canlı sistemlerde minimal downtime ile veritabanı bakım ve performans iyileştirmeleri yapıldı",
    ],
    stack: ["SQL Server", "T-SQL", "ERP (Logo)", "Index Tuning", "Execution Plans"],
  },
  {
    company: "SYPR Yazılım Yapay Zeka",
    role: "Intern Software Engineer",
    period: "Şubat 2024 – Haziran 2024",
    type: "intern",
    highlights: [
      "Node.js, JavaScript, AppSmith ve Vue.js ile AI destekli reklam optimizasyon uygulaması geliştirildi",
      "Müşteriler için reklam verimliliğini artıran AI çözümleri geliştirildi",
      "Reklam stratejilerini optimize eden karmaşık algoritmalar entegre edildi",
    ],
    stack: ["Node.js", "JavaScript", "Vue.js", "AppSmith"],
  },
  {
    company: "Teleset Group",
    role: "IT Intern",
    period: "Eylül 2023 – Ocak 2024",
    type: "intern",
    highlights: [
      "Form, iş akışı ve iş süreçleri yönetim araçları tasarımında destek sağlandı",
      "Raporlama ve dijitalleşme çalışmalarına katkıda bulunuldu",
      "Süreç iyileştirmeleri ile sistem verimliliği artırıldı",
    ],
    stack: ["BPM", "Forms", "Workflow", "Reporting"],
  },
  {
    company: "PilenPak Ambalaj",
    role: "IT Intern",
    period: "Haziran 2023 – Ağustos 2023",
    type: "intern",
    highlights: [
      "Fabrika programları yönetildi ve teknik sorunlar çözüldü",
      "Java, JSP ve PL/SQL ile operasyonel süreçler optimize edildi",
      "Program stabilitesi ve fabrika operasyonları iyileştirildi",
    ],
    stack: ["Java", "JSP", "PL/SQL"],
  },
];
