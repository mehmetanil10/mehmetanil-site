import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Başlık en az 3 karakter olmalı")
    .max(200, "Başlık en fazla 200 karakter olabilir"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug en az 3 karakter olmalı")
    .max(200, "Slug en fazla 200 karakter olabilir")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug yalnızca küçük harf, rakam ve tire içerebilir",
    ),
  excerpt: z
    .string()
    .trim()
    .max(500, "Özet en fazla 500 karakter olabilir")
    .optional(),
  content: z
    .string()
    .trim()
    .min(20, "İçerik en az 20 karakter olmalı")
    .max(100_000, "İçerik çok uzun"),
  coverImage: z
    .string()
    .trim()
    .max(2048, "Görsel URL'si çok uzun")
    .refine(
      (value) => value === "" || /^https?:\/\//i.test(value),
      "Görsel URL'si http:// veya https:// ile başlamalı",
    )
    .optional(),
  categoryId: z.string().trim().max(100).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: z.string().trim().max(60).optional(),
  seoDescription: z.string().trim().max(160).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı"),
  slug: z.string().min(2, "Slug en az 2 karakter olmalı"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "İsim zorunlu").max(80, "İsim çok uzun"),
  email: z
    .string()
    .trim()
    .email("Geçerli bir email girin")
    .max(254, "E-posta adresi çok uzun"),
  subject: z.string().trim().max(150, "Konu çok uzun").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Mesaj en az 10 karakter olmalı")
    .max(5000, "Mesaj en fazla 5000 karakter olabilir"),
  website: z.string().max(200).optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
