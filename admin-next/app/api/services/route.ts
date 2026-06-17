import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

const FIELDS = ["name", "description", "icon", "active", "sort_order"];

export async function GET(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  try {
    const { rows } = await pool.query("SELECT * FROM services ORDER BY sort_order,id");
    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  try {
    const body = await req.json();
    const vals = FIELDS.map((f) => body[f] ?? null);
    const { rows } = await pool.query(
      `INSERT INTO services(${FIELDS.join(",")}) VALUES(${FIELDS.map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`,
      vals
    );
    return NextResponse.json(rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
