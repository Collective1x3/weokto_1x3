"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  House,
  Sparkle,
  Trophy,
  ShoppingBag,
  ChartLine,
  Gear,
  SignOut,
  CaretLeft,
  CaretRight,
  Shield,
  Sword,
  CaretDown,
  List
} from "phosphor-react";

const businessNavigation = [
  { name: "[DASHBOARD]", href: "/home", icon: House },
  { name: "[PEARLS]", href: "/pearls", icon: Sparkle },
  { name: "[PRODUITS]", href: "/products", icon: ShoppingBag },
  { name: "[ANALYTICS]", href: "/analytics", icon: ChartLine },
];

const communityNavigation = [
  { name: "[GUILDE]", href: "/guild", icon: Shield },
  { name: "[CLAN]", href: "/clan", icon: Sword },
  { name: "[CLASSEMENTS]", href: "/leaderboards", icon: Trophy },
];

const bottomNavigation = [
  { name: "[PARAMÈTRES]", href: "/settings", icon: Gear },
];

export default function DashboardTerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [userName, setUserName] = useState('USER_001');
  const [cursorBlink, setCursorBlink] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const timer = setInterval(() => setCursorBlink(b => !b), 500);
    return () => clearInterval(timer);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.displayName || 'USER_001');
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
      <div className="flex h-screen bg-black font-mono relative">
        {/* Mobile Hamburger Button */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-4 right-4 z-50 p-3 bg-[#B794F4] hover:bg-[#B794F4]/80 text-black border-2 border-[#B794F4] shadow-lg transition-all duration-300"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            <List size={24} weight="bold" />
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
        <div className={`flex flex-col bg-black border-r-2 border-[#B794F4] transition-all duration-300 ${
          isMobile
            ? `fixed top-0 left-0 h-full z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-[280px]`
            : `relative ${isCollapsed ? "w-[72px]" : "w-64"}`
        }`}>

          {/* Terminal Header */}
          <div className={`border-b-2 border-[#B794F4] p-4 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
            <div className="flex items-center gap-3">
              <Image
                src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                alt="Weokto"
                width={40}
                height={40}
                priority
                className="flex-shrink-0"
              />
              {!isCollapsed && !isMobile && (
                <div>
                  <div className="text-[#B794F4] text-lg font-bold">WEOKTO_v2.1</div>
                  <div className="text-[#FFB000] text-xs">{'> SYSTEM_READY'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button - Desktop only */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute top-7 -right-3 z-10 p-1.5 bg-black border-2 border-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all"
            >
              {isCollapsed ? (
                <CaretRight size={14} weight="bold" />
              ) : (
                <CaretLeft size={14} weight="bold" />
              )}
            </button>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 py-4 px-2 overflow-y-auto">
            {/* Business Section */}
            <div className="mb-6">
              {!isCollapsed && (
                <div className="px-2 mb-2">
                  <div className="text-[#FFB000] text-xs">{'> BUSINESS_MODULES'}</div>
                </div>
              )}
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
                        flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} px-2 py-2 text-xs transition-all border
                        ${
                          isActive
                            ? "bg-[#B794F4] text-black border-[#B794F4]"
                            : "text-[#B794F4] hover:bg-[#B794F4]/10 border-[#B794F4]/30 hover:border-[#B794F4]"
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        weight={isActive ? "fill" : "regular"}
                        className="flex-shrink-0"
                      />
                      {!isCollapsed && (
                        <span className="ml-2">
                          {item.name}
                          {isActive && (
                            <span className={`inline-block w-2 h-4 bg-black ml-1 ${cursorBlink ? 'opacity-100' : 'opacity-0'}`} />
                          )}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Community Section */}
            <div className="mb-6">
              {!isCollapsed && (
                <div className="px-2 mb-2">
                  <div className="text-[#FFB000] text-xs">{'> COMMUNITY_MODULES'}</div>
                </div>
              )}
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
                        flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} px-2 py-2 text-xs transition-all border
                        ${
                          isActive
                            ? "bg-[#B794F4] text-black border-[#B794F4]"
                            : "text-[#B794F4] hover:bg-[#B794F4]/10 border-[#B794F4]/30 hover:border-[#B794F4]"
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        weight={isActive ? "fill" : "regular"}
                        className="flex-shrink-0"
                      />
                      {!isCollapsed && (
                        <span className="ml-2">
                          {item.name}
                          {isActive && (
                            <span className={`inline-block w-2 h-4 bg-black ml-1 ${cursorBlink ? 'opacity-100' : 'opacity-0'}`} />
                          )}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Profile Section */}
          <div className={`border-t-2 border-[#B794F4] ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
            {isCollapsed && !isMobile ? (
              <Link
                href="/profile"
                className="flex items-center justify-center"
              >
                <div className="w-10 h-10 border-2 border-[#B794F4] overflow-hidden hover:border-[#FFB000] transition-all">
                  <Image
                    src="/images/pfpr4_coachTBCB.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ) : (
              <div>
                {/* Profile Info */}
                <Link href="/profile" className="block">
                  <div className="border-2 border-[#B794F4] bg-black/50 p-3 hover:bg-[#B794F4]/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border border-[#FFB000] overflow-hidden">
                        <Image
                          src="/images/pfpr4_coachTBCB.png"
                          alt="Profile"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[#B794F4] text-xs mb-1">{'> USER_PROFILE'}</div>
                        <div className="text-white text-sm font-bold">{userName}</div>
                        <div className="text-[#FFB000] text-xs">LVL_12 • 1250_XP</div>
                      </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[#B794F4]/60 text-xs mb-1">
                        <span>XP_PROGRESS</span>
                        <span>70%</span>
                      </div>
                      <div className="h-1 bg-black border border-[#B794F4]/30">
                        <div className="h-full bg-[#FFB000]" style={{ width: '70%' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="border-t-2 border-[#B794F4] p-2">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={`
                    flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} px-2 py-2 mb-1 text-xs transition-all border
                    ${
                      isActive
                        ? "bg-[#B794F4] text-black border-[#B794F4]"
                        : "text-[#B794F4] hover:bg-[#B794F4]/10 border-[#B794F4]/30 hover:border-[#B794F4]"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    weight={isActive ? "fill" : "regular"}
                    className="flex-shrink-0"
                  />
                  {!isCollapsed && (
                    <span className="ml-2">{item.name}</span>
                  )}
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              title={isCollapsed ? "Déconnexion" : undefined}
              className={`
                flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} w-full px-2 py-2 text-xs transition-all border
                text-[#FFB000] hover:bg-[#FFB000]/10 border-[#FFB000]/30 hover:border-[#FFB000]
              `}
              onClick={() => {
                // Add logout logic here
                console.log('Logout');
              }}
            >
              <SignOut
                size={18}
                className="flex-shrink-0"
              />
              {!isCollapsed && (
                <span className="ml-2">[DÉCONNEXION]</span>
              )}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className={`flex-1 overflow-auto bg-black relative ${
          isMobile && isSidebarOpen ? 'transform translate-x-[280px]' : ''
        }`}>
          {/* Terminal-style Background Effects */}
          <div className="fixed inset-0 pointer-events-none opacity-50">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(183, 148, 244, 0.03) 2px, rgba(183, 148, 244, 0.03) 4px)',
              animation: 'scanlines 8s linear infinite'
            }} />
          </div>

          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 10px;
          }
        }
      `}</style>
    </>
  );
}