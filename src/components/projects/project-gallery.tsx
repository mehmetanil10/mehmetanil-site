"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
};

type ProjectGalleryProps = {
  images: GalleryImage[];
  projectTitle: string;
  priority?: boolean;
};

export function ProjectGallery({ images, projectTitle, priority = false }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, showNext, showPrevious]);

  const activeImage = images[activeIndex];

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-border/70 bg-secondary/30 text-left shadow-sm"
          aria-label={`${projectTitle} görselini büyüt`}
        >
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            priority={priority && activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
          />
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-950/70 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Expand size={16} />
          </span>
          <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
            {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </button>

        <div
          className="mt-3 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
          aria-label={`${projectTitle} görsel galerisi`}
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}. görseli göster: ${image.alt}`}
              aria-pressed={activeIndex === index}
              className={`relative aspect-video overflow-hidden rounded-md border bg-secondary/30 transition-all duration-200 ${
                activeIndex === index
                  ? "border-primary ring-1 ring-primary/35"
                  : "border-border/60 opacity-60 hover:border-border hover:opacity-100"
              }`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(max-width: 768px) 25vw, 170px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} görsel galerisi`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md md:p-10"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8 md:top-8"
            aria-label="Galeriyi kapat"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 md:left-8"
                aria-label="Önceki görsel"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8"
                aria-label="Sonraki görsel"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="relative h-[78vh] w-[88vw] max-w-7xl">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              priority
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-white/65 md:bottom-7">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
