import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WEOKTO - Affiliation & Guildes",
  description: "Plateforme pour affiliés et créateurs - Marketplace de produits digitaux",
};

export default function WeoktoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-weokto-darker min-h-screen">
      {/* Header WEOKTO à ajouter plus tard */}
      {children}
      {/* Footer WEOKTO à ajouter plus tard */}
    </div>
  );
}
