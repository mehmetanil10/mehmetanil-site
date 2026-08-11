"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { submitContact } from "@/actions/contact-actions";
import {
  TurnstileWidget,
  type TurnstileStatus,
  type TurnstileWidgetHandle,
} from "@/components/contact/turnstile-widget";

const TURNSTILE_ERROR =
  "İnsan doğrulaması başarısız oldu. Lütfen tekrar deneyin.";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileStatus, setTurnstileStatus] =
    useState<TurnstileStatus>("loading");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const handleTurnstileVerify = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token) setError("");
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const retryTurnstile = useCallback(() => {
    setError("");
    setTurnstileToken(null);
    setTurnstileStatus("loading");
    turnstileRef.current?.retry();
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    setError("");

    if (!turnstileToken) {
      setError(TURNSTILE_ERROR);
      return;
    }

    try {
      const result = await submitContact(data, turnstileToken);

      if (result.success) {
        reset();
        setSubmitted(true);
      } else {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Form alanlarını kontrol edip tekrar deneyin.",
        );
      }
    } catch {
      setError("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="mb-3 font-mono text-sm text-primary">/ iletişim</p>
        <h1 className="text-3xl font-semibold tracking-tight">İletişim</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Proje, işbirliği veya herhangi bir konu için mesaj gönderebilirsin.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                İzmir, Türkiye
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Github size={16} className="text-primary" />
                <Link
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  GitHub
                </Link>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Linkedin size={16} className="text-primary" />
                <Link
                  href="https://linkedin.com/in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
                <p className="text-sm font-medium text-primary">Mesajın iletildi!</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  En kısa sürede döneceğim.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Yeni mesaj gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px overflow-hidden"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    {...register("website")}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <input
                    {...register("name")}
                    placeholder="İsim"
                    className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="E-posta"
                    className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("subject")}
                    placeholder="Konu (opsiyonel)"
                    className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <textarea
                    {...register("message")}
                    placeholder="Mesaj"
                    rows={5}
                    className="w-full resize-none rounded-md border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.message.message}</p>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-card/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <ShieldCheck size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">İnsan Doğrulaması</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Mesajınızı gönderebilmek için aşağıdaki doğrulamayı
                        tamamlamanız gerekiyor.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <TurnstileWidget
                      ref={turnstileRef}
                      siteKey={turnstileSiteKey}
                      onVerify={handleTurnstileVerify}
                      onError={handleTurnstileError}
                      onStatusChange={setTurnstileStatus}
                    />
                  </div>

                  <div className="mt-2 min-h-5" aria-live="polite">
                    {turnstileStatus === "loading" ? (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader2 size={13} className="animate-spin text-primary" />
                        İnsan doğrulaması yükleniyor...
                      </p>
                    ) : null}
                    {turnstileStatus === "ready" ? (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck size={13} className="text-primary" />
                        Göndermeden önce doğrulamayı tamamlayın.
                      </p>
                    ) : null}
                    {turnstileStatus === "verified" ? (
                      <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={13} />
                        Doğrulama başarılı.
                      </p>
                    ) : null}
                    {turnstileStatus === "error" ? (
                      <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3">
                        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-red-600 dark:text-red-400">
                          <AlertCircle size={13} className="mt-0.5 shrink-0" />
                          İnsan doğrulaması yüklenemedi. İnternet bağlantınızı
                          kontrol edip tekrar deneyin.
                        </p>
                        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                          Sorun devam ederse reklam engelleyicinizi geçici olarak
                          kapatmanız gerekebilir.
                        </p>
                        <button
                          type="button"
                          onClick={retryTurnstile}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <RefreshCw size={12} /> Doğrulamayı Tekrar Yükle
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken}
                  className="w-full rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Gönderiliyor..."
                    : turnstileStatus === "loading"
                      ? "Doğrulama yükleniyor..."
                      : turnstileStatus === "error"
                        ? "Doğrulamayı tekrar yükleyin"
                        : !turnstileToken
                          ? "Önce doğrulamayı tamamlayın"
                          : "Mesajı Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
