"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Config {
  id?: number; name: string; phone: string; whatsapp: string;
  address: string; hours: string; about: string; tagline: string;
}

export default function ConfigPage() {
  const [data, setData] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Config>("/config").then(setData).catch(() => toast.error("Erro ao carregar configurações"));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      await api.put("/config", data);
      toast.success("Configurações salvas!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const fields: { key: keyof Config; label: string; type?: string; rows?: number }[] = [
    { key: "name",      label: "Nome da empresa" },
    { key: "phone",     label: "Telefone" },
    { key: "whatsapp",  label: "WhatsApp (número completo com DDI)" },
    { key: "address",   label: "Endereço completo" },
    { key: "hours",     label: "Horário de funcionamento" },
    { key: "tagline",   label: "Slogan/tagline" },
    { key: "about",     label: "Sobre a empresa", rows: 4 },
  ];

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">Dados gerais da empresa exibidos no site</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Informações da empresa</CardTitle>
          <CardDescription>Alterações são refletidas no site em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          {!data ? (
            <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <form onSubmit={save} className="space-y-4">
              {fields.map(({ key, label, rows }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  {rows ? (
                    <Textarea
                      id={key}
                      rows={rows}
                      value={(data[key] as string) || ""}
                      onChange={e => setData(d => d ? { ...d, [key]: e.target.value } : d)}
                    />
                  ) : (
                    <Input
                      id={key}
                      value={(data[key] as string) || ""}
                      onChange={e => setData(d => d ? { ...d, [key]: e.target.value } : d)}
                    />
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full mt-2" disabled={saving}>
                {saving ? "Salvando…" : "Salvar configurações"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
