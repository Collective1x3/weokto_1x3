"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  EnvelopeSimple,
  GearSix,
  LinkSimple,
  PencilSimple,
  SignOut,
  WarningCircle
} from "phosphor-react";
import { useUserSession } from '@/contexts/UserSessionContext';

type SettingsSection = {
  id: string
  label: string
};

const NAV_SECTIONS: SettingsSection[] = [
  { id: "general", label: "[GENERAL]" },
  { id: "account", label: "[COMPTE]" },
  { id: "danger", label: "[DANGER]" }
];

export default function SettingsPage() {
  const { user, setUser: setSessionUser } = useUserSession();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(NAV_SECTIONS[0]?.id ?? "general");

  useEffect(() => {
    if (user?.email) {
      setEditedEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    const onScroll = () => {
      const positions = NAV_SECTIONS.map((section) => {
        const element = document.getElementById(section.id);
        if (!element) return { id: section.id, top: Infinity };
        const rect = element.getBoundingClientRect();
        return { id: section.id, top: Math.abs(rect.top) };
      });
      const closest = positions.reduce((acc, val) => (val.top < acc.top ? val : acc));
      if (closest.id !== activeSection) {
        setActiveSection(closest.id);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeSection]);

  const copyUserId = async () => {
    if (!user?.id) return;
    try {
      await navigator.clipboard.writeText(user.id);
    } catch (error) {
      console.error("Unable to copy user id", error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const handleEmailUpdate = async () => {
    if (!editedEmail) return;
    setSavingEmail(true);
    try {
      const response = await fetch("/api/auth/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: editedEmail })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionUser((prev) => {
          if (!prev) {
            return {
              id: data.user.id,
              email: data.user.email,
              displayName: data.user.displayName ?? null,
              bio: null,
              publicSlug: null,
              guildId: null,
              userType: null,
              createdAt: null,
              lastLoginAt: null
            };
          }
          return {
            ...prev,
            email: data.user.email ?? prev.email,
            displayName: data.user.displayName ?? prev.displayName
          };
        });
        setEditedEmail(data.user.email);
        setIsEditingEmail(false);
      }
    } catch (error) {
      console.error("Unable to update email", error);
    } finally {
      setSavingEmail(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-sm text-gray-500">
        {"> CHARGEMENT_PARAMÈTRES..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-16 font-mono text-[#B794F4]">
      <div className="mx-auto max-w-5xl">
        <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center border border-purple-400 bg-purple-400/10 text-purple-400 rounded">
                <GearSix size={26} weight="bold" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Paramètres du compte</h1>
                <p className="text-xs text-gray-400">
                  Optimise ta base : email, liaisons et sécurité regroupés sur une seule surface.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {NAV_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`flex items-center gap-2 border rounded px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    activeSection === section.id
                      ? "border-[#B794F4] bg-[#B794F4] text-black"
                      : "border-[#B794F4]/30 bg-transparent text-[#B794F4] hover:border-[#B794F4] hover:bg-purple-400/10"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          <section id="general" className="scroll-mt-24">
            <header className="flex items-center gap-3 text-xs uppercase tracking-wide text-purple-400">
              <EnvelopeSimple size={16} />
              [EMAIL]
            </header>

            <div className="mt-4 border border-[#B794F4]/20 bg-[#1e1e1e] rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white">Adresse email principale</p>
                    <p className="text-xs text-gray-400">Utilisée pour les magic links et notifications.</p>
                  </div>
                  {!isEditingEmail && (
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(true)}
                      className="flex items-center gap-2 rounded border border-[#B794F4]/30 px-3 py-1 text-xs text-[#B794F4] transition-all duration-200 hover:border-[#B794F4]"
                    >
                      <PencilSimple size={14} />
                      Modifier
                    </button>
                  )}
                </div>

                {isEditingEmail ? (
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(event) => setEditedEmail(event.target.value)}
                      className="w-full border border-[#B794F4]/30 bg-[#1e1e1e] rounded px-3 py-2 text-sm text-white outline-none transition-all duration-200 focus:border-[#B794F4]"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleEmailUpdate}
                        disabled={savingEmail}
                        className="flex-1 rounded border border-purple-400/40 px-3 py-2 text-xs text-purple-400 transition-all duration-200 hover:bg-purple-400/10 disabled:opacity-50"
                      >
                        {savingEmail ? "Mise à jour..." : "Valider"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingEmail(false);
                          setEditedEmail(user?.email ?? "");
                        }}
                        className="flex-1 rounded border border-[#B794F4]/30 px-3 py-2 text-xs text-[#B794F4] transition-all duration-200 hover:border-[#B794F4]"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-[#B794F4]/20 bg-[#1e1e1e] rounded px-4 py-3 text-sm text-white">
                    <span>{user?.email}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="account" className="scroll-mt-24">
            <header className="flex items-center gap-3 text-xs uppercase tracking-wide text-purple-400">
              <LinkSimple size={16} />
              [COMPTE]
            </header>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="border border-[#B794F4]/20 bg-[#1e1e1e] rounded-lg p-6">
                <p className="text-sm text-white">Identifiant unique</p>
                <p className="mt-1 text-xs text-gray-400">
                  Conserve cet identifiant si tu contactes le support ou veux partager ton profil public.
                </p>

                <div className="mt-4 flex items-center justify-between border border-[#B794F4]/20 bg-[#1e1e1e] rounded px-3 py-2 text-xs">
                  <code className="text-purple-400">{user?.id}</code>
                  <button
                    type="button"
                    onClick={copyUserId}
                    className="rounded border border-[#B794F4]/30 px-2 py-1 text-[11px] text-[#B794F4] transition-all duration-200 hover:border-[#B794F4]"
                  >
                    <Copy size={12} /> Copier
                  </button>
                </div>
              </div>

              <div className="border border-[#B794F4]/20 bg-[#1e1e1e] rounded-lg p-6">
                <p className="text-sm text-white">Liaison profil STAM</p>
                <p className="mt-1 text-xs text-gray-400">
                  Connecte ton avatar STAM pour synchroniser tes succès (bientôt disponible).
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-4 w-full rounded border border-dashed border-[#B794F4]/30 px-4 py-3 text-xs text-gray-500"
                >
                  Liaison profil STAM (bientôt)
                </button>
              </div>
            </div>
          </section>

          <section id="danger" className="scroll-mt-24">
            <header className="flex items-center gap-3 text-xs uppercase tracking-wide text-purple-400">
              <WarningCircle size={16} />
              [ZONE_DE_DANGER]
            </header>

            <div className="mt-4 border border-red-500/40 bg-[#1e1e1e] rounded-lg p-6">
              <p className="text-sm text-white">Actions irréversibles</p>
              <p className="mt-1 text-xs text-gray-400">Pense à sauvegarder ce dont tu as besoin avant de poursuivre.</p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex flex-1 items-center justify-center gap-2 rounded border border-purple-400/40 px-4 py-3 text-sm text-purple-400 transition-all duration-200 hover:bg-purple-400/10"
                >
                  <SignOut size={18} /> Se déconnecter
                </button>
                <button
                  type="button"
                  disabled
                  className="flex flex-1 items-center justify-center gap-2 rounded border border-red-500/40 px-4 py-3 text-sm text-red-500 transition-all duration-200 hover:bg-red-500/10 disabled:opacity-50"
                >
                  Suppression définitive (bientôt)
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
