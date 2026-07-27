import type { Metadata } from "next";
//import { GeistSans } from "geist/font/sans";
//import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
    url: "https://mehmetanil.dev",
    siteName: "Mehmet Anıl",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${poppins.className} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
