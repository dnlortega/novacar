import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { pool } from "@/lib/db";

const FIELDS = ["author", "car", "rating", "text", "active"];

export async function GET(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  const { rows } = await pool.query("SELECT * FROM testimonials ORDER BY id");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;
  const body = await req.json();
  const vals = FIELDS.map((f) => body[f] ?? null);
  const { rows } = await pool.query(
    `INSERT INTO testimonials(${FIELDS.join(",")}) VALUES(${FIELDS.map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`,
    vals
  );
  return NextResponse.json(rows[0]);
}
