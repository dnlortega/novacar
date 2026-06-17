import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://novacarstudio.com.br";
  const today = new Date();
  return [
    { url: base, lastModified: today, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/#servicos`,    lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#precos`,      lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#depoimentos`, lastModified: today, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/#faq`,         lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/#contato`,     lastModified: today, changeFrequency: "monthly", priority: 0.9 },
  ];
}
