import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Eye, Tag } from "lucide-react";
import { getPosts } from "@/actions/post-actions";
import { getCategories } from "@/actions/category-actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "SQL, Backend, ERP, Full-Stack ve AI üzerine yazılar.",
};

/** Yazı içeriğinden yaklaşık okuma süresi (dakika) */
function readingTime(content?: string | null): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [posts, categories] = await Promise.all([
    getPosts("PUBLISHED"),
    getCategories(),
  ]);

  const filtered = searchParams.category
    ? posts.filter((p) => p.category?.slug === searchParams.category)
    : posts;

  // İlk yazı featured, diğerleri liste
  const [featured, ...rest] = filtered;

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      {/* ── Başlık ── */}
      <p className="mb-3 font-mono text-sm text-primary">/ blog</p>
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        SQL, Backend, ERP ve yazılım geliştirme üzerine notlar.
      </p>

      {/* ── Kategori filtresi ── */}
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-sm px-3 py-1 text-xs font-mono transition-colors ${
              !searchParams.category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Tümü
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`rounded-sm px-3 py-1 text-xs font-mono transition-colors ${
                searchParams.category === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* ── İçerik ── */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border/50 bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Henüz yazı yok.</p>
        </div>
      ) : (
        <>
          {/* ── Featured Post ── */}
          {featured && (
            <div className="mt-10">
              <p className="mb-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Öne Çıkan
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="group block rounded-xl border border-border/50 bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-[0_0_32px_-6px_hsl(var(--primary)/0.2)]"
              >
                {/* Cover image veya gradient placeholder */}
                {featured.coverImage ? (
                  <div className="relative h-52 md:h-64 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-36 md:h-44 overflow-hidden bg-gradient-to-br from-primary/8 via-primary/4 to-transparent">
                    {/* Dekoratif arka plan deseni */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 80% 20%, hsl(var(--primary)) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                  </div>
                )}

                <div className="p-6">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {featured.category && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-primary">
                        <Tag size={10} />
                        {featured.category.name}
                      </span>
                    )}
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatDate(featured.publishedAt ?? featured.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={10} />
                      {readingTime(featured.content)} dk okuma
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye size={11} />
                      {featured._count.views} görüntüleme
                    </span>
                  </div>

                  <h2 className="text-lg md:text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {featured.excerpt}
                    </p>
                  )}

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    Okumaya devam et
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ── Diğer yazılar ── */}
          {rest.length > 0 && (
            <div className="mt-10">
              {featured && (
                <p className="mb-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Tüm Yazılar
                </p>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {(featured ? rest : filtered).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-[0_0_20px_-6px_hsl(var(--primary)/0.15)] hover:-translate-y-0.5"
                  >
                    {/* Mini cover / gradient bar */}
                    {post.coverImage ? (
                      <div className="h-32 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-1.5 w-full bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {post.category && (
                          <span className="text-xs font-mono text-primary">
                            {post.category.name}
                          </span>
                        )}
                        <span className="text-xs font-mono text-muted-foreground">
                          {formatDate(post.publishedAt ?? post.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                          <Clock size={10} />
                          {readingTime(post.content)} dk
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye size={11} />
                          {post._count.views}
                        </span>
                      </div>

                      <h3 className="text-sm font-medium group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Oku <ArrowRight size={10} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
