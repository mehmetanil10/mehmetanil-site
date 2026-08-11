import type { Metadata } from "next";
//import { GeistSans } from "geist/font/sans";
//import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const themeInitializer = `
  (function () {
    var mode = "auto";

    try {
      var saved = window.localStorage.getItem("mehmetanil-home-theme");
      if (saved === "auto" || saved === "light" || saved === "dark") {
        mode = saved;
      }
    } catch (_) {}

    var hour = new Date().getHours();
    var theme = mode === "auto"
      ? hour >= 7 && hour < 19 ? "light" : "dark"
      : mode;
    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.dataset.themeMode = mode;
    root.style.colorScheme = theme;
  })();
`;

export const metadata: Metadata = {
  title: {
    default: "Mehmet Anıl – Backend, SQL & Full-Stack Engineer",
    template: "%s | Mehmet Anıl",
  },
  description:
    "Backend geliştirme, SQL Server optimizasyonu, ERP sistem desteği ve veri odaklı yazılım çözümleri üzerine çalışan bilgisayar mühendisi.",
  keywords: ["SQL", "Backend", "ERP", "Next.js", "TypeScript", "Full-Stack"],
  authors: [{ name: "Mehmet Anıl" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://mehmetanil-site.vercel.app",
    siteName: "Mehmet Anıl",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body
        className={`${poppins.className} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
