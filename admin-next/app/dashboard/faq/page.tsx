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

interface FAQ { id: number; question: string; answer: string; active: boolean; sort_order: number; }
const EMPTY: Omit<FAQ, "id" | "sort_order"> = { question: "", answer: "", active: true };

export default function FAQPage() {
  const [items, setItems]     = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  async function load() {
    try { const d = await api.get<FAQ[]>("/faq"); setItems(d); } catch { toast.error("Erro ao carregar"); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(f: FAQ) { setEditing(f); setForm({ question: f.question, answer: f.answer, active: f.active }); setOpen(true); }

  async function save() {
    setSaving(true);
    try {
      if (editing) await api.put(`/faq/${editing.id}`, form);
      else         await api.post("/faq", form);
      toast.success(editing ? "FAQ atualizado!" : "FAQ criado!");
      setOpen(false); load();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Erro"); }
    finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!confirm("Excluir esta pergunta?")) return;
    try { await api.delete(`/faq/${id}`); toast.success("Excluído!"); load(); }
    catch { toast.error("Erro ao excluir"); }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">FAQ</h1><p className="text-muted-foreground mt-1">Perguntas frequentes exibidas no site</p></div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Nova pergunta</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Perguntas ({items.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Pergunta</TableHead><TableHead>Resposta</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Ações</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {items.map(f => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium max-w-xs">{f.question}</TableCell>
                    <TableCell className="text-muted-foreground max-w-sm truncate">{f.answer}</TableCell>
                    <TableCell><Badge variant={f.active ? "default" : "secondary"}>{f.active ? "Ativo" : "Inativo"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(f)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(f.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Editar FAQ" : "Nova pergunta"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Pergunta</Label><Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Resposta</Label><Textarea rows={4} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} /></div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="act" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-primary w-4 h-4" />
              <Label htmlFor="act">Visível no site</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !form.question}>{saving ? "Salvando…" : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
