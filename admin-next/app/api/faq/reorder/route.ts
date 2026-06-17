import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  const items = await req.json();
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    for (const { id, sort_order } of items)
      await c.query("UPDATE faq SET sort_order=$1 WHERE id=$2", [sort_order, id]);
    await c.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    await c.query("ROLLBACK");
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  } finally {
    c.release();
  }
}
