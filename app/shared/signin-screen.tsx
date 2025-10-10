"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type SiteKey = "weokto" | "stam";

type SignInScreenProps = {
  site: SiteKey;
  title: string;
  description: string;
  redirectPath: string;
};

type Status =
  | { variant: "idle"; message: string }
  | { variant: "success"; message: string }
  | { variant: "error"; message: string };

export function SignInScreen({ site, title, description, redirectPath }: SignInScreenProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>({
    variant: "idle",
    message: "",
  });
  const [isMagicLinkPending, startMagicLinkTransition] = useTransition();
  const [isOtpPending, startOtpTransition] = useTransition();
  const router = useRouter();
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "";
  const authBasePath =
    site === "stam" ? "/api/auth/stam" : "/api/auth/weokto";

  const disabledMagicLink = useMemo(
    () => isMagicLinkPending || email.trim().length === 0,
    [email, isMagicLinkPending],
  );

  const disabledOtp = useMemo(
    () =>
      isOtpPending ||
      email.trim().length === 0 ||
      code.trim().length === 0 ||
      code.trim().length !== 6,
    [code, email, isOtpPending],
  );

  const handleRequestMagicLink = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ variant: "idle", message: "" });
    startMagicLinkTransition(async () => {
      try {
        const result = await signIn(
          "email",
          {
            email,
            redirect: false,
            callbackUrl: origin ? `${origin}${redirectPath}` : redirectPath,
          },
          { basePath: authBasePath },
        );

        if (result?.error) {
          setStatus({
            variant: "error",
            message:
              "Impossible d'envoyer l'e-mail pour le moment. Réessayez plus tard.",
          });
          return;
        }

        setStatus({
          variant: "success",
          message:
            "Lien magique et code OTP envoyés. Vérifiez votre boîte mail (valide 10 minutes).",
        });
        setCode("");
      } catch (error) {
        console.error(error);
        setStatus({
          variant: "error",
          message:
            "Une erreur inattendue est survenue. Réessayez dans un instant.",
        });
      }
    });
  };

  const handleValidateCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ variant: "idle", message: "" });

    startOtpTransition(async () => {
      try {
        const result = await signIn(
          "otp",
          {
            email,
            code,
            callbackUrl: origin ? `${origin}${redirectPath}` : redirectPath,
          },
          { basePath: authBasePath },
        );

        // Lorsque redirect est true (par défaut), signIn renvoie undefined.
        // En cas d'erreur, NextAuth redirige vers la page avec le paramètre ?error.
        if (result?.error) {
          setStatus({
            variant: "error",
            message: result.error,
          });
          return;
        }

        setStatus({
          variant: "success",
          message: "Redirection en cours...",
        });
        setCode("");
      } catch (error) {
        console.error(error);
        setStatus({
          variant: "error",
          message:
            "Impossible de valider le code. Vérifiez le code et réessayez.",
        });
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
        <header className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            {site === "weokto" ? "Weokto" : "Stam"}
          </p>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-white/60">{description}</p>
        </header>

        <section className="space-y-6">
          <form onSubmit={handleRequestMagicLink} className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/70">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <button
              type="submit"
              disabled={disabledMagicLink}
              className="w-full rounded-xl bg-white/90 px-4 py-2 text-base font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Envoyer le lien magique
            </button>
          </form>

          <div className="relative flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
            <span className="h-px flex-1 bg-white/10" />
            <span>ou</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleValidateCode} className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-white/70">
                Code OTP
              </label>
              <input
                id="otp"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-center text-lg font-semibold tracking-[0.4em] text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <button
              type="submit"
              disabled={disabledOtp}
              className="w-full rounded-xl border border-white/40 px-4 py-2 text-base font-semibold text-white transition hover:border-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Valider le code
            </button>
          </form>
        </section>

        {status.message ? (
          <p
            className={
              status.variant === "error"
                ? "text-sm text-red-400"
                : status.variant === "success"
                  ? "text-sm text-emerald-400"
                  : "text-sm text-white/60"
            }
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </main>
  );
}
