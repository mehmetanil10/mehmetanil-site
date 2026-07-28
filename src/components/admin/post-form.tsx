"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { slugify } from "@/lib/utils";
import type { Category } from "@prisma/client";
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  Globe,
  FileText,
  Tag,
  Link as LinkIcon,
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  UploadCloud,
  Loader2,
} from "lucide-react";

type PostFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  seoDescription: string;
};

type Props = {
  defaultValues?: Partial<PostFormData>;
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
};

export function PostForm({
  defaultValues,
  categories,
  action,
  submitLabel = "Kaydet",
}: Props) {
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [slugEdited, setSlugEdited] = useState(!!defaultValues?.slug);
  const [coverImage, setCoverImage] = useState(defaultValues?.coverImage ?? "");
  const [seoTitle, setSeoTitle] = useState(defaultValues?.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(defaultValues?.seoDescription ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    defaultValues?.status ?? "DRAFT",
  );
  const [imgError, setImgError] = useState(false);
  const [showImageTool, setShowImageTool] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
  const [editorUploadError, setEditorUploadError] = useState("");
  const [coverUploadError, setCoverUploadError] = useState("");
  const [uploadingEditorImage, setUploadingEditorImage] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const applyMarkdown = (
    before: string,
    after = before,
    placeholder = "metin",
  ) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const nextContent = `${content.slice(0, start)}${before}${selected}${after}${content.slice(end)}`;
    const selectionStart = start + before.length;
    const selectionEnd = selectionStart + selected.length;

    setContent(nextContent);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const prefixLines = (prefix: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || "liste öğesi";
    const prefixed = selected
      .split("\n")
      .map((line, index) =>
        prefix === "1. " ? `${index + 1}. ${line}` : `${prefix}${line}`,
      )
      .join("\n");

    setContent(`${content.slice(0, start)}${prefixed}${content.slice(end)}`);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + prefixed.length);
    });
  };

  const insertImage = () => {
    const url = imageUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      setImageUrlError("Görsel adresi http:// veya https:// ile başlamalı.");
      return;
    }

    applyMarkdown("![", `](${url})`, "Görsel açıklaması");
    setImageUrl("");
    setImageUrlError("");
    setShowImageTool(false);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      throw new Error(result.error ?? "Görsel yüklenemedi.");
    }

    return result.url;
  };

  const uploadEditorImage = async (file?: File) => {
    if (!file) return;

    setEditorUploadError("");
    setUploadingEditorImage(true);
    try {
      const url = await uploadImage(file);
      applyMarkdown("![", `](${url})`, file.name.replace(/\.[^.]+$/, ""));
      setShowImageTool(false);
    } catch (error) {
      setEditorUploadError(
        error instanceof Error ? error.message : "Görsel yüklenemedi.",
      );
    } finally {
      setUploadingEditorImage(false);
    }
  };

  const uploadCoverImage = async (file?: File) => {
    if (!file) return;

    setCoverUploadError("");
    setUploadingCoverImage(true);
    try {
      setCoverImage(await uploadImage(file));
    } catch (error) {
      setCoverUploadError(
        error instanceof Error ? error.message : "Kapak görseli yüklenemedi.",
      );
    } finally {
      setUploadingCoverImage(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    if (!slugEdited && title) setSlug(slugify(title));
  }, [title, slugEdited]);

  useEffect(() => {
    setImgError(false);
  }, [coverImage]);

  const inputClass =
    "w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors";
  const labelClass =
    "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide";
  const sectionClass =
    "rounded-lg border border-border/50 bg-card p-5 space-y-4";

  return (
    <form action={action}>
      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── Sol: Ana içerik ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Başlık + Slug */}
          <div className={sectionClass}>
            <div>
              <label className={labelClass}>Başlık *</label>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Yazı başlığı"
                className={`${inputClass} text-base font-medium`}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono shrink-0">
                  /blog/
                </span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugEdited(true);
                  }}
                  placeholder="yazi-slug"
                  className={`${inputClass} font-mono text-xs`}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Özet</label>
              <textarea
                name="excerpt"
                defaultValue={defaultValues?.excerpt ?? ""}
                placeholder="Okuyucunun dikkatini çekecek kısa bir özet..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* İçerik editörü */}
          <div className={sectionClass}>
            <div className="flex items-center justify-between">
              <label className={labelClass} style={{ margin: 0 }}>
                İçerik{" "}
                <span className="text-muted-foreground/50 normal-case tracking-normal">
                  (Markdown)
                </span>
              </label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md border border-border/50 px-2.5 py-1"
              >
                {preview ? (
                  <>
                    <EyeOff size={12} /> Düzenle
                  </>
                ) : (
                  <>
                    <Eye size={12} /> Önizle
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1 rounded-md border border-border/50 bg-background p-1.5">
              {[
                {
                  label: "Başlık",
                  icon: Heading2,
                  action: () => prefixLines("## "),
                },
                {
                  label: "Kalın",
                  icon: Bold,
                  action: () => applyMarkdown("**", "**", "kalın metin"),
                },
                {
                  label: "İtalik",
                  icon: Italic,
                  action: () => applyMarkdown("*", "*", "italik metin"),
                },
                {
                  label: "Madde listesi",
                  icon: List,
                  action: () => prefixLines("- "),
                },
                {
                  label: "Numaralı liste",
                  icon: ListOrdered,
                  action: () => prefixLines("1. "),
                },
                {
                  label: "Alıntı",
                  icon: Quote,
                  action: () => prefixLines("> "),
                },
                {
                  label: "Kod",
                  icon: Code2,
                  action: () => applyMarkdown("`", "`", "kod"),
                },
                {
                  label: "Bağlantı",
                  icon: LinkIcon,
                  action: () =>
                    applyMarkdown("[", "](https://example.com)", "bağlantı metni"),
                },
              ].map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  title={tool.label}
                  aria-label={tool.label}
                  onClick={tool.action}
                  disabled={preview}
                  className="inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <tool.icon size={15} />
                </button>
              ))}
              <div className="mx-1 h-5 w-px bg-border/70" />
              <button
                type="button"
                title="Yazıya görsel ekle"
                aria-label="Yazıya görsel ekle"
                onClick={() => setShowImageTool((value) => !value)}
                disabled={preview}
                className="inline-flex h-8 items-center gap-1.5 rounded px-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ImageIcon size={15} /> Görsel ekle
              </button>
              <span className="ml-auto px-2 text-xs font-mono text-muted-foreground/60">
                {wordCount} kelime · {content.length} karakter
              </span>
            </div>

            {showImageTool && !preview && (
              <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(event) => {
                      setImageUrl(event.target.value);
                      setImageUrlError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        insertImage();
                      }
                    }}
                    placeholder="https://.../gorsel.jpg"
                    className={`${inputClass} font-mono text-xs`}
                  />
                  <button
                    type="button"
                    onClick={insertImage}
                    className="shrink-0 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                  >
                    Yazıya ekle
                  </button>
                </div>
                {imageUrlError && (
                  <p className="mt-2 text-xs text-red-400">{imageUrlError}</p>
                )}
                <div className="mt-3 flex flex-col gap-2 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Ya da bilgisayarından bir görsel seç. İmlecin bulunduğu yere eklenir.
                  </p>
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-foreground transition-colors hover:bg-secondary">
                    {uploadingEditorImage ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <UploadCloud size={14} />
                    )}
                    {uploadingEditorImage ? "Yükleniyor..." : "Bilgisayardan seç"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      disabled={uploadingEditorImage}
                      className="sr-only"
                      onChange={(event) => {
                        void uploadEditorImage(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
                {editorUploadError && (
                  <p className="mt-2 text-xs text-red-400">
                    {editorUploadError}
                  </p>
                )}
              </div>
            )}

            {preview && <input type="hidden" name="content" value={content} />}

            {preview ? (
              <div className="min-h-[420px] rounded-md border border-border/50 bg-secondary/20 px-5 py-4 text-sm leading-relaxed overflow-auto">
                {content ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-a:text-primary prose-img:rounded-lg prose-img:border prose-img:border-border/50 prose-pre:bg-background">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        img: ({ src, alt }) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={src}
                            alt={alt ?? ""}
                            className="my-4 w-full rounded-lg border border-border/50 object-cover"
                          />
                        ),
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    Önizlenecek içerik yok.
                  </p>
                )}
              </div>
            ) : (
              <textarea
                ref={contentRef}
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    event.preventDefault();
                    applyMarkdown("  ", "", "");
                  }
                  if ((event.ctrlKey || event.metaKey) && event.key === "b") {
                    event.preventDefault();
                    applyMarkdown("**", "**", "kalın metin");
                  }
                  if ((event.ctrlKey || event.metaKey) && event.key === "i") {
                    event.preventDefault();
                    applyMarkdown("*", "*", "italik metin");
                  }
                }}
                placeholder={
                  "# Başlık\n\nİçeriğinizi buraya yazın...\n\n## Alt Başlık\n\n**Kalın metin**, *italik metin*\n\n```code block```"
                }
                rows={22}
                className={`${inputClass} font-mono text-xs leading-relaxed resize-y`}
                required
              />
            )}

            {/* Markdown cheatsheet */}
            {!preview && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-border/30">
                {[
                  ["#", "Başlık"],
                  ["**metin**", "Kalın"],
                  ["*metin*", "İtalik"],
                  ["`kod`", "Kod"],
                  ["[link](url)", "Link"],
                  ["![alt](url)", "Görsel"],
                ].map(([syntax, label]) => (
                  <span
                    key={label}
                    className="text-xs text-muted-foreground/60"
                  >
                    <code className="font-mono text-muted-foreground/80">
                      {syntax}
                    </code>{" "}
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Sağ: Sidebar ── */}
        <div className="w-full xl:w-72 shrink-0 space-y-5">
          {/* Yayınla */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-1">
              <FileText size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Yayın
              </span>
            </div>

            <div>
              <label className={labelClass}>Durum</label>
              <div className="flex gap-2">
                {(["DRAFT", "PUBLISHED"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                      status === s
                        ? s === "PUBLISHED"
                          ? "border-green-500/50 bg-green-500/10 text-green-400"
                          : "border-border bg-secondary text-foreground"
                        : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {s === "DRAFT" ? "Taslak" : "Yayınla"}
                  </button>
                ))}
              </div>
              {/* Hidden input for form submission */}
              <input type="hidden" name="status" value={status} />
            </div>

            <div className="flex justify-between gap-3 pt-2 border-t border-border/30">
              <a
                href="/admin/posts"
                className="flex-1 text-center rounded-md border border-border/50 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                İptal
              </a>
              <button
                type="submit"
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {submitLabel}
              </button>
            </div>
          </div>

          {/* Kategori */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-1">
              <Tag size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Kategori
              </span>
            </div>
            <select
              name="categoryId"
              defaultValue={defaultValues?.categoryId ?? ""}
              className={inputClass}
            >
              <option value="">Seçilmedi</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Kapak görseli */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-1">
              <ImageIcon size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Kapak Görseli
              </span>
            </div>
            <input
              name="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className={`${inputClass} font-mono text-xs`}
            />
            <label className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              {uploadingCoverImage ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UploadCloud size={14} />
              )}
              {uploadingCoverImage
                ? "Kapak yükleniyor..."
                : "Bilgisayardan kapak yükle"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                disabled={uploadingCoverImage}
                className="sr-only"
                onChange={(event) => {
                  void uploadCoverImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            {coverUploadError && (
              <p className="mt-2 text-xs text-red-400">{coverUploadError}</p>
            )}
            {/* Önizleme */}
            {coverImage && !imgError ? (
              <div className="mt-2 rounded-md overflow-hidden border border-border/50 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Kapak önizleme"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : coverImage && imgError ? (
              <p className="mt-2 text-xs text-red-400/80">
                Görsel yüklenemedi.
              </p>
            ) : (
              <div className="mt-2 rounded-md border border-border/40 border-dashed aspect-video flex items-center justify-center">
                <p className="text-xs text-muted-foreground/50">
                  Önizleme burada görünür
                </p>
              </div>
            )}
          </div>

          {/* SEO */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-1">
              <Globe size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                SEO
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ margin: 0 }}>
                  Başlık
                </label>
                <span
                  className={`text-xs font-mono ${seoTitle.length > 55 ? "text-orange-400" : "text-muted-foreground/60"}`}
                >
                  {seoTitle.length}/60
                </span>
              </div>
              <input
                name="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO başlığı"
                className={inputClass}
                maxLength={60}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ margin: 0 }}>
                  Açıklama
                </label>
                <span
                  className={`text-xs font-mono ${seoDesc.length > 145 ? "text-orange-400" : "text-muted-foreground/60"}`}
                >
                  {seoDesc.length}/160
                </span>
              </div>
              <textarea
                name="seoDescription"
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Arama motorlarında görünecek açıklama"
                rows={3}
                className={`${inputClass} resize-none`}
                maxLength={160}
              />
            </div>

            {/* Google önizleme */}
            {(seoTitle || title) && (
              <div className="mt-1 rounded-md border border-border/40 bg-secondary/20 p-3">
                <p className="text-xs text-muted-foreground/60 mb-1.5 flex items-center gap-1">
                  <Globe size={10} /> Google önizleme
                </p>
                <p className="text-xs text-blue-400 font-medium line-clamp-1">
                  {seoTitle || title}
                </p>
                <p className="text-xs text-green-600/80 font-mono mt-0.5">
                  mehmetanil-site.vercel.app/blog/{slug || "yazi-slug"}
                </p>
                {seoDesc && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {seoDesc}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
