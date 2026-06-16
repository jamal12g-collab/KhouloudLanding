"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  Check,
  Clock3,
  Crown,
  Eye,
  Filter,
  Gem,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  PanelLeftOpen,
  Phone,
  Plus,
  Send,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Trash2,
  TrendingUp,
  UserPlus,
  Upload,
  Users,
  type LucideIcon
} from "lucide-react";
import { ChangeEvent, CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { cn, formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/language-toggle";

type DashboardData = {
  products: Array<{ id: string; title: string; slug: string; description: string; price?: string | null; image: string; featured: boolean; active: boolean }>;
  bookings: Array<{ id: string; selectedService: string; preferredDate: string; preferredTime: string; status: string; notes?: string | null; customer: { fullName: string; phone: string; whatsapp?: string | null; email?: string | null } }>;
  customers: Array<{
    id: string;
    fullName: string;
    phone: string;
    whatsapp?: string | null;
    email?: string | null;
    address?: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: { bookings: number; messages: number };
    bookings?: Array<{ selectedService: string; preferredDate: string; status: string; createdAt: string }>;
  }>;
  messages: Array<{ id: string; name: string; subject?: string | null; message: string; status: string; createdAt: string }>;
  settings: Record<string, string | null>;
  analytics: { products: number; bookings: number; customers: number; unreadMessages: number };
};

const emptyProduct = {
  id: "",
  title: "",
  slug: "",
  description: "",
  price: "",
  image: "",
  featured: false,
  active: true
};

const settingsFields = [
  { name: "businessName", labelKey: "admin.settings.field.businessName", type: "text", required: true },
  { name: "tagline", labelKey: "admin.settings.field.tagline", type: "text", required: true },
  { name: "phone", labelKey: "admin.settings.field.phone", type: "tel", required: true },
  { name: "whatsapp", labelKey: "admin.settings.field.whatsapp", type: "tel", required: true },
  { name: "email", labelKey: "admin.settings.field.email", type: "email", required: false },
  { name: "address", labelKey: "admin.settings.field.address", type: "text", required: true },
  { name: "facebookUrl", labelKey: "admin.settings.field.facebookUrl", type: "url", required: true },
  { name: "instagramUrl", labelKey: "admin.settings.field.instagramUrl", type: "url", required: false },
  { name: "tiktokUrl", labelKey: "admin.settings.field.tiktokUrl", type: "url", required: false },
  { name: "messengerUrl", labelKey: "admin.settings.field.messengerUrl", type: "url", required: false },
  { name: "logoUrl", labelKey: "admin.settings.field.logoUrl", type: "text", required: false },
  { name: "heroImage", labelKey: "admin.settings.field.heroImage", type: "text", required: true }
];

function applyBrandTheme(primaryColor: string, accentColor: string) {
  document.documentElement.style.setProperty("--brand-primary", primaryColor);
  document.documentElement.style.setProperty("--brand-accent", accentColor);
  document.documentElement.style.setProperty("--brand-accent-soft", `${accentColor}2e`);
}

export type AdminSection = "overview" | "products" | "bookings" | "customers" | "messages" | "settings";

type Tab = {
  name: AdminSection;
  label: string;
  href: string;
  icon: LucideIcon;
};

export function AdminDashboard({ activeSection = "overview" }: { activeSection?: AdminSection }) {
  const { t, language } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [product, setProduct] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerFrom, setCustomerFrom] = useState("");
  const [customerTo, setCustomerTo] = useState("");
  const [customerContactFilter, setCustomerContactFilter] = useState("all");
  const [customerSort, setCustomerSort] = useState("newest");
  const [deleteCustomer, setDeleteCustomer] = useState<DashboardData["customers"][number] | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#5c2338");
  const [accentColor, setAccentColor] = useState("#e8b7a6");

  async function load() {
    const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
    if (response.ok) setData(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (data?.settings?.primaryColor) setPrimaryColor(data.settings.primaryColor as string);
    if (data?.settings?.accentColor) setAccentColor(data.settings.accentColor as string);
  }, [data?.settings?.accentColor, data?.settings?.primaryColor]);

  const tabs = useMemo<Tab[]>(
    () => [
      { name: "overview", label: t("admin.tab.overview"), href: "/admin", icon: LayoutDashboard },
      { name: "products", label: t("admin.tab.products"), href: "/admin/products", icon: Package },
      { name: "bookings", label: t("admin.tab.bookings"), href: "/admin/booking", icon: CalendarDays },
      { name: "customers", label: t("admin.tab.customers"), href: "/admin/customers", icon: Users },
      { name: "messages", label: t("admin.tab.messages"), href: "/admin/messages", icon: MessageSquare },
      { name: "settings", label: t("admin.tab.settings"), href: "/admin/settings", icon: Settings }
    ],
    [t]
  );

  const tab = activeSection;
  const activeTab = tabs.find((item) => item.name === tab) ?? tabs[0];
  const ActiveIcon = activeTab.icon;
  const bookingTotal = data?.bookings.length ?? 0;
  const customerTotal = data?.customers.length ?? 0;
  const messageTotal = data?.messages.length ?? 0;
  const activeProducts = data?.products.filter((item) => item.active).length ?? 0;
  const featuredProducts = data?.products.filter((item) => item.featured).length ?? 0;
  const confirmedBookings = data?.bookings.filter((item) => item.status === "Confirmed").length ?? 0;
  const completedBookings = data?.bookings.filter((item) => item.status === "Completed").length ?? 0;
  const newBookings = data?.bookings.filter((item) => item.status === "New").length ?? 0;
  const conversionRate = bookingTotal ? Math.round(((confirmedBookings + completedBookings) / bookingTotal) * 100) : 0;
  const unreadMessages = data?.messages.filter((item) => item.status === "Unread").length ?? 0;
  const upcomingBookings = data?.bookings
    .filter((booking) => new Date(booking.preferredDate).getTime() >= Date.now() - 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())
    .slice(0, 5) ?? [];
  const recentCustomers = data?.customers.slice(0, 5) ?? [];
  const overviewCards = [
    { labelKey: "admin.stat.totalBookings", value: bookingTotal, detailKey: "admin.stat.newRequests", detailN: newBookings, icon: CalendarDays, color: "from-rosegold/28 via-white/8 to-white/[0.03]", accent: "text-rosegold" },
    { labelKey: "admin.stat.conversion", value: `${conversionRate}%`, detailKey: "admin.stat.confirmedDone", detailN: confirmedBookings + completedBookings, icon: TrendingUp, color: "from-emerald/30 via-white/8 to-white/[0.03]", accent: "text-emerald" },
    { labelKey: "admin.stat.customers", value: customerTotal, detailKey: "admin.stat.newestVisible", detailN: recentCustomers.length, icon: Users, color: "from-champagne/24 via-white/8 to-white/[0.03]", accent: "text-champagne" },
    { labelKey: "admin.stat.products", value: activeProducts, detailKey: "admin.stat.featuredServices", detailN: featuredProducts, icon: Package, color: "from-plum/38 via-white/8 to-white/[0.03]", accent: "text-rosegold" },
    { labelKey: "admin.stat.messages", value: messageTotal, detailKey: "admin.stat.unread", detailN: unreadMessages, icon: MessageSquare, color: "from-white/16 via-white/8 to-white/[0.03]", accent: "text-white" },
    { labelKey: "admin.stat.premiumSignal", value: featuredProducts + confirmedBookings, detailKey: null, detailN: null, icon: Crown, color: "from-rosegold/22 via-champagne/10 to-white/[0.03]", accent: "text-champagne" }
  ];
  const shortcutMetaKeys = ["admin.overview.manageCatalog", "admin.overview.reviewRequests", "admin.overview.clientDirectory", "admin.overview.inboxStatus", "admin.overview.siteControls"];
  const shortcutCards = tabs.filter((item) => item.name !== "overview").map((item, index) => ({
    ...item,
    metaKey: shortcutMetaKeys[index],
    className: [
      "from-rosegold/28 to-plum/20",
      "from-emerald/24 to-rosegold/12",
      "from-champagne/22 to-white/5",
      "from-white/14 to-rosegold/12",
      "from-plum/32 to-emerald/12"
    ][index]
  }));
  const bookingStatus = ["New", "Confirmed", "Completed", "Cancelled"].map((status) => {
    const count = data?.bookings.filter((booking) => booking.status === status).length ?? 0;
    return { status, count, percent: bookingTotal ? Math.round((count / bookingTotal) * 100) : 0 };
  });
  const servicePopularity = Object.entries(
    (data?.bookings ?? []).reduce<Record<string, number>>((acc, booking) => {
      acc[booking.selectedService] = (acc[booking.selectedService] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topServiceCount = Math.max(...servicePopularity.map((item) => item.count), 1);
  const customerGrowth = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index), 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const count = data?.customers.filter((customer) => {
      const created = new Date(customer.createdAt);
      return created.getMonth() === month && created.getFullYear() === year;
    }).length ?? 0;

    return { label: date.toLocaleDateString(language === "ar" ? "ar-EG" : "en", { month: "short" }), count };
  });
  const topCustomerGrowth = Math.max(...customerGrowth.map((item) => item.count), 1);
  const filteredCustomers = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();
    const fromTime = customerFrom ? new Date(`${customerFrom}T00:00:00`).getTime() : null;
    const toTime = customerTo ? new Date(`${customerTo}T23:59:59`).getTime() : null;

    return [...(data?.customers ?? [])]
      .filter((customer) => {
        const createdAt = new Date(customer.createdAt).getTime();
        const haystack = [customer.fullName, customer.phone, customer.whatsapp, customer.email, customer.address, customer.bookings?.[0]?.selectedService]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (query && !haystack.includes(query)) return false;
        if (fromTime && createdAt < fromTime) return false;
        if (toTime && createdAt > toTime) return false;
        if (customerContactFilter === "email" && !customer.email) return false;
        if (customerContactFilter === "whatsapp" && !customer.whatsapp) return false;
        if (customerContactFilter === "booked" && !(customer._count?.bookings ?? 0)) return false;
        if (customerContactFilter === "missing-email" && customer.email) return false;
        return true;
      })
      .sort((a, b) => {
        if (customerSort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (customerSort === "name") return a.fullName.localeCompare(b.fullName);
        if (customerSort === "bookings") return (b._count?.bookings ?? 0) - (a._count?.bookings ?? 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [customerContactFilter, customerFrom, customerSearch, customerSort, customerTo, data?.customers]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const method = product.id ? "PATCH" : "POST";
    const url = product.id ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    setSaving(false);
    if (response.ok) {
      setProduct(emptyProduct);
      await load();
    }
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const body = await response.json().catch(() => null);
    setUploading(false);
    if (body?.url) setProduct((current) => ({ ...current, image: body.url }));
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await load();
  }

  async function updateBooking(id: string, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await load();
  }

  async function confirmDeleteCustomer() {
    if (!deleteCustomer) return;
    setDeletingCustomer(true);
    const response = await fetch(`/api/admin/customers/${deleteCustomer.id}`, { method: "DELETE" });
    setDeletingCustomer(false);

    if (response.ok) {
      setDeleteCustomer(null);
      await load();
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const body = await response.json().catch(() => null);
    if (body?.settings?.primaryColor && body?.settings?.accentColor) {
      setPrimaryColor(body.settings.primaryColor);
      setAccentColor(body.settings.accentColor);
      applyBrandTheme(body.settings.primaryColor, body.settings.accentColor);
    }
    await load();
  }

  const sidebar = (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/12 bg-ink/88 shadow-[24px_0_80px_rgba(0,0,0,.28)] backdrop-blur-2xl transition-all duration-300 lg:sticky lg:top-0",
        sidebarOpen ? "w-80" : "w-24",
        !sidebarOpen && "max-lg:-translate-x-full"
      )}
    >
      <div className={cn("flex h-20 items-center border-b border-white/10 px-5", sidebarOpen ? "justify-between" : "justify-center")}>
        <div className="flex min-w-0 items-center gap-3">
          <div className={cn("grid size-11 shrink-0 place-items-center rounded-full bg-[var(--brand-accent)] text-ink shadow-glow", !sidebarOpen && "hidden")}>
            <Sparkles className="size-5" />
          </div>
          <div className={cn("min-w-0 transition", !sidebarOpen && "hidden")}>
            <p className="truncate font-display text-lg font-semibold text-pearl">{t("admin.sidebar.title")}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-rosegold">{t("admin.sidebar.subtitle")}</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen((value) => !value)}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-white/70 transition hover:bg-white/14"
          aria-label={sidebarOpen ? t("admin.sidebar.collapse") : t("admin.sidebar.expand")}
        >
          <Menu className="size-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = tab === item.name;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={cn(
                "group flex h-12 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold transition",
                active ? "bg-[var(--brand-accent)] text-ink shadow-glow" : "text-white/62 hover:bg-white/10 hover:text-white",
                !sidebarOpen && "justify-center px-0"
              )}
              title={!sidebarOpen ? item.label : undefined}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-5 shrink-0" />
              <span className={cn("truncate", !sidebarOpen && "hidden")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={logout}
          className={cn("flex h-11 w-full items-center gap-3 rounded-lg border border-white/12 bg-white/8 px-3 text-sm font-semibold text-white/70 transition hover:border-red-300/30 hover:bg-red-500/12 hover:text-red-100", !sidebarOpen && "justify-center px-0")}
        >
          <LogOut className="size-5" />
          <span className={cn(!sidebarOpen && "hidden")}>{t("admin.sidebar.logout")}</span>
        </button>
      </div>
    </aside>
  );

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <Card className="grid min-h-80 w-full max-w-md place-items-center p-8">
          <Loader2 className="size-9 animate-spin text-rosegold" />
          <p className="mt-4 text-sm text-white/60">{t("admin.loading")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,var(--brand-accent-soft),transparent_28%),linear-gradient(135deg,var(--brand-primary),#2b1322_55%,#0c1110)] lg:grid lg:grid-cols-[auto_1fr]"
      style={
        {
          "--brand-primary": primaryColor,
          "--brand-accent": accentColor,
          "--brand-accent-soft": `${accentColor}2e`
        } as CSSProperties
      }
    >
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {sidebar}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/58 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-white/80 transition hover:bg-white/14"
                aria-label={t("admin.openMenu")}
              >
                <Menu className="size-5 lg:hidden" />
                <PanelLeftOpen className="hidden size-5 lg:block" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rosegold">{t("admin.header.dashboard")}</p>
                <h1 className="truncate font-display text-2xl font-semibold text-pearl sm:text-4xl">{t("admin.header.title")}</h1>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <LanguageToggle />
              <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/70">
                <ActiveIcon className="size-4 text-rosegold" />
                {activeTab.label}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {tab === "overview" && (
            <div className="grid gap-6">
              <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rosegold">{t("admin.overview.fastAccess")}</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-pearl">{t("admin.overview.shortcuts")}</h2>
                  </div>
                  <div className="hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/60 sm:block">
                    {t("admin.overview.tracked", { n: bookingTotal })}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {shortcutCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href} className={cn("group relative overflow-hidden rounded-lg border border-white/12 bg-gradient-to-br p-5 shadow-glass transition hover:-translate-y-1 hover:border-rosegold/45", item.className)}>
                        <div className="absolute -right-8 -top-8 size-24 rounded-full bg-white/10 blur-2xl transition group-hover:bg-rosegold/20" />
                        <div className="relative flex items-start justify-between gap-4">
                          <div className="grid size-12 place-items-center rounded-lg border border-white/14 bg-white/10 text-pearl backdrop-blur">
                            <Icon className="size-6" />
                          </div>
                          <Send className="size-4 text-white/45 transition group-hover:translate-x-1 group-hover:text-rosegold" />
                        </div>
                        <h3 className="relative mt-5 font-display text-2xl font-semibold text-pearl">{item.label}</h3>
                        <p className="relative mt-1 text-sm text-white/58">{t(item.metaKey)}</p>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {overviewCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.labelKey} className={cn("relative overflow-hidden bg-gradient-to-br p-6", item.color)}>
                      <div className="absolute right-0 top-0 size-28 rounded-bl-full bg-white/8" />
                      <div className="relative flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">{t(item.labelKey)}</p>
                          <p className="mt-4 text-4xl font-semibold text-pearl">{item.value}</p>
                          <p className="mt-2 text-sm text-white/58">{item.detailKey ? t(item.detailKey, { n: item.detailN }) : t("admin.stat.featuredConfirmed")}</p>
                        </div>
                        <div className={cn("grid size-12 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/10", item.accent)}>
                          <Icon className="size-6" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
                <Card className="p-6">
                  <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rosegold">{t("admin.funnel.title")}</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-pearl">{t("admin.funnel.subtitle")}</h2>
                  </div>
                    <BarChart3 className="size-7 text-rosegold" />
                  </div>
                  <div className="mt-6 grid gap-4">
                    {bookingStatus.map((item) => (
                      <div key={item.status}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-semibold text-white/78">{item.status}</span>
                          <span className="text-white/48">{t("admin.funnel.requests", { n: item.count, p: item.percent })}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white/8">
                          <div className="h-full rounded-full bg-gradient-to-r from-rosegold via-champagne to-emerald transition-all" style={{ width: `${Math.max(item.percent, item.count ? 8 : 0)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rosegold">{t("admin.pulse.title")}</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-pearl">{t("admin.pulse.subtitle")}</h2>
                    </div>
                    <UserPlus className="size-7 text-rosegold" />
                  </div>
                  <div className="mt-7 flex h-56 items-end gap-3">
                    {customerGrowth.map((item) => (
                      <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                        <div className="flex h-40 w-full items-end rounded-lg border border-white/10 bg-white/[0.05] p-1">
                          <div className="w-full rounded-md bg-gradient-to-t from-rosegold to-champagne" style={{ height: `${Math.max((item.count / topCustomerGrowth) * 100, item.count ? 12 : 4)}%` }} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-pearl">{item.count}</p>
                          <p className="text-xs text-white/45">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              <section className="grid gap-6 xl:grid-cols-3">
                <Card className="p-6 xl:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rosegold">{t("admin.demand.title")}</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-pearl">{t("admin.demand.subtitle")}</h2>
                    </div>
                    <Gem className="size-7 text-rosegold" />
                  </div>
                  <div className="mt-6 grid gap-4">
                    {(servicePopularity.length ? servicePopularity : [{ service: t("admin.demand.noData"), count: 0 }]).map((item, index) => (
                      <div key={item.service} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.05] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="grid size-8 place-items-center rounded-full bg-rosegold/16 text-sm font-semibold text-rosegold">{index + 1}</span>
                            <p className="font-semibold text-pearl">{item.service}</p>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                            <div className="h-full rounded-full bg-gradient-to-r from-rosegold to-emerald" style={{ width: `${item.count ? Math.max((item.count / topServiceCount) * 100, 12) : 0}%` }} />
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-white/58">{t("admin.demand.bookings", { n: item.count })}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rosegold">{t("admin.upcoming.title")}</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-pearl">{t("admin.upcoming.subtitle")}</h2>
                    </div>
                    <Clock3 className="size-7 text-rosegold" />
                  </div>
                  <div className="mt-6 grid gap-3">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                        <p className="font-semibold text-pearl">{booking.customer.fullName}</p>
                        <p className="mt-1 text-sm text-white/56">{booking.selectedService}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-rosegold">{formatDate(booking.preferredDate, language)} - {booking.preferredTime}</p>
                      </div>
                    ))}
                    {!upcomingBookings.length && <p className="rounded-lg border border-white/10 bg-white/[0.05] p-4 text-sm text-white/58">{t("admin.upcoming.empty")}</p>}
                  </div>
                </Card>
              </section>
            </div>
          )}

          {tab === "products" && (
            <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
              <Card className="p-5">
                <h2 className="font-display text-3xl font-semibold">{product.id ? t("admin.products.editProduct") : t("admin.products.newProduct")}</h2>
                <form onSubmit={saveProduct} className="mt-5 grid gap-4">
                  <Input value={product.title} onChange={(event) => setProduct({ ...product, title: event.target.value })} placeholder={t("admin.products.title")} required />
                  <Input value={product.slug} onChange={(event) => setProduct({ ...product, slug: event.target.value })} placeholder={t("admin.products.slug")} />
                  <Input value={product.price || ""} onChange={(event) => setProduct({ ...product, price: event.target.value })} placeholder={t("admin.products.price")} />
                  <Textarea value={product.description} onChange={(event) => setProduct({ ...product, description: event.target.value })} placeholder={t("admin.products.description")} required />
                  <Input value={product.image} onChange={(event) => setProduct({ ...product, image: event.target.value })} placeholder={t("admin.products.imageUrl")} required />
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/8 px-4 py-4 text-sm text-white/70">
                    {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                    {t("admin.products.uploadImage")}
                    <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
                  </label>
                  <div className="flex gap-4 text-sm text-white/70">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={product.featured} onChange={(event) => setProduct({ ...product, featured: event.target.checked })} />
                      {t("admin.products.featured")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={product.active} onChange={(event) => setProduct({ ...product, active: event.target.checked })} />
                      {t("admin.products.active")}
                    </label>
                  </div>
                  <Button disabled={saving}>
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    {t("admin.products.save")}
                  </Button>
                </form>
              </Card>

              <div className="grid content-start gap-4">
                {data.products.map((item) => (
                  <Card key={item.id} className="grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto]">
                    <div className="relative h-28 overflow-hidden rounded-lg border border-white/12">
                      <Image src={item.image} alt={item.title} fill sizes="120px" className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/62">{item.description}</p>
                      <p className="mt-2 text-xs text-rosegold">{item.price || t("admin.products.noPrice")} - {item.active ? t("admin.products.active") : t("admin.products.hidden")}</p>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <Button size="icon" variant="secondary" onClick={() => setProduct({ ...item, price: item.price || "" })} aria-label={t("admin.products.editLabel")}>
                        <Eye className="size-4" />
                      </Button>
                      <Button size="icon" variant="danger" onClick={() => deleteProduct(item.id)} aria-label={t("admin.products.deleteLabel")}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tab === "bookings" && (
            <div className="grid gap-4">
              {data.bookings.map((booking) => (
                <Card key={booking.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{booking.customer.fullName}</h3>
                    <p className="mt-2 text-sm text-white/62">{booking.selectedService} - {formatDate(booking.preferredDate, language)} {t("admin.bookings.atTime")} {booking.preferredTime}</p>
                    <p className="mt-2 text-sm text-white/62">{booking.customer.phone} - {booking.customer.email || t("admin.bookings.noEmail")}</p>
                    {booking.notes && <p className="mt-3 text-sm text-white/52">{booking.notes}</p>}
                  </div>
                  <select value={booking.status} onChange={(event) => updateBooking(booking.id, event.target.value)} className="h-11 rounded-lg border border-white/12 bg-white/8 px-3 text-sm text-white [&_option]:bg-ink">
                    {["New", "Confirmed", "Completed", "Cancelled"].map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </Card>
              ))}
            </div>
          )}

          {tab === "customers" && (
            <div className="grid gap-6">
              <Card className="p-5">
                <div className="grid gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-rosegold">
                      <Filter className="size-4" />
                      {t("admin.customers.advancedFilter")}
                    </div>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-pearl">{t("admin.customers.title")}</h2>
                    <p className="mt-2 text-sm text-white/55">{t("admin.customers.shown", { shown: filteredCustomers.length, total: data.customers.length })}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                      <Input value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} placeholder={t("admin.customers.search")} className="pl-10" />
                    </div>
                    <Input type="date" value={customerFrom} onChange={(event) => setCustomerFrom(event.target.value)} aria-label={t("admin.customers.fromDate")} />
                    <Input type="date" value={customerTo} onChange={(event) => setCustomerTo(event.target.value)} aria-label={t("admin.customers.toDate")} />
                    <select value={customerContactFilter} onChange={(event) => setCustomerContactFilter(event.target.value)} className="h-12 rounded-xl border border-white/12 bg-white/8 px-4 text-sm text-white outline-none backdrop-blur focus:border-rosegold [&_option]:bg-ink">
                      <option value="all">{t("admin.customers.allContacts")}</option>
                      <option value="email">{t("admin.customers.hasEmail")}</option>
                      <option value="whatsapp">{t("admin.customers.hasWhatsApp")}</option>
                      <option value="booked">{t("admin.customers.hasBookings")}</option>
                      <option value="missing-email">{t("admin.customers.missingEmail")}</option>
                    </select>
                    <select value={customerSort} onChange={(event) => setCustomerSort(event.target.value)} className="h-12 rounded-xl border border-white/12 bg-white/8 px-4 text-sm text-white outline-none backdrop-blur focus:border-rosegold [&_option]:bg-ink">
                      <option value="newest">{t("admin.customers.newestFirst")}</option>
                      <option value="oldest">{t("admin.customers.oldestFirst")}</option>
                      <option value="name">{t("admin.customers.nameAZ")}</option>
                      <option value="bookings">{t("admin.customers.mostBookings")}</option>
                    </select>
                  </div>
                </div>
              </Card>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredCustomers.map((customer) => {
                  const initials = customer.fullName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const latestBooking = customer.bookings?.[0];

                  return (
                    <Card key={customer.id} className="relative overflow-hidden p-5">
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-rosegold/12" />
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="grid size-14 shrink-0 place-items-center rounded-full border border-rosegold/30 bg-rosegold/16 font-display text-xl font-semibold text-rosegold shadow-glow">
                            {initials || "C"}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-display text-2xl font-semibold text-pearl">{customer.fullName}</h3>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">{t("admin.customers.joined", { date: formatDate(customer.createdAt, language) })}</p>
                          </div>
                        </div>
                        <button onClick={() => setDeleteCustomer(customer)} className="grid size-10 shrink-0 place-items-center rounded-full border border-red-300/20 bg-red-500/10 text-red-100 transition hover:bg-red-500/20" aria-label={t("admin.customers.deleteLabel", { name: customer.fullName })}>
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="relative mt-5 grid gap-3 text-sm text-white/68">
                        <a href={`tel:${customer.phone}`} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 transition hover:border-rosegold/35">
                          <Phone className="size-4 text-rosegold" />
                          <span className="truncate">{customer.phone}</span>
                        </a>
                        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3">
                          <Mail className="size-4 text-rosegold" />
                          <span className="truncate">{customer.email || t("admin.customers.noEmailSaved")}</span>
                        </div>
                        {customer.whatsapp && (
                          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3">
                            <MessageSquare className="size-4 text-rosegold" />
                            <span className="truncate">{customer.whatsapp}</span>
                          </div>
                        )}
                      </div>

                      <div className="relative mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-white/38">{t("admin.customers.bookings")}</p>
                          <p className="mt-2 text-2xl font-semibold text-pearl">{customer._count?.bookings ?? 0}</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-white/38">{t("admin.customers.messages")}</p>
                          <p className="mt-2 text-2xl font-semibold text-pearl">{customer._count?.messages ?? 0}</p>
                        </div>
                      </div>

                      <div className="relative mt-5 rounded-lg border border-white/10 bg-white/[0.06] p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rosegold">
                          <Clock3 className="size-4" />
                          {t("admin.customers.latestActivity")}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/66">
                          {latestBooking ? `${latestBooking.selectedService} - ${latestBooking.status} ${t("admin.customers.forDate")} ${formatDate(latestBooking.preferredDate, language)}` : t("admin.customers.noHistory")}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {!filteredCustomers.length && (
                <Card className="p-8 text-center">
                  <h3 className="font-display text-3xl font-semibold text-pearl">{t("admin.customers.notFound")}</h3>
                  <p className="mt-2 text-sm text-white/55">{t("admin.customers.notFoundHint")}</p>
                </Card>
              )}
            </div>
          )}

          {tab === "messages" && (
            <div className="grid gap-4">
              {data.messages.map((message) => (
                <Card key={message.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{message.name}</h3>
                      <p className="mt-1 text-sm text-rosegold">{message.subject || t("admin.messages.contactMessage")} - {formatDate(message.createdAt, language)}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{message.status}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/65">{message.message}</p>
                </Card>
              ))}
            </div>
          )}

          {tab === "settings" && (
            <div className="grid gap-6">
              <Card className="relative overflow-hidden p-6">
                <div className="absolute right-0 top-0 size-40 rounded-bl-full bg-[var(--brand-accent-soft)] blur-xl" />
                <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">{t("admin.settings.websiteSettings")}</p>
                    <h2 className="mt-2 font-display text-4xl font-semibold text-pearl">{t("admin.settings.brandControl")}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">{t("admin.settings.description")}</p>
                  </div>
                  <div className="flex gap-3 rounded-lg border border-white/12 bg-white/8 p-3">
                    <div className="size-10 rounded-lg border border-white/20" style={{ backgroundColor: primaryColor }} />
                    <div className="size-10 rounded-lg border border-white/20" style={{ backgroundColor: accentColor }} />
                  </div>
                </div>
              </Card>

              <form onSubmit={saveSettings} className="grid gap-6">
                <Card className="p-5 sm:p-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    {settingsFields.map((field) => (
                      <label key={field.name} className="grid gap-2">
                        <span className="text-sm font-semibold text-pearl">{t(field.labelKey)}</span>
                        <Input name={field.name} type={field.type} defaultValue={(data.settings?.[field.name] as string) || ""} required={field.required} placeholder={t(field.labelKey)} />
                        <span className="text-xs leading-5 text-white/42">{t("admin.settings.fieldHint." + field.name)}</span>
                      </label>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 sm:p-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-pearl">{t("admin.settings.primaryColor")}</span>
                      <div className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/8 p-2">
                        <input type="color" value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border-0 bg-transparent p-0" aria-label={t("admin.settings.primaryColor")} />
                        <Input name="primaryColor" value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} aria-label={t("admin.settings.primaryColor")} />
                      </div>
                      <span className="text-xs leading-5 text-white/42">{t("admin.settings.primaryHint")}</span>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-pearl">{t("admin.settings.accentColor")}</span>
                      <div className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/8 p-2">
                        <input type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border-0 bg-transparent p-0" aria-label={t("admin.settings.accentColor")} />
                        <Input name="accentColor" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} aria-label={t("admin.settings.accentColor")} />
                      </div>
                      <span className="text-xs leading-5 text-white/42">{t("admin.settings.accentHint")}</span>
                    </label>
                  </div>
                </Card>

                <Card className="p-5 sm:p-6">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-pearl">{t("admin.settings.businessDescription")}</span>
                    <Textarea name="description" defaultValue={(data.settings?.description as string) || ""} placeholder={t("admin.settings.fieldHint.description")} required className="min-h-40" />
                    <span className="text-xs leading-5 text-white/42">{t("admin.settings.businessDescHint")}</span>
                  </label>
                </Card>

                <div className="flex justify-end pb-2">
                  <Button size="lg" className="shadow-glow">
                    <Check className="size-5" />
                    {t("admin.settings.save")}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {deleteCustomer && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/78 px-4 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="delete-customer-title">
          <Card className="w-full max-w-lg overflow-hidden">
            <div className="border-b border-white/10 bg-red-500/10 p-6">
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-red-500/16 text-red-100">
                  <ShieldAlert className="size-6" />
                </div>
                <div>
                  <h2 id="delete-customer-title" className="font-display text-3xl font-semibold text-pearl">{t("admin.deleteCustomer.title")}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    {t("admin.deleteCustomer.body", { name: deleteCustomer.fullName })}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 p-6 sm:grid-cols-2">
              <Button type="button" variant="secondary" disabled={deletingCustomer} onClick={() => setDeleteCustomer(null)}>
                {t("admin.deleteCustomer.cancel")}
              </Button>
              <Button type="button" variant="danger" disabled={deletingCustomer} onClick={confirmDeleteCustomer}>
                {deletingCustomer ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                {t("admin.deleteCustomer.delete")}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
