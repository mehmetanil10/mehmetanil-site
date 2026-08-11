import type { Post, Category, Tag, User } from "@prisma/client";

export type PostWithRelations = Post & {
  category: Category | null;
  author: Pick<User, "id" | "name">;
  postTags: { tag: Tag }[];
};

export type PostCardData = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "coverImage" | "publishedAt" | "createdAt"
> & {
  category: Pick<Category, "name" | "slug"> | null;
};

// Static project data type
export type Project = {
  title: string;
  slug: string;
  year: number;
  description: string;
  longDescription?: string;
  stack: string[];
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  type: "full-stack" | "ai" | "sql" | "scraping";
  gallery?: {
    src: string;
    alt: string;
  }[];
};

export type Experience = {
  company: string;
  role: string;
  positioning?: string;
  summary?: string;
  period: string;
  type: "full-time" | "intern";
  highlights: string[];
  focusAreas?: {
    title: string;
    description: string;
  }[];
  stack?: string[];
};
