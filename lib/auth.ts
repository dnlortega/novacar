import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function getAuth(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    return verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest): NextResponse | null {
  if (!getAuth(req)) {
    return NextResponse.json({ error: "Token necessário" }, { status: 401 });
  }
  return null;
}
