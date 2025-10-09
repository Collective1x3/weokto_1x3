"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  CaretLeft,
  CaretRight,
  Copy,
  ShareNetwork,
  Shield,
  Sparkle,
  Trophy,
  Crown,
  Fire,
  Rocket
} from "phosphor-react";
import type { IconProps } from "phosphor-react";
import {
  PROFILE_STATS,
  PROFILE_REVENUE_DATA,
  PROFILE_ACHIEVEMENTS,
  PROFILE_GUILD
} from "@/lib/profile/staticProfileData";

type SectionKey = "stats" | "progress" | "guild" | "achievements" | "calendar";

const INITIAL_SECTIONS: SectionKey[] = ["progress", "stats", "guild", "achievements", "calendar"];

const ACHIEVEMENT_ICONS: Record<string, React.ComponentType<IconProps>> = {
  Fire,
  Trophy,
  Rocket,
  Crown
};

interface PublicProfileUser {
  id: string;
  displayName: string;
  bio: string;
  publicSlug: string;
  createdAt?: string;
  profileSectionsOrder?: string[] | null;
}

export default function ProfilePublicClient({ user }: { user: PublicProfileUser }) {
  const stats = useMemo(() => PROFILE_STATS, []);
  const revenueData = useMemo(() => PROFILE_REVENUE_DATA, []);
  const achievements = useMemo(() => PROFILE_ACHIEVEMENTS, []);
  const guild = useMemo(() => PROFILE_GUILD, []);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [shareOrigin, setShareOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareOrigin(window.location.origin);
    }
  }, []);

  const sectionsOrder: SectionKey[] = useMemo(() => {
    const stored = user.profileSectionsOrder;
    const base = stored?.filter((section): section is SectionKey =>
      INITIAL_SECTIONS.includes(section as SectionKey)
    ) ?? [];
    const missing = INITIAL_SECTIONS.filter((section) => !base.includes(section));
    return [...base, ...missing];
  }, [user.profileSectionsOrder]);

  const sharePath = user.publicSlug ? `/profil/${user.publicSlug}` : null;
  const shareLink = sharePath && shareOrigin ? `${shareOrigin}${sharePath}` : null;

  const copyProfileLink = async () => {
    if (!sharePath) return;
    try {
      await navigator.clipboard.writeText(shareLink ?? sharePath);
    } catch (error) {
      console.error("Unable to copy public profile link", error);
    }
  };

  const renderStatsSection = () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded border border-[#B794F4]/20 bg-black/70 p-4 text-center">
        <div className="text-3xl font-bold text-white">€{(stats.monthlyRevenue / 1000).toFixed(1)}k</div>
        <p className="mt-2 text-xs uppercase tracking-wide text-[#B794F4]/60">MRR estimé</p>
      </div>
      <div className="rounded border border-[#B794F4]/20 bg-black/70 p-4 text-center">
        <div className="text-3xl font-bold text-white">€140</div>
        <p className="mt-2 text-xs uppercase tracking-wide text-[#B794F4]/60">Revenu moyen / jour</p>
      </div>
      <div className="rounded border border-[#B794F4]/20 bg-black/70 p-4 text-center">
        <div className="text-3xl font-bold text-white">{stats.winStreak}J</div>
        <p className="mt-2 text-xs uppercase tracking-wide text-[#B794F4]/60">Série actuelle</p>
      </div>
    </div>
  );

  const renderProgressSection = () => (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-[#B794F4]/60">Niveau {stats.level}</span>
          <span className="text-white">
            {stats.currentXP.toLocaleString()} / {stats.nextLevelXP.toLocaleString()} XP
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#B794F4]/10">
          <div
            className="h-full bg-gradient-to-r from-[#B794F4] to-[#FFB000]"
            style={{ width: `${Math.min((stats.currentXP / stats.nextLevelXP) * 100, 100)}%` }}
          />
        </div>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-[#B794F4]/60">Objectif mensuel</span>
          <span className="text-white">€{stats.monthlyRevenue.toLocaleString()} / €6,000</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#B794F4]/10">
          <div
            className="h-full bg-gradient-to-r from-[#FFB000] to-[#B794F4]"
            style={{ width: `${Math.min((stats.monthlyRevenue / 6000) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );

  const renderGuildSection = () => (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex flex-1 items-center gap-4 border border-[#B794F4]/20 bg-black/60 p-6">
        <Shield size={52} weight="fill" className="text-[#FFB000]" />
        <div>
          <p className="text-lg font-bold text-white">{guild.name}</p>
          <p className="text-sm text-[#B794F4]/70">Rang #{stats.guildRank} • {guild.members} membres</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="border border-[#FFB000]/40 px-3 py-1 text-[#FFB000]">{guild.status}</span>
            <span className="border border-[#B794F4]/40 px-3 py-1 text-[#B794F4]">Niveau {guild.level}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-4 border border-[#B794F4]/20 bg-black/60 p-6">
        <Sparkle size={48} className="text-[#B794F4]" />
        <div>
          <p className="text-2xl font-bold text-white">#{stats.rank}</p>
          <p className="mt-2 text-xs text-[#FFB000]">Série en cours : {stats.winStreak} jours</p>
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
            className={`border p-4 text-center ${
              achievement.unlocked
                ? "border-[#FFB000]/40 bg-black/60"
                : "border-[#B794F4]/20 bg-black/40 opacity-40"
            }`}
          >
            <Icon
              size={32}
              weight={achievement.unlocked ? "fill" : "regular"}
              className={achievement.unlocked ? "mx-auto mb-3 text-[#FFB000]" : "mx-auto mb-3 text-[#B794F4]/40"}
            />
            <p className="text-xs font-semibold text-white/80">{achievement.name}</p>
            <p className="mt-1 text-[10px] text-[#B794F4]/60">{achievement.description}</p>
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
      let colorClass = "bg-red-500/20 border-red-500/50";
      if (revenue > 0 && revenue < avgDaily) {
        colorClass = "bg-orange-500/20 border-orange-500/50";
      } else if (revenue >= avgDaily) {
        colorClass = "bg-green-500/20 border-green-500/50";
      }

      days.push(
        <div
          key={day}
          className={`flex aspect-square flex-col items-center justify-center border ${colorClass} p-1 text-center text-xs text-white`}
        >
          <span className="text-[10px] text-white/70">{day}</span>
          <span className="text-[9px] font-bold">{revenue > 0 ? `€${revenue}` : "-"}</span>
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
            className="rounded-sm border border-[#B794F4]/40 p-2 text-[#B794F4] transition-all hover:border-[#FFB000] hover:text-[#FFB000]"
            type="button"
          >
            <CaretLeft size={18} />
          </button>
          <h3 className="text-sm font-semibold capitalize text-[#FFB000]">
            {currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </h3>
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
            }
            className="rounded-sm border border-[#B794F4]/40 p-2 text-[#B794F4] transition-all hover:border-[#FFB000] hover:text-[#FFB000]"
            type="button"
          >
            <CaretRight size={18} />
          </button>
        </div>

        <div className="border-2 border-[#B794F4]/30 p-4">
          <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs text-[#B794F4]/60">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">{days}</div>
          <div className="mt-4 flex justify-center gap-4 text-[10px] text-[#B794F4]/60">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 border border-green-500/50 bg-green-500/20" />
              &gt; €140/j
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 border border-orange-500/50 bg-orange-500/20" />
              &lt; €140/j
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 border border-red-500/50 bg-red-500/20" />
              €0
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSectionContent = (section: SectionKey) => {
    switch (section) {
      case "progress":
        return renderProgressSection();
      case "stats":
        return renderStatsSection();
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
    <div className="min-h-screen bg-black pb-16 font-mono text-[#B794F4]">
      <div className="px-4 pt-8 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-12 h-40 max-w-4xl sm:h-56">
            <div
              className="flex h-full w-full items-center justify-center rounded-sm bg-[#B794F4]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.15) 8px, rgba(0,0,0,0.15) 16px), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.15) 8px, rgba(0,0,0,0.15) 16px)"
              }}
            >
              <div className="h-28 w-28 rounded-sm border-4 border-black bg-black sm:h-36 sm:w-36">
                <div className="h-full w-full overflow-hidden rounded-sm border-2 border-[#FFB000] bg-black">
                  <Image
                    src="/images/pfpr4_coachTBCB.png"
                    alt="Avatar public"
                    width={144}
                    height={144}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-3xl px-4 text-center">
            <h1 className="text-4xl font-bold text-white">{user.displayName}</h1>
            <p className="mt-4 text-sm text-[#B794F4]/80">{user.bio}</p>

            {sharePath ? (
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#B794F4]">
                <ShareNetwork size={16} className="text-[#FFB000]" />
                <Link
                  href={sharePath}
                  className="border border-[#B794F4]/30 px-3 py-1 text-white transition-all hover:border-[#FFB000]"
                >
                  {sharePath}
                </Link>
                <button
                  type="button"
                  onClick={copyProfileLink}
                  className="flex items-center gap-1 border border-[#B794F4]/30 px-2 py-1 text-[11px] text-[#B794F4] transition-all hover:border-[#B794F4]"
                >
                  <Copy size={12} />
                  Copier
                </button>
              </div>
            ) : null}
          </div>

          <div className="mx-auto mt-8 max-w-4xl px-4 space-y-8">
            <div className="border border-[#B794F4]/20 bg-black/70 p-6">
              <div className="grid gap-3 text-sm text-white sm:grid-cols-3">
                <div className="rounded border border-[#B794F4]/20 bg-black/50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#B794F4]/60">Revenus totaux</p>
                  <p className="mt-2 text-xl font-bold">€{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="rounded border border-[#B794F4]/20 bg-black/50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#B794F4]/60">Classement WeOkto</p>
                  <p className="mt-2 text-xl font-bold">#{stats.guildRank}</p>
                </div>
                <div className="rounded border border-[#B794F4]/20 bg-black/50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#B794F4]/60">Série max</p>
                  <p className="mt-2 text-xl font-bold">{stats.winStreak} jours</p>
                </div>
              </div>
            </div>

            {sectionsOrder.map((section) => (
              <div key={section} className="border border-[#B794F4]/20 bg-black/70 p-6">
                {renderSectionContent(section)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
