import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Lista de Tarefas",
  description:
    "Lista de tarefas simples e leve: adicione, conclua e organize o que precisa fazer. Marque importantes, filtre e acompanhe seu progresso. Offline e sem cadastro.",
  applicationName: "Lista de Tarefas",
  openGraph: {
    title: "Lista de Tarefas",
    description: "Organize o que precisa fazer. Simples, offline e sem cadastro.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2552c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
