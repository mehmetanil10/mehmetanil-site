import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostBySlug } from "@/actions/post-actions";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) return { title: "Yazı bulunamadı" };

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPublishedPostBySlug(params.slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft size={14} /> Blog&apos;a dön
      </Link>

      {/* Header */}
      <div className="mb-10">
        {post.category && (
          <Link
            href={`/blog?category=${post.category.slug}`}
            className="text-xs font-mono text-primary mb-3 block"
          >
            {post.category.name}
          </Link>
        )}
        <h1 className="text-3xl font-semibold tracking-tight leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
        </div>
        {post.postTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.postTags.map(({ tag }) => (
              <span
                key={tag.id}
                className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="mb-10 rounded-lg overflow-hidden border border-border/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-sm max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-img:rounded-lg prose-img:border prose-img:border-border/50 prose-img:w-full">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            // Dış görselleri native img ile render et (Next.js domain kısıtı yok)
            img: ({ src, alt }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt ?? ""}
                className="rounded-lg border border-border/50 w-full object-cover my-4"
              />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
