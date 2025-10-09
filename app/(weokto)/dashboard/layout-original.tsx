"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  House, 
  CurrencyDollar, 
  Users, 
  Sparkle, 
  Trophy,
  ShoppingBag,
  ChartLine,
  User,
  Gear,
  SignOut,
  CaretLeft,
  CaretRight,
  Moon,
  Sun,
  Shield,
  Sword,
  Crown,
  CaretDown
} from "phosphor-react";

const businessNavigation = [
  { name: "Dashboard", href: "/home", icon: House },
  { name: "Perles", href: "/pearls", icon: Sparkle },
  { name: "Produits", href: "/products", icon: ShoppingBag },
  { name: "Analytiques", href: "/analytics", icon: ChartLine },
];

const communityNavigation = [
  { name: "Guilde", href: "/guild", icon: Shield },
  { name: "Clan", href: "/clan", icon: Sword },
  { name: "Classements", href: "/leaderboards", icon: Trophy },
];

const bottomNavigation = [
  { name: "Paramètres", href: "/settings", icon: Gear },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [userName, setUserName] = useState('Utilisateur');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.displayName || 'Utilisateur');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen, isMobile]);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-base: 255 255 255;
          --bg-subtle: 249 250 251;
          --bg-muted: 243 244 246;
          --text-primary: 17 24 39;
          --text-secondary: 75 85 99;
          --text-muted: 107 114 128;
          --border-subtle: 229 231 235;
          --border-strong: 209 213 219;
        }

        .dark {
          --bg-base: 9 9 11;
          --bg-subtle: 18 18 20;
          --bg-muted: 27 27 30;
          --text-primary: 250 250 250;
          --text-secondary: 212 212 216;
          --text-muted: 161 161 170;
          --border-subtle: 39 39 42;
          --border-strong: 63 63 70;
        }

        .bg-base { background-color: rgb(var(--bg-base)); }
        .bg-subtle { background-color: rgb(var(--bg-subtle)); }
        .bg-muted { background-color: rgb(var(--bg-muted)); }
        .text-primary { color: rgb(var(--text-primary)); }
        .text-secondary { color: rgb(var(--text-secondary)); }
        .text-muted { color: rgb(var(--text-muted)); }
        .border-subtle { border-color: rgb(var(--border-subtle)); }
        .border-strong { border-color: rgb(var(--border-strong)); }
      `}</style>

      <div className="flex h-screen bg-base relative">
        {/* Mobile Hamburger Button */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-4 right-4 z-50 p-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg shadow-lg transition-all duration-300"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        )}

        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`flex flex-col bg-subtle border-r border-subtle transition-all duration-300 ${
          isMobile 
            ? `fixed top-0 left-0 h-full z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-[280px]`
            : `relative ${isCollapsed ? "w-[72px]" : "w-64"}`
        }`}>
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} h-24 px-4 border-b border-subtle`}>
            <div className="flex items-center gap-3">
              <Image 
                src="/weoktologosvg/logo-weokto-blanc-violet-orange-ouvert.svg"
                alt="Weokto" 
                width={48}
                height={48}
                priority
              />
              <span className={`text-2xl font-bold text-primary transition-all duration-300 ${isCollapsed && !isMobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`} style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, lineHeight: '48px' }}>
                Weokto
              </span>
            </div>
          </div>
          
          
          {/* Bouton toggle sur la bordure - Desktop only */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute top-[32px] -right-3 z-10 p-1.5 bg-subtle border border-violet-500/20 rounded-lg hover:bg-muted hover:border-violet-500/30 transition-all shadow-sm"
            >
            {isCollapsed ? (
              <CaretRight size={16} className="text-secondary" />
            ) : (
              <CaretLeft size={16} className="text-secondary" />
            )}
            </button>
          )}

          {/* Navigation principale */}
          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {/* Business Section */}
            <div>
              <h3 className={`px-3 mb-2 text-xs font-semibold text-muted uppercase tracking-wider transition-opacity duration-300 ${isCollapsed && !isMobile ? 'opacity-0' : 'opacity-100'}`} style={{ fontFamily: 'var(--font-inter)' }}>
                Business
              </h3>
              <div className="space-y-1">
                {businessNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={isCollapsed ? item.name : undefined}
                      className={`
                        flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
                            : "text-secondary hover:bg-muted hover:text-primary"
                        }
                      `}
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      <div className="w-5 flex items-center justify-center">
                        <Icon 
                          size={20} 
                          weight={isActive ? "fill" : "regular"}
                          className="flex-shrink-0"
                        />
                      </div>
                      <span className={`transition-all duration-300 ${isCollapsed && !isMobile ? 'opacity-0 w-0 ml-0' : 'opacity-100 ml-3'} overflow-hidden`}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Community Section */}
            <div>
              <h3 className={`px-3 mb-2 text-xs font-semibold text-muted uppercase tracking-wider transition-opacity duration-300 ${isCollapsed && !isMobile ? 'opacity-0' : 'opacity-100'}`} style={{ fontFamily: 'var(--font-inter)' }}>
                Communauté
              </h3>
              <div className="space-y-1">
                {communityNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={isCollapsed ? item.name : undefined}
                      className={`
                        flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
                            : "text-secondary hover:bg-muted hover:text-primary"
                        }
                      `}
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      <div className="w-5 flex items-center justify-center">
                        <Icon 
                          size={20} 
                          weight={isActive ? "fill" : "regular"}
                          className="flex-shrink-0"
                        />
                      </div>
                      <span className={`transition-all duration-300 ${isCollapsed && !isMobile ? 'opacity-0 w-0 ml-0' : 'opacity-100 ml-3'} overflow-hidden`}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Profile Section */}
          <div className={`border-t border-subtle ${isCollapsed && !isMobile ? 'px-3 py-3' : 'p-4'}`}>
            {isCollapsed && !isMobile ? (
              <Link
                href="/profile"
                className="flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-violet-500/30 hover:ring-violet-500/50 transition-all">
                  <Image
                    src="/images/pfpr4_coachTBCB.png"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ) : isMobile ? (
              <div>
                {/* Mobile Profile - Compact View */}
                <button
                  onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                  className="w-full"
                >
                  <div className="flex items-center gap-3">
                    {/* Profile Image with Expand Indicator */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-violet-500/30">
                        <Image
                          src="/images/pfpr4_coachTBCB.png"
                          alt="Profile"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Expand Arrow */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                        <CaretDown 
                          size={12} 
                          weight="bold" 
                          className={`text-white transition-transform ${isProfileExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                    
                    {/* Level and XP Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-violet-400">NIV 12</span>
                        <span className="text-xs text-muted">• 1,250 XP</span>
                      </div>
                      <p className="text-sm font-semibold text-primary">{userName}</p>
                    </div>
                  </div>
                </button>
                
                {/* Expanded Profile View */}
                {isProfileExpanded && (
                  <Link href="/profile" className="block mt-4">
                    <div className="relative h-48 bg-gradient-to-br from-violet-500/10 to-violet-600/10 rounded-xl overflow-hidden border-2 border-violet-500/30 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all">
                      <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <Image
                          src="/images/pfpr4_coachTBCB.png"
                          alt="Profile"
                          width={256}
                          height={192}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-manrope)' }}>
                            {userName}
                          </p>
                          <CaretRight size={16} className="text-white/80" weight="bold" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
                
                {/* XP Progress Bar */}
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted text-xs font-medium">Niveau 12</span>
                    <span className="text-muted text-xs">1,250 / 1,800 XP</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full relative"
                      style={{ width: '70%' }}
                    >
                      <div className="absolute inset-0 bg-violet-400/30 blur-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/profile">
                <div>
                  <div className="relative h-48 bg-gradient-to-br from-violet-500/10 to-violet-600/10 rounded-xl overflow-hidden border-2 border-violet-500/30 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all group">
                    {/* Character Image with inner container to prevent overflow */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <Image
                        src="/images/pfpr4_coachTBCB.png"
                        alt="Profile"
                        width={256}
                        height={192}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Subtle vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                    
                    {/* Bottom gradient for text */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    
                    {/* User Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-manrope)' }}>
                          {userName}
                        </p>
                        <CaretRight size={16} className="text-white/80" weight="bold" />
                      </div>
                    </div>
                  </div>
                  
                  {/* XP Progress Bar Outside */}
                  <div className="mt-3 px-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted text-xs font-medium">Niveau 12</span>
                      <span className="text-muted text-xs">1,250 / 1,800 XP</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full relative"
                        style={{ width: '70%' }}
                      >
                        <div className="absolute inset-0 bg-violet-400/30 blur-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Navigation du bas */}
          <div className="border-t border-subtle">
            <nav className={`px-3 py-4 ${isMobile ? 'flex items-center justify-around' : 'space-y-1'}`}>
              {bottomNavigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={`
                      flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-lg transition-all
                      ${
                        isActive
                          ? "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
                          : "text-secondary hover:bg-muted hover:text-primary"
                      }
                    `}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    <div className="w-5 flex items-center justify-center">
                      <Icon 
                        size={20} 
                        weight={isActive ? "fill" : "regular"}
                        className="flex-shrink-0"
                      />
                    </div>
                    {!isMobile && (
                      <span className={`transition-all duration-300 ${isCollapsed && !isMobile ? 'opacity-0 w-0 ml-0' : 'opacity-100 ml-3'} overflow-hidden`}>
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                title={isCollapsed ? (isDark ? "Mode clair" : "Mode sombre") : undefined}
                className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} w-full px-3 py-2 text-sm font-medium text-secondary rounded-lg transition-all hover:bg-muted hover:text-primary`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <div className="w-5 flex items-center justify-center">
                  {isDark ? (
                    <Sun size={20} className="flex-shrink-0" />
                  ) : (
                    <Moon size={20} className="flex-shrink-0" />
                  )}
                </div>
                {!isMobile && (
                  <span className={`transition-all duration-300 ${isCollapsed && !isMobile ? 'opacity-0 w-0 ml-0' : 'opacity-100 ml-3'} overflow-hidden`}>
                    {isDark ? "Mode clair" : "Mode sombre"}
                  </span>
                )}
              </button>
              
              {/* Bouton déconnexion */}
              <button
                title={isCollapsed ? "Déconnexion" : undefined}
                className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} w-full px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 rounded-lg transition-all hover:bg-red-500/10`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <div className="w-5 flex items-center justify-center">
                  <SignOut size={20} className="flex-shrink-0" />
                </div>
                {!isMobile && (
                  <span className={`transition-all duration-300 ${isCollapsed && !isMobile ? 'opacity-0 w-0 ml-0' : 'opacity-100 ml-3'} overflow-hidden`}>
                    Déconnexion
                  </span>
                )}
              </button>
            </nav>
          </div>

        </div>

        {/* Main content */}
        <div className={`flex-1 overflow-auto bg-base transition-all duration-300 ${
          isMobile && isSidebarOpen ? 'transform translate-x-[280px]' : ''
        }`}>
          {children}
        </div>
      </div>
    </>
  );
}