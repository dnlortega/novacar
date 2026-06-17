"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function PasswordPage() {
  const [current, setCurrent]   = useState("");
  const [next, setNext]         = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showAll, setShowAll]   = useState(false);
  const [saving, setSaving]     = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 6) { toast.error("Senha deve ter ao menos 6 caracteres"); return; }
    if (next !== confirm)  { toast.error("As senhas não coincidem"); return; }
    setSaving(true);
    try {
      await api.post("/change-password", { current, newPassword: next });
      toast.success("Senha alterada com sucesso!");
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao alterar senha");
    } finally { setSaving(false); }
  }

  return (
    <div className="p-8 space-y-6 max-w-md">
      <div>
        <h1 className="text-3xl font-bold">Alterar senha</h1>
        <p className="text-muted-foreground mt-1">Altere a senha de acesso ao painel</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Nova senha</CardTitle>
              <CardDescription>Mínimo de 6 caracteres</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            {[
              { id: "current", label: "Senha atual",        value: current, set: setCurrent },
              { id: "next",    label: "Nova senha",         value: next,    set: setNext },
              { id: "confirm", label: "Confirmar nova senha", value: confirm, set: setConfirm },
            ].map(({ id, label, value, set }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <div className="relative">
                  <Input
                    id={id}
                    type={showAll ? "text" : "password"}
                    value={value}
                    onChange={e => set(e.target.value)}
                    required
                    className="pr-10"
                    placeholder="••••••••"
                  />
                  {id === "current" && (
                    <button type="button" onClick={() => setShowAll(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                      {showAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={saving || !current || !next || !confirm}>
              {saving ? "Alterando…" : "Alterar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
