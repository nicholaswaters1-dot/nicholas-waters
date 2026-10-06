import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { PersonaMode } from '../../types';
import { Logo } from './Logo';
import { HouseholdUserSwitcher } from './HouseholdUserSwitcher';
import {
  X,
  Compass,
  FileText,
  Radio,
  CalendarCheck,
  Store,
  Users,
  Heart,
  Building2,
  AlertTriangle,
  Sliders,
  Award,
  UploadCloud,
  CreditCard,
  BarChart3,
  Globe2,
  Receipt,
  UserCheck,
  Bot,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  Moon,
  Gift,
  ShieldAlert,
  Info,
  Scale,
  Play,
  Smartphone,
  Brain,
} from 'lucide-react';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const {
    persona,
    setPersona,
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
    setAdvertiseModalOpen,
    setPolicyModalOpen,
    setLanguageModalOpen,
    setAiAssistantOpen,
    setAboutModalOpen,
    setLegalModalOpen,
    setHowToUseModalOpen,
    hasUserSignedPolicies,
    activeHouseholdMember,
    isAuthorizedAdmin,
  } = useMarketplace();

  if (!isOpen) return null;

  const handleSelectTab = (fn: () => void) => {
    fn();
    onClose();
  };

  const personas: { id: PersonaMode; label: string; desc: string; icon: string }[] = [
    { id: 'owner', label: 'Pet Owner', desc: 'Book walks, kennels & GPS tracking', icon: '🐶' },
    { id: 'walker', label: 'Dog Walker (Sarah)', desc: 'Pack hub, custom mins & pricing', icon: '🦮' },
    { id: 'kennel', label: 'Kennels & Boarding', desc: 'Custom suite prices & membership', icon: '🏨' },
    { id: 'shelter', label: 'Rescue Shelter', desc: 'Multi-staff rehoming & volunteer walks', icon: '🏡' },
    ...(isAuthorizedAdmin
      ? [
          {
            id: 'admin' as PersonaMode,
            label: 'Admin & Mobile Command',
            desc: 'Manage walkers, kennels, users & revenue',
            icon: '🛡️',
          },
        ]
      : []),
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
          <Logo variant="compact" />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 space-y-6 flex-1">
          {/* Persona Selection */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Switch Persona / Account Mode
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {personas.map((p) => {
                const isSelected = persona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPersona(p.id);
                      if (p.id === 'owner') setOwnerTab('discover');
                      if (p.id === 'walker') setWalkerTab('pack-hub');
                      if (p.id === 'kennel') setKennelTab('suites-pricing');
                      if (p.id === 'shelter') setShelterTab('adoptable-dogs');
                      if (p.id === 'admin') setAdminTab('mobile-command');
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">{p.label}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{p.desc}</div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Persona-specific Tabs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {persona.toUpperCase()} Navigation
            </span>

            {/* OWNER TABS */}
            {persona === 'owner' && (
              <div className="space-y-1">
                {[
                  { id: 'discover', label: 'Find Dog Walkers', icon: Compass },
                  { id: 'kennels', label: 'Dog Kennels & Overnight', icon: Building2 },
                  { id: 'live-walk', label: 'Live GPS Walk Trail & Tracker', icon: Radio },
                  { id: 'directory', label: 'Dog-Friendly Directory (Eat, Stay, Shop)', icon: Store },
                  { id: 'training', label: 'Training Tips & Brain Games', icon: Brain },
                  { id: 'my-dogs', label: 'My Dogs & Care Guide', icon: FileText },
                  { id: 'bookings', label: 'My Walk & Stay Bookings', icon: CalendarCheck },
                  { id: 'pawmates', label: 'PawMates Community', icon: Users },
                  { id: 'shelters', label: 'Local Rescue Shelters', icon: Heart },
                  { id: 'complaints', label: 'Help Desk & Complaints', icon: ShieldAlert },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = ownerTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(() => setOwnerTab(item.id as any))}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#0f5132] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* WALKER TABS */}
            {persona === 'walker' && (
              <div className="space-y-1">
                {[
                  { id: 'pack-hub', label: 'Pack Connect Hub', icon: Users },
                  { id: 'calendar', label: 'Availability Calendar', icon: CalendarCheck },
                  { id: 'services-pricing', label: 'Services, Custom Mins & Academy', icon: Sliders },
                  { id: 'credentials', label: 'Become Verified Guide & DBS Audit', icon: Award },
                  { id: 'verify-upload', label: 'Upload Credentials', icon: UploadCloud },
                  { id: 'subscriptions', label: 'Walker Membership Plans', icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = walkerTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(() => setWalkerTab(item.id as any))}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#0f5132] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* KENNEL TABS */}
            {persona === 'kennel' && (
              <div className="space-y-1">
                {[
                  { id: 'suites-pricing', label: 'Suites & Input Custom Prices', icon: Building2 },
                  { id: 'subscriptions', label: 'Kennel & Sitting Membership Fees', icon: CreditCard },
                  { id: 'overnight-routine', label: 'Night Routine & Pup Academy', icon: Moon },
                  { id: 'calendar', label: 'Guest Check-ins & Bookings', icon: CalendarCheck },
                  { id: 'licensing', label: 'DEFRA 5-Star Compliance', icon: Award },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = kennelTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(() => setKennelTab(item.id as any))}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#0f5132] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* SHELTER TABS */}
            {persona === 'shelter' && (
              <div className="space-y-1">
                {[
                  { id: 'adoptable-dogs', label: 'Adoptable Dogs Gallery', icon: Heart },
                  { id: 'visits', label: 'Visitor Appointments', icon: CalendarCheck },
                  { id: 'volunteer-walks', label: 'Volunteer Walks Desk', icon: Compass },
                  { id: 'donations', label: 'Item & Food Wishlist Desk', icon: Gift },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = shelterTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(() => setShelterTab(item.id as any))}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#0f5132] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ADMIN TABS (Restricted to Sole Owner nicholaswaters1@gmail.com) */}
            {persona === 'admin' && isAuthorizedAdmin && (
              <div className="space-y-1">
                {[
                  { id: 'mobile-command', label: 'Mobile Command & Revenue Roster', icon: Smartphone },
                  { id: 'kpis', label: 'Platform KPIs & Growth', icon: BarChart3 },
                  { id: 'complaints', label: 'Complaints & Grievances Desk', icon: ShieldAlert },
                  { id: 'operations', label: 'Live Operations Map', icon: Globe2 },
                  { id: 'compliance', label: 'Walker DBS Compliance', icon: UserCheck },
                  { id: 'incidents', label: 'Safety Incidents', icon: AlertTriangle },
                  { id: 'financials', label: 'Commission Engine', icon: Receipt },
                  { id: 'advertisers', label: 'Directory Advertisers Vetting', icon: Store },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(() => setAdminTab(item.id as any))}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#0f5132] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions & Policies */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Essential Actions
            </span>

            {/* How to Use the App Video Tour */}
            <button
              onClick={() => handleSelectTab(() => setHowToUseModalOpen(true))}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-300/90 hover:bg-amber-300 border border-amber-400 text-slate-950 font-black text-xs"
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Watch: How to Use the App Video</span>
              </div>
              <span className="text-[10px] font-extrabold bg-white px-2 py-0.5 rounded-full">
                HD Guide
              </span>
            </button>

            {/* Advertise Your Pet Business */}
            <button
              onClick={() => handleSelectTab(() => setAdvertiseModalOpen(true))}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>Advertise Your Pet Business</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-extrabold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                From £0 / £6.99/mo
              </span>
            </button>

            {/* Policies & Procedures Signature */}
            <button
              onClick={() => handleSelectTab(() => setPolicyModalOpen(true))}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sign Policies & Procedures</span>
              </div>
              {hasUserSignedPolicies ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Signed ✓
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                  Sign Required
                </span>
              )}
            </button>

            {/* Ask AI Assistant */}
            <button
              onClick={() => handleSelectTab(() => setAiAssistantOpen(true))}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-semibold text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-600" />
                <span>Ask Pawsy (AI Dog Assistant)</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>

            {/* Language Selector */}
            <button
              onClick={() => handleSelectTab(() => setLanguageModalOpen(true))}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-slate-400" />
                <span>Select Language</span>
              </div>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectTab(() => setAboutModalOpen(true))}
              className="hover:text-slate-800 transition-colors"
            >
              About
            </button>
            <span>·</span>
            <button
              onClick={() => handleSelectTab(() => setLegalModalOpen(true))}
              className="hover:text-slate-800 transition-colors"
            >
              Legal & DEFRA
            </button>
          </div>
          <span>v2.4 Pro</span>
        </div>
      </div>
    </div>
  );
};
