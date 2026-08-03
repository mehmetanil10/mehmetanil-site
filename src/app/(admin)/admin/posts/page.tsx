import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { getPosts } from "@/actions/post-actions";
import { deletePost } from "@/actions/post-actions";
import { formatDate } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin/delete-post-button";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Yazılar</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={15} /> Yeni yazı
        </Link>
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
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Henüz yazı yok.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border/30 hover:bg-secondary/10 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {post.category?.name ?? "—"}
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
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={13} /> {post._count.views}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      >
                        <Pencil size={14} />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deletePost(post.id);
                        }}
                      >
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
    </div>
  );
}
