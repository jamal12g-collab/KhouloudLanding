import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, product: true }
  });

  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.fullName || !body?.phone || !body?.selectedService || !body?.preferredDate || !body?.preferredTime) {
    return NextResponse.json({ error: "Please complete the required booking fields." }, { status: 400 });
  }

  const customer = await prisma.customer.create({
    data: {
      fullName: body.fullName,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      email: body.email || null,
      address: body.address || null
    }
  });

  const product = await prisma.product.findFirst({ where: { title: body.selectedService } });

  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      productId: product?.id,
      selectedService: body.selectedService,
      preferredDate: new Date(body.preferredDate),
      preferredTime: body.preferredTime,
      notes: body.notes || null
    }
  });

  return NextResponse.json({ booking }, { status: 201 });
}
