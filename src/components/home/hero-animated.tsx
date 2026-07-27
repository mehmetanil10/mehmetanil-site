"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const TITLES = [
  "Backend Engineer",
  "SQL Specialist",
  "Full-Stack Developer",
  "AI & Data Builder",
];

function useTypingEffect(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplayed(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) {
            setTimeout(() => setDeleting(true), pause);
          } else {
            setCharIndex((c) => c + 1);
          }
        } else {
          setDisplayed(current.slice(0, charIndex - 1));
          if (charIndex - 1 === 0) {
            setDeleting(false);
            setCharIndex(0);
            setWordIndex((w) => (w + 1) % words.length);
          } else {
            setCharIndex((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return displayed;
}

export function HeroAnimated() {
  const title = useTypingEffect(TITLES);
  const blobRef = useRef<HTMLDivElement>(null);

  // Subtle floating animation via JS (CSS keyframes would also work)
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.008;
      if (blobRef.current) {
        const x = Math.sin(t) * 18;
        const y = Math.cos(t * 0.7) * 14;
        blobRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Floating blob */}
      <div
        ref={blobRef}
        className="pointer-events-none absolute -top-20 -right-20 h-[420px] w-[420px] rounded-full opacity-[0.03] blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <div className="max-w-3xl">
        <p
          className="mb-4 font-mono text-sm text-primary opacity-0 animate-fade-in"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          Merhaba, ben
        </p>

        <h1
          className="text-4xl font-semibold tracking-tight md:text-6xl opacity-0 animate-fade-in"
          style={{ animationDelay: "250ms", animationFillMode: "forwards" }}
        >
          Mehmet Anıl
        </h1>

        {/* Typing title */}
        <div
          className="mt-4 h-8 md:h-9 flex items-center opacity-0 animate-fade-in"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          <p className="text-xl text-muted-foreground md:text-2xl font-mono">
            {title}
            <span className="ml-0.5 inline-block w-0.5 h-5 md:h-6 bg-primary align-middle animate-blink" />
          </p>
        </div>

        <p
          className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed opacity-0 animate-fade-in"
          style={{ animationDelay: "550ms", animationFillMode: "forwards" }}
        >
          Kurumsal ERP sistemleri, SQL Server optimizasyonu, raporlama, backend
          geliştirme ve veri odaklı yazılım çözümleri üzerine çalışıyorum. Şu an
          Dokuz Eylül Üniversitesi&apos;nde yüksek lisans yapıyorum.
        </p>

        <div
          className="mt-8 flex flex-wrap gap-3 opacity-0 animate-fade-in"
          style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.03] active:scale-[0.98]"
          >
            Projeler <ArrowRight size={16} />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:scale-[1.03] active:scale-[0.98]"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-secondary hover:scale-[1.03] active:scale-[0.98]"
          >
            İletişim
          </Link>
        </div>
        </div>

        <div
          className="relative order-first mx-auto flex items-center justify-center opacity-0 animate-fade-in lg:order-last"
          style={{ animationDelay: "350ms", animationFillMode: "forwards" }}
        >
          <div className="absolute h-64 w-64 rounded-full bg-primary/15 blur-3xl sm:h-72 sm:w-72 lg:h-80 lg:w-80" />
          <div className="relative h-60 w-60 rounded-full border border-primary/40 bg-card p-1.5 shadow-[0_0_60px_-16px_hsl(var(--primary)/0.55)] sm:h-72 sm:w-72 lg:h-[340px] lg:w-[340px]">
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-white">
              <Image
                src="/profile.jpg"
                alt="Mehmet Anıl profil fotoğrafı"
                fill
                priority
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 288px, 340px"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute -right-2 top-10 h-3 w-3 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary))]" />
          <div className="pointer-events-none absolute -bottom-1 left-8 h-2 w-2 rounded-full bg-primary/70 shadow-[0_0_14px_hsl(var(--primary))]" />
        </div>
      </div>
    </section>
  );
}
