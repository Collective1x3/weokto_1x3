'use client'

import { useState } from 'react'
import clsx from 'clsx'

export interface DashboardMetric {
  label: string
  value: string
  caption?: string
}

export interface DashboardTab {
  id: string
  label: string
  accentColor?: string
  metrics: DashboardMetric[]
  content?: React.ReactNode
}

interface UnifiedDashboardProps {
  tabs: DashboardTab[]
  defaultTabId?: string
  className?: string
}

export function UnifiedDashboard({ tabs, defaultTabId, className }: UnifiedDashboardProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId ?? tabs[0]?.id)
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  if (!activeTab) return null

  return (
    <div className={clsx('rounded-3xl border border-[#B794F4]/25 bg-[#121217] text-white', className)}>
      <div className="flex flex-wrap gap-3 border-b border-white/5 px-5 py-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={clsx(
                'relative inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] transition-all',
                isActive
                  ? 'bg-[#B794F4]/20 text-[#EAE2FF] border border-[#B794F4]/40 shadow-[0_10px_25px_-15px_rgba(183,148,244,0.9)]'
                  : 'bg-transparent text-[#B794F4]/60 border border-transparent hover:border-[#B794F4]/20 hover:text-[#B794F4]/90'
              )}
            >
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeTab.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 shadow-[0_20px_40px_-35px_rgba(183,148,244,0.9)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#B794F4]/70">
                {metric.label}
              </p>
              <p className="mt-3 text-2xl font-bold text-white">{metric.value}</p>
              {metric.caption && (
                <p className="mt-1 text-xs text-[#B794F4]/60">{metric.caption}</p>
              )}
            </div>
          ))}
        </div>

        {activeTab.content && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
            {activeTab.content}
          </div>
        )}
      </div>
    </div>
  )
}
