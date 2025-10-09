"use client";

import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reorder, motion } from "framer-motion";
import {
  Calendar,
  CaretLeft,
  CaretRight,
  Crown,
  Copy,
  Eye,
  DotsSixVertical,
  Fire,
  Lightning,
  PencilSimple,
  Rocket,
  ShareNetwork,
  Shield,
  Sparkle,
  Trophy,
  Check,
  X
} from "phosphor-react";
import type { IconProps } from "phosphor-react";
import {
  PROFILE_STATS,
  PROFILE_REVENUE_DATA,
  PROFILE_ACHIEVEMENTS,
  PROFILE_GUILD
} from "@/lib/profile/staticProfileData";
import { useUserSession } from '@/contexts/UserSessionContext';

type SectionKey = "stats" | "progress" | "guild" | "achievements" | "calendar";

const INITIAL_SECTIONS: SectionKey[] = ["progress", "stats", "guild", "achievements", "calendar"];

const SECTION_ICONS: Record<SectionKey, React.ComponentType<IconProps>> = {
  stats: Sparkle,
  progress: Lightning,
  guild: Shield,
  achievements: Trophy,
  calendar: Calendar
};

const ACHIEVEMENT_ICONS: Record<string, React.ComponentType<IconProps>> = {
  Fire,
  Trophy,
  Rocket,
  Crown
};

