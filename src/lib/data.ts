import type { Experience, Project, ProjectCaseStudy } from "@/types";

export const projects: Project[] = [
  {
    title: "PulsePilot AI — Product Feedback & Engineering Copilot",
    slug: "pulsepilot-ai",
    year: 2026,
    description:
      "Müşteri geri bildirimlerini yapılandırılmış içgörülere, açıklanabilir önceliklere ve insan onaylı mühendislik aksiyonlarına dönüştüren AI destekli product feedback copilot.",
    longDescription:
      "PulsePilot AI, API üzerinden alınan müşteri geri bildirimlerini yapılandırılmış ürün içgörülerine ve takip edilebilir mühendislik aksiyonlarına dönüştüren yapay zekâ destekli bir ürün yönetimi copilotudur. Sistem; geri bildirimlerin duygu, kategori, aciliyet ve tema analizini gerçekleştirir, pgvector tabanlı benzerlik aramasıyla ilişkili müşteri sinyallerini gruplandırır ve açıklanabilir öncelik skorları oluşturur. Kritik AI aksiyonları doğrudan çalıştırılmaz; öneriler human-in-the-loop inceleme ekranına gönderilir ve yalnızca yetkili kullanıcı onayından sonra mühendislik backlog’una aktarılır. Workspace tabanlı veri izolasyonu, JWT kimlik doğrulama, güvenli API gateway, PII redaction, OpenTelemetry gözlemlenebilirliği, Docker altyapısı ve GitHub Actions kalite kontrolleriyle production seviyesine yakın bir mimari hedeflenmiştir.",
    stack: [
      ".NET 10",
      "Next.js 16",
      "PostgreSQL",
      "pgvector",
      "OpenAI API",
      "Docker",
      "OpenTelemetry",
      "GitHub Actions",
    ],
    featured: true,
    type: "ai",
    githubUrl: "https://github.com/mehmetanil10/pulsepilot-ai",
    gallery: [
      {
        src: "/images/projects/pulsepilot/landing.png",
        alt: "PulsePilot AI ürün tanıtım ve açılış sayfası",
      },
      {
        src: "/images/projects/pulsepilot/dashboard.png",
        alt: "PulsePilot AI ürün sinyalleri ve işleme durumu dashboard'u",
      },
      {
        src: "/images/projects/pulsepilot/feedback.png",
        alt: "PulsePilot AI müşteri geri bildirimi analiz ekranı",
      },
      {
        src: "/images/projects/pulsepilot/actions.png",
        alt: "PulsePilot AI human-in-the-loop aksiyon inceleme ekranı",
      },
      {
        src: "/images/projects/pulsepilot/backlog.png",
        alt: "PulsePilot AI mühendislik backlog ekranı",
      },
      {
        src: "/images/projects/pulsepilot/copilot.png",
        alt: "PulsePilot AI workspace copilot ekranı",
      },
    ],
  },
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

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "pulsepilot-ai",
    eyebrow: "AI PRODUCT INTELLIGENCE · HUMAN CONTROL",
    overview:
      "Dağınık müşteri sinyallerini analiz eden, ilişkili geri bildirimleri bir araya getiren ve kanıta bağlı mühendislik aksiyonları üreten production odaklı bir AI copilot.",
    signals: [
      { label: "Girdi", value: "API tabanlı feedback" },
      { label: "Karar modeli", value: "Açıklanabilir öncelik" },
      { label: "Kontrol", value: "Human-in-the-loop" },
    ],
    challenge: [
      {
        title: "Dağınık ürün sinyalleri",
        description:
          "Destek, anket ve ürün kanallarından gelen geri bildirimler farklı biçimlerde kaldığı için ortak temaları görmek ve gerçek problemi ayırmak zorlaşıyor.",
      },
      {
        title: "Sezgisel önceliklendirme",
        description:
          "Sadece sesin yüksekliğine göre verilen kararlar; etki, aciliyet, tekrar ve müşteri kanıtı arasındaki ilişkiyi görünmez bırakıyor.",
      },
      {
        title: "Kontrolsüz AI riski",
        description:
          "Bir modelin doğrudan backlog veya operasyonel sistemlerde işlem yapması; açıklanabilirlik, yetki ve denetlenebilirlik riskleri oluşturuyor.",
      },
    ],
    architecture: [
      {
        step: "01",
        title: "Güvenli veri alımı",
        description:
          "API gateway, JWT kimlik doğrulama, workspace izolasyonu ve PII redaction ile müşteri sinyalleri güvenli bir bağlamda sisteme alınır.",
      },
      {
        step: "02",
        title: "AI analiz katmanı",
        description:
          "Geri bildirimler duygu, kategori, aciliyet ve tema açısından analiz edilir; sonuçlar kaynak metinle birlikte saklanır.",
      },
      {
        step: "03",
        title: "Benzerlik ve öncelik",
        description:
          "pgvector tabanlı arama ilişkili sinyalleri gruplandırır; hacim, şiddet ve bağlam açıklanabilir bir öncelik skoruna dönüşür.",
      },
      {
        step: "04",
        title: "İzlenebilir mühendislik çıktısı",
        description:
          "Onaylanan öneriler, kaynak feedback ve karar bağını koruyarak mühendislik backlog'una aktarılır ve yaşam döngüsü boyunca izlenir.",
      },
    ],
    flowTitle: "AI önerir, insan karar verir.",
    flowDescription:
      "PulsePilot kritik aksiyonları otomatik çalıştırmaz. Model kanıtı hazırlar; yetkili kullanıcı öneriyi inceler ve sistem yalnızca açık onaydan sonra izinli aracı çalıştırır.",
    flow: [
      {
        step: "01",
        title: "Sinyali anla",
        description: "Model geri bildirimi analiz eder ve ilişkili müşteri kanıtını toplar.",
      },
      {
        step: "02",
        title: "Öneriyi açıkla",
        description: "Aksiyon, öncelik skoru ve gerekçesi birlikte inceleme ekranına gelir.",
      },
      {
        step: "03",
        title: "İnsan onayı",
        description: "Yetkili kullanıcı öneriyi onaylar veya reddeder; model tek başına karar vermez.",
      },
      {
        step: "04",
        title: "Sınırlı çalıştırma",
        description: "Sadece allowlist içindeki araçlar çalışır ve sonuç backlog kaydına bağlanır.",
      },
    ],
    engineering: [
      {
        title: "Tenant sınırları",
        description:
          "Workspace kimliği veri erişiminin her katmanına taşınarak müşteri verilerinin birbirinden ayrılması hedeflendi.",
      },
      {
        title: "Gözlemlenebilir AI",
        description:
          "OpenTelemetry ile istekler, model işleme adımları ve hata akışları uçtan uca izlenebilir hâle getirildi.",
      },
      {
        title: "Tekrarlanabilir altyapı",
        description:
          "Docker geliştirme ortamı ve GitHub Actions kalite kontrolleriyle kurulum ve doğrulama süreçleri standartlaştırıldı.",
      },
    ],
  },
  {
    slug: "vehicleguard",
    eyebrow: "PREDICTIVE MAINTENANCE · FLEET INTELLIGENCE",
    overview:
      "Araç telemetrisini sağlık skoru, risk seviyesi, kalan faydalı ömür tahmini ve takip edilebilir bakım uyarılarına dönüştüren uçtan uca filo platformu.",
    signals: [
      { label: "Girdi", value: "OBD-II telemetri" },
      { label: "Tahmin", value: "Risk + RUL" },
      { label: "Görünürlük", value: "5 sn canlı takip" },
    ],
    challenge: [
      {
        title: "Reaktif bakım maliyeti",
        description:
          "Arıza ortaya çıktıktan sonra harekete geçmek; plansız duruş, yüksek servis maliyeti ve operasyon kaybı oluşturuyor.",
      },
      {
        title: "Parçalı sensör verisi",
        description:
          "Motor, sıcaklık, basınç ve aşınma sinyalleri tek başına anlamlı bir bakım kararı üretmek için yeterli bağlamı sunmuyor.",
      },
      {
        title: "Operasyonel görünürlük",
        description:
          "Filo yöneticisinin araç sağlığını, aktif riskleri ve kritik uyarıları tek ekranda öncelik sırasıyla görebilmesi gerekiyor.",
      },
    ],
    architecture: [
      {
        step: "01",
        title: "Telemetri akışı",
        description:
          "OBD-II sensör verileri simüle edilir, doğrulanır ve araç kimliğiyle birlikte FastAPI katmanına aktarılır.",
      },
      {
        step: "02",
        title: "Tahmin işlem hattı",
        description:
          "XGBoost modelleri sağlık skoru, Düşük-Orta-Yüksek risk sınıfı ve kalan faydalı ömür tahmini üretir.",
      },
      {
        step: "03",
        title: "Durum ve uyarılar",
        description:
          "Tahmin sonuçları PostgreSQL üzerinde araç geçmişiyle saklanır; eşiklere göre otomatik uyarılar oluşturulur.",
      },
      {
        step: "04",
        title: "Canlı filo görünümü",
        description:
          "Next.js dashboard 5 saniyelik sorgulama döngüsüyle filo sağlığını ve yeni riskleri kullanıcıya taşır.",
      },
    ],
    flowTitle: "Sensörden bakım kararına.",
    flowDescription:
      "VehicleGuard ham telemetriyi tek başına göstermez; veriyi operasyon ekibinin yorumlayabileceği risk, ömür ve aksiyon bağlamına dönüştürür.",
    flow: [
      {
        step: "01",
        title: "Veriyi al",
        description: "Araç sensörlerinden gelen değerleri doğrula ve normalize et.",
      },
      {
        step: "02",
        title: "Sağlığı tahmin et",
        description: "Model ile sağlık skoru, risk sınıfı ve RUL sonucunu üret.",
      },
      {
        step: "03",
        title: "Riski görünür kıl",
        description: "Kritik sinyalleri uyarıya dönüştür ve ilgili araca bağla.",
      },
      {
        step: "04",
        title: "Aksiyonu izle",
        description: "Filo ekranından araç durumunu ve kapanmamış uyarıları takip et.",
      },
    ],
    engineering: [
      {
        title: "Servis ayrımı",
        description:
          "Next.js arayüz, FastAPI servisleri ve ML işlem hattı bağımsız sorumluluklarla ayrıştırıldı.",
      },
      {
        title: "Güvenli erişim",
        description:
          "JWT tabanlı kimlik doğrulama ile dashboard ve araç operasyonları korumalı bir oturum üzerinden yürütüldü.",
      },
      {
        title: "Dağıtık yayın",
        description:
          "Frontend Vercel, API Render üzerinde çalışacak şekilde production ortamına taşındı.",
      },
    ],
  },
  {
    slug: "ydsxp",
    eyebrow: "LEARNING SYSTEM · GAMIFIED PROGRESS",
    overview:
      "YDS ve YÖKDİL hazırlığını ölçülebilir günlük ilerlemeye dönüştüren; XP, hedef ve spaced repetition mekaniklerini birleştiren full-stack çalışma ürünü.",
    signals: [
      { label: "Motivasyon", value: "XP + seviye" },
      { label: "Öğrenme", value: "SM-2 tekrar" },
      { label: "Takip", value: "Günlük hedefler" },
    ],
    challenge: [
      {
        title: "Görünmeyen ilerleme",
        description:
          "Uzun sınav hazırlığında küçük günlük çalışmaların birikimi görünmediğinde motivasyonu korumak zorlaşıyor.",
      },
      {
        title: "Plansız tekrar",
        description:
          "Kelimeleri rastgele tekrar etmek, öğrenilmiş ve unutulmaya yakın içerikler arasında doğru önceliği kuramıyor.",
      },
      {
        title: "Dağınık çalışma kaydı",
        description:
          "Kelime, paragraf, test ve deneme çalışmalarını tek ilerleme modelinde birleştirmek gerekiyor.",
      },
    ],
    architecture: [
      {
        step: "01",
        title: "Çalışma kaydı",
        description:
          "Farklı çalışma türleri ortak bir XP modeline çevrilerek günlük aktivite olarak kaydedilir.",
      },
      {
        step: "02",
        title: "İlerleme motoru",
        description:
          "Kazanılan XP; seviye, günlük hedef ve çalışma serisi göstergelerini günceller.",
      },
      {
        step: "03",
        title: "Akıllı tekrar",
        description:
          "SM-2 algoritması flashcard tekrar zamanını kullanıcının performansına göre planlar.",
      },
      {
        step: "04",
        title: "Kalıcı veri",
        description:
          "Prisma ve PostgreSQL/Supabase katmanı kullanıcı ilerlemesini ve öğrenme geçmişini saklar.",
      },
    ],
    flowTitle: "Çalışmayı görünür ilerlemeye dönüştür.",
    flowDescription:
      "YDSXP yalnızca süre tutmaz; her çalışmayı anlamlı bir ödüle bağlar ve tekrar edilmesi gereken içeriği doğru zamanda yeniden karşıya çıkarır.",
    flow: [
      {
        step: "01",
        title: "Çalışmayı kaydet",
        description: "Kelime, paragraf, test veya deneme aktivitesini seç.",
      },
      {
        step: "02",
        title: "XP kazan",
        description: "Aktivitenin değerine göre XP ve günlük hedef ilerlemesi kazan.",
      },
      {
        step: "03",
        title: "Tekrarı planla",
        description: "Flashcard performansına göre bir sonraki çalışma zamanını belirle.",
      },
      {
        step: "04",
        title: "Gelişimi izle",
        description: "Seviye, seri ve haftalık istatistiklerle uzun dönem ilerlemeyi gör.",
      },
    ],
    engineering: [
      {
        title: "Tip güvenli full-stack yapı",
        description:
          "Next.js ve TypeScript ile arayüzden veri erişimine kadar tutarlı bir geliştirme deneyimi kuruldu.",
      },
      {
        title: "İlişkisel veri modeli",
        description:
          "Prisma ve PostgreSQL ile kullanıcı, aktivite, XP ve tekrar kayıtları izlenebilir ilişkiler hâlinde modellendi.",
      },
      {
        title: "Bulut dağıtımı",
        description:
          "Uygulama Vercel ve Supabase üzerinde erişilebilir, yönetilebilir bir ürün olarak yayınlandı.",
      },
    ],
  },
];

