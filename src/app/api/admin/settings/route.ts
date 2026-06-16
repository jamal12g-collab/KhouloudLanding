import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const current = await prisma.websiteSetting.findFirst();
  const data = {
    businessName: body.businessName,
    tagline: body.tagline,
    description: body.description,
    phone: body.phone,
    whatsapp: body.whatsapp,
    email: body.email || null,
    address: body.address,
    facebookUrl: body.facebookUrl,
    instagramUrl: body.instagramUrl || null,
    tiktokUrl: body.tiktokUrl || null,
    messengerUrl: body.messengerUrl || null,
    logoUrl: body.logoUrl || null,
    primaryColor: body.primaryColor || "#5c2338",
    accentColor: body.accentColor || "#e8b7a6",
    heroImage: body.heroImage
  };

  const settings = current ? await prisma.websiteSetting.update({ where: { id: current.id }, data }) : await prisma.websiteSetting.create({ data });

  return NextResponse.json({ settings });
}
