import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const err = requireAuth(req);
  if (err) return err;

  const { current, newPassword } = await req.json();
  if (current !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
  }
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Nova senha deve ter mínimo 6 caracteres" }, { status: 400 });
  }
  process.env.ADMIN_PASSWORD = newPassword;
  return NextResponse.json({ ok: true, message: "Senha alterada. Reiniciar o servidor restaura a senha do .env." });
}
