"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const cvLinks = [
  {
    href: "/cv/Mehmet_Anil_CV_TR.pdf",
    label: "Türkçe CV",
    language: "TR",
  },
  {
    href: "/cv/Mehmet_Anil_CV_EN.pdf",
    label: "English CV",
    language: "EN",
  },
];

export function CvMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <FileText size={14} className="text-primary" />
        CV
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-lg border border-border/70 bg-background/95 p-1.5 shadow-xl backdrop-blur-md"
        >
          {cvLinks.map((link) => (
            <a
              key={link.language}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
              <span className="font-mono text-[10px] text-primary">{link.language}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export { cvLinks };
