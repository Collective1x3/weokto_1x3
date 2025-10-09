'use client'

import type { ReactNode } from 'react'
import { useGuild } from '@/hooks/useGuilds'
import GuildNavigationHeader from '@/components/weokto/guild/GuildNavigationHeader'
import {
  Activity,
  ChatsTeardrop,
  Gear,
  GraduationCap,
  House,
  Package,
  UsersThree,
  Warning
} from 'phosphor-react'

interface SupplierGuildLayoutProps {
  slug: string
  children: ReactNode
}

export function SupplierGuildLayout({ slug, children }: SupplierGuildLayoutProps) {
  const { guild, linkedProduct, isLoading, error } = useGuild(slug)

  const productTabHref = linkedProduct ? `/supplier/products/${linkedProduct.id}` : '/supplier/products'

  if (error) {
    return (
      <div className="min-h-screen p-4 font-mono text-white md:mr-6 md:pt-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#EF4444] bg-[#EF4444]/10 p-6">
          <div className="flex items-start gap-3">
            <Warning size={28} className="text-[#EF4444]" />
            <div>
              <p className="text-lg font-bold text-[#EF4444] mb-1">Erreur de chargement</p>
              <p className="text-sm text-[#EF4444]/70">Impossible de récupérer les informations de la guilde.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 font-mono md:mr-6 md:pt-6">
      <GuildNavigationHeader
        className="mb-6"
        guildName={guild?.name ?? 'Guilde'}
        subtitle={guild?.slug ? `/${guild.slug}` : undefined}
        tabs={[
          {
            key: 'overview',
            label: '[HOME]',
            href: `/supplier/guilds/${slug}`,
            icon: <House size={18} />
          },
          {
            key: 'product',
            label: '[PRODUIT]',
            href: productTabHref,
            icon: <Package size={18} />,
            match: (pathname) => pathname.startsWith('/supplier/products')
          },
          {
            key: 'members',
            label: '[MEMBRES]',
            href: `/supplier/guilds/${slug}/members`,
            icon: <UsersThree size={18} />
          },
          {
            key: 'chat',
            label: '[CHAT]',
            href: `/supplier/guilds/${slug}/chat`,
            icon: <ChatsTeardrop size={18} />
          },
          {
            key: 'actions',
            label: '[ACTIONS]',
            href: `/supplier/guilds/${slug}/actions`,
            icon: <Activity size={18} />
          },
          {
            key: 'formations',
            label: '[FORMATIONS]',
            href: `/supplier/guilds/${slug}/formations`,
            icon: <GraduationCap size={18} />
          },
          {
            key: 'settings',
            label: '[PARAMÈTRES]',
            href: `/supplier/guilds/${slug}/settings`,
            icon: <Gear size={18} />
          }
        ]}
        showUpgrade={false}
      />
      <div className="space-y-6">{children}</div>
    </div>
  )
}
