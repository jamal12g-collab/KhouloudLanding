import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" }, include: { customer: true } });
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.message) {
    return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      subject: body.subject || null,
      message: body.message
    }
  });

  return NextResponse.json({ message }, { status: 201 });
}
