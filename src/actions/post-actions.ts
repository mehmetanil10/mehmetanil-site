"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";
import { postSchema } from "@/lib/validations";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parsePostForm(formData: FormData, fallbackContent = "") {
  const title = getFormString(formData, "title");
  const submittedContent = getFormString(formData, "content");
  const result = postSchema.safeParse({
    title,
    slug: getFormString(formData, "slug") || slugify(title),
    excerpt: getFormString(formData, "excerpt"),
    content: submittedContent.trim() ? submittedContent : fallbackContent,
    coverImage: getFormString(formData, "coverImage"),
    categoryId: getFormString(formData, "categoryId"),
    status: getFormString(formData, "status"),
    seoTitle: getFormString(formData, "seoTitle"),
    seoDescription: getFormString(formData, "seoDescription"),
  });

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Geçersiz yazı verisi.");
  }

  return result.data;
}

export async function createPost(formData: FormData) {
  await requireAdmin();

  const data = parsePostForm(formData);

  const adminUser = await prisma.user.findFirst();
  if (!adminUser) throw new Error("Admin kullanıcı bulunamadı.");

  await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      categoryId: data.categoryId || null,
      status: data.status,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      authorId: adminUser.id,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Yazı bulunamadı.");

  const data = parsePostForm(formData, existing.content);

  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      categoryId: data.categoryId || null,
      status: data.status,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      publishedAt:
        data.status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireAdmin();

  await prisma.post.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}

export async function getPosts(status?: "DRAFT" | "PUBLISHED") {
  if (status !== "PUBLISHED") {
    await requireAdmin();
  }

  return prisma.post.findMany({
    where: status ? { status } : undefined,
    include: {
      category: true,
      author: { select: { id: true, name: true } },
      postTags: { include: { tag: true } },
      _count: { select: { views: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      author: { select: { id: true, name: true } },
      postTags: { include: { tag: true } },
      _count: { select: { views: true } },
    },
  });
}
