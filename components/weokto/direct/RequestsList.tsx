'use client'

import * as Icons from 'phosphor-react'

interface RequestsListProps {
  requests: Array<{
    id: string
    participants: Array<{
      auth_id: string
      display_name?: string | null
    }>
    created_at: string
  }>
  currentUserAuthId: string | null
  onAccept: (conversationId: string) => void
  onDecline: (conversationId: string) => void
}

function getRequesterName(
  request: RequestsListProps['requests'][number],
  currentUserAuthId: string | null
) {
  const requester = request.participants.find((participant) => participant.auth_id !== currentUserAuthId)
  return requester?.display_name || 'Utilisateur inconnu'
}

export default function RequestsList({ requests, currentUserAuthId, onAccept, onDecline }: RequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-6">
        <Icons.UserPlus size={32} weight="duotone" className="mx-auto mb-2 text-purple-400/30" />
        <p className="text-sm text-gray-500">Aucune demande</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const requesterName = getRequesterName(request, currentUserAuthId)
        const timeAgo = new Date(request.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short'
        })

        return (
          <div key={request.id} className="rounded-lg border border-purple-400/20 bg-[#1e1e1e]/80 p-4 hover:border-purple-400/40 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center flex-shrink-0">
                <Icons.User size={20} weight="duotone" className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-semibold truncate">{requesterName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Demande reçue le {timeAgo}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => onAccept(request.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-400 text-white hover:bg-purple-500 transition-all duration-200 flex items-center gap-1"
                    title="Accepter"
                  >
                    <Icons.Check size={14} weight="bold" />
                    Accepter
                  </button>
                  <button
                    onClick={() => onDecline(request.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-400/40 text-red-400 hover:bg-red-400/10 hover:border-red-400 transition-all duration-200 flex items-center gap-1"
                    title="Refuser"
                  >
                    <Icons.X size={14} weight="bold" />
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
