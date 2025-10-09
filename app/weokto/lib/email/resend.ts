import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend =
  apiKey && apiKey.length > 0 ? new Resend(apiKey) : undefined;

export function assertResendConfigured() {
  if (!resend) {
    throw new Error(
      "RESEND_API_KEY manquant. Configurez la clé Resend dans le fichier .env."
    );
  }
}
