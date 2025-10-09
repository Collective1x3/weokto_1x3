"use client";

import { useUserSession } from '@/contexts/UserSessionContext';

export default function HomePage() {
  const { user } = useUserSession();
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="p-4 md:p-6 h-full">
      {/* Main Container */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-[#B794F4] overflow-hidden h-full flex flex-col md:mr-6">

        {/* Header Section */}
        <div className="p-8 flex items-center flex-shrink-0">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Bienvenue, {displayName}.</h1>
        </div>

      </div>
    </div>
  );
}