import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-primary">
              mehmetanil<span className="text-muted-foreground">.dev</span>
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
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/mehmetanil2018/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="İletişim"
            >
              <Mail size={18} />
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mehmet Anıl.
        </div>
      </div>
    </footer>
  );
}
