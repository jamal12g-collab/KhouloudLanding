import { NextResponse } from "next/server";
import { getSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}
