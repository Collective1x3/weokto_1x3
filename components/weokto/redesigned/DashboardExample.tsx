'use client'

import {
  TrendUp,
  TrendDown,
  Users,
  Coins,
  Trophy,
  Lightning,
  Target,
  Crown,
  Fire
} from 'phosphor-react'

// Example dashboard showcasing the redesigned components
export default function DashboardExample() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your performance overview.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pearls"
          value="12,485"
          change="+12.5%"
          trend="up"
          icon={<Coins size={20} />}
          accentColor="purple"
        />
        <StatCard
          label="Active Users"
          value="3,291"
          change="+5.2%"
          trend="up"
          icon={<Users size={20} />}
          accentColor="orange"
        />
        <StatCard
          label="Guild Rank"
          value="#42"
          change="+8 positions"
          trend="up"
          icon={<Trophy size={20} />}
          accentColor="purple"
        />
        <StatCard
          label="Win Rate"
          value="68.4%"
          change="-2.1%"
          trend="down"
          icon={<Target size={20} />}
          accentColor="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <Card title="Activity Overview" icon={<ChartIcon />}>
            <div className="h-64 flex items-center justify-center text-gray-500">
              {/* Chart would go here */}
              <div className="text-center">
                <Lightning size={48} className="mx-auto mb-2 text-purple-400/50" />
                <p>Activity chart visualization</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <div>
          <Card title="Recent Achievements" icon={<Trophy size={16} />}>
            <div className="space-y-3">
              <AchievementItem
                title="First Victory"
                description="Won your first guild battle"
                points={100}
                icon={<Crown size={20} />}
                unlocked
              />
              <AchievementItem
                title="Streak Master"
                description="Maintain a 7-day streak"
                points={250}
                icon={<Fire size={20} />}
                progress={5}
                maxProgress={7}
              />
              <AchievementItem
                title="Pearl Collector"
                description="Collect 10,000 pearls"
                points={500}
                icon={<Coins size={20} />}
                locked
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionButton
          label="View Analytics"
          icon={<ChartIcon />}
          href="/analytics"
        />
        <QuickActionButton
          label="Guild Chat"
          icon={<ChatIcon />}
          href="/guild/chat"
        />
        <QuickActionButton
          label="Formations"
          icon={<FormationIcon />}
          href="/guild/formation"
        />
        <QuickActionButton
          label="Leaderboards"
          icon={<Trophy size={20} />}
          href="/leaderboards"
        />
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ label, value, change, trend, icon, accentColor }: any) {
  const isPositive = trend === 'up'
  const TrendIcon = isPositive ? TrendUp : TrendDown
  const colorClasses = accentColor === 'purple'
    ? 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    : 'text-orange-400 bg-orange-400/10 border-orange-400/20'

  return (
    <div className="bg-[#12121A] border border-purple-400/10 rounded-xl p-4 hover:bg-[#1A1A24] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses} transition-all duration-200 group-hover:scale-110`}>
          {icon}
        </div>
        <span className={`text-xs font-medium flex items-center gap-1 ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          <TrendIcon size={14} />
          {change}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}

// Card Component
function Card({ title, icon, children }: any) {
  return (
    <div className="bg-[#12121A] border border-purple-400/10 rounded-xl p-6 hover:border-purple-400/20 transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-purple-400">{icon}</div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

// Achievement Item Component
function AchievementItem({ title, description, points, icon, unlocked, progress, maxProgress, locked }: any) {
  const isInProgress = progress !== undefined && maxProgress !== undefined
  const progressPercentage = isInProgress ? (progress / maxProgress) * 100 : 0

  return (
    <div className={`
      flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
      ${unlocked
        ? 'bg-purple-400/10 border-purple-400/30'
        : locked
        ? 'bg-gray-900/50 border-gray-700/30 opacity-50'
        : 'bg-orange-400/5 border-orange-400/20'
      }
    `}>
      <div className={`
        p-2 rounded-lg
        ${unlocked ? 'bg-purple-400/20 text-purple-400' : locked ? 'bg-gray-800 text-gray-600' : 'bg-orange-400/20 text-orange-400'}
      `}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-semibold ${unlocked || isInProgress ? 'text-white' : 'text-gray-500'}`}>
            {title}
          </h3>
          <span className={`text-xs font-mono ${unlocked ? 'text-purple-400' : 'text-gray-600'}`}>
            +{points} XP
          </span>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
        {isInProgress && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}/{maxProgress}</span>
            </div>
            <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({ label, icon, href }: any) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-3 p-4 bg-[#12121A] border border-purple-400/10 rounded-xl hover:bg-purple-400/10 hover:border-purple-400/30 transition-all duration-200 group"
    >
      <div className="text-purple-400 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-200">
        {label}
      </span>
    </a>
  )
}

// Icon Components (simplified)
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <rect x="2" y="10" width="3" height="8" rx="1" />
      <rect x="7" y="6" width="3" height="12" rx="1" />
      <rect x="12" y="4" width="3" height="14" rx="1" />
      <rect x="17" y="8" width="3" height="10" rx="1" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2C5.58 2 2 5.13 2 9c0 2.38 1.36 4.47 3.42 5.71-.15.56-.36 1.39-.36 1.39s1.06-.36 1.85-.85c.77.15 1.58.25 2.42.25 4.42 0 8-3.13 8-7s-3.58-7-8-7z"/>
    </svg>
  )
}

function FormationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <circle cx="10" cy="5" r="2" />
      <circle cx="5" cy="10" r="2" />
      <circle cx="15" cy="10" r="2" />
      <circle cx="7" cy="15" r="2" />
      <circle cx="13" cy="15" r="2" />
    </svg>
  )
}