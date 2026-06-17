import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { event } = await req.json();
  if (!["wa_clicks", "form_submissions"].includes(event)) {
    return NextResponse.json({ ok: false });
  }
  await pool.query(
    "INSERT INTO stats(key,value) VALUES($1,1) ON CONFLICT(key) DO UPDATE SET value=stats.value+1",
    [event]
  );
  return NextResponse.json({ ok: true });
}
