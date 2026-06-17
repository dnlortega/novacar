"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Settings, Wrench, DollarSign,
  Star, HelpCircle, Calendar, Lock, LogOut,
  ExternalLink, Download, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/dashboard/config",       label: "Configurações",icon: Settings },
  { href: "/dashboard/services",     label: "Serviços",     icon: Wrench },
  { href: "/dashboard/pricing",      label: "Preços",       icon: DollarSign },
  { href: "/dashboard/testimonials", label: "Depoimentos",  icon: Star },
  { href: "/dashboard/faq",          label: "FAQ",          icon: HelpCircle },
  { href: "/dashboard/bookings",     label: "Agendamentos", icon: Calendar, badge: true },
  { href: "/dashboard/password",     label: "Senha",        icon: Lock },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [newBookings, setNewBookings] = useState(0);
  const [session, setSession]         = useState("--:--");

  useEffect(() => {
    const token = localStorage.getItem("nc_token");
    if (!token) { router.push("/login"); return; }

    // Timer de sessão
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const tick = () => {
        const rem = exp * 1000 - Date.now();
        if (rem <= 0) { logout(); return; }
        const m = Math.floor(rem / 60000);
        const s = Math.floor((rem % 60000) / 1000);
        setSession(`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
        if (rem < 300_000 && rem > 299_000) toast.warning("Sessão expira em 5 minutos");
      };
      tick();
      const t = setInterval(tick, 1000);
      return () => clearInterval(t);
    } catch { logout(); }
  }, []);

  useEffect(() => {
    api.get<{ new_bookings: number }>("/stats")
      .then(s => setNewBookings(s.new_bookings))
      .catch(() => {});
  }, [pathname]);

  function logout() {
    localStorage.removeItem("nc_token");
    router.push("/login");
  }

  async function downloadBackup() {
    const token = localStorage.getItem("nc_token") || "";
    const res = await fetch("/api/backup", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { toast.error("Erro ao gerar backup"); return; }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), {
      href: url, download: `novacar-backup-${new Date().toISOString().split("T")[0]}.json`,
    });
    a.click(); URL.revokeObjectURL(url);
    toast.success("Backup baixado!");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex flex-col w-60 shrink-0 border-r border-border bg-sidebar">
        <div className="px-6 py-5">
          <span className="text-xl font-black tracking-tight">
            Nova<span className="text-primary">Car</span>
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">Painel Admin</p>
        </div>
        <Separator />
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    active && "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{label}</span>
                  {badge && newBookings > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                      {newBookings}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
        <Separator />
        <div className="p-3 space-y-2">
          {/* Timer sessão */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Bell className="w-3.5 h-3.5" />
              Sessão expira em
            </div>
            <span className="text-xs font-mono font-bold text-primary">{session}</span>
          </div>
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={downloadBackup}>
            <Download className="w-3.5 h-3.5" /> Backup JSON
          </Button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full gap-2 h-7 px-2.5 text-xs rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Ver site
          </a>
          <Button variant="ghost" size="sm" className="w-full gap-2 text-xs text-destructive hover:text-destructive" onClick={logout}>
            <LogOut className="w-3.5 h-3.5" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
