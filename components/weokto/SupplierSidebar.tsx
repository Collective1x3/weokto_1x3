'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  House,
  Buildings,
  ChartLine,
  Gear,
  SignOut,
  CaretDown,
  List,
  Users,
  ArrowSquareOut,
  Chats,
  ShoppingBag,
  Plus
} from 'phosphor-react'
import { useGuilds } from '@/hooks/useGuilds'
import { useProducts } from '@/hooks/useProducts'

const supplierNavigation = [
  { name: 'DASHBOARD', href: '/supplier/dashboard', icon: House },
  { name: 'COMMUNAUTÉS', href: '/supplier/products', icon: ShoppingBag },
  { name: 'GUILDES', href: '/supplier/guilds', icon: Buildings },
  { name: 'ANALYTICS', href: '/supplier/analytics', icon: ChartLine }
]
const communityNavigation = [{ name: 'MESSAGES', href: '/supplier/messages', icon: Chats }]
const bottomNavigation = [{ name: 'PARAMÈTRES', href: '/supplier/settings', icon: Gear }]

interface SupplierSidebarProps {
  userName?: string
}

export default function SupplierSidebar({ userName = 'SUPPLIER_001' }: SupplierSidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { guilds, isLoading: guildsLoading } = useGuilds()
  const { products, isLoading: productsLoading } = useProducts({ take: 20 })
  const [guildsExpanded, setGuildsExpanded] = useState(() => pathname?.startsWith('/supplier/guilds') ?? false)
  const [communitiesExpanded, setCommunitiesExpanded] = useState(() => pathname?.startsWith('/supplier/products') ?? false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen, isMobile])

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
    if (pathname?.startsWith('/supplier/guilds')) {
      setGuildsExpanded(true)
    }
    if (pathname?.startsWith('/supplier/products')) {
      setCommunitiesExpanded(true)
    }
  }, [pathname, isMobile])

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 right-4 z-50 p-3 bg-[#1e1e1e] border border-[#B794F4] text-[#B794F4] hover:bg-purple-400/10 rounded-xl shadow-lg transition-all duration-200"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <List size={28} weight="bold" />
        </button>
      )}

      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div
        className={`flex flex-col bg-[#1e1e1e] rounded-2xl border border-[#B794F4] transition-all duration-300 ${
          isMobile
            ? `fixed top-0 left-0 h-full z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-[280px]`
            : 'relative w-[290px] h-full'
        }`}
      >
        <div className="border-b border-[#B794F4]/20 p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
              alt="Weokto"
              width={40}
              height={40}
              priority
              className="flex-shrink-0"
            />
            <div className="text-[#B794F4] text-lg font-bold">SUPPLIER</div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto space-y-6">
          <div>
            <div className="px-3 mb-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">GESTION</h3>
            </div>
            <div className="space-y-1">
              {supplierNavigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                if (item.name === 'GUILDES') {
                  const sectionActive = pathname?.startsWith('/supplier/guilds') ?? false
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setGuildsExpanded(!guildsExpanded)}
                        className="group relative w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <CaretDown
                          size={14}
                          className={`transition-transform duration-200 ${guildsExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <div className={`mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-200 ease-out ${guildsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {guildsLoading ? (
                          <div className="px-3 py-2 text-xs text-gray-500">Chargement…</div>
                        ) : guilds.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-gray-500">Aucune guilde</div>
                        ) : (
                          <>
                            {guilds.slice(0, 6).map((guild: { id: string; name: string; slug: string }) => (
                              <Link
                                key={guild.id}
                                href={`/supplier/guilds/${guild.slug}`}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                  pathname?.startsWith(`/supplier/guilds/${guild.slug}`)
                                    ? 'bg-purple-400/10 text-white'
                                    : 'text-gray-500 hover:text-white hover:bg-purple-400/10'
                                }`}
                              >
                                <span className="truncate">{guild.name}</span>
                              </Link>
                            ))}
                            {guilds.length > 6 && (
                              <Link
                                href="/supplier/guilds"
                                className="flex items-center gap-1 px-3 py-2 text-xs text-gray-500 hover:text-[#B794F4] transition-colors duration-200"
                              >
                                Voir toutes
                                <ArrowSquareOut size={12} />
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                }

                if (item.name === 'COMMUNAUTÉS') {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setCommunitiesExpanded(!communitiesExpanded)}
                        className="group relative w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <CaretDown
                          size={14}
                          className={`transition-transform duration-200 ${communitiesExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <div className={`mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-200 ease-out ${communitiesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {productsLoading ? (
                          <div className="px-3 py-2 text-xs text-gray-500">Chargement…</div>
                        ) : products.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-gray-500">
                            Aucune communauté
                            <Link
                              href="/supplier/products"
                              className="mt-2 inline-flex items-center gap-1 rounded-md border border-[#B794F4]/30 px-3 py-1 text-[11px] font-semibold text-[#B794F4] transition hover:border-[#B794F4] hover:text-white"
                            >
                              <Plus size={10} weight="bold" />
                              Créer un produit
                            </Link>
                          </div>
                        ) : (
                          <>
                            {products.slice(0, 6).map((product: { id: string; name: string }) => {
                              const target = `/supplier/products/${product.id}`
                              const isActive = pathname?.startsWith(target)
                              return (
                                <Link
                                  key={product.id}
                                  href={target}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                    isActive
                                      ? 'bg-purple-400/10 text-white'
                                      : 'text-gray-500 hover:text-white hover:bg-purple-400/10'
                                  }`}
                                >
                                  <span className="truncate">{product.name}</span>
                                </Link>
                              )
                            })}
                            {products.length > 6 && (
                              <Link
                                href="/supplier/products"
                                className="flex items-center gap-1 px-3 py-2 text-xs text-gray-500 hover:text-[#B794F4] transition-colors duration-200"
                              >
                                Voir toutes
                                <ArrowSquareOut size={12} />
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-400/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-purple-400/10'
                    }`}
                  >
                    <Icon
                      size={20}
                      weight={isActive ? 'fill' : 'regular'}
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'
                      }`}
                    />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <div className="px-3 mb-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">COMMUNITY</h3>
            </div>
            <div className="space-y-1">
              {communityNavigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-400/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-purple-400/10'
                    }`}
                  >
                    <Icon
                      size={20}
                      weight={isActive ? 'fill' : 'regular'}
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'
                      }`}
                    />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        <div className="border-t border-purple-400/10 p-3">
          <div className="px-3 space-y-3">
            <Link href="/supplier/profile" className="w-full flex items-center gap-4 p-2 rounded-lg hover:bg-purple-400/10 transition-all group">
              <div className="relative">
                <div className="w-14 h-14 rounded-lg bg-purple-400/20 flex items-center justify-center">
                  <Users size={24} className="text-purple-400" />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-0.5 text-left">
                <span className="text-white text-base font-semibold leading-tight">{userName}</span>
                <span className="text-gray-400 text-xs leading-none">FOURNISSEUR</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="border-t border-purple-400/10 p-3 space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-400/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'rotate-90' : ''}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}

          <button
            className="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' })
                window.location.href = '/'
              } catch (error) {
                console.error('Logout error:', error)
              }
            }}
          >
            <SignOut size={20} />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  )
}
