'use client'

import useSWR from 'swr'
import * as Icons from 'phosphor-react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface StatsOverview {
  totalModules: number
  totalLessons: number
  totalViews: number
  avgCompletionRate: number
  activeUsers: number
  totalWatchTime: number
}

interface TopLesson {
  id: string
  title: string
  moduleName: string
  views: number
  completionRate: number
  avgWatchTime: number
}

interface ModuleStat {
  moduleId: string
  moduleName: string
  lessonsCount: number
  totalViews: number
  avgCompletionRate: number
  totalWatchTime: number
}

interface StatsData {
  overview: StatsOverview
  topLessons: TopLesson[]
  moduleStats: ModuleStat[]
}

interface FormationStatsProps {
  slug: string
}

export function FormationStats({ slug }: FormationStatsProps) {
  const { data, error, isLoading } = useSWR<StatsData>(
    `/api/supplier/guilds/${slug}/formations/stats`,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="border-t-2 border-[#B794F4]/30 pt-6 mt-6">
        <div className="text-center py-12">
          <Icons.CircleNotch size={32} className="animate-spin text-[#B794F4] mx-auto mb-4" />
          <p className="text-[#B794F4]/60 text-sm">CHARGEMENT DES STATISTIQUES...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-t-2 border-[#B794F4]/30 pt-6 mt-6">
        <div className="border-2 border-[#EF4444] bg-[#EF4444]/10 p-4">
          <div className="flex gap-3">
            <Icons.Warning size={20} className="text-[#EF4444] flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#EF4444] mb-1">ERREUR</p>
              <p className="text-xs text-[#EF4444]/80">
                Impossible de charger les statistiques
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = data?.overview
  const topLessons = data?.topLessons || []
  const moduleStats = data?.moduleStats || []

  if (!stats) {
    return null
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="border-t-2 border-[#B794F4]/30 pt-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Icons.ChartLine size={20} className="text-[#FFB000]" />
        <h3 className="text-lg font-bold text-white">STATISTIQUES</h3>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="border border-[#B794F4]/30 bg-black/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icons.BookOpen size={16} className="text-[#B794F4]" />
            <span className="text-xs text-[#B794F4]/60">MODULES</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalModules}</p>
        </div>

        <div className="border border-[#B794F4]/30 bg-black/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icons.VideoCamera size={16} className="text-[#B794F4]" />
            <span className="text-xs text-[#B794F4]/60">LEÇONS</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalLessons}</p>
        </div>

        <div className="border border-[#B794F4]/30 bg-black/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icons.Eye size={16} className="text-[#B794F4]" />
            <span className="text-xs text-[#B794F4]/60">VUES</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(stats.totalViews)}</p>
        </div>

        <div className="border border-[#B794F4]/30 bg-black/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icons.CheckCircle size={16} className="text-[#B794F4]" />
            <span className="text-xs text-[#B794F4]/60">COMPLÉTION</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgCompletionRate.toFixed(0)}%</p>
        </div>

        <div className="border border-[#B794F4]/30 bg-black/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icons.Users size={16} className="text-[#B794F4]" />
            <span className="text-xs text-[#B794F4]/60">ACTIFS (30J)</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
        </div>

        <div className="border border-[#B794F4]/30 bg-black/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icons.Clock size={16} className="text-[#B794F4]" />
            <span className="text-xs text-[#B794F4]/60">DURÉE VUE</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatDuration(stats.totalWatchTime)}</p>
        </div>
      </div>

      {/* Top Lessons Table */}
      {topLessons.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Icons.TrendUp size={18} className="text-[#FFB000]" />
            <h4 className="text-sm font-bold text-white">TOP 10 LEÇONS</h4>
          </div>

          <div className="border border-[#B794F4]/30 bg-black/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#B794F4]/30 bg-[#B794F4]/10">
                    <th className="text-left px-4 py-3 text-white font-bold">#</th>
                    <th className="text-left px-4 py-3 text-white font-bold">LEÇON</th>
                    <th className="text-left px-4 py-3 text-white font-bold">MODULE</th>
                    <th className="text-right px-4 py-3 text-white font-bold">VUES</th>
                    <th className="text-right px-4 py-3 text-white font-bold">COMPLÉTION</th>
                    <th className="text-right px-4 py-3 text-white font-bold">TEMPS MOY.</th>
                  </tr>
                </thead>
                <tbody>
                  {topLessons.map((lesson, index) => (
                    <tr
                      key={lesson.id}
                      className="border-b border-[#B794F4]/10 hover:bg-[#B794F4]/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-[#FFB000] font-bold">{index + 1}</td>
                      <td className="px-4 py-3 text-white max-w-xs truncate">{lesson.title}</td>
                      <td className="px-4 py-3 text-[#B794F4]/80 max-w-xs truncate">
                        {lesson.moduleName}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-bold">
                        {formatNumber(lesson.views)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`${
                            lesson.completionRate >= 80
                              ? 'text-[#10B981]'
                              : lesson.completionRate >= 50
                              ? 'text-[#FFB000]'
                              : 'text-[#EF4444]'
                          } font-bold`}
                        >
                          {lesson.completionRate.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#B794F4]/80">
                        {formatDuration(lesson.avgWatchTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Module Stats Table */}
      {moduleStats.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icons.ChartBar size={18} className="text-[#FFB000]" />
            <h4 className="text-sm font-bold text-white">STATISTIQUES PAR MODULE</h4>
          </div>

          <div className="border border-[#B794F4]/30 bg-black/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#B794F4]/30 bg-[#B794F4]/10">
                    <th className="text-left px-4 py-3 text-white font-bold">MODULE</th>
                    <th className="text-right px-4 py-3 text-white font-bold">LEÇONS</th>
                    <th className="text-right px-4 py-3 text-white font-bold">VUES</th>
                    <th className="text-right px-4 py-3 text-white font-bold">COMPLÉTION</th>
                    <th className="text-right px-4 py-3 text-white font-bold">DURÉE VUE</th>
                  </tr>
                </thead>
                <tbody>
                  {moduleStats.map((module) => (
                    <tr
                      key={module.moduleId}
                      className="border-b border-[#B794F4]/10 hover:bg-[#B794F4]/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-bold max-w-xs truncate">
                        {module.moduleName}
                      </td>
                      <td className="px-4 py-3 text-right text-[#B794F4]/80">
                        {module.lessonsCount}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-bold">
                        {formatNumber(module.totalViews)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`${
                            module.avgCompletionRate >= 80
                              ? 'text-[#10B981]'
                              : module.avgCompletionRate >= 50
                              ? 'text-[#FFB000]'
                              : 'text-[#EF4444]'
                          } font-bold`}
                        >
                          {module.avgCompletionRate.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#B794F4]/80">
                        {formatDuration(module.totalWatchTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {topLessons.length === 0 && moduleStats.length === 0 && (
        <div className="border border-[#B794F4]/30 bg-black/50 p-8 text-center">
          <Icons.ChartLine size={48} className="text-[#B794F4]/30 mx-auto mb-3" />
          <p className="text-[#B794F4]/60 text-sm">
            Aucune donnée de visionnage disponible pour le moment
          </p>
        </div>
      )}
    </div>
  )
}