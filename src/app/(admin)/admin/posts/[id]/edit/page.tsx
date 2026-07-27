import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCategories } from "@/actions/category-actions";
import { updatePost } from "@/actions/post-actions";
import { PostForm } from "@/components/admin/post-form";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id: params.id },
      include: { postTags: { include: { tag: true } } },
    }),
    getCategories(),
  ]);

  if (!post) notFound();

  const defaultValues = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    coverImage: post.coverImage ?? "",
    categoryId: post.categoryId ?? "",
    status: post.status as "DRAFT" | "PUBLISHED",
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-xl font-semibold mb-8">Yazıyı düzenle</h1>
      <PostForm
        defaultValues={defaultValues}
        categories={categories}
        action={updatePost.bind(null, post.id)}
        submitLabel="Güncelle"
      />
    </div>
  );
}
