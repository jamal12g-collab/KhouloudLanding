import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.description || !body?.image) {
    return NextResponse.json({ error: "Title, description, and image are required." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      title: body.title,
      slug: slugify(body.slug || body.title),
      description: body.description,
      price: body.price || null,
      image: body.image,
      featured: Boolean(body.featured),
      active: body.active !== false
    }
  });

  return NextResponse.json({ product }, { status: 201 });
}
