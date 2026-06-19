import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} dark antialiased min-h-screen bg-background text-foreground`}>
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}
