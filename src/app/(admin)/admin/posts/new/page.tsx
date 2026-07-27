import { getCategories } from "@/actions/category-actions";
import { createPost } from "@/actions/post-actions";
import { PostForm } from "@/components/admin/post-form";

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-xl font-semibold mb-8">Yeni yazı</h1>
      <PostForm
        categories={categories}
        action={createPost}
        submitLabel="Yayınla"
      />
    </div>
  );
}
