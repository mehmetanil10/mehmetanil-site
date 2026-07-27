import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || adminPassword.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD en az 12 karakter olmalı ve seed çalıştırılmadan önce tanımlanmalıdır.",
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: "admin@mehmetanil.dev" },
    update: { passwordHash },
    create: {
      name: "Mehmet Anıl",
      email: "admin@mehmetanil.dev",
      passwordHash,
      role: "ADMIN",
    },
  });

  const categories = [
    { name: "SQL", slug: "sql" },
    { name: "Backend", slug: "backend" },
    { name: "ERP", slug: "erp" },
    { name: "Full-Stack", slug: "full-stack" },
    { name: "AI", slug: "ai" },
    { name: "Career Notes", slug: "career-notes" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
