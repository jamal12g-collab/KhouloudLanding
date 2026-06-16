import { NextResponse } from "next/server";
import { setAdminSession, validateAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.toString() || "";
  const password = body?.password?.toString() || "";

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await setAdminSession(email);
  return NextResponse.json({ ok: true });
}
