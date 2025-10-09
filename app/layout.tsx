import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { getRequestTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getRequestTenant();
  if (tenant === "stam") {
    return {
      title: "STAM",
      description: "Expériences créatives et immersives",
    };
  }
  return {
    title: "WEOKTO",
    description: "Plateforme sécurisée pour vos expériences digitales.",
  };
}

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
