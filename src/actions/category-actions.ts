"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { categorySchema } from "@/lib/validations";
import type { CategoryFormValues } from "@/lib/validations";

export async function createCategory(data: CategoryFormValues) {
  await requireAdmin();

  const validated = categorySchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  await prisma.category.create({ data: validated.data });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, data: CategoryFormValues) {
  await requireAdmin();

  const validated = categorySchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  await prisma.category.update({ where: { id }, data: validated.data });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
