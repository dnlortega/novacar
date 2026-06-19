import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import DashboardClientLayout from "./_layout-client";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Admin — NovaCar Studio",
  description: "Painel de controle NovaCar Studio Automotivo",
  robots: "noindex, nofollow",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} dark antialiased`}>
      <DashboardClientLayout>{children}</DashboardClientLayout>
      <Toaster richColors position="top-right" />
    </div>
  );
}
