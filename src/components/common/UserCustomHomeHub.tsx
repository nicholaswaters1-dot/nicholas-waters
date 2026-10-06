import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Home,
  Compass,
  Building2,
  Radio,
  Store,
  CalendarCheck,
  FileText,
  Trophy,
  Heart,
  ShieldAlert,
  Users,
  Sliders,
  CreditCard,
  Award,
  Moon,
  Gift,
  Smartphone,
  BarChart3,
  UserCheck,
  Bell,
  BellOff,
  Camera,
  Check,
  Sparkles,
  Play,
  Settings,
  ArrowRight,
  Pin,
  Share2,
  BookOpen,
  Star,
  Calendar,
  KeyRound,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const UserCustomHomeHub: React.FC = () => {
  const {
    persona,
    setPersona,
    setOwnerTab,
    setWalkerTab,
    setKennelTab,
    setShelterTab,
    setAdminTab,
    pinnedHomeTabs,
    togglePinHomeTab,
    pushAlertsEnabled,
    togglePushAlertsForRole,
    pushNotifications,
    sendPushAlert,
    markPushAlertRead,
    setProfileEditorModalOpen,
    setHowToUseModalOpen,
    activeHouseholdMember,
    activeDog,
    walkers,
    kennels,
    activeShelter,
    activeShelterStaff,
    nativeShare,
    confirmAndReleaseEscrowPayment,
    completeWalkAndRequestEscrowRelease,
  } = useMarketplace();

  const [customizeMode, setCustomizeMode] = useState(false);
  const [guideRoleTab, setGuideRoleTab] = useState<'owner' | 'walker' | 'kennel'>(
    persona === 'walker' ? 'walker' : persona === 'kennel' ? 'kennel' : 'owner'
  );

  const allMenusByPersona: Record<
    string,
    { id: string; title: string; desc: string; icon: any; badge?: string; onOpen: () => void }[]
  > = {
    owner: [
      {
        id: 'discover',
        title: 'Find Dog Walkers',
        desc: 'Browse DBS-checked local walkers, custom durations & instant booking.',
        icon: Compass,
        badge: 'Top Rated',
        onOpen: () => setOwnerTab('discover'),
      },
      {
        id: 'kennels',
        title: 'Kennels & Stays',
        desc: 'DEFRA 5-star luxury overnight suites & daytime dog sitting.',
        icon: Building2,
        badge: '5-Star DEFRA',
        onOpen: () => setOwnerTab('kennels'),
      },
      {
        id: 'live-walk',
        title: 'Live GPS Walk & Chat',
        desc: '1-tap Start/Stop GPS walk tracking, photo feed & SOS button.',
        icon: Radio,
        badge: 'Live GPS',
        onOpen: () => setOwnerTab('live-walk'),
      },
      {
        id: 'my-dogs',
        title: 'My Dogs & Photo Profiles',
        desc: `Upload custom photos & care guides for ${activeDog.name} & family dogs.`,
        icon: FileText,
        badge: 'Upload Photos',
        onOpen: () => setOwnerTab('my-dogs'),
      },
      {
        id: 'training-games',
        title: 'Training, Games & Ranks',
        desc: 'Complete trick milestones, earn badges & climb the national leaderboard.',
        icon: Trophy,
        badge: 'Leaderboard',
        onOpen: () => setOwnerTab('training-games'),
      },
      {
        id: 'directory',
        title: 'Dog-Friendly Directory',
        desc: 'Interactive Google Map of dog pubs, cafes, shops & 24/7 emergency vets.',
        icon: Store,
        badge: 'Google Maps',
        onOpen: () => setOwnerTab('directory'),
      },
      {
        id: 'shelters',
        title: 'Rescue Shelters & Adoption',
        desc: 'Adopt rescue dogs, book free volunteer walks or donate food/bedding.',
        icon: Heart,
        badge: 'Adopt / Walk',
        onOpen: () => setOwnerTab('shelters'),
      },
      {
        id: 'bookings',
        title: 'My Bookings & Escrow',
        desc: 'Manage upcoming walks, recurring subscriptions & payment receipts.',
        icon: CalendarCheck,
        onOpen: () => setOwnerTab('bookings'),
      },
      {
        id: 'pawmates',
        title: 'PawMates Social Club',
        desc: 'Join local park walk meetups & connect with neighborhood dog parents.',
        icon: Users,
        onOpen: () => setOwnerTab('pawmates'),
      },
      {
        id: 'complaints',
        title: 'Support & Resolution Desk',
        desc: '24/7 safety support, escrow dispute resolution & incident reporting.',
        icon: ShieldAlert,
        onOpen: () => setOwnerTab('complaints'),
      },
    ],
    walker: [
      {
        id: 'pack-hub',
        title: 'Pack Connect Hub',
        desc: 'Manage daily 4-dog packs, compatibility scores & roll-call check-in.',
        icon: Users,
        badge: 'Live Pack',
        onOpen: () => setWalkerTab('pack-hub'),
      },
      {
        id: 'services-pricing',
        title: 'Custom Durations & Rates',
        desc: 'Select walk durations (20–120 mins), set custom prices & Pup Points.',
        icon: Sliders,
        badge: 'Custom Rates',
        onOpen: () => setWalkerTab('services-pricing'),
      },
      {
        id: 'calendar',
        title: 'Availability Calendar',
        desc: 'Set working hours, max daily dogs & block holiday dates.',
        icon: CalendarCheck,
        onOpen: () => setWalkerTab('calendar'),
      },
      {
        id: 'subscriptions',
        title: 'Walker Membership Plans',
        desc: 'Manage £0 Starter (10% comm), £6.99/mo PRO (5% comm) or £14.99/mo Elite (2.5% comm).',
        icon: CreditCard,
        onOpen: () => setWalkerTab('subscriptions'),
      },
      {
        id: 'credentials',
        title: 'Verified Guide & DBS',
        desc: 'UK Dog Walker legal compliance, insurance & Canine First Aid links.',
        icon: Award,
        badge: 'UK Verified',
        onOpen: () => setWalkerTab('credentials'),
      },
    ],
    kennel: [
      {
        id: 'suites-pricing',
        title: 'Suites & Custom Prices',
        desc: 'Input custom nightly boarding & day sitting rates and add new suites.',
        icon: Building2,
        badge: 'Custom Tariffs',
        onOpen: () => setKennelTab('suites-pricing'),
      },
      {
        id: 'overnight-routine',
        title: 'Night Routine & Academy',
        desc: 'Log bedtime checks, climate readings & award Pup Academy rewards.',
        icon: Moon,
        badge: 'Pup Points',
        onOpen: () => setKennelTab('overnight-routine'),
      },
      {
        id: 'calendar',
        title: 'Guest Check-Ins & Bookings',
        desc: 'Manage incoming overnight guests, feeding schedules & escrow payouts.',
        icon: CalendarCheck,
        onOpen: () => setKennelTab('calendar'),
      },
      {
        id: 'subscriptions',
        title: 'Host Membership Plans',
        desc: 'Same £0 Starter, £6.99/mo PRO or £14.99/mo Elite plans as Walkers.',
        icon: CreditCard,
        onOpen: () => setKennelTab('subscriptions'),
      },
      {
        id: 'licensing',
        title: 'DEFRA 5-Star Compliance',
        desc: 'Higher standard boarding inspection checklist & council license.',
        icon: Award,
        onOpen: () => setKennelTab('licensing'),
      },
    ],
    shelter: [
      {
        id: 'adoptable-dogs',
        title: 'Upload & Manage Dogs',
        desc: 'Post new rescue dogs, activate/deactivate when adopted & log daily care.',
        icon: Heart,
        badge: 'Post / Control',
        onOpen: () => setShelterTab('adoptable-dogs'),
      },
      {
        id: 'visits',
        title: 'Adoption Inquiries & Visits',
        desc: 'Review Meet & Greet bookings and receive instant push alerts.',
        icon: CalendarCheck,
        badge: 'Push Alerts',
        onOpen: () => setShelterTab('visits'),
      },
      {
        id: 'volunteer-walks',
        title: 'Free Volunteer Dog Walks',
        desc: 'Coordinate 100% free enrichment walks with vetted community walkers.',
        icon: Compass,
        badge: '£0 Free',
        onOpen: () => setShelterTab('volunteer-walks'),
      },
      {
        id: 'donations',
        title: 'Food & Bedding Wishlist',
        desc: 'Accept or decline community item donations for shelter dogs.',
        icon: Gift,
        onOpen: () => setShelterTab('donations'),
      },
    ],
    admin: [
      {
        id: 'mobile-command',
        title: 'Mobile Command & Revenue',
        desc: 'Approve businesses, manage accounts & monitor live revenue from phone.',
        icon: Smartphone,
        badge: 'Mobile Ready',
        onOpen: () => setAdminTab('mobile-command'),
      },
      {
        id: 'kpis',
        title: 'Platform KPIs & Analytics',
        desc: 'Live GMV, active walk packs, retention & regional growth.',
        icon: BarChart3,
        onOpen: () => setAdminTab('kpis'),
      },
      {
        id: 'compliance',
        title: 'DBS & License Queue',
        desc: 'Approve walker DBS certificates & kennel DEFRA licenses.',
        icon: UserCheck,
        onOpen: () => setAdminTab('compliance'),
      },
      {
        id: 'complaints',
        title: 'Complaints & Escrow Desk',
        desc: 'Investigate and resolve customer tickets and refunds.',
        icon: ShieldAlert,
        onOpen: () => setAdminTab('complaints'),
      },
    ],
  };

  const availableMenus = allMenusByPersona[persona] || allMenusByPersona.owner;
  const pinnedIds = pinnedHomeTabs[persona] || availableMenus.map((m) => m.id);
  const pinnedMenus = availableMenus.filter((m) => pinnedIds.includes(m.id));
  const roleNotifications = pushNotifications.filter(
    (n) => n.targetRole === persona || n.targetRole === 'all'
  );

  // Active profile info based on persona
  const getActiveProfileCard = () => {
    if (persona === 'owner') {
      return {
        name: activeHouseholdMember.name,
        subtitle: `${activeHouseholdMember.role} · Pet Parent to ${activeDog.name} (${activeDog.breed})`,
        avatar: activeHouseholdMember.avatar,
        badge: 'Verified Pet Owner Account',
      };
    }
    if (persona === 'walker') {
      const w = walkers[0];
      return {
        name: w.name,
        subtitle: `${w.headline} · ${w.location}`,
        avatar: w.avatar,
        badge: `DBS Verified (${w.dbsCertificateNumber})`,
      };
    }
    if (persona === 'kennel') {
      const k = kennels[0];
      return {
        name: k.businessName,
        subtitle: `Host: ${k.contactName} · ${k.location}`,
        avatar: k.avatar,
        badge: `${k.councilLicenceRating} (${k.councilLicenceNumber})`,
      };
    }
    if (persona === 'shelter') {
      return {
        name: activeShelter.name,
        subtitle: `Logged in as ${activeShelterStaff.name} (${activeShelterStaff.role})`,
        avatar: activeShelter.logoUrl,
        badge: `Charity No: ${activeShelter.charityNumber}`,
      };
    }
    return {
      name: 'Platform Executive Admin',
      subtitle: 'Full Mobile Command & Escrow Treasury Control',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badge: 'Isolated Role Security Enforced',
    };
  };

  const profileInfo = getActiveProfileCard();

  const handleTestLivePush = () => {
    if (persona === 'shelter') {
      sendPushAlert({
        targetRole: 'shelter',
        category: 'Adoption Inquiry',
        title: '🐾 New Adoption Inquiry Alert (Firebase Push)',
        body: `New family application received to meet a rescue dog at ${activeShelter.name}. Tap Visits to respond.`,
        actionTab: 'visits',
      });
    } else if (persona === 'walker') {
      sendPushAlert({
        targetRole: 'walker',
        category: 'New Booking',
        title: '🦮 New Walk Booking Received (Firebase Push)',
        body: 'New 60-min Group Walk request in NW3 Hampstead (£18.00 held in Escrow).',
        actionTab: 'pack-hub',
      });
    } else if (persona === 'kennel') {
      sendPushAlert({
        targetRole: 'kennel',
        category: 'Kennel Stay',
        title: '🏨 New Overnight Boarding Inquiry (Firebase Push)',
        body: '3-Night Luxury Suite reservation request received (£195.00 Escrow).',
        actionTab: 'calendar',
      });
    } else {
      sendPushAlert({
        targetRole: 'owner',
        category: 'New Message',
        title: `🐶 Live Update for ${activeDog.name} (Firebase Push)`,
        body: 'Sarah Jenkins sent a new GPS walk checkpoint and photo!',
        actionTab: 'live-walk',
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Personalized Welcome & Profile Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0f5132] to-slate-900 text-white p-5 sm:p-7 shadow-md border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profileInfo.avatar}
                alt={profileInfo.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md bg-white"
              />
              <button
                onClick={() => setProfileEditorModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-md border border-white transition-transform hover:scale-105"
                title="Upload New Photo / Logo & Edit Profile"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{profileInfo.badge}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">
                {profileInfo.name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 leading-snug">
                {profileInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Profile Edit, Share Profile, Video Guide & Push Toggle Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() =>
                nativeShare({
                  type: 'profile',
                  title: `🐾 ${profileInfo.name} on My Paws Walks`,
                  subtitle: profileInfo.subtitle,
                  badge: profileInfo.badge,
                  text: `Connect with ${profileInfo.name} (${profileInfo.subtitle}) on My Paws Walks — ${profileInfo.badge}!`,
                })
              }
              className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Verified Profile</span>
            </button>

            <button
              onClick={() => setProfileEditorModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#0f5132] font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Edit Profile & Upload Photo/Logo</span>
            </button>

            <button
              onClick={() => setCustomizeMode(!customizeMode)}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                customizeMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-emerald-900/70 hover:bg-emerald-800 text-white border-emerald-700'
              }`}
            >
              <Pin className="w-4 h-4" />
              <span>{customizeMode ? 'Done Customizing Home' : 'Select Home Menus'}</span>
            </button>

            <button
              onClick={() => setHowToUseModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
              <span>Video Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE ROLE FEATURE & HOW-TO-USE GUIDE (DOG OWNER / WALKER / KENNEL & SITTER) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Interactive Platform Guide — Features & How to Use the App</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              What Features You Can Use & Step-by-Step Interface Guide
            </h2>
            <p className="text-xs text-slate-500">
              Select a role below to explore every feature available to <strong>Dog Owners</strong>, <strong>Dog Walkers</strong>, and <strong>Kennels & Dog Sitters</strong> and learn how to use your interface.
            </p>
          </div>

          {/* 3-Role Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start">
            <button
              type="button"
              onClick={() => setGuideRoleTab('owner')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                guideRoleTab === 'owner'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🐕 Dog Owner Guide (FREE)</span>
            </button>
            <button
              type="button"
              onClick={() => setGuideRoleTab('walker')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                guideRoleTab === 'walker'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🦮 Dog Walker Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setGuideRoleTab('kennel')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                guideRoleTab === 'kennel'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🏡 Kennel & Sitter Guide</span>
            </button>
          </div>
        </div>

        {/* 1. DOG OWNER FEATURES & HOW TO USE */}
        {guideRoleTab === 'owner' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-emerald-950">
                <strong className="font-extrabold">Dog Owners — 100% FREE (£0 Subscription):</strong> Create your account, build dog profiles, browse live availability calendars, track live GPS walks, release escrow payments after walks, and leave 1–5 star verified reviews.
              </div>
              <button
                type="button"
                onClick={() => {
                  setPersona('owner');
                  setOwnerTab('discover');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold whitespace-nowrap cursor-pointer shrink-0"
              >
                Open Dog Owner View →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emerald-700" />
                  <span>1. Create Dog Profiles & Home Access</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"My Dogs"</strong> to upload photos for each dog, add vet & dietary notes, and save your home collection address and key safe / gate access instructions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>2. Check Availability Calendars & Book</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"Walkers"</strong> or <strong>"Kennels & Stays"</strong> to view each professional’s live monthly availability calendar, compare aggregated star ratings, and click any green date to book.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-700" />
                  <span>3. Track Live GPS Walks & Chat</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Tap <strong>"Live GPS"</strong> during a walk to watch your dog’s real-time route, see live recordings of poos, water breaks, and off-leash runs, and chat or receive photos from your walker.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>4. Confirm & Release Escrow Payment</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> When your walker finishes the walk, you receive a push notification. Open <strong>"Bookings"</strong> and tap <strong>"Confirm & Release"</strong> to release the escrow funds to your walker.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>5. Leave 1–5 Star Verified Reviews</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Click <strong>"Leave a Star Rating"</strong> on any walker or kennel profile (or <strong>"Rate ★"</strong> in Bookings) to submit a star rating that immediately updates their aggregated average score.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>6. PawMates, Shelters & Training Ranks</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Use <strong>"PawMates"</strong> to arrange free local park meetups, <strong>"Ranks"</strong> to earn training badges, and <strong>"Shelters"</strong> to adopt or book free volunteer walks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. DOG WALKER FEATURES & HOW TO USE */}
        {guideRoleTab === 'walker' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-emerald-950">
                <strong className="font-extrabold">Dog Walkers — Starter (£0/mo · 10% comm), PRO (£6.99/mo · 5% comm — Most Popular), Elite (£14.99/mo · 2.5% comm):</strong> Manage your operating hours, pack walks, live GPS telemetry, owner photo chat, and escrow payouts.
              </div>
              <button
                type="button"
                onClick={() => {
                  setPersona('walker');
                  setWalkerTab('pack-hub');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold whitespace-nowrap cursor-pointer shrink-0"
              >
                Open Walker Portal →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  <span>1. Edit Operating Hours & Custom Prices</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"Rates & Hours"</strong> to toggle your working days (Mon–Sun), edit your exact start/finish times, set custom walk durations (15–120 mins), and set your prices.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>2. Inspect Dog Profiles, Address & Access</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> In <strong>"Pack Hub"</strong> or <strong>"Schedule"</strong>, click on any booked dog’s card to open their full profile, medical/behavioral notes, home collection address, and key safe / pick-up & drop-off access instructions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-700" />
                  <span>3. Start/Stop Live GPS & Log Trail Events</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> In <strong>"Pack Hub"</strong>, tap <strong>"Start Live GPS Walk"</strong>. Use the 1-tap buttons while walking to record <strong>💩 Poos, 💧 Water breaks, and 🐕 Off-Leash</strong> status for each dog.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>4. Live On-Walk Chat & Photo Updates</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Select an individual dog owner or "All Pack Owners" in the Live Walk console to send quick 1-tap status updates, custom messages, and camera photos whilst on the walk.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>5. Complete Walk & Request Escrow Release</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Tap <strong>"Complete Walk & Request Escrow Release"</strong> when finished. The dog owner receives an instant alert to confirm and release your payout.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>6. Build Your Aggregated Star Rating & Plan</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"DBS Audit"</strong> to view your aggregated star rating score and verified reviews, or open <strong>"Plans"</strong> to manage or cancel your subscription (1-month notice).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. KENNEL & SITTER FEATURES & HOW TO USE */}
        {guideRoleTab === 'kennel' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-emerald-950">
                <strong className="font-extrabold">Kennels & Sitters — Starter (£0/mo · 10% comm), PRO (£6.99/mo · 5% comm — Most Popular), Elite (£14.99/mo · 2.5% comm):</strong> Manage your boarding suites, availability calendar, guest dog profiles, and overnight care logs.
              </div>
              <button
                type="button"
                onClick={() => {
                  setPersona('kennel');
                  setKennelTab('suites-pricing');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold whitespace-nowrap cursor-pointer shrink-0"
              >
                Open Kennel & Sitter Portal →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>1. Configure Suites & Sitting Prices</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"Suites & Custom Pricing"</strong> to add luxury boarding suites or day-sitting options and edit your nightly and daytime rates live.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>2. Availability Calendar & Dog Profiles</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"Availability Calendar & Dog Profiles"</strong> to view bookings by date, block/unblock dates, and click any dog’s name to inspect their full care profile, home address, and access notes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>3. Overnight Welfare Log & Webcams</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"Pup Academy Rewards & Night Log"</strong> to record thermostat temperatures, bedtime checks, 1080p parent webcam status, and custom boarding rewards.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>4. Aggregated Star Rating & Reviews</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Your aggregated average star rating and 5-star review breakdown are displayed prominently at the top of your Kennel Portal and on the Dog Owner discovery view.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>5. Council Licensing & Vet Compliance</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"Council Licensing & Vet Audit"</strong> to display your DEFRA 5-Star rating, local authority licence number, and 24/7 emergency veterinary cover.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>6. Manage Subscription & 1-Month Notice</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>How to use:</strong> Open <strong>"Sign-Up & Membership Fees"</strong> to switch between Starter (£0), PRO (£6.99/mo or £69.99/yr), and Elite (£14.99/mo or £149.99/yr) or give 1-month cancellation notice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customize Home Screen Selector Drawer (When Active) */}
      {customizeMode && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-600" />
                <span>Customize Your Personal Home Screen Shortcuts</span>
              </h2>
              <p className="text-xs text-slate-600">
                Tap any menu or feature below to pin or unpin it on your personal Home dashboard. Saved automatically to your device!
              </p>
            </div>
            <button
              onClick={() => setCustomizeMode(false)}
              className="px-4 py-2 bg-[#0f5132] text-white rounded-xl text-xs font-bold self-start sm:self-auto"
            >
              Save My Home Screen
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {availableMenus.map((item) => {
              const Icon = item.icon;
              const isPinned = pinnedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => togglePinHomeTab(persona, item.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isPinned
                      ? 'bg-white border-emerald-600 ring-1 ring-emerald-500 shadow-2xs'
                      : 'bg-white/60 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isPinned ? 'bg-emerald-100 text-[#0f5132]' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isPinned ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pinned Home Screen Features Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-[#0f5132]" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              My Pinned Home Screen Menus ({pinnedMenus.length})
            </h2>
          </div>
          <button
            onClick={() => setCustomizeMode(!customizeMode)}
            className="text-xs font-bold text-[#0f5132] hover:underline flex items-center gap-1"
          >
            <Pin className="w-3.5 h-3.5" />
            <span>+ Add / Edit Shortcuts</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {pinnedMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <button
                key={menu.id}
                onClick={menu.onOpen}
                className="group bg-white hover:bg-emerald-50/40 rounded-2xl border border-slate-200 hover:border-emerald-500 p-4 text-left shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-[#0f5132] text-[#0f5132] group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    {menu.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {menu.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#0f5132] transition-colors">
                      {menu.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
                      {menu.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0f5132]">
                  <span>Open Menu</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Firebase Live Push Notification Center */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0f5132] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Firebase Live Push Notification Center
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  Cloud Synced
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Instant alerts for Shelter adoption inquiries, Dog Owner messages, Walker bookings, and Kennel stays.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => togglePushAlertsForRole(persona)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                pushAlertsEnabled[persona]
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {pushAlertsEnabled[persona] ? (
                <>
                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Push Alerts: ON</span>
                </>
              ) : (
                <>
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Push Alerts: MUTED</span>
                </>
              )}
            </button>

            <button
              onClick={handleTestLivePush}
              className="px-3 py-1.5 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold transition-colors"
            >
              + Send Test Push Alert
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roleNotifications.slice(0, 6).map((notif) => (
            <div
              key={notif.id}
              onClick={() => markPushAlertRead(notif.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                notif.read
                  ? 'bg-slate-50/70 border-slate-200'
                  : 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {notif.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900">{notif.title}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{notif.body}</p>

                {notif.bookingIdForEscrowRelease && (
                  <div className="pt-2 mt-2 border-t border-emerald-200/80">
                    {notif.escrowReleased ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800">
                        <Check className="w-3.5 h-3.5" />
                        Escrow Payment Confirmed & Released to Walker
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmAndReleaseEscrowPayment(notif.bookingIdForEscrowRelease!);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        💷 Confirm Walk Completion & Release Escrow Payment
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Play Store & Live Escrow Payment Gateway Readiness Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0f5132] to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-700/50 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Play Store TWA & Live Escrow Payments Ready</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Live Payment Processing & Google Play Store Package Configured
          </h3>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Accepting <strong>Apple Pay</strong>, <strong>Google Pay</strong>, <strong>PayPal</strong>, <strong>Visa / Mastercard</strong>, and <strong>Klarna</strong> with automatic <strong>Escrow Hold & Owner Post-Walk Notification Release</strong>. Standalone Web App Manifest (`manifest.json`), 512×512 maskable icons, and offline service worker (`sw.js`) are verified for Google Play Store publishing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {persona === 'walker' && (
            <button
              type="button"
              onClick={() => completeWalkAndRequestEscrowRelease()}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm transition-colors cursor-pointer"
            >
              🏁 Complete Walk & Request Escrow Release
            </button>
          )}
          <button
            type="button"
            onClick={() => setOwnerTab('bookings')}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-xs transition-colors cursor-pointer"
          >
            View Escrow & Payouts →
          </button>
        </div>
      </div>
    </div>
  );
};
