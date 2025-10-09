import { redirect } from "next/navigation";
import { SignInScreen } from "../shared/signin-screen";
import { getRequestTenant } from "@/lib/tenant";
import { getSessionForTenant } from "@/lib/auth/session";
import type { Metadata } from "next";

const COPY = {
  weokto: {
    title: "Connexion Weokto",
    description: "Accédez à votre espace sécurisé avec votre e-mail.",
    redirect: "/dashboard",
  },
  stam: {
    title: "Connexion Stam",
    description: "Entrez dans l'espace Stam via lien magique ou code OTP.",
    redirect: "/home",
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
  const session = await getSessionForTenant(tenant);
  if (session) {
    redirect(copy.redirect);
  }

  return (
    <SignInScreen
      site={tenant}
      title={copy.title}
      description={copy.description}
      redirectPath={copy.redirect}
    />
  );
}
