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
import {
  Building2, Zap, BarChart3, Info, Megaphone,
  Car, MapPin, Search, Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ConfigData = Record<string, string>;

const CAR_TYPES = [
  { id: "sedan",     label: "Sedã",       desc: "Clássico com porta-malas" },
  { id: "suv",       label: "SUV",        desc: "Alto e espaçoso" },
  { id: "hatchback", label: "Hatchback",  desc: "Compacto e versátil" },
  { id: "pickup",    label: "Pickup",     desc: "Cabine + caçamba" },
  { id: "sports",    label: "Esportivo",  desc: "Baixo e veloz" },
];

interface FieldDef { key: string; label: string; rows?: number; }
interface SectionDef {
  id: string; title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  fields: FieldDef[];
}

const SECTIONS: SectionDef[] = [
  {
    id: "empresa", title: "Empresa", icon: Building2,
    description: "Dados gerais da oficina exibidos no site",
    fields: [
      { key: "name",           label: "Nome da empresa" },
      { key: "phone",          label: "Telefone exibido (ex: (14) 9 9823-1408)" },
      { key: "whatsapp",       label: "WhatsApp com DDI (ex: 5514998231408)" },
      { key: "address",        label: "Endereço completo" },
      { key: "hours_weekdays", label: "Horário de funcionamento (Seg–Sex)" },
      { key: "instagram",      label: "Instagram (ex: @novacarstudio)" },
      { key: "maps_url",       label: "Link Google Maps (botão 'Ver no Maps')" },
      { key: "maps_embed",     label: "URL embed do Maps (src do iframe)", rows: 2 },
    ],
  },
  {
    id: "hero", title: "Hero", icon: Zap,
    description: "Primeira seção que o visitante vê ao abrir o site",
    fields: [
      { key: "hero_badge",           label: "Badge — texto acima do título (ex: Mecânica em Bauru/SP)" },
      { key: "hero_title_before",    label: "Título — texto antes do destaque (ex: Seu carro merece a)" },
      { key: "hero_title_highlight", label: "Título — palavra em dourado (ex: melhor mecânica)" },
      { key: "hero_subtitle",        label: "Subtítulo / descrição", rows: 3 },
      { key: "hero_cta_text",        label: "Botão principal — texto (ex: Agendar Agora)" },
    ],
  },
  {
    id: "stats", title: "Contadores", icon: BarChart3,
    description: "Números animados no hero (contagem automática ao rolar a página)",
    fields: [
      { key: "stat_cars",        label: "Carros atendidos — número (ex: 500)" },
      { key: "stat_cars_label",  label: "Carros atendidos — label (ex: Carros atendidos)" },
      { key: "stat_years",       label: "Anos de experiência — número (ex: 5)" },
      { key: "stat_years_label", label: "Anos de experiência — label (ex: De experiência)" },
    ],
  },
  {
    id: "sobre", title: "Sobre", icon: Info,
    description: "Seção 'Quem somos' — textos sobre a oficina",
    fields: [
      { key: "about_title", label: "Título da seção Sobre" },
      { key: "about_text1", label: "Parágrafo 1", rows: 3 },
      { key: "about_text2", label: "Parágrafo 2", rows: 3 },
    ],
  },
  {
    id: "cta", title: "Banner CTA", icon: Megaphone,
    description: "Faixa de chamada para ação exibida antes do FAQ",
    fields: [
      { key: "cta_title",    label: "Título (ex: Pronto para cuidar do seu carro?)" },
      { key: "cta_subtitle", label: "Subtítulo (ex: Agende uma avaliação gratuita...)" },
      { key: "cta_btn_text", label: "Texto do botão (ex: Falar no WhatsApp)" },
    ],
  },
  {
    id: "contato", title: "Contato Extra", icon: MapPin,
    description: "Links e redes sociais exibidos na seção de contato",
    fields: [
      { key: "tagline", label: "Slogan/tagline da empresa" },
      { key: "about",   label: "Texto 'sobre' resumido (usado internamente)", rows: 2 },
    ],
  },
  {
    id: "seo", title: "SEO", icon: Search,
    description: "Metatags para Google, WhatsApp e redes sociais",
    fields: [
      { key: "seo_title",       label: "Título da página (<title>)" },
      { key: "seo_description", label: "Meta description (aparece no Google)", rows: 2 },
    ],
  },
];

export default function ConfigPage() {
  const [data, setData]     = useState<ConfigData>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get<ConfigData>("/config")
      .then(d => { setData(d); setLoaded(true); })
      .catch(() => toast.error("Erro ao carregar configurações"));
  }, []);

  const set = (key: string, val: string) =>
    setData(d => ({ ...d, [key]: val }));

  async function save() {
    setSaving(true);
    try {
      await api.put("/config", data);
      toast.success("Configurações salvas! O site atualiza em segundos.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const selectedCar = data.car_type || "sedan";

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Todas as opções do site em um lugar — salve no final
          </p>
        </div>
        <Button onClick={save} disabled={saving || !loaded} size="lg" className="gap-2 shrink-0">
          <Save className="w-4 h-4" />
          {saving ? "Salvando…" : "Salvar tudo"}
        </Button>
      </div>

      {!loaded ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Seções genéricas */}
          {SECTIONS.map(section => (
            <Card key={section.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <section.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base leading-tight">{section.title}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <Label htmlFor={f.key} className="text-xs text-muted-foreground font-medium">
                      {f.label}
                    </Label>
                    {f.rows ? (
                      <Textarea
                        id={f.key}
                        rows={f.rows}
                        value={data[f.key] || ""}
                        onChange={e => set(f.key, e.target.value)}
                        className="resize-none text-sm"
                      />
                    ) : (
                      <Input
                        id={f.key}
                        value={data[f.key] || ""}
                        onChange={e => set(f.key, e.target.value)}
                        className="text-sm"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Carro animado */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base leading-tight">Carro Animado</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Tipo de veículo exibido na faixa animada do site
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {CAR_TYPES.map(car => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => set("car_type", car.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 text-left transition-all hover:bg-muted/40",
                      selectedCar === car.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className={cn(
                      "font-semibold text-sm",
                      selectedCar === car.id ? "text-primary" : ""
                    )}>
                      {car.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                      {car.desc}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botão final */}
          <div className="flex justify-end pb-8">
            <Button onClick={save} disabled={saving} size="lg" className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Salvando…" : "Salvar tudo"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
