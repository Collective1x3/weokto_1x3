import { SignInScreen } from "../shared/signin-screen";
import { getRequestTenant } from "@/lib/tenant";
import type { Metadata } from "next";

const COPY = {
  weokto: {
    title: "Connexion Weokto",
    description: "Accédez à votre espace sécurisé avec votre e-mail.",
  },
  stam: {
    title: "Connexion Stam",
    description: "Entrez dans l'espace Stam via lien magique ou code OTP.",
  },
} as const;

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getRequestTenant();
  const copy = COPY[tenant];
  return {
    title: copy.title,
    description: copy.description,
  };
}

export default async function SignInPage() {
  const tenant = await getRequestTenant();
  const copy = COPY[tenant];
  return (
    <SignInScreen
      site={tenant}
      title={copy.title}
      description={copy.description}
    />
  );
}
