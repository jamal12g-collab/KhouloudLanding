import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, bookings, customers, messages, settings] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, include: { customer: true, product: true } }),
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { bookings: true, messages: true } },
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { selectedService: true, preferredDate: true, status: true, createdAt: true }
        }
      }
    }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.websiteSetting.findFirst()
  ]);

  return NextResponse.json({
    products,
    bookings,
    customers,
    messages,
    settings,
    analytics: {
      products: products.length,
      bookings: bookings.length,
      customers: customers.length,
      unreadMessages: messages.filter((message) => message.status === "Unread").length
    }
  });
}
