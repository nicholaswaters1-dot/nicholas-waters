import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Compass,
  Building2,
  Store,
  Heart,
  Sliders,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Home,
  Bell,
  Camera,
} from 'lucide-react';
import { Logo } from './Logo';

export const HowToUseAppModal: React.FC = () => {
  const {
    howToUseModalOpen,
    setHowToUseModalOpen,
    persona,
    setPersona,
    setOwnerTab,
    setWalkerTab,
    setKennelTab,
    setShelterTab,
  } = useMarketplace();

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(6);
  const [isMuted, setIsMuted] = useState(false);

  // User-only Video Tour Chapters (Admin removed per user instructions)
  const chapters = [
    {
      id: 'owner',
      roleKey: 'owner',
      title: '1. Pet Owners: Book Walkers, Kennels, Live GPS & Custom Dog Photos',
      duration: '0:45',
      summary:
        'Everything a dog parent needs: pin your favorite menus to your Home Screen, upload photos for each dog, track live GPS walks, and earn Training Leaderboard badges.',
      icon: Compass,
      featuresExplained: [
        {
          feature: '🏠 Custom Home Screen & Push Alerts',
          explanation:
            'Tap "Home" on the bottom menu bar to pin your favorite features and receive instant Firebase push notifications when your walker sends photos or messages.',
        },
        {
          feature: '📸 Upload Pictures for Each Dog',
          explanation:
            'Open "My Dogs" or "Edit Profile & Photo" to upload your own photos from your phone camera for each dog alongside their feeding, vet, and care instructions.',
        },
        {
          feature: '📍 1-Tap Live GPS Walk & SOS',
          explanation:
            'Tap "Live GPS" on the bottom bar to start or stop walk tracking, chat live with your DBS-checked walker, and use the 1-tap Emergency SOS button.',
        },
        {
          feature: '🏆 Training Leaderboard & Badges',
          explanation:
            'Open "Ranks" (Training & Games) to complete trick milestones, use voice-to-text notes, unlock badges, and climb the national leaderboard.',
        },
      ],
      actionLabel: 'Open Pet Owner Home',
      action: () => {
        setPersona('owner');
        setOwnerTab('home');
        setHowToUseModalOpen(false);
      },
    },
    {
      id: 'walker',
      roleKey: 'walker',
      title: '2. Dog Walkers: Custom Walk Durations, Prices & Push Bookings',
      duration: '0:40',
      summary:
        'Run your professional dog walking business with custom minute durations, your own prices, instant push alerts for new bookings, and full profile/photo editing.',
      icon: Sliders,
      featuresExplained: [
        {
          feature: '⏱️ Custom Walk Durations & Prices',
          explanation:
            'Open "Rates" to choose your own walk durations (15 to 120 mins), set your own prices, and configure Pup & Academy Points for dogs in your pack.',
        },
        {
          feature: '🔔 Instant Booking & Message Push Alerts',
          explanation:
            'Turn on Firebase Push Alerts in the top bell icon to get notified immediately on your phone whenever a dog owner books a walk or sends a message.',
        },
        {
          feature: '🖼️ Upload Your Walker Photo & Bio',
          explanation:
            'Tap "Edit Profile & Photo" to upload your profile picture or business logo, update your DBS certificate number, and edit your bio.',
        },
        {
          feature: '🦮 Pack Connect Hub & UK Verified Guide',
          explanation:
            'Manage up to 4 dogs per walk pack safely and follow direct UK government links for DBS checks, Pet First Aid, and insurance.',
        },
      ],
      actionLabel: 'Open Dog Walker Portal',
      action: () => {
        setPersona('walker');
        setWalkerTab('services-pricing');
        setHowToUseModalOpen(false);
      },
    },
    {
      id: 'kennel',
      roleKey: 'kennel',
      title: '3. Kennels & Stays: Custom Nightly Rates, Suites & Push Alerts',
      duration: '0:40',
      summary:
        'Same sign-up & membership plans (£0 Starter / £6.99 PRO / £14.99 Elite) as Dog Walkers. Upload your kennel logo, set custom suite prices, and receive push alerts for new stays.',
      icon: Building2,
      featuresExplained: [
        {
          feature: '🏨 Input Custom Suite & Day-Sitting Prices',
          explanation:
            'Create luxury suites or day-sitting pods and input your own nightly boarding and daytime rates with multi-dog family discounts.',
        },
        {
          feature: '🔔 Push Notifications for New Stay Bookings',
          explanation:
            'Receive instant Firebase push notifications whenever a pet owner books an overnight stay or sends dietary/medication updates.',
        },
        {
          feature: '🖼️ Upload Kennel Logo & Facility Details',
          explanation:
            'Tap "Edit Profile & Photo" to upload your kennel logo, DEFRA 5-Star council license number, and facility overview.',
        },
        {
          feature: '🌙 Overnight Welfare Routine & Pup Academy',
          explanation:
            'Log bedtime checks, room temperatures, and 1080p webcam status, and award Pup Academy rewards to boarding guests.',
        },
      ],
      actionLabel: 'Open Kennels & Stays Portal',
      action: () => {
        setPersona('kennel');
        setKennelTab('suites-pricing');
        setHowToUseModalOpen(false);
      },
    },
    {
      id: 'shelter',
      roleKey: 'shelter',
      title: '4. Dog Shelters: Upload Dogs, Activate/Deactivate & Multi-Staff Login',
      duration: '0:45',
      summary:
        'Dedicated charity portal with multi-user staff logins to upload new rescue dogs, activate or deactivate listings when adopted, and get adoption push alerts.',
      icon: Heart,
      featuresExplained: [
        {
          feature: '🐶 Post / Upload New Dogs & Activate/Deactivate',
          explanation:
            'Tap "+ Post / Upload New Dog for Adoption" to add rescue dogs with photos, and use the 1-tap toggle to deactivate listings when a dog is adopted.',
        },
        {
          feature: '👥 Multi-User Staff Logins & Daily Care Logs',
          explanation:
            'Switch between individual staff logins (Director, Vet Nurse, Coordinator, Volunteer) with PIN security to post daily medical and walking updates.',
        },
        {
          feature: '🔔 Push Alerts for New Adoption Inquiries',
          explanation:
            'Shelter staff receive immediate Firebase push notifications when families book Meet & Greet visits or submit adoption inquiries.',
        },
        {
          feature: '🦮 Free Volunteer Walks & Donation Wishlist',
          explanation:
            'Approve 100% free volunteer enrichment walks and manage community donations of food, blankets, and toys.',
        },
      ],
      actionLabel: 'Open Shelter Portal',
      action: () => {
        setPersona('shelter');
        setShelterTab('adoptable-dogs');
        setHowToUseModalOpen(false);
      },
    },
    {
      id: 'directory',
      roleKey: 'directory',
      title: '5. Local Pet Businesses: Interactive Google Maps & Member Rewards',
      duration: '0:35',
      summary:
        'List your dog-friendly pub, cafe, hotel, groomer, or vet clinic on Google Maps, edit your business profile & logo, and offer Pup Points rewards.',
      icon: Store,
      featuresExplained: [
        {
          feature: '🗺️ Interactive Google Maps Directory',
          explanation:
            'Pet owners and walkers can filter by postcode to discover dog-welcoming places to eat, stay, and shop with 1-tap directions.',
        },
        {
          feature: '🎁 Business Pup Points & Customer Perks',
          explanation:
            'Offer custom rewards (like a free Puppuccino or grooming discount) when customers complete calm-behavior milestones at your venue.',
        },
        {
          feature: '🖼️ Edit Business Profile, Promo & Logo',
          explanation:
            'Use the Profile Editor to update your business name, address, phone number, dog amenities, and member promo code anytime.',
        },
        {
          feature: '💳 Instant Checkout & Escrow Payments',
          explanation:
            'Supports Apple Pay, Google Pay, PayPal, Klarna (Pay in 3), and Debit/Credit Cards across all bookings and business plans.',
        },
      ],
      actionLabel: 'Explore Dog-Friendly Directory',
      action: () => {
        setPersona('owner');
        setOwnerTab('directory');
        setHowToUseModalOpen(false);
      },
    },
  ];

  // Jump automatically to the chapter matching the user's active persona when modal opens
  useEffect(() => {
    if (howToUseModalOpen) {
      const idx = chapters.findIndex((c) => c.roleKey === persona);
      if (idx !== -1) {
        setActiveChapterIndex(idx);
        setCurrentTime(0);
      } else {
        setActiveChapterIndex(0);
        setCurrentTime(0);
      }
    }
  }, [howToUseModalOpen, persona]);

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  // Auto-play progress simulation
  useEffect(() => {
    if (!isPlaying || !howToUseModalOpen) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 45) {
          setActiveChapterIndex((idx) => (idx + 1) % chapters.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, howToUseModalOpen, chapters.length]);

  if (!howToUseModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <Logo variant="light" />
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold truncate">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Easy Feature-by-Feature Video Tour for Every User</span>
            </div>
          </div>

          <button
            onClick={() => setHowToUseModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display Screen */}
        <div className="relative bg-slate-950 aspect-video max-h-56 sm:max-h-72 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6 text-white shrink-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/95 via-slate-900/95 to-teal-950/95 flex items-center justify-center p-4 text-center">
            <div className="space-y-2 max-w-xl z-10 animate-in fade-in">
              <div className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                <Play className="w-3.5 h-3.5 fill-emerald-300" />
                <span>
                  User Video Guide {activeChapterIndex + 1} of {chapters.length} ·{' '}
                  {currentChapter.title.split(':')[0]}
                </span>
              </div>

              <h2 className="text-base sm:text-2xl font-black text-white leading-tight">
                {currentChapter.title.split(':')[1] || currentChapter.title}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-lg mx-auto">
                {currentChapter.summary}
              </p>
            </div>

            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Top Player Status */}
          <div className="relative z-10 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Interactive Feature Walkthrough</span>
            </span>

            <span className="font-mono text-slate-300">
              0:{currentTime < 10 ? `0${currentTime}` : currentTime} / {currentChapter.duration}
            </span>
          </div>

          {/* Bottom Player Controls */}
          <div className="relative z-10 space-y-2 pt-3">
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden cursor-pointer">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${(currentTime / 45) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-colors shadow-md cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-slate-950" />
                  ) : (
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="text-slate-300 hover:text-white transition-colors p-1 cursor-pointer"
                  title="Replay Chapter"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-300 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="text-xs font-semibold text-emerald-300 hidden sm:inline">
                  {currentChapter.title.split(':')[0]}
                </span>
              </div>

              <button
                onClick={currentChapter.action}
                className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-[#0f5132] font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-sm min-h-[36px] cursor-pointer"
              >
                <span>{currentChapter.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chapters and Clear Feature-by-Feature Explanation */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
              Select Your User Role to See Every Feature Explained Simply
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline">Tap any role below</span>
          </div>

          {/* Chapter Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {chapters.map((ch, idx) => {
              const Icon = ch.icon;
              const isActive = activeChapterIndex === idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChapterIndex(idx);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 min-h-[68px] cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono text-slate-400">{ch.duration}</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 leading-snug line-clamp-1">
                    {ch.title.split(':')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feature-by-Feature Easy Guide Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Features You Can Use in {currentChapter.title.split(':')[0]}:</span>
              </div>
              <button
                onClick={currentChapter.action}
                className="px-3.5 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm self-start sm:self-auto cursor-pointer"
              >
                <span>{currentChapter.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentChapter.featuresExplained.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1"
                >
                  <div className="font-extrabold text-xs text-slate-900">{item.feature}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ready for Google Play Store, Apple App Store & Instant Mobile Payments</span>
          </div>

          <button
            onClick={() => setHowToUseModalOpen(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Video Guide
          </button>
        </div>
      </div>
    </div>
  );
};
