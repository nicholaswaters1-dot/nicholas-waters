import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Home,
  Compass,
  Radio,
  Menu,
  CalendarCheck,
  Building2,
  Users,
  Moon,
  Heart,
  BarChart3,
  ShieldAlert,
  Trophy,
  Sliders,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMobileMenu }) => {
  const {
    persona,
    ownerTab,
    setOwnerTab,
    walkerTab,
    setWalkerTab,
    kennelTab,
    setKennelTab,
    shelterTab,
    setShelterTab,
    adminTab,
    setAdminTab,
    bookings,
    isAuthorizedAdmin,
  } = useMarketplace();

  const inProgressBooking = bookings.find((b) => b.status === 'In Progress');

  return (
    <nav
      aria-label="Permanent Bottom Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 w-full max-w-full bg-white/95 backdrop-blur-lg border-t border-slate-200 px-1 py-1 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom,4px)]"
    >
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto gap-0.5">
        {/* PET OWNER PERMANENT BOTTOM NAV */}
        {persona === 'owner' && (
          <>
            <button
              onClick={() => setOwnerTab('home')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                ownerTab === 'home'
                  ? 'text-[#0f5132] font-extrabold bg-emerald-50/90'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${ownerTab === 'home' ? 'text-[#0f5132]' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Home</span>
            </button>

            <button
              onClick={() => setOwnerTab('discover')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                ownerTab === 'discover'
                  ? 'text-[#0f5132] font-extrabold bg-emerald-50/90'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Compass className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${ownerTab === 'discover' ? 'text-[#0f5132]' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Walkers</span>
            </button>

            <button
              onClick={() => setOwnerTab('kennels')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                ownerTab === 'kennels'
                  ? 'text-[#0f5132] font-extrabold bg-emerald-50/90'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${ownerTab === 'kennels' ? 'text-[#0f5132]' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Kennels</span>
            </button>

            <button
              onClick={() => setOwnerTab('live-walk')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors relative cursor-pointer ${
                ownerTab === 'live-walk'
                  ? 'text-[#0f5132] font-extrabold bg-emerald-50/90'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Radio className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${ownerTab === 'live-walk' ? 'text-[#0f5132] animate-pulse' : 'text-slate-400'}`} />
                {inProgressBooking && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 truncate max-w-full">Live GPS</span>
            </button>

            <button
              onClick={() => setOwnerTab('training-games')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                ownerTab === 'training-games'
                  ? 'text-[#0f5132] font-extrabold bg-amber-50/90'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${ownerTab === 'training-games' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Ranks</span>
            </button>

            <button
              onClick={onOpenMobileMenu}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 shrink-0" />
              <span className="text-[10px] mt-0.5 font-bold truncate max-w-full">More</span>
            </button>
          </>
        )}

        {/* DOG WALKER PERMANENT BOTTOM NAV */}
        {persona === 'walker' && (
          <>
            <button
              onClick={() => setWalkerTab('home')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                walkerTab === 'home' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Home</span>
            </button>

            <button
              onClick={() => setWalkerTab('pack-hub')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                walkerTab === 'pack-hub' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Pack Hub</span>
            </button>

            <button
              onClick={() => setWalkerTab('calendar')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                walkerTab === 'calendar' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Calendar</span>
            </button>

            <button
              onClick={() => setWalkerTab('services-pricing')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                walkerTab === 'services-pricing' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Rates</span>
            </button>

            <button
              onClick={onOpenMobileMenu}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 font-bold truncate max-w-full">Menu</span>
            </button>
          </>
        )}

        {/* KENNELS PERMANENT BOTTOM NAV */}
        {persona === 'kennel' && (
          <>
            <button
              onClick={() => setKennelTab('home')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                kennelTab === 'home' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Home</span>
            </button>

            <button
              onClick={() => setKennelTab('suites-pricing')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                kennelTab === 'suites-pricing' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Suites</span>
            </button>

            <button
              onClick={() => setKennelTab('overnight-routine')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                kennelTab === 'overnight-routine' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Overnight</span>
            </button>

            <button
              onClick={() => setKennelTab('calendar')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                kennelTab === 'calendar' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Bookings</span>
            </button>

            <button
              onClick={onOpenMobileMenu}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 font-bold truncate max-w-full">Menu</span>
            </button>
          </>
        )}

        {/* SHELTER PERMANENT BOTTOM NAV */}
        {persona === 'shelter' && (
          <>
            <button
              onClick={() => setShelterTab('home')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                shelterTab === 'home' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Home</span>
            </button>

            <button
              onClick={() => setShelterTab('adoptable-dogs')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                shelterTab === 'adoptable-dogs' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Dogs</span>
            </button>

            <button
              onClick={() => setShelterTab('visits')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                shelterTab === 'visits' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Visits</span>
            </button>

            <button
              onClick={() => setShelterTab('volunteer-walks')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                shelterTab === 'volunteer-walks' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Walks</span>
            </button>

            <button
              onClick={onOpenMobileMenu}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 font-bold truncate max-w-full">Menu</span>
            </button>
          </>
        )}

        {/* ADMIN PERMANENT BOTTOM NAV (Restricted to Sole Owner nicholaswaters1@gmail.com) */}
        {persona === 'admin' && isAuthorizedAdmin && (
          <>
            <button
              onClick={() => setAdminTab('mobile-command')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                adminTab === 'mobile-command' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Home</span>
            </button>

            <button
              onClick={() => setAdminTab('kpis')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                adminTab === 'kpis' ? 'text-[#0f5132] font-extrabold bg-emerald-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">KPIs</span>
            </button>

            <button
              onClick={() => setAdminTab('complaints')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                adminTab === 'complaints' ? 'text-red-700 font-extrabold bg-red-50/90' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">Complaints</span>
            </button>

            <button
              onClick={onOpenMobileMenu}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 font-bold truncate max-w-full">Menu</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
