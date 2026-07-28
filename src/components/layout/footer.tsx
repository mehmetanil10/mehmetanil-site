import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { VisitorStats } from "@/components/analytics/visitor-stats";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="font-mono text-sm text-primary">
              mehmetanil
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Backend · SQL · Full-Stack · İzmir, Türkiye
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/mehmetanil10/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/mehmetanil2018/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="İletişim"
            >
              <Mail size={18} />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-3 border-t border-border/30 pt-6 text-center text-xs text-muted-foreground sm:grid-cols-2 sm:items-center sm:text-left">
          <span>© {new Date().getFullYear()} Mehmet Anıl.</span>
          <VisitorStats track />
        </div>
      </div>
    </footer>
  );
}
