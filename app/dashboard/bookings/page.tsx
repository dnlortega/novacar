"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, MessageCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Booking {
  id: number; name: string; phone: string; service: string;
  date: string; message: string; created_at: string;
}

export default function BookingsPage() {
  const [items, setItems]     = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try { const d = await api.get<Booking[]>("/bookings"); setItems(d); } catch { toast.error("Erro ao carregar"); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: number) {
    if (!confirm("Excluir este agendamento?")) return;
    try { await api.delete(`/bookings/${id}`); toast.success("Excluído!"); load(); }
    catch { toast.error("Erro ao excluir"); }
  }

  function waLink(b: Booking) {
    const phone = b.phone.replace(/\D/g, "");
    const msg   = encodeURIComponent(`Olá ${b.name}! Recebemos seu agendamento de ${b.service} para ${b.date}. Confirmaremos em breve!`);
    return `https://wa.me/55${phone}?text=${msg}`;
  }

  function exportCSV() {
    const header = "ID,Nome,Telefone,Serviço,Data,Mensagem,Criado em";
    const rows   = items.map(b =>
      [b.id, b.name, b.phone, b.service, b.date, `"${b.message?.replace(/"/g,'""')}"`, new Date(b.created_at).toLocaleString("pt-BR")].join(",")
    );
    const csv  = [header, ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: `agendamentos-${Date.now()}.csv` });
    a.click(); URL.revokeObjectURL(url);
    toast.success("CSV exportado!");
  }

  function formatDate(d: string) {
    try { return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return d; }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Agendamentos</h1><p className="text-muted-foreground mt-1">Solicitações recebidas pelo site</p></div>
        <Button variant="outline" onClick={exportCSV} className="gap-2"><Download className="w-4 h-4" /> Exportar CSV</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Agendamentos ({items.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">Nenhum agendamento ainda</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Recebido</TableHead>
                  <TableHead className="w-28">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(b => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell>{b.phone}</TableCell>
                    <TableCell><Badge variant="outline">{b.service}</Badge></TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell className="max-w-50 truncate text-muted-foreground">{b.message}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(b.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <a href={waLink(b)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-green-500 hover:text-green-400 hover:bg-muted transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(b.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
