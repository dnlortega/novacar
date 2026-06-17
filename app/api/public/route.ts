import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const [cfg, svc, prc, tst, faq] = await Promise.all([
      pool.query("SELECT key,value FROM config"),
      pool.query("SELECT * FROM services WHERE active=true ORDER BY sort_order,id"),
      pool.query("SELECT * FROM pricing  WHERE active=true ORDER BY id"),
      pool.query("SELECT * FROM testimonials WHERE active=true ORDER BY id"),
      pool.query("SELECT * FROM faq      WHERE active=true ORDER BY sort_order,id"),
    ]);
    return NextResponse.json({
      config:       Object.fromEntries(cfg.rows.map((r: { key: string; value: string }) => [r.key, r.value])),
      services:     svc.rows,
      pricing:      prc.rows,
      testimonials: tst.rows,
      faq:          faq.rows,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
