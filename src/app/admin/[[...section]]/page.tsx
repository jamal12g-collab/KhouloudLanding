import { notFound } from "next/navigation";
import { AdminDashboard, type AdminSection } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";
import { isAdminAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage products, bookings, customers, messages, and website settings."
};

const sectionMap: Record<string, AdminSection> = {
  overview: "overview",
  products: "products",
  product: "products",
  booking: "bookings",
  bookings: "bookings",
  customers: "customers",
  customer: "customers",
  messages: "messages",
  message: "messages",
  settings: "settings"
};

type AdminPageProps = {
  params: Promise<{ section?: string[] }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { section = [] } = await params;
  const authenticated = await isAdminAuthenticated();

  if (section.length > 1) {
    notFound();
  }

  const activeSection = section.length === 0 ? "overview" : sectionMap[section[0]];

  if (!activeSection) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(232,183,166,.18),transparent_28%),linear-gradient(135deg,#100b12,#2b1322_55%,#0c1110)]">
      {authenticated ? <AdminDashboard activeSection={activeSection} /> : <div className="grid min-h-screen place-items-center px-4 py-12"><AdminLogin /></div>}
    </section>
  );
}
