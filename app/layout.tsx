import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEOKTO & STAM - Plateforme complète",
  description: "Plateformes WEOKTO (Affiliés & Guildes) et STAM (Communautés en ligne)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
