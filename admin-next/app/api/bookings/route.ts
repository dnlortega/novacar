import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:admin@novacarstudio.com.br",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function GET(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  const { rows } = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { name, phone, service, message } = await req.json();
  if (!name || !phone) {
    return NextResponse.json({ error: "Nome e telefone obrigatórios" }, { status: 400 });
  }
  await pool.query(
    "INSERT INTO bookings(name,phone,service,message) VALUES($1,$2,$3,$4)",
    [name, phone, service, message]
  );
  await pool.query(
    "INSERT INTO stats(key,value) VALUES($1,1) ON CONFLICT(key) DO UPDATE SET value=stats.value+1",
    ["form_submissions"]
  );
  const { rows: subs } = await pool.query("SELECT * FROM push_subscriptions");
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({
          title: "📅 Novo Agendamento — NovaCar",
          body: `${name} quer agendar: ${service || "não especificado"}`,
          url: "/dashboard/bookings",
        })
      );
    } catch (e: unknown) {
      if ((e as { statusCode?: number }).statusCode === 410) {
        await pool.query("DELETE FROM push_subscriptions WHERE endpoint=$1", [sub.endpoint]);
      }
    }
  }
  return NextResponse.json({ ok: true });
}
