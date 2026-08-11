"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

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
  const heroRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Pointer-following ambient light. It is intentionally disabled for touch
  // devices and visitors who prefer reduced motion.
  useEffect(() => {
    const hero = heroRef.current;
    const spotlight = spotlightRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!hero || !spotlight || !finePointer.matches || reducedMotion.matches) {
      return;
    }

    const current = { x: hero.clientWidth * 0.58, y: hero.clientHeight * 0.42 };
    const target = { ...current };
    let currentOpacity = 0;
    let targetOpacity = 0;
    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      targetOpacity = 1;
    };

    const handlePointerEnter = () => {
      targetOpacity = 1;
    };

    const handlePointerLeave = () => {
      targetOpacity = 0;
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.09;
      current.y += (target.y - current.y) * 0.09;
      currentOpacity += (targetOpacity - currentOpacity) * 0.08;

      spotlight.style.transform = `translate3d(${current.x - 230}px, ${current.y - 230}px, 0)`;
      spotlight.style.opacity = currentOpacity.toFixed(3);
      frame = requestAnimationFrame(animate);
    };

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerenter", handlePointerEnter);
    hero.addEventListener("pointerleave", handlePointerLeave);
    frame = requestAnimationFrame(animate);

    return () => {
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerenter", handlePointerEnter);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

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
    <section
      ref={heroRef}
      className="relative overflow-x-clip py-20 md:py-24 lg:flex lg:min-h-[calc(100svh-4rem)] lg:items-center lg:py-14"
    >
      {/* Smooth pointer-following ambient spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 h-[460px] w-[460px] rounded-full opacity-0 blur-2xl motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.16) 0%, hsl(var(--primary) / 0.07) 35%, transparent 72%)",
          willChange: "transform, opacity",
        }}
      />

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
          <div className="relative h-60 w-60 sm:h-72 sm:w-72 lg:h-[340px] lg:w-[340px]">
            <div aria-hidden="true" className="profile-halo-glow" />
            <div aria-hidden="true" className="profile-halo-ring" />

            <div aria-hidden="true" className="profile-orbit profile-orbit-primary">
              <span className="profile-orbit-dot profile-orbit-dot-primary" />
            </div>
            <div aria-hidden="true" className="profile-orbit profile-orbit-secondary">
              <span className="profile-orbit-dot profile-orbit-dot-secondary" />
            </div>

            <div className="profile-frame relative z-10 h-full w-full rounded-full border border-primary/40 bg-card p-1.5">
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
          </div>
        </div>
      </div>

      <a
        href="#engineering-expertise"
        className="group absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary lg:flex"
      >
        Aşağı kaydır
        <ArrowDown
          size={12}
          className="transition-transform duration-300 group-hover:translate-y-1"
        />
      </a>
    </section>
  );
}
