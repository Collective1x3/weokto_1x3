'use client'

import { useCurrentGuild } from '@/hooks/useCurrentGuild'
import { CircleNotch, Play, PauseCircle, ArrowsOutSimple, Trophy, Bell, PaperPlaneTilt, Microphone, MicrophoneSlash, VideoCamera, VideoCameraSlash } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import GuildNavigationHeader from '@/components/weokto/guild/GuildNavigationHeader'

export default function GuildHomePage() {
  const { guild, isLoading, error } = useCurrentGuild()
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: 'ADMIN_001', message: 'Bienvenue dans la guilde! 🚀', time: '10:32', isAnnouncement: false },
    { id: 2, author: 'USER_042', message: 'Merci pour la formation!', time: '10:35', isAnnouncement: false },
    { id: 3, author: 'USER_089', message: 'Question sur le module 3?', time: '10:38', isAnnouncement: false },
  ])
  const [announcements] = useState([
    { id: 1, title: '🔥 NOUVELLE FORMATION', content: 'Module avancé disponible!', time: '2h' },
    { id: 2, title: '📊 MISE À JOUR', content: 'Nouveau système de points', time: '5h' },
  ])
  const [wins] = useState([
    { id: 1, user: 'USER_420', amount: '+€2,500', time: 'Aujourd\'hui' },
    { id: 2, user: 'USER_777', amount: '+€1,800', time: 'Hier' },
    { id: 3, user: 'USER_101', amount: '+€5,200', time: 'Il y a 2j' },
  ])

  useEffect(() => {
    if (!isLoading && !guild && !error) {
      router.push('/choose-guild')
    }
  }, [guild, isLoading, error, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CircleNotch size={48} className="animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-purple-400 font-mono">Chargement de la guilde...</p>
        </div>
      </div>
    )
  }

  if (!guild) return null

  return (
    <div className="min-h-screen p-4 font-mono">
      {/* Navigation Header */}
      <GuildNavigationHeader guildName={guild.name} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Content Area - Left Side */}
        <div className="xl:col-span-2 space-y-4">
          {/* Video Player */}
          <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg overflow-hidden">
            <div className="border-b border-[#B794F4]/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                <span className="text-xs text-purple-400">FORMATION EN COURS • MODULE 3</span>
              </div>
              <button className="text-purple-400 hover:text-white transition-colors">
                <ArrowsOutSimple size={18} />
              </button>
            </div>

            <div className="relative aspect-video bg-black/60">
              {/* Fake Video Player */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 border border-purple-400/30 rounded-full flex items-center justify-center bg-purple-400/10">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-purple-400 hover:text-white transition-colors"
                    >
                      {isPlaying ? <PauseCircle size={64} weight="fill" /> : <Play size={64} weight="fill" />}
                    </button>
                  </div>
                  <p className="text-white font-bold mb-1">Stratégies Avancées de Trading</p>
                  <p className="text-gray-500 text-xs">Durée: 45:23 • Progression: 35%</p>
                </div>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#1e1e1e] p-3 border-t border-[#B794F4]/20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-purple-400 hover:text-white transition-colors"
                  >
                    {isPlaying ? <PauseCircle size={20} /> : <Play size={20} />}
                  </button>

                  <div className="flex-1">
                    <div className="h-1 bg-purple-400/20 rounded-full relative">
                      <div className="absolute left-0 top-0 h-full w-[35%] bg-purple-400 rounded-full" />
                    </div>
                  </div>

                  <span className="text-xs text-gray-500">15:48 / 45:23</span>

                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-purple-400 hover:text-white transition-colors"
                    >
                      {isMuted ? <MicrophoneSlash size={18} /> : <Microphone size={18} />}
                    </button>
                    <button
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className="text-purple-400 hover:text-white transition-colors"
                    >
                      {isCameraOn ? <VideoCamera size={18} /> : <VideoCameraSlash size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg h-[400px] flex flex-col overflow-hidden">
            <div className="border-b border-[#B794F4]/20 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">CHAT GÉNÉRAL</span>
                <span className="text-xs text-gray-500">128 en ligne</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-8 h-8 border border-purple-400/20 bg-purple-400/10 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-purple-400">{msg.author.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-purple-400">{msg.author}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-300">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#B794F4]/20 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-3 py-2 bg-black/40 border border-[#B794F4]/40 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#B794F4] transition-colors"
                />
                <button className="px-4 py-2 bg-purple-400 text-black font-bold hover:bg-purple-400/80 transition-all rounded flex items-center gap-2">
                  <PaperPlaneTilt size={18} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Announcements */}
          <div className="border border-orange-500 bg-[#1e1e1e] rounded-lg overflow-hidden">
            <div className="border-b border-orange-500/20 p-3 flex items-center gap-2">
              <Bell size={20} className="text-orange-500" />
              <span className="text-sm font-bold text-white">ANNONCES</span>
            </div>
            <div className="p-3 space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border border-orange-500/20 bg-orange-500/5 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs font-bold text-orange-500">{announcement.title}</p>
                    <span className="text-xs text-gray-500">{announcement.time}</span>
                  </div>
                  <p className="text-xs text-gray-300">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Wins */}
          <div className="border border-[#10B981] bg-[#1e1e1e] rounded-lg overflow-hidden">
            <div className="border-b border-[#10B981]/20 p-3 flex items-center gap-2">
              <Trophy size={20} className="text-[#10B981]" />
              <span className="text-sm font-bold text-white">DERNIERS WINS</span>
            </div>
            <div className="p-3 space-y-2">
              {wins.map((win) => (
                <div key={win.id} className="flex items-center justify-between p-2 border border-[#10B981]/20 bg-[#10B981]/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-[#10B981]/40 bg-[#10B981]/10 rounded flex items-center justify-center">
                      <span className="text-[10px] text-[#10B981]">W</span>
                    </div>
                    <span className="text-xs text-gray-300">{win.user}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#10B981]">{win.amount}</p>
                    <p className="text-xs text-gray-500">{win.time}</p>
                  </div>
                </div>
              ))}

              <button className="w-full py-2 rounded-lg border border-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/10 transition-all text-xs font-bold">
                [VOIR TOUS LES WINS]
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">1,234</p>
                <p className="text-xs text-gray-500">MEMBRES</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#10B981]">89%</p>
                <p className="text-xs text-gray-500">WIN RATE</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">42</p>
                <p className="text-xs text-gray-500">FORMATIONS</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#EF4444]">LIVE</p>
                <p className="text-xs text-gray-500">SESSION</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}