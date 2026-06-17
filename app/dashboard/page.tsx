"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, Wrench, Star, HelpCircle, DollarSign, MousePointerClick, ClipboardList } from "lucide-react";
import { api } from "@/lib/api";

interface Stats {
  bookings: number; new_bookings: number; services: number;
  testimonials: number; faq: number; pricing: number;
  wa_clicks: number; form_submissions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>("/stats").then(setStats).catch(() => {});
  }, []);

  const cards = stats ? [
    { label: "Agendamentos",       value: stats.bookings,          icon: Calendar,          badge: stats.new_bookings > 0 ? `${stats.new_bookings} novos` : null },
    { label: "Serviços",           value: stats.services,          icon: Wrench,            badge: null },
    { label: "Depoimentos",        value: stats.testimonials,      icon: Star,              badge: null },
    { label: "FAQ",                value: stats.faq,               icon: HelpCircle,        badge: null },
    { label: "Planos de Preço",    value: stats.pricing,           icon: DollarSign,        badge: null },
    { label: "Cliques WhatsApp",   value: stats.wa_clicks,         icon: MessageSquare,     badge: null },
    { label: "Formulários",        value: stats.form_submissions,  icon: ClipboardList,     badge: null },
    { label: "Interações Totais",  value: stats.wa_clicks + stats.form_submissions, icon: MousePointerClick, badge: null },
  ] : [];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do NovaCar Studio Automotivo</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {!stats
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))
          : cards.map(({ label, value, icon: Icon, badge }) => (
              <Card key={label} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                  <Icon className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold">{value}</div>
                  {badge && <Badge variant="destructive" className="mt-1 text-xs">{badge}</Badge>}
                </CardContent>
              </Card>
            ))
        }
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Sobre o NovaCar</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>NovaCar Studio Automotivo — Bauru/SP</p>
          <p>Especializado em higienização de ar-condicionado, troca de óleo, revisão completa e mais.</p>
          <p className="text-primary font-medium">Gerencie todos os conteúdos do site pelo menu lateral.</p>
        </CardContent>
      </Card>
    </div>
  );
}
