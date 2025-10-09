import { SITE_CONFIGS, type SiteKey } from "../auth/site-config";

type AuthEmailKind = "login" | "signup";

type AuthEmailPayload = {
  site: SiteKey;
  kind: AuthEmailKind;
  to: string;
  magicLink: string;
  otpCode: string;
};

const accentBySite: Record<SiteKey, string> = {
  weokto: "#6366f1",
  stam: "#f97316",
};

const loginSubjects: Record<SiteKey, string> = {
  weokto: "Connexion sécurisée à WEOKTO",
  stam: "Connexion sécurisée à STAM",
};

const signupSubjects: Record<SiteKey, string> = {
  weokto: "Bienvenue sur WEOKTO",
  stam: "Bienvenue sur STAM",
};

export function renderAuthEmail(payload: AuthEmailPayload) {
  const { site, kind, magicLink, otpCode } = payload;
  const brand = SITE_CONFIGS[site].name;
  const accent = accentBySite[site];
  const isSignup = kind === "signup";

  const subject = isSignup ? signupSubjects[site] : loginSubjects[site];

  const html = `
  <table style="width:100%;background:#0f172a;padding:40px 0;font-family:Helvetica,Arial,sans-serif;">
    <tr>
      <td align="center">
        <table style="max-width:520px;width:100%;background:#0b1220;border-radius:24px;padding:40px;color:#e2e8f0;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="display:inline-block;padding:8px 18px;border-radius:999px;background:${accent}1a;color:${accent};font-size:11px;letter-spacing:6px;text-transform:uppercase;">
                ${brand}
              </span>
            </td>
          </tr>
          <tr>
            <td style="font-size:24px;font-weight:600;padding-bottom:16px;text-align:center;">
              ${isSignup ? "Bienvenue !" : "Connexion sécurisée"}
            </td>
          </tr>
          <tr>
            <td style="font-size:15px;line-height:1.7;padding-bottom:28px;text-align:center;color:#cbd5f5;">
              ${isSignup ? `Votre compte ${brand} est presque prêt.` : `Utilisez l'une des méthodes ci-dessous pour vous connecter.`}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${magicLink}" style="display:inline-block;padding:14px 28px;background:${accent};color:#0b1220;font-weight:600;border-radius:16px;text-decoration:none;">
                ${isSignup ? "Activer mon compte" : "Ouvrir le lien magique"}
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:#0f172a;border-radius:18px;padding:20px 24px;text-align:center;">
              <p style="margin:0 0 12px 0;font-size:13px;color:#94a3b8;text-transform:uppercase;letter-spacing:4px;">Code OTP</p>
              <p style="margin:0;font-size:28px;font-weight:700;letter-spacing:12px;color:#f9fafb;">${otpCode}</p>
              <p style="margin:16px 0 0 0;font-size:13px;color:#64748b;">
                Le code expire dans 10 minutes. Ne le partagez jamais.
              </p>
            </td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#475569;padding-top:32px;text-align:center;">
              Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;

  const text = `${isSignup ? "Bienvenue" : "Connexion"} ${brand}

Ouvrez le lien magique : ${magicLink}

Ou saisissez le code OTP : ${otpCode}
(valide 10 minutes)
`;

  return { subject, html, text };
}
