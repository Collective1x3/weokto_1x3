import { SITE_CONFIGS, type SiteKey } from "../auth/site-config";
import { assertResendConfigured, resend } from "./resend";
import { renderAuthEmail } from "./templates";

type AuthEmailKind = "login" | "signup";

type SendAuthEmailParams = {
  site: SiteKey;
  kind: AuthEmailKind;
  to: string;
  magicLink: string;
};

export async function sendAuthEmail(params: SendAuthEmailParams) {
  assertResendConfigured();
  const { site, kind, to, magicLink } = params;
  const { fromEnvVar } = SITE_CONFIGS[site];

  const from =
    process.env[fromEnvVar as keyof NodeJS.ProcessEnv] ??
    process.env.RESEND_DEFAULT_FROM;

  if (!from) {
    throw new Error(
      `Adresse d'envoi manquante pour ${site}. Renseignez ${fromEnvVar} ou RESEND_DEFAULT_FROM.`
    );
  }

  const payload = renderAuthEmail({ site, kind, to, magicLink });

  await resend!.emails.send({
    from,
    to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}
