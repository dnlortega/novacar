import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  const { rows } = await pool.query("SELECT key,value FROM config");
  return NextResponse.json(
    Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]))
  );
}

export async function PUT(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  const body = await req.json();
  for (const [k, v] of Object.entries(body)) {
    await pool.query(
      "INSERT INTO config(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2",
      [k, String(v)]
    );
  }
  return NextResponse.json({ ok: true });
}
