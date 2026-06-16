import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await prisma.$transaction([
    prisma.booking.deleteMany({ where: { customerId: id } }),
    prisma.message.deleteMany({ where: { customerId: id } }),
    prisma.customer.delete({ where: { id } })
  ]);

  return NextResponse.json({ ok: true });
}
