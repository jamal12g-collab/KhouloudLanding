import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { categories, products, services, websiteSetting } from "../src/lib/seed-data.ts";

const prismaDir = path.join(process.cwd(), "prisma");
mkdirSync(prismaDir, { recursive: true });

const db = new DatabaseSync(path.join(prismaDir, "dev.db"));

db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" TEXT,
  "image" TEXT NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "categoryId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");

CREATE TABLE IF NOT EXISTS "Service" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" TEXT,
  "duration" TEXT,
  "image" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "categoryId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Service_slug_key" ON "Service"("slug");

CREATE TABLE IF NOT EXISTS "Customer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "whatsapp" TEXT,
  "email" TEXT,
  "address" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Booking" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "customerId" TEXT NOT NULL,
  "productId" TEXT,
  "selectedService" TEXT NOT NULL,
  "preferredDate" DATETIME NOT NULL,
  "preferredTime" TEXT NOT NULL,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'New',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Booking_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Message" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "customerId" TEXT,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Unread',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Message_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "WebsiteSetting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "businessName" TEXT NOT NULL,
  "tagline" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "email" TEXT,
  "address" TEXT NOT NULL,
  "facebookUrl" TEXT NOT NULL,
  "instagramUrl" TEXT,
  "tiktokUrl" TEXT,
  "messengerUrl" TEXT,
  "logoUrl" TEXT,
  "primaryColor" TEXT NOT NULL,
  "accentColor" TEXT NOT NULL,
  "heroImage" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
`);

const now = new Date().toISOString();
const id = (prefix) => `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;

const categoryBySlug = new Map();
const insertCategory = db.prepare(`
INSERT INTO "Category" ("id", "name", "slug", "description", "createdAt", "updatedAt")
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT("slug") DO UPDATE SET "name"=excluded."name", "description"=excluded."description", "updatedAt"=excluded."updatedAt"
`);
const findCategory = db.prepare(`SELECT "id" FROM "Category" WHERE "slug" = ?`);

for (const category of categories) {
  insertCategory.run(id("cat"), category.name, category.slug, category.description, now, now);
  categoryBySlug.set(category.slug, findCategory.get(category.slug).id);
}

const insertProduct = db.prepare(`
INSERT INTO "Product" ("id", "title", "slug", "description", "price", "image", "featured", "active", "categoryId", "createdAt", "updatedAt")
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT("slug") DO UPDATE SET
  "title"=excluded."title",
  "description"=excluded."description",
  "price"=excluded."price",
  "image"=excluded."image",
  "featured"=excluded."featured",
  "active"=excluded."active",
  "categoryId"=excluded."categoryId",
  "updatedAt"=excluded."updatedAt"
`);

for (const product of products) {
  insertProduct.run(id("prod"), product.title, product.slug, product.description, product.price, product.image, product.featured ? 1 : 0, 1, categoryBySlug.get(product.categorySlug), now, now);
}

const insertService = db.prepare(`
INSERT INTO "Service" ("id", "title", "slug", "description", "price", "duration", "image", "active", "categoryId", "createdAt", "updatedAt")
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT("slug") DO UPDATE SET
  "title"=excluded."title",
  "description"=excluded."description",
  "price"=excluded."price",
  "duration"=excluded."duration",
  "image"=excluded."image",
  "active"=excluded."active",
  "categoryId"=excluded."categoryId",
  "updatedAt"=excluded."updatedAt"
`);

for (const service of services) {
  insertService.run(id("serv"), service.title, service.slug, service.description, service.price, service.duration, service.image, 1, categoryBySlug.get(service.categorySlug), now, now);
}

const existingSetting = db.prepare(`SELECT "id" FROM "WebsiteSetting" LIMIT 1`).get();
if (existingSetting) {
  db.prepare(`
  UPDATE "WebsiteSetting" SET
    "businessName"=?, "tagline"=?, "description"=?, "phone"=?, "whatsapp"=?, "email"=?, "address"=?,
    "facebookUrl"=?, "instagramUrl"=?, "tiktokUrl"=?, "messengerUrl"=?, "logoUrl"=?, "primaryColor"=?, "accentColor"=?, "heroImage"=?, "updatedAt"=?
  WHERE "id"=?
  `).run(
    websiteSetting.businessName,
    websiteSetting.tagline,
    websiteSetting.description,
    websiteSetting.phone,
    websiteSetting.whatsapp,
    websiteSetting.email,
    websiteSetting.address,
    websiteSetting.facebookUrl,
    websiteSetting.instagramUrl,
    websiteSetting.tiktokUrl,
    websiteSetting.messengerUrl,
    websiteSetting.logoUrl,
    websiteSetting.primaryColor,
    websiteSetting.accentColor,
    websiteSetting.heroImage,
    now,
    existingSetting.id
  );
} else {
  db.prepare(`
  INSERT INTO "WebsiteSetting" ("id", "businessName", "tagline", "description", "phone", "whatsapp", "email", "address", "facebookUrl", "instagramUrl", "tiktokUrl", "messengerUrl", "logoUrl", "primaryColor", "accentColor", "heroImage", "createdAt", "updatedAt")
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id("set"),
    websiteSetting.businessName,
    websiteSetting.tagline,
    websiteSetting.description,
    websiteSetting.phone,
    websiteSetting.whatsapp,
    websiteSetting.email,
    websiteSetting.address,
    websiteSetting.facebookUrl,
    websiteSetting.instagramUrl,
    websiteSetting.tiktokUrl,
    websiteSetting.messengerUrl,
    websiteSetting.logoUrl,
    websiteSetting.primaryColor,
    websiteSetting.accentColor,
    websiteSetting.heroImage,
    now,
    now
  );
}

db.close();
console.log("SQLite database initialized at prisma/dev.db");
