import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  const { endpoint, keys } = await req.json();
  if (!endpoint || !keys) {
    return NextResponse.json({ error: "Subscription inválida" }, { status: 400 });
  }
  await pool.query(
    "INSERT INTO push_subscriptions(endpoint,p256dh,auth) VALUES($1,$2,$3) ON CONFLICT(endpoint) DO UPDATE SET p256dh=$2,auth=$3",
    [endpoint, keys.p256dh, keys.auth]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  const { endpoint } = await req.json();
  await pool.query("DELETE FROM push_subscriptions WHERE endpoint=$1", [endpoint]);
  return NextResponse.json({ ok: true });
}
