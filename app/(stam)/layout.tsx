import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STAM - Communautés en ligne",
  description: "Plateforme pour clients finaux - Communautés, formations, et chat temps réel",
};

export default function StamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-stam-bg min-h-screen">
      {/* Header STAM à ajouter plus tard */}
      {children}
      {/* Footer STAM à ajouter plus tard */}
    </div>
  );
}
