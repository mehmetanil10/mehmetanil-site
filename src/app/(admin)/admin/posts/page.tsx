import Link from "next/link";
import { Plus } from "lucide-react";
import { getPosts } from "@/actions/post-actions";
import { formatDate } from "@/lib/utils";
import { PostList } from "@/components/admin/post-list";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  const rows = posts.map((post) => ({
    id: post.id, title: post.title, status: post.status,
    category: post.category?.name, date: formatDate(post.createdAt), views: post._count.views,
  }));

  return (
    <div className="min-w-0 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Yazılar</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={15} /> Yeni yazı
        </Link>
      </div>

      <PostList posts={rows} />
    </div>
  );
}
