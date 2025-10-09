'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'phosphor-react'

type NavItem = { name: string; href: string; icon: any }

const supplierNavigation: NavItem[] = [
  { name: 'DASHBOARD', href: '/supplier/dashboard', icon: null },
  { name: 'GUILDES', href: '/supplier/guilds', icon: null },
  { name: 'ANALYTICS', href: '/supplier/analytics', icon: null },
]

const bottomNavigation: NavItem[] = [
  { name: 'PARAMÈTRES', href: '/supplier/settings', icon: null },
]

export default function SupplierSidebarModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="absolute top-0 left-0 h-full w-[88%] max-w-[320px] bg-[#1e1e1e] rounded-r-2xl border-r border-[#B794F4] shadow-2xl">
        <div className="border-b border-[#B794F4]/20 p-4 flex items-center justify-between">
          <div className="text-[#B794F4] text-lg font-bold">SUPPLIER</div>
          <button
            aria-label="Close"
            className="p-2 rounded border border-[#B794F4]/40 text-gray-400 hover:text-white hover:bg-purple-400/10 transition-all duration-200"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-3 overflow-y-auto">
          <div className="mb-5">
            <div className="px-2 mb-2 text-gray-500 text-xs uppercase">{'> GESTION'}</div>
            <div className="space-y-1">
              {supplierNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`block px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-400/20 text-[#B794F4] border border-[#B794F4]'
                        : 'text-gray-400 hover:text-white hover:bg-purple-400/10 border border-transparent'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mt-6">
            <div className="px-2 mb-2 text-gray-500 text-xs uppercase">{'> COMPTE'}</div>
            <div className="space-y-1">
              {bottomNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`block px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-400/20 text-[#B794F4] border border-[#B794F4]'
                        : 'text-gray-400 hover:text-white hover:bg-purple-400/10 border border-transparent'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}


