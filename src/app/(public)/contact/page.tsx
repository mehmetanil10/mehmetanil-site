"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Linkedin, MapPin } from "lucide-react";
import Link from "next/link";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { submitContact } from "@/actions/contact-actions";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setError("");
    const result = await submitContact(data);
    if (result.success) {
      setSubmitted(true);
      reset();
    } else {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Form alanlarını kontrol edip tekrar deneyin.",
      );
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
          {/* Info */}
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
                  className="hover:text-foreground transition-colors"
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
                  className="hover:text-foreground transition-colors"
                >
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
                <p className="text-sm font-medium text-primary">Mesajın iletildi!</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  En kısa sürede döneceğim.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                    <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
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
                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
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
                    className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                  )}
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
