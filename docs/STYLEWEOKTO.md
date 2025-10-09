# 🎨 Style Guide WeOkto - Design System

## 📌 Vue d'ensemble

WeOkto utilise un design system moderne et cohérent basé sur un fond Matrix japonais violet, des containers sombres avec des bordures arrondies et une palette de couleurs centrée sur le violet (#B794F4).

---

## 🎨 Palette de couleurs

### Couleurs principales

```tsx
const COLORS = {
  // Violet principal - utilisé pour tous les éléments interactifs
  primary: '#B794F4',

  // Backgrounds
  background: '#1e1e1e',        // Containers et cards
  backgroundDark: '#141414',    // Fond global (avec matrix)

  // Textes
  text: {
    primary: 'white',           // Titres et textes principaux
    secondary: 'text-gray-400', // Textes secondaires
    tertiary: 'text-gray-500'   // Labels et hints
  }
}
```

### Couleurs contextuelles (accents spécifiques)

Ces couleurs sont **conservées** pour des usages contextuels précis :

```tsx
// 🟢 Vert #10B981
- Victoires (Wins)
- Succès
- Statuts "approved"
- Messages de confirmation

// 🔴 Rouge #EF4444
- Erreurs et alertes
- Danger zone
- Statuts "live"
- Actions destructives

// 🟠 Orange
- Announcements importantes
- Fire icons (streak/flammes)
- Boutons UPGRADE (call-to-action spécial)
- Pearls (monnaie virtuelle)
- Sous-menu Guild (accent spécial)
```

### ❌ À ÉVITER

- ~~`#FFB000` (orange)~~ - réservé uniquement pour les accents très spécifiques
- ~~Dégradés~~ (`gradient-to-r from-X to-Y`)
- ~~Couleurs multiples~~ (sauf pour statuts contextuels)

---

## 🌊 Effet Matrix (Fond japonais)

### Description

L'effet Matrix est un fond animé de caractères japonais (katakana) tombant en cascade, créant une atmosphère cyberpunk et futuriste.

### Code complet

```tsx
'use client'

import { useEffect, useRef } from 'react'

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Définir les dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Configuration
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    // Animation
    const draw = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(20, 20, 20, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Caractères japonais (katakana)
        const text = String.fromCharCode(0x30A0 + Math.random() * 96)

        // Couleur violette avec transparence
        ctx.fillStyle = '#B794F4'
        ctx.globalAlpha = 0.3

        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        ctx.globalAlpha = 1

        // Reset drops
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 opacity-10 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
```

### Utilisation dans un layout

```tsx
<div className="flex h-screen bg-[#141414] font-mono relative">
  {/* Matrix Rain Background */}
  <canvas
    ref={canvasRef}
    className="fixed inset-0 opacity-10 pointer-events-none"
    style={{ zIndex: 0 }}
  />

  {/* Contenu de la page */}
  <div className="flex-1 relative z-10">
    {children}
  </div>
</div>
```

### Paramètres ajustables

```tsx
// Opacité du matrix
opacity-10  // 10% (standard)
opacity-5   // 5% (plus subtil)
opacity-20  // 20% (plus visible)

// Vitesse d'animation
setInterval(draw, 33)  // ~30fps (standard)
setInterval(draw, 50)  // ~20fps (plus lent)
setInterval(draw, 16)  // ~60fps (plus rapide)

// Densité des colonnes
const fontSize = 16    // Standard
const fontSize = 12    // Plus dense
const fontSize = 20    // Moins dense
```

---

## 📦 Backgrounds

```tsx
// Background global des pages
className="min-h-screen pb-20"
// Pas de bg-color → matrix visible

// Containers principaux
className="bg-[#1e1e1e] rounded-2xl border border-[#B794F4]"

// Cards / Items secondaires
className="bg-[#1e1e1e] rounded-lg border border-[#B794F4]/20"

// Inputs et formulaires
className="bg-[#1e1e1e] border border-[#B794F4]/40 focus:border-[#B794F4]"
```

---

## 🔲 Border Radius

```tsx
// Containers principaux
className="rounded-2xl"

// Items, cards, buttons
className="rounded-lg"

// Inputs, petits éléments
className="rounded"
```

**❌ Éviter:** `rounded-sm`, angles carrés (sauf cas spécifiques)

---

## 🖱️ Hovers & Transitions

```tsx
// Hover standard (cards, items)
className="hover:bg-purple-400/10 transition-all duration-200"

// Boutons interactifs
className="hover:bg-purple-400/20 hover:border-[#B794F4]"

// Texte
className="text-gray-400 hover:text-white transition-colors duration-200"

// Icônes dans un groupe
className="text-gray-500 group-hover:text-purple-400 transition-colors"
```

---

## 🔳 Bordures

```tsx
// Containers principaux
border border-[#B794F4]        // Border pleine (visible)

// Cards/items secondaires
border border-[#B794F4]/20     // Border subtile (20% d'opacité)

// Sections internes / séparateurs
border-t border-[#B794F4]/20   // Séparateur horizontal
```

---

## 📏 Espacement

```tsx
// Padding containers
p-4 md:p-6                     // Mobile → Desktop

// Gaps
gap-4                          // Standard
gap-6 space-y-6               // Sections

// Margins
mb-6                          // Entre sections
md:mr-6                       // Margin droite (desktop, pour sidebar)
```

---

## 🧩 WeoktoSidebar - Composant de référence

### Code complet

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUserSession } from '@/contexts/UserSessionContext'
import {
  House,
  ShoppingBag,
  ChartLine,
  Sparkle,
  Shield,
  Trophy,
  CaretDown,
  GridFour,
  ChatCircle,
  GraduationCap,
  Lifebuoy,
  Sword,
  Gear,
  SignOut,
  MagicWand,
  User,
  Fire,
  PaintBrush,
  Bell,
  CaretRight,
  List
} from 'phosphor-react'