export default function ProfilePage() {
  const { user, setUser: setSessionUser } = useUserSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const deriveOrder = useCallback((stored?: string[] | null): SectionKey[] => {
    const base = stored?.filter((section): section is SectionKey =>
      INITIAL_SECTIONS.includes(section as SectionKey)
    ) ?? [];
    const missing = INITIAL_SECTIONS.filter((section) => !base.includes(section));
    return [...base, ...missing];
  }, []);

  const [sectionsOrder, setSectionsOrder] = useState<SectionKey[]>(() => deriveOrder(user?.profileSectionsOrder));
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [cursorBlink, setCursorBlink] = useState(true);
  const [shareOrigin, setShareOrigin] = useState<string>("");

  const stats = useMemo(() => PROFILE_STATS, []);
  const revenueData = useMemo(() => PROFILE_REVENUE_DATA, []);
  const achievements = useMemo(() => PROFILE_ACHIEVEMENTS, []);
  const guild = useMemo(() => PROFILE_GUILD, []);

  useEffect(() => {
    const timer = setInterval(() => setCursorBlink((blink) => !blink), 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setEditedName(user.displayName || "");
      setEditedBio(user.bio || "");
      setSectionsOrder(deriveOrder(user.profileSectionsOrder));
    }
  }, [user, deriveOrder]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShareOrigin(window.location.origin);
  }, []);

  const persistProfile = useCallback(
    async (displayName: string, bio: string) => {
      const trimmedName = displayName.trim();
      if (!trimmedName) return;

      setIsSavingProfile(true);
      try {
        const response = await fetch("/api/auth/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName: trimmedName, bio: bio.trim() })
        });

        if (response.ok) {
          const data = await response.json();
          setSessionUser((prev) => {
            if (!prev) {
              return {
                id: data.user.id,
                email: data.user.email,
                displayName: data.user.displayName ?? null,
                bio: data.user.bio ?? null,
                publicSlug: data.user.publicSlug ?? null,
                guildId: null,
                userType: null,
                createdAt: null,
                lastLoginAt: null,
                profileSectionsOrder: deriveOrder(null)
              };
            }
            return {
              ...prev,
              email: data.user.email ?? prev.email,
              displayName: data.user.displayName ?? prev.displayName,
              bio: data.user.bio ?? prev.bio,
              publicSlug: data.user.publicSlug ?? prev.publicSlug
            };
          });
          setEditedName(data.user.displayName || "");
          setEditedBio(data.user.bio || "");
          return true;
        }
      } catch (error) {
        console.error("Error saving profile:", error);
      } finally {
        setIsSavingProfile(false);
      }
      return false;
    },
    [setSessionUser, deriveOrder]
  );

  const handleNameSubmit = useCallback(async () => {
    const success = await persistProfile(editedName, editedBio);
    if (success) setIsEditingName(false);
  }, [editedName, editedBio, persistProfile]);

  const handleBioSubmit = useCallback(async () => {
    const success = await persistProfile(editedName, editedBio);
    if (success) setIsEditingBio(false);
  }, [editedName, editedBio, persistProfile]);

  const resetNameEditing = () => {
    setIsEditingName(false);
    setEditedName(user?.displayName || "");
  };

  const resetBioEditing = () => {
    setIsEditingBio(false);
    setEditedBio(user?.bio || "");
  };

  const sharePath = user?.publicSlug ? `/profil/${user.publicSlug}` : null;
  const shareLink = sharePath && shareOrigin ? `${shareOrigin}${sharePath}` : null;

  const copyProfileLink = async () => {
    if (!sharePath) return;
    try {
      await navigator.clipboard.writeText(shareLink ?? sharePath);
    } catch (error) {
      console.error("Unable to copy link", error);
    }
  };

  if (!user) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center font-mono text-sm text-[#B794F4]">
        {"> CHARGEMENT DU PROFIL..."}
        <span className={`ml-2 inline-block h-4 w-2 bg-[#B794F4] ${cursorBlink ? "opacity-100" : "opacity-0"}`} />
      </div>
    );
  }

  const renderProgressSection = () => (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-500">Niveau {stats.level}</span>
          <span className="text-white">
            {stats.currentXP.toLocaleString()} / {stats.nextLevelXP.toLocaleString()} XP
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[#B794F4]/10">
          <div
            className="h-full bg-[#B794F4]"
            style={{ width: `${Math.min((stats.currentXP / stats.nextLevelXP) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-500">Objectif mensuel</span>
          <span className="text-white">€{stats.monthlyRevenue.toLocaleString()} / €6,000</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[#B794F4]/10">
          <div
            className="h-full bg-[#B794F4]"
            style={{ width: `${Math.min((stats.monthlyRevenue / 6000) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );

  const renderStatsSection = () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4 text-center">
        <div className="text-3xl font-bold text-white">€{(stats.monthlyRevenue / 1000).toFixed(1)}k</div>
        <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">MRR estimé</p>
      </div>
      <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4 text-center">
        <div className="text-3xl font-bold text-white">€140</div>
        <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">Revenu moyen / jour</p>
      </div>
      <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4 text-center">
        <div className="text-3xl font-bold text-white">{stats.winStreak}J</div>
        <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">Série actuelle</p>
      </div>
    </div>
  );

  const renderGuildSection = () => (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-6">
        <Shield size={52} weight="fill" className="text-[#B794F4]" />
        <div>
          <p className="text-lg font-bold text-white">{guild.name}</p>
          <p className="text-sm text-gray-400">Rang #{stats.guildRank} • {guild.members} membres</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded border border-[#B794F4]/40 px-3 py-1 text-[#B794F4]">{guild.status}</span>
            <span className="rounded border border-[#B794F4]/40 px-3 py-1 text-gray-400">Niveau {guild.level}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-6">
        <Sparkle size={48} className="text-[#B794F4]" />
        <div>
          <p className="text-2xl font-bold text-white">#{stats.rank}</p>
          <p className="mt-2 text-xs text-gray-400">Série en cours : {stats.winStreak} jours</p>
        </div>
      </div>
    </div>
  );

  const renderAchievementsSection = () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {achievements.map((achievement) => {
        const Icon = ACHIEVEMENT_ICONS[achievement.icon] ?? Sparkle;
        return (
          <div
            key={achievement.id}
            className={`rounded-lg border p-4 text-center transition-all duration-200 ${
              achievement.unlocked
                ? "border-[#B794F4]/40 bg-[#1e1e1e] hover:bg-purple-400/10"
                : "border-[#B794F4]/20 bg-[#1e1e1e] opacity-40"
            }`}
          >
            <Icon
              size={32}
              weight={achievement.unlocked ? "fill" : "regular"}
              className={achievement.unlocked ? "mx-auto mb-3 text-[#B794F4]" : "mx-auto mb-3 text-gray-500"}
            />
            <p className="text-xs font-semibold text-white">{achievement.name}</p>
            <p className="mt-1 text-[10px] text-gray-500">{achievement.description}</p>
          </div>
        );
      })}
    </div>
  );

  const renderCalendarSection = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startPadding = (firstDay.getDay() + 6) % 7;
    const days: ReactElement[] = [];
    const avgDaily = 140;

    for (let i = 0; i < startPadding; i += 1) {
      days.push(<div key={`pad-${i}`} />);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const revenue = revenueData[day as keyof typeof revenueData] || 0;
      let colorClass = "border-[#B794F4]/20";
      if (revenue > 0 && revenue < avgDaily) {
        colorClass = "border-[#B794F4]/30 bg-[#B794F4]/5";
      } else if (revenue >= avgDaily) {
        colorClass = "border-[#B794F4]/50 bg-[#B794F4]/10";
      }

      days.push(
        <div
          key={day}
          className={`flex aspect-square flex-col items-center justify-center border ${colorClass} p-1 text-center text-xs text-white`}
        >
          <span className="text-[10px] text-gray-400">{day}</span>
          <span className="text-[9px] font-bold text-white">{revenue > 0 ? `€${revenue}` : "-"}</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
            }
            className="rounded border border-[#B794F4]/40 p-2 text-[#B794F4] transition-all duration-200 hover:bg-purple-400/10"
            type="button"
          >
            <CaretLeft size={18} />
          </button>
          <h3 className="text-sm font-semibold capitalize text-white">
            {currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </h3>
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
            }
            className="rounded border border-[#B794F4]/40 p-2 text-[#B794F4] transition-all duration-200 hover:bg-purple-400/10"
            type="button"
          >
            <CaretRight size={18} />
          </button>
        </div>

        <div className="rounded-lg border border-[#B794F4]/20 p-4 bg-[#1e1e1e]">
          <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">{days}</div>
          <div className="mt-4 flex justify-center gap-4 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded border border-[#B794F4]/50 bg-[#B794F4]/10" />
              &gt; €140/j
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded border border-[#B794F4]/30 bg-[#B794F4]/5" />
              &lt; €140/j
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded border border-[#B794F4]/20" />
              €0
            </span>
          </div>
        </div>
      </div>
    );
  };

  const handleSectionsReorder = useCallback(async (nextOrder: SectionKey[]) => {
    setSectionsOrder(nextOrder);
    setSessionUser((prev) => (prev ? { ...prev, profileSectionsOrder: nextOrder } : prev));
    try {
      await fetch('/api/profile/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: nextOrder })
      });
    } catch (error) {
      console.error('Unable to persist profile layout', error);
    }
  }, [setSessionUser]);
  const renderSectionContent = (section: SectionKey) => {
    switch (section) {
      case "stats":
        return renderStatsSection();
      case "progress":
        return renderProgressSection();
      case "guild":
        return renderGuildSection();
      case "achievements":
        return renderAchievementsSection();
      case "calendar":
        return renderCalendarSection();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 font-mono text-[#B794F4]">
      <div className="px-4 pt-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 h-40 max-w-4xl sm:h-56">
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-[#B794F4] bg-[#1e1e1e]">
              <div className="h-28 w-28 sm:h-36 sm:w-36">
                <div className="h-full w-full overflow-hidden rounded-lg border-2 border-[#B794F4]">
                  <Image
                    src="/images/pfpr4_coachTBCB.png"
                    alt="Avatar"
                    width={144}
                    height={144}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-3xl px-4 text-center">
            {isEditingName ? (
              <div className="flex flex-col items-center gap-3">
                <input
                  value={editedName}
                  onChange={(event) => setEditedName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleNameSubmit();
                    }
                    if (event.key === "Escape") {
                      event.preventDefault();
                      resetNameEditing();
                    }
                  }}
                  autoFocus
                  maxLength={100}
                  className="w-full max-w-md rounded border border-[#B794F4]/40 bg-[#1e1e1e] px-3 py-2 text-xl text-white outline-none transition-all duration-200 focus:border-[#B794F4]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleNameSubmit}
                    disabled={isSavingProfile}
                    className="flex items-center gap-1 rounded border border-[#B794F4]/40 px-3 py-2 text-xs text-[#B794F4] transition-all duration-200 hover:bg-purple-400/10 disabled:opacity-50"
                  >
                    <Check size={14} />
                    {isSavingProfile ? "..." : "Valider"}
                  </button>
                  <button
                    type="button"
                    onClick={resetNameEditing}
                    className="flex items-center gap-1 rounded border border-[#B794F4]/30 px-3 py-2 text-xs text-gray-400 transition-all duration-200 hover:bg-purple-400/10"
                  >
                    <X size={14} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                {sharePath && (
                  <Link
                    href={sharePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500 transition-all duration-200 hover:text-[#B794F4]"
                    aria-label="Voir le profil public"
                  >
                    <Eye size={18} />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="group flex items-center gap-3 text-left"
                >
                  <h1 className="text-4xl font-bold text-white">
                    {user.displayName || "USER_001"}
                  </h1>
                  <PencilSimple size={18} className="text-gray-500 transition-all duration-200 group-hover:text-[#B794F4]" />
                </button>
              </div>
            )}

            {isEditingBio ? (
              <div className="mt-4 flex flex-col items-center gap-3">
                <textarea
                  value={editedBio}
                  onChange={(event) => setEditedBio(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                      handleBioSubmit();
                    }
                    if (event.key === "Escape") {
                      event.preventDefault();
                      resetBioEditing();
                    }
                  }}
                  rows={3}
                  maxLength={500}
                  className="w-full max-w-xl rounded border border-[#B794F4]/40 bg-[#1e1e1e] px-3 py-2 text-sm text-white outline-none transition-all duration-200 focus:border-[#B794F4]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleBioSubmit}
                    disabled={isSavingProfile}
                    className="flex items-center gap-1 rounded border border-[#B794F4]/40 px-3 py-2 text-xs text-[#B794F4] transition-all duration-200 hover:bg-purple-400/10 disabled:opacity-50"
                  >
                    <Check size={14} />
                    {isSavingProfile ? "..." : "Sauvegarder"}
                  </button>
                  <button
                    type="button"
                    onClick={resetBioEditing}
                    className="flex items-center gap-1 rounded border border-[#B794F4]/30 px-3 py-2 text-xs text-gray-400 transition-all duration-200 hover:bg-purple-400/10"
                  >
                    <X size={14} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingBio(true)}
                className="group mt-4 mx-auto flex items-center justify-center gap-2 text-center"
              >
                <p className="max-w-2xl text-center text-sm text-gray-400">{user.bio || "Aucune description"}</p>
                <PencilSimple size={16} className="text-gray-500 transition-all duration-200 group-hover:text-[#B794F4]" />
              </button>
            )}

            {sharePath ? (
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#B794F4]">
                <ShareNetwork size={16} className="text-[#B794F4]" />
                <Link
                  href={sharePath}
                  className="rounded border border-[#B794F4]/30 px-3 py-1 text-white transition-all duration-200 hover:bg-purple-400/10"
                >
                  {sharePath}
                </Link>
                <button
                  type="button"
                  onClick={copyProfileLink}
                  className="flex items-center gap-1 rounded border border-[#B794F4]/30 px-2 py-1 text-[11px] text-gray-400 transition-all duration-200 hover:bg-purple-400/10"
                >
                  <Copy size={12} />
                  Copier
                </button>
              </div>
            ) : null}
          </div>

          <div className="mx-auto mt-8 max-w-4xl px-4 space-y-8">
            <div className="rounded-2xl border border-[#B794F4]/20 bg-[#1e1e1e] p-6">
              <div className="grid gap-3 text-sm text-white sm:grid-cols-3">
                <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Revenus totaux</p>
                  <p className="mt-2 text-xl font-bold">€{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Classement WeOkto</p>
                  <p className="mt-2 text-xl font-bold">#{stats.guildRank}</p>
                </div>
                <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Série max</p>
                  <p className="mt-2 text-xl font-bold">{stats.winStreak} jours</p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-wide text-[#B794F4]">
                  [Modules réorganisables]
                </h2>
                <span className="text-[11px] text-gray-500">Glisse un bloc pour réordonner ton profil.</span>
              </div>

              <Reorder.Group axis="y" values={sectionsOrder} onReorder={handleSectionsReorder} className="flex flex-col gap-6">
                {sectionsOrder.map((section) => {
                  const Icon = SECTION_ICONS[section];
                  const sectionContent = (
                    <div className="rounded-2xl border border-[#B794F4]/20 bg-[#1e1e1e]">
                      <div className="flex items-center justify-between border-b border-[#B794F4]/20 px-4 py-3">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#B794F4]">
                          <Icon size={16} />
                        </div>
                        <DotsSixVertical size={18} className="text-gray-500 cursor-grab active:cursor-grabbing" />
                      </div>
                      <div className="p-5 text-sm text-white">{renderSectionContent(section)}</div>
                    </div>
                  );

                  return (
                    <Reorder.Item key={section} value={section}>
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {sectionContent}
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
