'use client'

import * as Icons from 'phosphor-react'

interface OnlineUsersProps {
  users: Map<string, any>
  canModerate?: boolean
  onModerate?: (payload: { userId: string }) => void
}

export default function OnlineUsers({ users, canModerate, onModerate }: OnlineUsersProps) {
  const onlineCount = users.size

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-xs">
        <div className="relative">
          <Icons.Users size={16} className="text-[#B794F4]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <span className="text-[#B794F4]/80">
          {onlineCount} {onlineCount === 1 ? 'membre' : 'membres'} en ligne
        </span>
      </div>

      {/* Could expand to show user list on click */}
      {onlineCount > 0 && (
        <div className="mt-2 flex -space-x-2">
          {Array.from(users.values()).slice(0, 5).map((user, index) => (
            <button
              key={user.user_id || index}
              onClick={() => canModerate && onModerate && onModerate({ userId: user.user_id })}
              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                canModerate && onModerate
                  ? 'bg-[#B794F4]/20 border-[#B794F4] hover:border-[#FFB000]'
                  : 'cursor-default bg-[#B794F4]/20 border-[#B794F4]'
              }`}
              title={user.display_name || 'Membre'}
              type="button"
              disabled={!canModerate || !onModerate}
            >
              <span className="text-[#FFB000] text-xs font-bold">
                {user.display_name?.[0]?.toUpperCase() || '?'}
              </span>
            </button>
          ))}
          {onlineCount > 5 && (
            <div className="w-6 h-6 rounded-full bg-black border border-[#B794F4] flex items-center justify-center">
              <span className="text-[#B794F4] text-xs">+{onlineCount - 5}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
