import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

const FIELDS = ["question", "answer", "sort_order", "active"];

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = requireAuth(req);
  if (err) return err;
  const { id } = await params;
  const body = await req.json();
  const sets = FIELDS.map((f, i) => `${f}=$${i + 1}`).join(",");
  const vals = [...FIELDS.map((f) => body[f] ?? null), id];
  const { rows } = await pool.query(
    `UPDATE faq SET ${sets} WHERE id=$${FIELDS.length + 1} RETURNING *`,
    vals
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = requireAuth(req);
  if (err) return err;
  const { id } = await params;
  await pool.query("DELETE FROM faq WHERE id=$1", [id]);
  return NextResponse.json({ ok: true });
}
