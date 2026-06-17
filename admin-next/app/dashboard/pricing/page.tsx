"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Plan { id: number; title: string; price: string; description: string; features: string; highlighted: boolean; badge: string; }
const EMPTY: Omit<Plan, "id"> = { title: "", price: "", description: "", features: "", highlighted: false, badge: "" };

export default function PricingPage() {
  const [items, setItems]     = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  async function load() {
    try { const d = await api.get<Plan[]>("/pricing"); setItems(d); } catch { toast.error("Erro ao carregar"); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew()  { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p: Plan) { setEditing(p); setForm({ title: p.title, price: p.price, description: p.description, features: p.features, highlighted: p.highlighted, badge: p.badge }); setOpen(true); }

  async function save() {
    setSaving(true);
    try {
      if (editing) await api.put(`/pricing/${editing.id}`, form);
      else         await api.post("/pricing", form);
      toast.success(editing ? "Plano atualizado!" : "Plano criado!");
      setOpen(false); load();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Erro"); }
    finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!confirm("Excluir este plano?")) return;
    try { await api.delete(`/pricing/${id}`); toast.success("Excluído!"); load(); }
    catch { toast.error("Erro ao excluir"); }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Preços</h1><p className="text-muted-foreground mt-1">Planos e valores exibidos no site</p></div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Novo plano</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Planos ({items.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Título</TableHead><TableHead>Preço</TableHead><TableHead>Badge</TableHead><TableHead>Destaque</TableHead><TableHead className="w-24">Ações</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {items.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="text-primary font-bold">{p.price}</TableCell>
                    <TableCell>{p.badge && <Badge variant="outline">{p.badge}</Badge>}</TableCell>
                    <TableCell>{p.highlighted && <Badge className="bg-primary text-primary-foreground">Destaque</Badge>}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar plano" : "Novo plano"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Título do plano</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Revisão Completa" /></div>
            <div className="space-y-2"><Label>Preço</Label><Input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Ex: R$ 350" /></div>
            <div className="space-y-2"><Label>Badge (opcional)</Label><Input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Ex: Mais popular" /></div>
            <div className="space-y-2"><Label>Descrição</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Recursos (um por linha)</Label><Textarea rows={4} value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder={"Troca de óleo\nFiltro de ar\nVerificação de freios"} /></div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="hl" checked={form.highlighted} onChange={e => setForm(f => ({ ...f, highlighted: e.target.checked }))} className="accent-primary w-4 h-4" />
              <Label htmlFor="hl">Plano em destaque</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !form.title}>{saving ? "Salvando…" : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
