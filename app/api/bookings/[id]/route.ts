import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = requireAuth(req);
  if (err) return err;
  const { id } = await params;
  await pool.query("DELETE FROM bookings WHERE id=$1", [id]);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = requireAuth(req);
  if (err) return err;
  const { id } = await params;
  const { handled } = await req.json();
  const { rows } = await pool.query(
    "UPDATE bookings SET handled=$1 WHERE id=$2 RETURNING *",
    [handled, id]
  );
  return NextResponse.json(rows[0]);
}
