import { prisma } from "@/lib/db";
import { products, services, websiteSetting } from "@/lib/seed-data";

export async function getSettings() {
  try {
    const settings = await prisma.websiteSetting.findFirst();
    return settings ?? websiteSetting;
  } catch {
    return websiteSetting;
  }
}

export async function getProducts() {
  try {
    const records = await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: { category: true }
    });
    return records.length ? records : products;
  } catch {
    return products;
  }
}

export async function getProduct(slug: string) {
  try {
    const record = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
    return record ?? products.find((product) => product.slug === slug);
  } catch {
    return products.find((product) => product.slug === slug);
  }
}

export async function getServices() {
  try {
    const records = await prisma.service.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, include: { category: true } });
    return records.length ? records : services;
  } catch {
    return services;
  }
}
