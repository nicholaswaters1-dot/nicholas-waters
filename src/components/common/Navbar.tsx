import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Logo } from './Logo';
import { HouseholdUserSwitcher } from './HouseholdUserSwitcher';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { AccountLoginAndSetupModal } from './AccountLoginAndSetupModal';
import { ContactUsModal } from './ContactUsModal';
import { PWAInstallButton } from './PWAInstallButton';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import {
  Compass,
  FileText,
  Radio,
  CalendarCheck,
  Users,
  Award,
  UploadCloud,
  CreditCard,
  BarChart3,
  Globe2,
  AlertTriangle,
  Receipt,
  UserCheck,
  Store,
  Sliders,
  Sparkles,
  Bot,
  Calendar,
  Heart,
  Gift,
  Building2,
  ShieldAlert,
  Moon,
  PlusCircle,
  Menu,
  ShieldCheck,
  Play,
  KeyRound,
  Mail,
  Smartphone,
  Brain,
  Home,
  Bell,
  BellOff,
  Camera,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    persona,
    setPersona,
    ownerTab,
    setOwnerTab,
    walkerTab,
    setWalkerTab,
    kennelTab,
    setKennelTab,
    adminTab,
    setAdminTab,
    shelterTab,
    setShelterTab,
    openBookingModal,
    bookings,
    language,
    setLanguageModalOpen,
    setAboutModalOpen,
    setLegalModalOpen,
    setAiAssistantOpen,
    setAdvertiseModalOpen,
    setPolicyModalOpen,
    setHowToUseModalOpen,
    hasUserSignedPolicies,
    activeHouseholdMember,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    pushNotifications,
    pushAlertsEnabled,
    togglePushAlertsForRole,
    markPushAlertRead,
    markAllPushAlertsRead,
    confirmAndReleaseEscrowPayment,
    setProfileEditorModalOpen,
    isAuthorizedAdmin,
    t,
  } = useMarketplace();

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [pushMenuOpen, setPushMenuOpen] = useState(false);

  const unreadPushCount = pushNotifications.filter(
    (n) => !n.read && (n.targetRole === persona || n.targetRole === 'all')
  ).length;

  const inProgressBooking = bookings.find((b) => b.status === 'In Progress');
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        {/* Top Banner: Persona Switcher & Quick Utilities */}
        <div className="bg-[#0f5132] text-white px-3 sm:px-4 py-1.5 text-xs border-b border-emerald-900/50">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-100 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-semibold text-white">Mode:</span>
              <span className="hidden md:inline truncate">My Paws Walks Pet Care & Shelter Ecosystem</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-full">
              {/* Account Login & Set Up Button */}
              <button
                onClick={() => setAccountModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[11px] font-extrabold transition-colors shadow-2xs cursor-pointer"
                title="Account Login & New Account Set Up"
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span>Account Login / Set Up</span>
              </button>

              {/* Contact Us Button */}
              <button
                onClick={() => setContactModalOpen(true)}
                className="hidden sm:flex items-center gap-1 px-2 py-1 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 rounded-lg text-[11px] font-semibold text-emerald-100 transition-colors cursor-pointer"
                title="Contact UK Customer & Business Support"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Contact Us</span>
              </button>

              {/* Language Selector */}
              <button
                onClick={() => setLanguageModalOpen(true)}
                className="hidden md:flex items-center gap-1 px-2 py-1 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 rounded-lg text-[11px] font-semibold text-emerald-100 transition-colors cursor-pointer"
                title="Select Language / Dewis Iaith"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden lg:inline">{currentLangObj.nativeName}</span>
                <Globe2 className="w-3 h-3 text-emerald-300 ml-0.5 shrink-0" />
              </button>

              {/* Policy Sign-Up Agreement Indicator */}
              <button
                onClick={() => setPolicyModalOpen(true)}
                className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                  hasUserSignedPolicies
                    ? 'bg-emerald-900/80 text-emerald-200 border-emerald-700/60'
                    : 'bg-amber-400 text-slate-950 font-bold border-amber-300 animate-pulse'
                }`}
                title="Review & Sign Policies"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">
                  {hasUserSignedPolicies ? 'Policies Signed' : 'Sign Policies'}
                </span>
              </button>

              {/* Persona Switcher Pill (Wraps cleanly inside screen) */}
              <div className="flex flex-wrap items-center gap-0.5 p-0.5 bg-emerald-950/70 rounded-lg border border-emerald-800 max-w-full">
                <button
                  onClick={() => {
                    setPersona('owner');
                    setOwnerTab('discover');
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    persona === 'owner'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  Pet Owner
                </button>
                <button
                  onClick={() => {
                    setPersona('walker');
                    setWalkerTab('pack-hub');
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    persona === 'walker'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  Walker
                </button>
                <button
                  onClick={() => {
                    setPersona('kennel');
                    setKennelTab('suites-pricing');
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    persona === 'kennel'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  Kennels & Stays
                </button>
                <button
                  onClick={() => {
                    setPersona('shelter');
                    setShelterTab('adoptable-dogs');
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    persona === 'shelter'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  Shelters
                </button>
                {isAuthorizedAdmin && (
                  <button
                    onClick={() => {
                      setPersona('admin');
                      setAdminTab('kpis');
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      persona === 'admin'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Top Bar & Wrapped Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (persona === 'owner') setOwnerTab('discover');
                if (persona === 'walker') setWalkerTab('pack-hub');
                if (persona === 'kennel') setKennelTab('suites-pricing');
                if (persona === 'shelter') setShelterTab('adoptable-dogs');
                if (persona === 'admin') setAdminTab('kpis');
              }}
              className="hover:opacity-95 transition-opacity"
            >
              <Logo variant="compact" />
            </a>
          </div>

          {/* Desktop Navigation Links based on active persona (Wraps cleanly so all tabs stay within screen) */}
          <nav className="hidden lg:flex flex-wrap items-center gap-1 order-3 w-full pt-2 mt-1 border-t border-slate-100">
            {persona === 'owner' && (
              <>
                <button
                  onClick={() => setOwnerTab('home')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'home'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => setOwnerTab('discover')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'discover'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('findWalkers')}</span>
                </button>

                <button
                  onClick={() => setOwnerTab('kennels')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'kennels'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kennels & Stays</span>
                </button>

                <button
                  onClick={() => setOwnerTab('live-walk')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors relative ${
                    ownerTab === 'live-walk'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>{t('liveWalk')}</span>
                  {inProgressBooking && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 right-1" />
                  )}
                </button>

                <button
                  onClick={() => setOwnerTab('directory')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'directory'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dog Directory</span>
                </button>

                <button
                  onClick={() => setOwnerTab('bookings')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'bookings'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('bookings')}</span>
                </button>

                <button
                  onClick={() => setOwnerTab('my-dogs')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'my-dogs'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('myDogs')}</span>
                </button>

                <button
                  onClick={() => setOwnerTab('training')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'training'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-purple-600" />
                  <span>Training & Games</span>
                </button>

                <button
                  onClick={() => setOwnerTab('shelters')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'shelters'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Shelters</span>
                </button>

                <button
                  onClick={() => setOwnerTab('complaints')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    ownerTab === 'complaints'
                      ? 'bg-red-50 text-red-800 border border-red-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  <span>Complaints</span>
                </button>
              </>
            )}

            {persona === 'walker' && (
              <>
                <button
                  onClick={() => setWalkerTab('pack-hub')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    walkerTab === 'pack-hub'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('packHub')}</span>
                </button>

                <button
                  onClick={() => setWalkerTab('calendar')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    walkerTab === 'calendar'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Availability</span>
                </button>

                <button
                  onClick={() => setWalkerTab('services-pricing')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    walkerTab === 'services-pricing'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('servicesPricing')}</span>
                </button>

                <button
                  onClick={() => setWalkerTab('subscriptions')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    walkerTab === 'subscriptions'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Membership Plans</span>
                </button>

                <button
                  onClick={() => setWalkerTab('credentials')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    walkerTab === 'credentials'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Guide & DBS</span>
                </button>
              </>
            )}

            {persona === 'kennel' && (
              <>
                <button
                  onClick={() => setKennelTab('suites-pricing')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    kennelTab === 'suites-pricing'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Suites & Custom Prices</span>
                </button>

                <button
                  onClick={() => setKennelTab('subscriptions')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    kennelTab === 'subscriptions'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Membership Fees</span>
                </button>

                <button
                  onClick={() => setKennelTab('overnight-routine')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    kennelTab === 'overnight-routine'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Night Routine & Academy</span>
                </button>

                <button
                  onClick={() => setKennelTab('calendar')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    kennelTab === 'calendar'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Guest Check-ins</span>
                </button>

                <button
                  onClick={() => setKennelTab('licensing')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    kennelTab === 'licensing'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>DEFRA 5-Star Audit</span>
                </button>
              </>
            )}

            {persona === 'shelter' && (
              <>
                <button
                  onClick={() => setShelterTab('adoptable-dogs')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    shelterTab === 'adoptable-dogs'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Adoptable Dogs</span>
                </button>

                <button
                  onClick={() => setShelterTab('visits')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    shelterTab === 'visits'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Visit Bookings</span>
                </button>

                <button
                  onClick={() => setShelterTab('volunteer-walks')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    shelterTab === 'volunteer-walks'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>Volunteer Walks</span>
                </button>

                <button
                  onClick={() => setShelterTab('donations')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    shelterTab === 'donations'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Donation Desk</span>
                </button>
              </>
            )}

            {persona === 'admin' && isAuthorizedAdmin && (
              <>
                <button
                  onClick={() => setAdminTab('mobile-command')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    adminTab === 'mobile-command'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mobile Command & Revenue</span>
                </button>

                <button
                  onClick={() => setAdminTab('kpis')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    adminTab === 'kpis'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('platformKpis')}</span>
                </button>

                <button
                  onClick={() => setAdminTab('complaints')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    adminTab === 'complaints'
                      ? 'bg-red-50 text-red-800 border border-red-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>Complaints Desk</span>
                </button>

                <button
                  onClick={() => setAdminTab('compliance')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    adminTab === 'compliance'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DBS Queue</span>
                </button>

                <button
                  onClick={() => setAdminTab('advertisers')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    adminTab === 'advertisers'
                      ? 'bg-emerald-50 text-[#0f5132] border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ad Sponsors</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Zone: Push Bell + Edit Profile/Logo + How to Use Video Button + Advertise Button */}
          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 order-2">
            {/* Firebase Live Push Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setPushMenuOpen(!pushMenuOpen)}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#0f5132] border border-slate-200 transition-colors cursor-pointer"
                title="Firebase Push Notifications & Alerts"
              >
                {pushAlertsEnabled[persona] ? (
                  <Bell className="w-4 h-4 text-[#0f5132]" />
                ) : (
                  <BellOff className="w-4 h-4 text-slate-400" />
                )}
                {unreadPushCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-2xs">
                    {unreadPushCount}
                  </span>
                )}
              </button>

              {pushMenuOpen && (
                <div className="fixed sm:absolute right-2 sm:right-0 top-28 sm:top-11 w-[calc(100vw-1rem)] sm:w-96 max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-[#0f5132]" />
                        <span>Firebase Push Notifications ({persona.toUpperCase()})</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Alerts for Adoption Inquiries, Bookings, Kennel Stays & Messages
                      </p>
                    </div>
                    <button
                      onClick={() => togglePushAlertsForRole(persona)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
                        pushAlertsEnabled[persona]
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {pushAlertsEnabled[persona] ? 'ON' : 'MUTED'}
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {pushNotifications
                      .filter((n) => n.targetRole === persona || n.targetRole === 'all')
                      .slice(0, 6)
                      .map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markPushAlertRead(n.id);
                            setPushMenuOpen(false);
                          }}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-slate-50 border-slate-200/80'
                              : 'bg-emerald-50/70 border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                            <span className="font-bold text-[#0f5132]">{n.category}</span>
                            <span>{n.timestamp}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900">{n.title}</div>
                          <p className="text-[11px] text-slate-600 line-clamp-3">{n.body}</p>

                          {n.bookingIdForEscrowRelease && (
                            <div className="mt-2 pt-2 border-t border-emerald-200/80 flex items-center justify-between gap-2">
                              {n.escrowReleased ? (
                                <span className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1">
                                  ✓ Escrow Funds Released to Walker
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmAndReleaseEscrowPayment(n.bookingIdForEscrowRelease!);
                                    setPushMenuOpen(false);
                                  }}
                                  className="w-full py-1.5 px-3 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-black text-[11px] shadow-xs transition-colors cursor-pointer"
                                >
                                  💷 Confirm Walk & Release Escrow Payment Now
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <button
                      onClick={markAllPushAlertsRead}
                      className="font-bold text-[#0f5132] hover:underline"
                    >
                      Mark all as read
                    </button>
                    <button
                      onClick={() => setPushMenuOpen(false)}
                      className="text-slate-500 hover:text-slate-800 font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Profile & Upload Photo/Logo Button */}
            <button
              onClick={() => setProfileEditorModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[#0f5132] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer"
              title="Edit Profile & Upload Photo or Logo"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="hidden md:inline">Edit Profile</span>
            </button>

            {/* How to Use the App Video Button */}
            <button
              onClick={() => setHowToUseModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-extrabold text-slate-950 bg-amber-300/90 hover:bg-amber-300 border border-amber-400 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="Watch How to Use the App Video Tour"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950 shrink-0" />
              <span className="hidden sm:inline">Video Guide</span>
            </button>

            {/* Catch Businesses - Prominent Advertise Button */}
            <button
              onClick={() => {
                setPersona('owner');
                setOwnerTab('directory');
                setAdvertiseModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="Sign up & advertise your pet business (£9.99/mo)"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Advertise</span>
            </button>

            {/* PWA / Google Play Install Button */}
            <div className="hidden md:block">
              <PWAInstallButton variant="navbar" />
            </div>

            {/* Household user switcher for pet owners */}
            {persona === 'owner' && <HouseholdUserSwitcher />}

            {/* Primary Action Button */}
            {persona === 'owner' && (
              <button
                onClick={() => openBookingModal()}
                className="hidden sm:flex px-3 py-1.5 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-xl transition-all shadow-xs items-center gap-1.5 cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Book Walk</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Account Login & Set Up Modal */}
      <AccountLoginAndSetupModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />

      {/* Contact Us Modal */}
      <ContactUsModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
};
