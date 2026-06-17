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
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Testimonial { id: number; name: string; role: string; text: string; rating: number; active: boolean; avatar: string; }
const EMPTY: Omit<Testimonial, "id"> = { name: "", role: "", text: "", rating: 5, active: true, avatar: "" };

export default function TestimonialsPage() {
  const [items, setItems]     = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  async function load() {
    try { const d = await api.get<Testimonial[]>("/testimonials"); setItems(d); } catch { toast.error("Erro ao carregar"); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(t: Testimonial) { setEditing(t); setForm({ name: t.name, role: t.role, text: t.text, rating: t.rating, active: t.active, avatar: t.avatar }); setOpen(true); }

  async function save() {
    setSaving(true);
    try {
      if (editing) await api.put(`/testimonials/${editing.id}`, form);
      else         await api.post("/testimonials", form);
      toast.success(editing ? "Depoimento atualizado!" : "Depoimento criado!");
      setOpen(false); load();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Erro"); }
    finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!confirm("Excluir este depoimento?")) return;
    try { await api.delete(`/testimonials/${id}`); toast.success("Excluído!"); load(); }
    catch { toast.error("Erro ao excluir"); }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Depoimentos</h1><p className="text-muted-foreground mt-1">Avaliações de clientes exibidas no site</p></div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Novo depoimento</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Depoimentos ({items.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Nome</TableHead><TableHead>Cargo</TableHead><TableHead>Avaliação</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Ações</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {items.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground">{t.role}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />)}</div>
                    </TableCell>
                    <TableCell><Badge variant={t.active ? "default" : "secondary"}>{t.active ? "Ativo" : "Inativo"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(t.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Editar depoimento" : "Novo depoimento"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nome do cliente</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Cargo/Contexto</Label><Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Ex: Cliente há 3 anos" /></div>
            <div className="space-y-2"><Label>Depoimento</Label><Textarea rows={3} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} /></div>
            <div className="space-y-2">
              <Label>Avaliação (estrelas)</Label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                    <Star className={`w-6 h-6 ${n <= form.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="act" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-primary w-4 h-4" />
              <Label htmlFor="act">Visível no site</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !form.name}>{saving ? "Salvando…" : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
