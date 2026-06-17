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

interface Service { id: number; icon: string; title: string; description: string; active: boolean; sort_order: number; }
const EMPTY: Omit<Service, "id" | "sort_order"> = { icon: "🔧", title: "", description: "", active: true };

export default function ServicesPage() {
  const [items, setItems]   = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]     = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const d = await api.get<Service[]>("/services");
      setItems(d);
    } catch { toast.error("Erro ao carregar"); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(s: Service) { setEditing(s); setForm({ icon: s.icon, title: s.title, description: s.description, active: s.active }); setOpen(true); }

  async function save() {
    setSaving(true);
    try {
      if (editing) await api.put(`/services/${editing.id}`, form);
      else         await api.post("/services", form);
      toast.success(editing ? "Serviço atualizado!" : "Serviço criado!");
      setOpen(false); load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!confirm("Excluir este serviço?")) return;
    try { await api.delete(`/services/${id}`); toast.success("Excluído!"); load(); }
    catch { toast.error("Erro ao excluir"); }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Serviços</h1><p className="text-muted-foreground mt-1">Serviços exibidos na seção principal</p></div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Novo serviço</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Lista de serviços ({items.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Ícone</TableHead><TableHead>Título</TableHead><TableHead>Descrição</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Ações</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {items.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="text-2xl">{s.icon}</TableCell>
                    <TableCell className="font-medium">{s.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{s.description}</TableCell>
                    <TableCell><Badge variant={s.active ? "default" : "secondary"}>{s.active ? "Ativo" : "Inativo"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(s.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Editar serviço" : "Novo serviço"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Ícone (emoji)</Label><Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🔧" /></div>
            <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nome do serviço" /></div>
            <div className="space-y-2"><Label>Descrição</Label><Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-primary w-4 h-4" />
              <Label htmlFor="active">Ativo (visível no site)</Label>
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
