import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;

  const [s, p, t, f, b, bn, st] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM services WHERE active=true"),
    pool.query("SELECT COUNT(*) FROM pricing  WHERE active=true"),
    pool.query("SELECT COUNT(*) FROM testimonials WHERE active=true"),
    pool.query("SELECT COUNT(*) FROM faq WHERE active=true"),
    pool.query("SELECT COUNT(*) FROM bookings"),
    pool.query("SELECT COUNT(*) FROM bookings WHERE handled=false AND created_at > NOW()-INTERVAL '7 days'"),
    pool.query("SELECT key,value FROM stats"),
  ]);
  const statsMap = Object.fromEntries(
    st.rows.map((r: { key: string; value: string }) => [r.key, Number(r.value)])
  );
  return NextResponse.json({
    services:         Number(s.rows[0].count),
    pricing:          Number(p.rows[0].count),
    testimonials:     Number(t.rows[0].count),
    faq:              Number(f.rows[0].count),
    bookings:         Number(b.rows[0].count),
    new_bookings:     Number(bn.rows[0].count),
    wa_clicks:        statsMap.wa_clicks || 0,
    form_submissions: statsMap.form_submissions || 0,
  });
}
