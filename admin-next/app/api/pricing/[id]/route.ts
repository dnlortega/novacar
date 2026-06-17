import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

const FIELDS = ["name", "price", "icon", "badge", "featured", "features", "active"];

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = requireAuth(req);
  if (err) return err;
  const { id } = await params;
  const body = await req.json();
  const sets = FIELDS.map((f, i) => `${f}=$${i + 1}`).join(",");
  const vals = [...FIELDS.map((f) => {
    if (f === "features") return JSON.stringify(body[f] ?? []);
    return body[f] ?? null;
  }), id];
  const { rows } = await pool.query(
    `UPDATE pricing SET ${sets} WHERE id=$${FIELDS.length + 1} RETURNING *`,
    vals
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = requireAuth(req);
  if (err) return err;
  const { id } = await params;
  await pool.query("DELETE FROM pricing WHERE id=$1", [id]);
  return NextResponse.json({ ok: true });
}
