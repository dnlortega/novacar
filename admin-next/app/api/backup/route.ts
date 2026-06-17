import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  try {
    const [cfg, svc, prc, tst, faq, bkn] = await Promise.all([
      pool.query("SELECT * FROM config"),
      pool.query("SELECT * FROM services ORDER BY sort_order,id"),
      pool.query("SELECT * FROM pricing ORDER BY id"),
      pool.query("SELECT * FROM testimonials ORDER BY id"),
      pool.query("SELECT * FROM faq ORDER BY sort_order,id"),
      pool.query("SELECT * FROM bookings ORDER BY created_at DESC"),
    ]);
    const backup = {
      exported_at:  new Date().toISOString(),
      config:       Object.fromEntries(cfg.rows.map((r: { key: string; value: string }) => [r.key, r.value])),
      services:     svc.rows,
      pricing:      prc.rows,
      testimonials: tst.rows,
      faq:          faq.rows,
      bookings:     bkn.rows,
    };
    const date = new Date().toISOString().split("T")[0];
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="novacar-backup-${date}.json"`,
      },
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