export const experiences: Experience[] = [
  {
    company: "Uzser Teknoloji",
    role: "Software Support Specialist",
    positioning: "Yazılım Destek · Raporlama · İş Analizi",
    summary:
      "Kurumsal müşterilerin Logo ERP sistemlerinde yazılım desteği sağladım; kullanıcı ve departman ihtiyaçlarını analiz ederek SQL Server tabanlı özel raporlar, sorgular ve veri çözümleri geliştirdim.",
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
    focusAreas: [
      {
        title: "Yazılım desteği",
        description:
          "Logo ERP kullanıcı sorunları, canlı sistem takibi ve operasyonel teknik destek süreçleri.",
      },
      {
        title: "Raporlama ve veri",
        description:
          "SQL sorguları, view'lar, özel raporlar ve karar destek çıktılarının geliştirilmesi.",
      },
      {
        title: "İş analizi",
        description:
          "Kullanıcı ihtiyaçlarının anlaşılması, iş süreçlerinin incelenmesi ve teknik çözüme dönüştürülmesi.",
      },
    ],
    stack: ["SQL Server", "T-SQL", "ERP (Logo)", "Index Tuning", "Execution Plans"],
  },
  {
    company: "SYPR Yazılım Yapay Zeka",
    role: "Intern Software Engineer",
    positioning: "Yapay Zekâ · Web Uygulaması",
    summary:
      "AI destekli reklam optimizasyon ürününün web uygulaması ve algoritma entegrasyonlarında görev aldım.",
    period: "Şubat 2024 – Haziran 2024",
    type: "intern",
    highlights: [
      "Node.js, JavaScript, AppSmith ve Vue.js ile AI destekli reklam optimizasyon uygulaması geliştirildi",
      "Müşteriler için reklam verimliliğini artıran AI çözümleri geliştirildi",
      "Reklam stratejilerini optimize eden karmaşık algoritmalar entegre edildi",
    ],
    focusAreas: [
      {
        title: "Ürün geliştirme",
        description:
          "Node.js, Vue.js ve AppSmith ile ürün özelliklerinin geliştirilmesine katkı.",
      },
      {
        title: "AI entegrasyonu",
        description:
          "Reklam verimliliğine odaklanan algoritmaların uygulama akışına entegre edilmesi.",
      },
    ],
    stack: ["Node.js", "JavaScript", "Vue.js", "AppSmith"],
  },
  {
    company: "Teleset Group",
    role: "IT Intern",
    positioning: "Süreç Tasarımı · Raporlama",
    summary:
      "İş akışlarının dijitalleştirilmesi, form tasarımı ve operasyonel raporlama çalışmalarına destek verdim.",
    period: "Eylül 2023 – Ocak 2024",
    type: "intern",
    highlights: [
      "Form, iş akışı ve iş süreçleri yönetim araçları tasarımında destek sağlandı",
      "Raporlama ve dijitalleşme çalışmalarına katkıda bulunuldu",
      "Süreç iyileştirmeleri ile sistem verimliliği artırıldı",
    ],
    focusAreas: [
      {
        title: "Süreç dijitalleştirme",
        description:
          "Form ve iş akışı yönetim araçlarının hazırlanmasına verilen destek.",
      },
      {
        title: "Operasyonel raporlama",
        description:
          "Dijitalleşme ve süreç iyileştirme çalışmalarını destekleyen raporlama faaliyetleri.",
      },
    ],
    stack: ["BPM", "Forms", "Workflow", "Reporting"],
  },
  {
    company: "PilenPak Ambalaj",
    role: "IT Intern",
    positioning: "IT Operasyonları · Uygulama Desteği",
    summary:
      "Fabrika uygulamalarının sürekliliğini destekledim ve operasyonel yazılım süreçlerinde geliştirme çalışmalarına katkı sağladım.",
    period: "Haziran 2023 – Ağustos 2023",
    type: "intern",
    highlights: [
      "Fabrika programları yönetildi ve teknik sorunlar çözüldü",
      "Java, JSP ve PL/SQL ile operasyonel süreçler optimize edildi",
      "Program stabilitesi ve fabrika operasyonları iyileştirildi",
    ],
    focusAreas: [
      {
        title: "Teknik operasyon",
        description:
          "Fabrika programlarının takibi ve kullanıcıların karşılaştığı teknik sorunların çözümü.",
      },
      {
        title: "Uygulama geliştirme",
        description:
          "Java, JSP ve PL/SQL ile operasyonel süreçleri destekleyen geliştirme çalışmaları.",
      },
    ],
    stack: ["Java", "JSP", "PL/SQL"],
  },
];
