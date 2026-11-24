"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Eye } from "lucide-react";
import { deletePost } from "@/actions/post-actions";
import { DeletePostButton } from "./delete-post-button";

type PostRow = {
  id: string;
  title: string;
  status: "PUBLISHED" | "DRAFT";
  category?: string;
  date: string;
  views: number;
};

const filters = { all: "Tümü", DRAFT: "Taslak", PUBLISHED: "Yayında" } as const;

export function PostList({ posts }: { posts: PostRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<keyof typeof filters>("all");
  const search = query.trim().toLocaleLowerCase("tr-TR");
  const visiblePosts = posts.filter((post) =>
    (status === "all" || post.status === status) && post.title.toLocaleLowerCase("tr-TR").includes(search)
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input type="search" aria-label="Başlığa göre ara" value={query} onChange={(event) => setQuery(event.target.value)}
          placeholder="Başlığa göre ara" className="min-w-0 flex-auto rounded-md border bg-background px-3 py-2 text-sm" />
        <div className="flex gap-1" role="group" aria-label="Yazı durumu">
          {(Object.keys(filters) as Array<keyof typeof filters>).map((key) => (
            <button key={key} type="button" aria-pressed={status === key} onClick={() => setStatus(key)}
              className={`rounded-md px-3 py-2 text-sm ${status === key ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {filters[key]}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Başlık
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">
                Kategori
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
                Durum
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">
                Tarih
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">
                Görüntüleme
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {visiblePosts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  {posts.length ? "Aramaya uygun yazı bulunamadı." : "Henüz yazı yok."}
                </td>
              </tr>
            ) : (
              visiblePosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border/30 hover:bg-secondary/10 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link className="break-words font-medium hover:underline" href={`/admin/posts/${post.id}/edit`}>
                      {post.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground lg:hidden">
                      <span className="sm:hidden">{post.status === "PUBLISHED" ? "Yayında" : "Taslak"} · </span>
                      {post.views} görüntüleme · {post.date}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {post.category ?? "—"}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`rounded-sm px-2 py-0.5 text-xs font-mono ${
                        post.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-yellow-400"
                      }`}
                    >
                      {post.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono hidden lg:table-cell">
                    {post.date}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={13} /> {post.views}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        aria-label={`${post.title} yazısını düzenle`}
                        className="hidden p-2 text-muted-foreground hover:text-foreground sm:block"
                      >
                        <Pencil size={14} />
                      </Link>
                      <form action={deletePost.bind(null, post.id)}>
                        <DeletePostButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
