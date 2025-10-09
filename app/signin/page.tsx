import { SignInScreen } from "../shared/signin-screen";
import type { Metadata } from "next";

const COPY = {
  title: "Connexion Weokto",
  description: "Accédez à votre espace sécurisé avec votre e-mail.",
} as const;

export function generateMetadata(): Metadata {
  return {
    title: COPY.title,
    description: COPY.description,
  };
}

export default function SignInPage() {
  return (
    <SignInScreen
      site="weokto"
      title={COPY.title}
      description={COPY.description}
    />
  );
}
