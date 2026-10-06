import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Walker } from '../../types';
import { ASSET_PATHS } from '../../data/initialData';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';
import { StarRatingReviewsSection } from '../common/StarRatingReviewsSection';
import {
  Search,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Heart,
  Calendar,
  CheckCircle,
  Radio,
  SlidersHorizontal,
  X,
  Sparkles,
  Repeat,
  ArrowRight,
  Award,
  Zap,
  Play,
  UserCheck,
  Brain,
  Share2,
} from 'lucide-react';

export const MarketplaceDiscovery: React.FC = () => {
  const {
    walkers,
    openBookingModal,
    setSelectedWalker,
    selectedPostcodeArea,
    setSelectedPostcodeArea,
    setOwnerTab,
    setPersona,
    setWalkerTab,
    setHowToUseModalOpen,
    nativeShare,
  } = useMarketplace();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [filterDbsOnly, setFilterDbsOnly] = useState(true);
  const [filterFirstAidOnly, setFilterFirstAidOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(35);
  const [activeProfileWalker, setActiveProfileWalker] = useState<Walker | null>(null);

  const recommendedWalkers = walkers
    .filter(
      (w) =>
        w.isRecommended ||
        ((w.subscriptionPlan === 'Elite Package' || w.subscriptionPlan === 'PRO') &&
          w.subscriptionPaid !== false)
    )
    .sort((a, b) => {
      const tierWeight = (w: Walker) => {
        if (w.subscriptionPaid === false) return 0;
        if (w.subscriptionPlan === 'Elite Package') return 3;
        if (w.subscriptionPlan === 'PRO') return 2;
        return 1;
      };
      return tierWeight(b) - tierWeight(a);
    });

  const filteredWalkers = walkers
    .filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.postcodeArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.additionalServiceAreas &&
          w.additionalServiceAreas.some((area) =>
            area.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesPostcode =
        selectedPostcodeArea === 'All' ||
        w.postcodeArea === selectedPostcodeArea ||
        (w.subscriptionPlan === 'Elite Package' &&
          w.subscriptionPaid !== false &&
          w.additionalServiceAreas?.some((area) => area.includes(selectedPostcodeArea)));

      const matchesService =
        selectedService === 'All' ||
        w.services.some((s) => s.toLowerCase().includes(selectedService.toLowerCase()));

      const matchesDbs = !filterDbsOnly || w.dbsVerified;
      const matchesFirstAid = !filterFirstAidOnly || w.firstAidCertified;
      const matchesPrice = w.hourlyRate <= maxPrice;

      return (
        matchesSearch &&
        matchesPostcode &&
        matchesService &&
        matchesDbs &&
        matchesFirstAid &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      const tierRank = (w: Walker) => {
        if (w.subscriptionPaid === false) return 0;
        if (w.subscriptionPlan === 'Elite Package') return 3;
        if (w.subscriptionPlan === 'PRO') return 2;
        return 1;
      };
      return tierRank(b) - tierRank(a);
    });

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-[#072417] shadow-sm">
        <div className="absolute inset-0">
          <img
            src={ASSET_PATHS.heroPack}
            alt="Dog walking pack adventure in green meadow"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041a10]/95 via-[#072417]/80 to-transparent" />
        </div>

        <div className="relative px-6 py-10 sm:px-12 sm:py-14 max-w-3xl text-white">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3 tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Enhanced DBS Verified & Insured Up to £5M</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Trusted Dog Walkers, Kennels & Stays, Right Near You.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 mb-6 leading-relaxed">
            Connect with certified neighborhood dog handlers & licensed boarding hosts. Book custom walk durations, overnight stays, or record your own GPS walks with offline route caching and Pup Academy rewards.
          </p>

          {/* Main Screen Before Signing Up: Watch How to Use Video + Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => setHowToUseModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Watch: How to Use the App Video Tour</span>
            </button>

            <button
              onClick={() => setOwnerTab('live-walk')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Start My Own GPS Walk</span>
            </button>

            <button
              onClick={() => setOwnerTab('training')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Brain className="w-4 h-4 text-amber-300" />
              <span>Training Tips & Brain Games</span>
            </button>

            <button
              onClick={() => {
                setPersona('walker');
                setWalkerTab('credentials');
              }}
              className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Become a Verified Dog Walker (UK Guide)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Custom Walk Durations (15–90m)</span>
            </div>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Pup & Academy Points & Rewards</span>
            </div>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Offline PWA & Google Play Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Recommended / Featured Walkers Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white rounded-2xl border-2 border-emerald-300 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0f5132] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Featured & Recommended Walkers</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  Top Rated This Week
                </span>
              </h2>
              <p className="text-xs text-slate-500">Hand-picked professionals with 100% DBS verification, zero incidents, and highest repeat bookings.</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-800 hidden sm:inline">
            Guaranteed Care Protection
          </span>
        </div>

        {/* Recommended Walkers Cards Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedWalkers.map((walker) => (
            <div
              key={walker.id}
              className="bg-white rounded-xl border border-emerald-200/80 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-2.5">
                  <div className="relative">
                    <img
                      src={walker.avatar}
                      alt={walker.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-xl object-cover border border-emerald-300"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{walker.name}</h4>
                      <div className="flex items-center gap-0.5 text-xs text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-slate-900 tabular-nums">{walker.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-semibold truncate">
                      {walker.headline}
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {walker.location} ({walker.postcodeArea})
                    </span>
                  </div>
                </div>

                {/* Subscription availability pill */}
                {walker.subscriptionPackages && walker.subscriptionPackages.length > 0 && (
                  <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-lg text-[11px] text-emerald-900 mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-medium">
                      <Repeat className="w-3 h-3 text-emerald-700" />
                      Weekly Subscriptions
                    </span>
                    <strong className="font-mono">From £{walker.subscriptionPackages[0].weeklyPrice.toFixed(2)}/wk</strong>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Single Walk</span>
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">£{walker.hourlyRate}/hr</span>
                </div>
                <button
                  onClick={() => openBookingModal(walker)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-lg transition-colors shadow-2xs flex items-center gap-1"
                >
                  <span>Book / Subscribe</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsored Local Partner Banner */}
      <SponsoredAdBanner postcodeArea={selectedPostcodeArea} />

      {/* Search & Interactive Filter Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by neighborhood, postcode area (e.g. NW3, TW9, N1, SE10) or walker name..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Service Filter Tabs (Wraps cleanly inside screen) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-full">
            {['All', 'Group Walk', 'Solo Sniffari', 'Puppy Drop-in', 'Senior Stroll'].map((service) => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  selectedService === service
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Compliance & Price Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Filter by Trust:
            </span>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterDbsOnly}
                onChange={(e) => setFilterDbsOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-slate-700 font-medium">Enhanced DBS Check Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterFirstAidOnly}
                onChange={(e) => setFilterFirstAidOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-slate-700 font-medium">Canine CPR & First Aid</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">Max hourly rate:</span>
            <input
              type="range"
              min="18"
              max="40"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-emerald-600 cursor-pointer w-24 sm:w-32"
            />
            <span className="font-semibold text-slate-900 tabular-nums">£{maxPrice}/hr</span>
          </div>
        </div>
      </div>

      {/* Walker Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">
            Available Verified Walkers ({filteredWalkers.length})
          </div>
          <div className="text-xs text-slate-500">
            Filtered by Greater London boroughs & council verified licenses
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWalkers.map((walker) => (
            <div
              key={walker.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Top Bar of Card */}
                <div className="flex items-start gap-4 mb-3">
                  <img
                    src={walker.avatar}
                    alt={walker.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 truncate">{walker.name}</h3>
                      <button
                        type="button"
                        onClick={() => setActiveProfileWalker(walker)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs text-amber-900 shrink-0 shadow-2xs transition-colors cursor-pointer"
                        title="Click to view or submit verified star reviews"
                      >
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= Math.round(walker.rating)
                                  ? 'text-amber-500 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-extrabold text-slate-950 tabular-nums">
                          {walker.rating.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-800">
                          ({walker.reviewCount} reviews)
                        </span>
                      </button>
                    </div>

                    <p className="text-xs text-emerald-800 font-medium line-clamp-1 mb-1">
                      {walker.headline}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {walker.location} ({walker.postcodeArea})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{walker.distanceMiles} mi away</span>
                    </div>
                  </div>
                </div>

                {/* Clean unboxed trust metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-3 pb-3 border-b border-slate-100">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Enhanced DBS Verified
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{walker.insuranceCoverAmount}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Max {walker.maxPackSize} Dogs</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                  {walker.bio}
                </p>

                {/* Subscription Tier & Priority Search Placement / Featured Listing Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  {walker.subscriptionPlan === 'Elite Package' && walker.subscriptionPaid !== false ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured Listing · Elite Package</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        Priority #1 Search Placement
                      </span>
                      {walker.additionalServiceAreas && walker.additionalServiceAreas.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-semibold">
                          Multi-Area: +{walker.additionalServiceAreas.length} Boroughs
                        </span>
                      )}
                    </>
                  ) : walker.subscriptionPlan === 'PRO' && walker.subscriptionPaid !== false ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-100 text-[10px] font-extrabold uppercase tracking-wider">
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>PRO Verified · Priority Search Placement</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      Starter Plan (Max 5 Bookings/Week)
                    </span>
                  )}
                </div>

                {/* Subscription Available Tag (Only if Walker has paid PRO or Elite subscription) */}
                {walker.subscriptionPlan !== 'FREE / STARTER' &&
                  walker.subscriptionPaid !== false &&
                  walker.subscriptionPackages &&
                  walker.subscriptionPackages.length > 0 && (
                    <div className="p-2 bg-emerald-50/60 rounded-lg text-[11px] text-emerald-900 font-medium mb-2.5 flex items-center gap-1.5">
                      <Repeat className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Recurring subscriptions (1-month cancellation notice): Save up to 15%</span>
                    </div>
                  )}

                {/* Quick Weekly Availability Calendar Preview for Dog Owners */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1.5">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span>Walker Live Availability Calendar (Oct 2026)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveProfileWalker(walker)}
                      className="text-emerald-700 hover:underline font-bold cursor-pointer"
                    >
                      Open Full Calendar →
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                    {[
                      { d: 'Mon', status: 'Open', slots: '3 slots' },
                      { d: 'Tue', status: 'Open', slots: '2 slots' },
                      { d: 'Wed', status: 'Open', slots: '4 slots' },
                      { d: 'Thu', status: 'Open', slots: '2 slots' },
                      { d: 'Fri', status: 'Open', slots: '3 slots' },
                      { d: 'Sat', status: 'Limited', slots: '1 slot' },
                      { d: 'Sun', status: walker.id === 'walker_sarah_01' ? 'Rest' : 'Open', slots: walker.id === 'walker_sarah_01' ? 'Closed' : '2 slots' },
                    ].map((dayItem) => (
                      <button
                        key={dayItem.d}
                        type="button"
                        onClick={() => openBookingModal(walker)}
                        disabled={dayItem.status === 'Rest'}
                        className={`p-1 rounded-lg border transition-all ${
                          dayItem.status === 'Rest'
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : dayItem.status === 'Limited'
                            ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 cursor-pointer'
                            : 'bg-white border-emerald-200 text-emerald-900 hover:bg-emerald-50 cursor-pointer'
                        }`}
                      >
                        <div className="font-bold">{dayItem.d}</div>
                        <div className="text-[8px] font-semibold opacity-80">{dayItem.slots}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Star-Based Service Reviews & Rating Score Preview */}
                <div className="mb-3">
                  <StarRatingReviewsSection
                    targetId={walker.id}
                    targetType="walker"
                    targetName={walker.name}
                    baseRating={walker.rating}
                    baseReviewCount={walker.reviewCount}
                    compact={true}
                  />
                </div>
              </div>

              {/* Card Footer: Rates & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-400">Single walk from</div>
                  <div className="text-lg font-bold text-slate-900 tabular-nums">
                    £{walker.hourlyRate}
                    <span className="text-xs font-normal text-slate-500">/hr</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      nativeShare({
                        type: 'profile',
                        title: `🦮 Verified Dog Walker: ${walker.name} (${walker.rating}★)`,
                        subtitle: `${walker.headline} · ${walker.location} (${walker.postcodeArea})`,
                        badge: `DBS Verified (${walker.dbsCertificateNumber})`,
                        text: `Check out ${walker.name}, an Enhanced DBS Verified & £5M Insured professional dog walker in ${walker.location} (${walker.postcodeArea}) on My Paws Walks! Rated ${walker.rating}★ (${walker.reviewCount} reviews).`,
                      })
                    }
                    className="p-2 text-xs font-bold text-[#0f5132] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Share Verified Walker Profile"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    onClick={() => setActiveProfileWalker(walker)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Availability & Details
                  </button>
                  <button
                    onClick={() => openBookingModal(walker)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-xl transition-colors shadow-xs whitespace-nowrap flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book or Subscribe</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Walker Detail Modal */}
      {activeProfileWalker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeProfileWalker.avatar}
                  alt={activeProfileWalker.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{activeProfileWalker.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <strong className="text-slate-900 tabular-nums">{activeProfileWalker.rating}</strong> ({activeProfileWalker.reviewCount} reviews)
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeProfileWalker.location}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveProfileWalker(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <div className="text-xs font-semibold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Verified Credentials & Government Checks</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800">
                  <div>DBS Certificate: <strong className="font-mono">{activeProfileWalker.dbsCertificateNumber}</strong></div>
                  <div>Audit Issue Date: <strong>{activeProfileWalker.dbsIssueDate}</strong></div>
                  <div>Insurance Policy: <strong>{activeProfileWalker.insuranceCoverAmount}</strong></div>
                  <div>Council License: <strong>Authorized (Max {activeProfileWalker.maxPackSize} Dogs)</strong></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">About {activeProfileWalker.name}</h4>
                <p className="leading-relaxed">{activeProfileWalker.bio}</p>
              </div>

              {/* Interactive Month Availability Calendar for Dog Owners */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      <span>{activeProfileWalker.name}’s October 2026 Availability Calendar</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Click any available green date below to book a walk or recurring slot
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> 1 Slot Left
                    </span>
                    <span className="flex items-center gap-1 text-rose-600">
                      <span className="w-2 h-2 rounded-full bg-rose-400" /> Full
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                  <div>Sun</div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {/* Oct 2026 starts on Thursday -> 3 leading blanks */}
                  {[0, 1, 2].map((b) => (
                    <div key={`blank_${b}`} className="h-9 rounded-lg bg-slate-100/50" />
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isSunday = (day + 3) % 7 === 0;
                    const isBookedOut = day === 11 || day === 18 || day === 25 || (isSunday && activeProfileWalker.id === 'walker_sarah_01');
                    const isLimited = day === 3 || day === 10 || day === 17 || day === 24;
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isBookedOut}
                        onClick={() => {
                          const target = activeProfileWalker;
                          setActiveProfileWalker(null);
                          openBookingModal(target);
                        }}
                        className={`h-9 rounded-lg border text-[10px] font-bold flex flex-col items-center justify-center transition-all ${
                          isBookedOut
                            ? 'bg-rose-50/60 border-rose-200 text-rose-400 cursor-not-allowed line-through'
                            : isLimited
                            ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer'
                            : 'bg-white border-emerald-200 text-emerald-950 hover:bg-[#0f5132] hover:text-white cursor-pointer'
                        }`}
                      >
                        <span>{day}</span>
                        <span className="text-[8px] font-normal opacity-80">
                          {isBookedOut ? 'Full' : isLimited ? '1 left' : 'Open'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeProfileWalker.subscriptionPackages && activeProfileWalker.subscriptionPackages.length > 0 && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Repeat className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Recurring Walk Subscription Packages</span>
                    </h4>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      1-Month Cancellation Notice
                    </span>
                  </div>
                  {activeProfileWalker.subscriptionPackages.map((pkg) => (
                    <div key={pkg.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{pkg.title}</div>
                        <div className="text-[11px] text-slate-500">{pkg.walksPerWeek} walks/week · {pkg.description}</div>
                      </div>
                      <div className="font-bold text-slate-900 text-sm tabular-nums">
                        £{pkg.weeklyPrice.toFixed(2)}<span className="text-[10px] font-normal text-slate-500">/wk</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Full Star-Based Rating System & Service Reviews Section */}
              <StarRatingReviewsSection
                targetId={activeProfileWalker.id}
                targetType="walker"
                targetName={activeProfileWalker.name}
                baseRating={activeProfileWalker.rating}
                baseReviewCount={activeProfileWalker.reviewCount}
                compact={false}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() =>
                  nativeShare({
                    type: 'profile',
                    title: `🦮 Verified Dog Walker: ${activeProfileWalker.name} (${activeProfileWalker.rating}★)`,
                    subtitle: `${activeProfileWalker.headline} · ${activeProfileWalker.location}`,
                    badge: `DBS Certificate: ${activeProfileWalker.dbsCertificateNumber}`,
                    text: `Check out ${activeProfileWalker.name}, an Enhanced DBS Verified & ${activeProfileWalker.insuranceCoverAmount} Insured dog walker in ${activeProfileWalker.location} on My Paws Walks!`,
                  })
                }
                className="px-3.5 py-2 text-xs font-bold text-[#0f5132] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Verified Profile</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveProfileWalker(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const target = activeProfileWalker;
                    setActiveProfileWalker(null);
                    openBookingModal(target);
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-xl shadow-sm transition-colors"
                >
                  Proceed to Booking & Subscriptions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
