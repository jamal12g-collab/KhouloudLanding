import { PrismaClient } from "@prisma/client";
import { categories, products, services, websiteSetting } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUnique({ where: { slug: product.categorySlug } });
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        featured: product.featured,
        active: true,
        categoryId: category?.id
      },
      create: {
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image: product.image,
        featured: product.featured,
        active: true,
        categoryId: category?.id
      }
    });
  }

  for (const service of services) {
    const category = await prisma.category.findUnique({ where: { slug: service.categorySlug } });
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        image: service.image,
        active: true,
        categoryId: category?.id
      },
      create: {
        title: service.title,
        slug: service.slug,
        description: service.description,
        price: service.price,
        duration: service.duration,
        image: service.image,
        active: true,
        categoryId: category?.id
      }
    });
  }

  const current = await prisma.websiteSetting.findFirst();
  if (current) {
    await prisma.websiteSetting.update({ where: { id: current.id }, data: websiteSetting });
  } else {
    await prisma.websiteSetting.create({ data: websiteSetting });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