export default function WeoktoSidebar() {
  const { user } = useUserSession()
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'

  const [isGuildExpanded, setIsGuildExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 right-4 p-3 bg-[#1e1e1e] border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black rounded-xl shadow-lg transition-all duration-200"
          style={{ zIndex: 9999 }}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <List size={24} weight="bold" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          style={{ zIndex: 9998 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-[#1e1e1e] rounded-2xl border border-[#B794F4] flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile
            ? `fixed top-0 left-0 h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-[280px]`
            : 'relative w-[290px] h-full'
          }
        `}
        style={{ zIndex: isMobile ? 9998 : 'auto' }}
      >
      {/* Logo WEOKTO */}
      <div className="overflow-hidden p-3 flex justify-center">
        <pre className="text-[#B794F4] text-[8px] block text-left whitespace-pre" style={{display: 'block', lineHeight: '1.3', margin: 0}}>
{`██╗    ██╗███████╗ ██████╗ ██╗  ██╗████████╗ ██████╗
██║    ██║██╔════╝██╔═══██╗██║ ██╔╝╚══██╔══╝██╔═══██╗
██║ █╗ ██║█████╗  ██║   ██║█████╔╝    ██║   ██║   ██║
██║███╗██║██╔══╝  ██║   ██║██╔═██╗    ██║   ██║   ██║
╚███╔███╔╝███████╗╚██████╔╝██║  ██╗   ██║   ╚██████╔╝
 ╚══╝╚══╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝`}
        </pre>
      </div>

      {/* Separator */}
      <div className="border-t border-[#B794F4]"></div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-6">
        {/* Business Category */}
        <div>
          <div className="px-3 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Business</h3>
          </div>
          <div className="space-y-1">
            <Link href="/home" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <House size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
            <Link href="/products" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <ShoppingBag size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Marketplace</span>
            </Link>
            <Link href="/analytics" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <ChartLine size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Analytics</span>
            </Link>
            <Link href="/oktoai" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <MagicWand size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">OktoAI</span>
            </Link>
          </div>
        </div>

        {/* Communauté Category */}
        <div>
          <div className="px-3 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Communauté</h3>
          </div>
          <div className="space-y-1">
            {/* Guilde Dropdown */}
            <div>
              <button
                onClick={() => setIsGuildExpanded(!isGuildExpanded)}
                className="group relative w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <Shield size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  <span className="font-medium text-sm">Guilde</span>
                </div>
                <CaretDown
                  size={14}
                  className={`transition-transform duration-200 ${isGuildExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Guild Submenu - Accent orange spécial */}
              <div className={`mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-200 ease-out ${isGuildExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                <Link href="/guild/home" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <GridFour size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Home</span>
                </Link>
                <Link href="/guild/chat" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <ChatCircle size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Chat</span>
                </Link>
                <Link href="/guild/formation" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <GraduationCap size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Formation</span>
                </Link>
                <Link href="/guild/wins" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <Trophy size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Victoires</span>
                </Link>
                <Link href="/guild/support" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <Lifebuoy size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Support</span>
                </Link>
              </div>
            </div>

            {/* Messages */}
            <Link href="/messages" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <ChatCircle size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Messages</span>
            </Link>

            {/* Compétition */}
            <Link href="/competition" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <Sword size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Compétition</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-purple-400/10 p-3">
        <div className="px-3 space-y-3">
          <Link href="/profile" className="w-full flex items-center gap-4 p-2 rounded-lg hover:bg-purple-400/10 transition-all group">
            <div className="relative">
              <div className="w-14 h-14 rounded-lg bg-purple-400/20 flex items-center justify-center">
                <User size={24} className="text-purple-400" />
              </div>
              {/* Level Badge - Orange pour badge spécial */}
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                12
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-0.5 text-left">
              <span className="text-white text-base font-semibold leading-tight">{displayName}</span>
              <div className="flex items-center gap-1.5">
                <Fire size={14} weight="fill" className="text-orange-500" />
                <span className="text-orange-400 text-sm font-mono leading-none">7</span>
              </div>
            </div>

            <CaretRight size={18} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
          </Link>

          <div className="flex items-center gap-2 justify-center px-2">
            <Link href="/myokto" className="flex-1 h-12 rounded-lg border border-purple-400/20 hover:bg-purple-400/10 hover:border-purple-400/40 text-gray-400 hover:text-purple-400 transition-all flex items-center justify-center text-sm font-medium" title="MyOkto">
              MyOkto
            </Link>
            <Link href="/notifications" className="w-12 h-12 rounded-lg border border-purple-400/20 hover:bg-purple-400/10 hover:border-purple-400/40 text-gray-400 hover:text-purple-400 transition-all flex items-center justify-center" title="Notifications">
              <Bell size={22} weight="regular" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-purple-400/10 p-3 space-y-1">
        <Link href="/settings" className="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
          <Gear size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm">Réglages</span>
        </Link>

        <button className="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
          <SignOut size={20} />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
      </div>
    </>
  )
}
```

### Points clés du composant

#### 1. Structure générale
- Container principal : `bg-[#1e1e1e] rounded-2xl border border-[#B794F4]`
- Navigation fluide avec `overflow-y-auto`
- Séparateurs subtils : `border-t border-[#B794F4]` ou `border-purple-400/10`

#### 2. Items de navigation
```tsx
// Item standard
<Link className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
  <Icon size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
  <span className="font-medium text-sm">Label</span>
</Link>
```

#### 3. Dropdown Guilde (avec animation)
- Bouton avec `CaretDown` qui rotate à 180deg
- Submenu avec `max-h-0 opacity-0` → `max-h-64 opacity-100`
- **Accent orange spécial** pour les sous-items de guilde

#### 4. User Profile Card
- Avatar avec badge level en orange
- Fire icon (streak) en orange
- Hover subtil avec `hover:bg-purple-400/10`

#### 5. Responsive Mobile
- Bouton menu fixe en haut à droite
- Sidebar en slide-in avec overlay
- Gestion du scroll body

---

## 🧱 Templates de composants

### Container principal (page)
```tsx
<div className="p-4 md:p-6 h-full">
  <div className="max-w-7xl mx-auto">
    <div className="rounded-2xl border border-[#B794F4] bg-[#1e1e1e] mb-6 md:mr-6 p-6">
      {/* Contenu */}
    </div>
  </div>
</div>
```

### Card simple
```tsx
<div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4 hover:bg-purple-400/5 transition-all duration-200">
  {/* Contenu */}
</div>
```

### Bouton primaire
```tsx
<button className="px-6 py-3 rounded-lg bg-purple-400/10 text-[#B794F4] hover:bg-purple-400/20 transition-all duration-200 font-bold text-sm border border-[#B794F4]/40 hover:border-[#B794F4]">
  LABEL
</button>
```

### Bouton secondaire
```tsx
<button className="px-6 py-3 rounded-lg border border-[#B794F4]/20 text-gray-400 hover:text-white hover:bg-purple-400/10 transition-all duration-200 font-bold text-sm">
  LABEL
</button>
```

### Input
```tsx
<input
  className="w-full px-4 py-3 bg-[#1e1e1e] rounded border border-[#B794F4]/40 text-white font-mono focus:outline-none focus:border-[#B794F4] transition-colors duration-200 placeholder:text-gray-500 text-sm"
  placeholder="Placeholder..."
/>
```

### Label
```tsx
<label className="block text-xs text-[#B794F4] mb-2 uppercase tracking-wide">
  LABEL
</label>
```

### Stat card
```tsx
<div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4 text-center">
  <div className="text-3xl font-bold text-white">{value}</div>
  <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">Label</p>
</div>
```

---

## 📋 Checklist par fichier

Avant de valider un composant, vérifier :

```markdown
- [ ] Background transparent (pages) ou bg-[#1e1e1e] (containers)
- [ ] Borders violet uniquement (border-[#B794F4] ou /20 pour subtil)
- [ ] Hovers cohérents (hover:bg-purple-400/10)
- [ ] Textes secondaires en gray-400/500
- [ ] Border radius harmonisé (rounded-lg/rounded-2xl)
- [ ] Transitions à duration-200
- [ ] Pas de dégradés
- [ ] Suppression des couleurs orange (sauf exceptions contextuelles)
- [ ] md:mr-6 sur les containers principaux (desktop, pour espace sidebar)
- [ ] Icônes phosphor-react avec weight="regular"
- [ ] Matrix background visible (pages transparentes)
```

---

## 🎯 Icônes - phosphor-react

```bash
npm install phosphor-react
```

```tsx
import { House, ShoppingBag, Shield } from 'phosphor-react'

// Utilisation standard
<House size={20} weight="regular" className="text-gray-500 group-hover:text-purple-400 transition-colors" />

// Weights disponibles
weight="thin"      // 100
weight="light"     // 300
weight="regular"   // 400 (par défaut)
weight="bold"      // 700
weight="fill"      // Rempli (ex: Fire icon)
```

---

## 🚨 Règles strictes

### ❌ NE JAMAIS MODIFIER
- La logique métier (hooks, fetch, state)
- Les routes API
- Les validations
- Les props des composants
- Les imports de dépendances

### ✅ MODIFIER UNIQUEMENT
- Les `className`
- Les couleurs CSS
- Les border-radius
- Les transitions
- La structure HTML (si nécessaire pour le style)

---

## 📞 Références

Si problème de style, référez-vous à :
1. [WeoktoSidebar.tsx](../components/WeoktoSidebar.tsx) (référence absolue)
2. [DashboardLayoutClient.tsx](../app/(dashboard)/DashboardLayoutClient.tsx) (effet Matrix)
3. Ce document

**Dernière mise à jour :** 2025-10-09
**Version du design system :** 1.0
