import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { KennelSuite } from '../../types';
import {
  Building2,
  ShieldCheck,
  Star,
  CheckCircle2,
  Plus,
  Moon,
  Award,
  Thermometer,
  Video,
  Users,
  Check,
  CreditCard,
  Sparkles,
  Trophy,
  Gift,
  Edit3,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  Eye,
  Camera,
  MapPin,
  Upload,
} from 'lucide-react';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';
import { WalkerDogProfileModal } from '../walker/WalkerDogProfileModal';
import { StarRatingReviewsSection } from '../common/StarRatingReviewsSection';

export const KennelPortal: React.FC = () => {
  const {
    kennels,
    kennelBookings,
    kennelTab,
    setKennelTab,
    updateKennelSuiteAvailability,
    updateKennelSuite,
    addKennelSuite,
    updateKennelSubscription,
    updateKennelProfile,
    showToast,
  } = useMarketplace();

  // Active kennel host (Oakwood Country Dog Lodge)
  const host = kennels[0];
  const suites = host.suites;

  // Custom Suite Modal State
  const [showAddSuiteModal, setShowAddSuiteModal] = useState(false);
  const [newSuiteName, setNewSuiteName] = useState('');
  const [newSuiteType, setNewSuiteType] = useState<KennelSuite['type']>('Luxury Executive Suite');
  const [newSuiteNightlyRate, setNewSuiteNightlyRate] = useState<number>(65);
  const [newSuiteDayRate, setNewSuiteDayRate] = useState<number>(42);
  const [newSuiteCapacity, setNewSuiteCapacity] = useState<number>(2);
  const [newSuiteDesc, setNewSuiteDesc] = useState('');
  const [newSuitePhotoUrl, setNewSuitePhotoUrl] = useState<string>('');
  const [postcodeInput, setPostcodeInput] = useState<string>(host.postcode || `${host.postcodeArea} 1AA`);

  // Membership / Sign-Up Fee State (Matching Walkers, Kennels & Sitters Pricing!)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    host.subscriptionBillingCycle || 'annual'
  );
  const activePlan: 'FREE / STARTER' | 'PRO' | 'Elite Package' =
    host.subscriptionPlan === 'FREE / STARTER' ||
    host.subscriptionPlan === 'PRO' ||
    host.subscriptionPlan === 'Elite Package'
      ? host.subscriptionPlan
      : 'PRO';
  const isSubscriptionPaid = host.subscriptionPaid !== false;
  const hasProKennelAccess =
    (activePlan === 'PRO' || activePlan === 'Elite Package') && isSubscriptionPaid;
  const hasEliteKennelAccess = activePlan === 'Elite Package' && isSubscriptionPaid;

  const [pendingCheckoutPlan, setPendingCheckoutPlan] = useState<
    'PRO' | 'Elite Package' | null
  >(null);
  const [isProcessingKennelPayment, setIsProcessingKennelPayment] = useState(false);

  const [kennelCancelPending, setKennelCancelPending] = useState(false);
  const [kennelCancelEffectiveDate, setKennelCancelEffectiveDate] = useState('');
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<'apple_pay' | 'google_pay' | 'paypal' | 'card' | 'klarna'>('apple_pay');

  // Pup & Academy Points & Custom Rewards State for Kennel / Dog Sitting Host
  const [kennelRewards, setKennelRewards] = useState([
    { id: 'kr_1', task: 'Overnight Calm Settling & Crate Mastery', pointsAwarded: 50, rewardOffer: 'Complimentary Organic Lavender Hydrobath (£25 Value)', active: true },
    { id: 'kr_2', task: 'Social Paddock Recall & Polite Greeting Assessment', pointsAwarded: 75, rewardOffer: '1 Free Day-Sitting Pass on Next Booking', active: true },
    { id: 'kr_3', task: '3-Day Puppy Socialization & Separation Confidence', pointsAwarded: 100, rewardOffer: '£20 Off 3+ Night Boarding Retreat + Academy Rosette', active: true },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState<number>(60);
  const [newRewardOffer, setNewRewardOffer] = useState('');

  // Night routine state
  const [thermostatReading] = useState('21.5°C (Optimal)');
  const [eveningWalkCompleted, setEveningWalkCompleted] = useState(true);
  const [bedtimeTreatsDelivered, setBedtimeTreatsDelivered] = useState(true);
  const [cctvLiveStreamActive, setCctvLiveStreamActive] = useState(true);

  // Kennel & Dog Sitter Availability Calendar + Clickable Dog Profile Modal State
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(15);
  const [blockedKennelDays, setBlockedKennelDays] = useState<number[]>([26, 27]);
  const [inspectingDogName, setInspectingDogName] = useState<string | null>(null);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlankDays = 3; // October 2026 starts on Thursday

  const getKennelBookingsForDay = (day: number) => {
    if (day >= 15 && day <= 18) {
      return kennelBookings;
    }
    if (day === 3 || day === 4 || day === 5) {
      return [
        {
          id: 'kb_oct_03',
          kennelId: host.id,
          kennelName: host.businessName,
          suiteId: suites[0]?.id || 'suite_1',
          suiteName: suites[0]?.name || 'Woodland Luxury Suite',
          ownerName: 'Oliver Harrison',
          ownerPhone: '+44 7700 900481',
          dogNames: ['Buster', 'Bella'],
          checkInDate: '03 Oct 2026',
          checkOutDate: '05 Oct 2026',
          totalNights: 2,
          totalPrice: 130.0,
          feedingSchedule: '1 scoop salmon & sweet potato kibble at 8:00 AM & 5:30 PM',
          medicationNotes: 'Joint Glucosamine chew with morning meal',
          emergencyVetConsent: true,
          status: 'Confirmed' as const,
          bookedAt: '2 days ago',
        },
      ];
    }
    if (day === 10 || day === 11) {
      return [
        {
          id: 'kb_oct_10',
          kennelId: host.id,
          kennelName: host.businessName,
          suiteId: suites[1]?.id || 'suite_2',
          suiteName: suites[1]?.name || 'Cosy Orchard Pod',
          ownerName: 'Clara Oswald',
          ownerPhone: '+44 7700 900592',
          dogNames: ['Luna'],
          checkInDate: '10 Oct 2026',
          checkOutDate: '11 Oct 2026',
          totalNights: 1,
          totalPrice: 52.0,
          feedingSchedule: 'Grain-free duck pate twice daily',
          medicationNotes: 'None',
          emergencyVetConsent: true,
          status: 'Confirmed' as const,
          bookedAt: 'Yesterday',
        },
      ];
    }
    return [];
  };

  const toggleBlockedKennelDay = (day: number) => {
    setBlockedKennelDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    showToast(`Updated Kennel & Sitter availability calendar for ${day} October 2026.`);
  };

  const dashboardPhotosList =
    host.dashboardPhotos && host.dashboardPhotos.length > 0
      ? host.dashboardPhotos
      : [
          host.dashboardPhotoUrl ||
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80',
        ];
  const maxDashboardPics = activePlan === 'Elite Package' ? 6 : activePlan === 'PRO' ? 4 : 1;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateKennelProfile(host.id, { avatar: reader.result });
        showToast('Kennel & Sitting logo / profile picture updated!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDashboardPicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (dashboardPhotosList.length >= maxDashboardPics && maxDashboardPics === 1) {
      // On Starter plan (1 dashboard pic allowed), replace the primary dashboard picture
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateKennelProfile(host.id, {
            dashboardPhotoUrl: reader.result,
            dashboardPhotos: [reader.result],
          });
          showToast('Dashboard picture updated! Upgrade to PRO or Elite to add more dashboard pictures.', 'success');
        }
      };
      reader.readAsDataURL(files[0]);
      return;
    }

    const remaining = maxDashboardPics - dashboardPhotosList.length;
    if (remaining <= 0) {
      showToast(
        `Maximum of ${maxDashboardPics} dashboard pictures reached on ${activePlan}. Upgrade your plan to add more dashboard pictures!`,
        'warning'
      );
      return;
    }

    files.slice(0, remaining).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const updated = [...dashboardPhotosList, reader.result].slice(0, maxDashboardPics);
          updateKennelProfile(host.id, {
            dashboardPhotoUrl: updated[0],
            dashboardPhotos: updated,
          });
          showToast(`Added new dashboard picture (${updated.length}/${maxDashboardPics})!`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDashboardPic = (idx: number) => {
    if (dashboardPhotosList.length <= 1) {
      showToast('At least 1 primary dashboard picture is required.', 'info');
      return;
    }
    const updated = dashboardPhotosList.filter((_, i) => i !== idx);
    updateKennelProfile(host.id, {
      dashboardPhotoUrl: updated[0],
      dashboardPhotos: updated,
    });
    showToast('Dashboard picture removed.', 'info');
  };

  const handleExistingSuitePicUpload = (suiteId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateKennelSuite(host.id, suiteId, { photoUrl: reader.result });
        showToast('Suite picture uploaded and saved!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNewSuitePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setNewSuitePhotoUrl(reader.result);
        showToast('Suite picture attached!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePostcode = () => {
    if (!postcodeInput.trim()) {
      showToast('Kennels & Sitting must provide a valid UK postcode.', 'warning');
      return;
    }
    const cleanPc = postcodeInput.trim().toUpperCase();
    const outcode = cleanPc.split(' ')[0] || host.postcodeArea;
    updateKennelProfile(host.id, {
      postcode: cleanPc,
      postcodeArea: outcode,
    });
    showToast(`Kennel & Sitting postcode updated to ${cleanPc}!`, 'success');
  };

  const handleCreateCustomSuite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuiteName) return;

    addKennelSuite(host.id, {
      name: newSuiteName,
      type: newSuiteType,
      capacityDogs: Number(newSuiteCapacity) || 2,
      nightlyRate: Number(newSuiteNightlyRate) || 55,
      dayCareRate: Number(newSuiteDayRate) || 35,
      features: ['Underfloor Heating', '24/7 HD Parent Webcam', 'Orthopedic Memory Foam Bed', 'Private Grass Run'],
      description: newSuiteDesc || 'Bespoke climate-controlled boarding and dog sitting suite with 24/7 care.',
      photoUrl:
        newSuitePhotoUrl ||
        'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
      available: true,
    });

    setNewSuiteName('');
    setNewSuiteDesc('');
    setNewSuitePhotoUrl('');
    setShowAddSuiteModal(false);
  };

  const handleAddKennelReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newRewardOffer) return;
    setKennelRewards((prev) => [
      ...prev,
      {
        id: `kr_${Date.now()}`,
        task: newTaskTitle,
        pointsAwarded: Number(newTaskPoints) || 50,
        rewardOffer: newRewardOffer,
        active: true,
      },
    ]);
    setNewTaskTitle('');
    setNewRewardOffer('');
    showToast('Added new Pup & Academy training reward for your boarding clients!');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Kennel & Dog Sitting Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0f5132] to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>DEFRA 5-Star Licensed Boarding & Dog Sitting · {host.councilLicenceNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {host.businessName}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {host.headline} — Manage your custom overnight stay prices, daytime dog sitting tariffs, suite pictures, logo/dashboard pics, and host membership plan.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200 pt-1">
              <span>📍 {host.location}</span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/30 border border-emerald-400/40 text-white font-mono font-bold text-xs">
                Postcode: {host.postcode || `${host.postcodeArea} 1AA`}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
                <Star className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>{host.rating.toFixed(2)} / 5.00 ★</span>
                <span className="text-[10px] font-bold opacity-85">
                  ({host.reviewCount} verified reviews)
                </span>
              </span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                Plan: {activePlan}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 space-y-2.5 shrink-0">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Logged-in Host Account:
            </div>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={host.avatar}
                  alt={host.contactName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 bg-white"
                />
                <label
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow border border-white cursor-pointer"
                  title="Upload Kennel & Sitting Logo / Profile Pic"
                >
                  <Camera className="w-3 h-3" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
              <div>
                <div className="font-bold text-white text-xs">{host.contactName}</div>
                <div className="text-[10px] text-emerald-200">Verified Kennel & Sitting Host</div>
                <label className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold cursor-pointer">
                  <Upload className="w-2.5 h-2.5 text-amber-300" />
                  <span>Upload Logo / Profile Pic</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KENNEL & SITTING LOGO, MANDATORY POSTCODE & DASHBOARD PICTURES STUDIO (WITH UPGRADE PERKS) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-700" />
                <span>Kennel & Sitting Logo, Postcode & Dashboard Pictures</span>
              </h2>
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                {dashboardPhotosList.length} / {maxDashboardPics} Dashboard Pics ({activePlan})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your official logo/profile pic, provide your mandatory UK postcode, and upload your primary dashboard picture. Upgrade to <strong>PRO (up to 4 pics)</strong> or <strong>Elite (up to 6 pics)</strong> to add more dashboard pictures!
            </p>
          </div>

          {/* Mandatory Postcode Input */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Facility Postcode *:</span>
            </div>
            <input
              type="text"
              value={postcodeInput}
              onChange={(e) => setPostcodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. TW9 1DH"
              className="w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-extrabold text-slate-900 uppercase"
            />
            <button
              type="button"
              onClick={handleSavePostcode}
              className="px-3 py-1.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Save Postcode
            </button>
          </div>
        </div>

        {/* Logo + Dashboard Pictures Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left 4 Cols: Logo / Profile Pic Card */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={host.avatar}
                alt={host.businessName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 bg-white shadow-xs shrink-0"
              />
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  Logo / Profile Picture
                </div>
                <p className="text-[11px] text-slate-600">
                  Displayed on your boarding cards & header.
                </p>
                <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white text-[11px] font-bold rounded-xl cursor-pointer shadow-2xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Logo / Pic</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right 8 Cols: Dashboard Pictures Showcase & Upload */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-800">
                Dashboard Banner Pictures ({dashboardPhotosList.length} of {maxDashboardPics} used):
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-2xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {maxDashboardPics === 1
                      ? 'Upload / Replace Dashboard Pic'
                      : `Upload Dashboard Pic (${Math.max(0, maxDashboardPics - dashboardPhotosList.length)} left)`}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple={maxDashboardPics > 1}
                    className="hidden"
                    onChange={handleDashboardPicUpload}
                  />
                </label>

                {activePlan === 'FREE / STARTER' && (
                  <button
                    type="button"
                    onClick={() => setKennelTab('subscriptions')}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Upgrade to Add More Dashboard Pics</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {dashboardPhotosList.map((picUrl, idx) => (
                <div
                  key={idx}
                  className="relative h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs"
                >
                  <img
                    src={picUrl}
                    alt={`${host.businessName} dashboard ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-slate-950/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {idx === 0 ? '★ Main Dashboard Pic' : `Dashboard Pic #${idx + 1}`}
                  </span>
                  {dashboardPhotosList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDashboardPic(idx)}
                      className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              {dashboardPhotosList.length < maxDashboardPics && (
                <label className="h-28 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 flex flex-col items-center justify-center gap-1 text-emerald-800 cursor-pointer transition-colors p-2 text-center">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px] font-extrabold">+ Add Dashboard Pic</span>
                  <span className="text-[10px] text-emerald-600">
                    {maxDashboardPics - dashboardPhotosList.length} slot(s) available
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleDashboardPicUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <SponsoredAdBanner category="Veterinary Hospital" />

      {/* Prominent Aggregated Star Rating & Verified Parent Reviews Summary */}
      <StarRatingReviewsSection
        targetId={host.id}
        targetType="kennel"
        targetName={host.businessName}
        baseRating={host.rating}
        baseReviewCount={host.reviewCount}
        compact={true}
      />

      {/* Kennel Navigation Tabs (Wraps cleanly inside screen) */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2 pb-2 text-xs font-semibold max-w-full">
        <button
          onClick={() => setKennelTab('suites-pricing')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            kennelTab === 'suites-pricing'
              ? 'bg-[#0f5132] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Suites & Custom Pricing ({suites.length})</span>
        </button>

        <button
          onClick={() => setKennelTab('subscriptions')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            kennelTab === 'subscriptions'
              ? 'bg-[#0f5132] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Sign-Up & Membership Fees</span>
        </button>

        <button
          onClick={() => setKennelTab('calendar')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            kennelTab === 'calendar'
              ? 'bg-[#0f5132] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Availability Calendar & Dog Profiles</span>
        </button>

        <button
          onClick={() => setKennelTab('bookings')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            kennelTab === 'bookings'
              ? 'bg-[#0f5132] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Canine Guests & Stays ({kennelBookings.length})</span>
        </button>

        <button
          onClick={() => setKennelTab('night-routine')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            kennelTab === 'night-routine' || kennelTab === 'overnight-routine'
              ? 'bg-[#0f5132] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Pup Academy Rewards & Night Log</span>
        </button>

        <button
          onClick={() => setKennelTab('licensing')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            kennelTab === 'licensing'
              ? 'bg-[#0f5132] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Council Licensing & Vet Audit</span>
        </button>
      </div>

      {/* TAB 1: SUITES & CUSTOM PRICING INPUT */}
      {kennelTab === 'suites-pricing' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Boarding Suites, Dog Sitting & Custom Price Input
              </h2>
              <p className="text-xs text-slate-500">
                Input your own custom nightly boarding rates (£) and daytime dog sitting prices (£) directly below. Changes update live on the Pet Owner marketplace.
              </p>
            </div>
            <button
              onClick={() => setShowAddSuiteModal(true)}
              className="px-4 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Suite / Sitting Option</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suites.map((suite) => (
              <div
                key={suite.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden group">
                  <img
                    src={suite.photoUrl}
                    alt={suite.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-xs">
                    £{suite.nightlyRate} <span className="text-[10px] font-normal text-slate-500">/ night</span>
                  </div>
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-white">
                    {suite.type}
                  </div>
                  <label className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/85 hover:bg-[#0f5132] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md cursor-pointer backdrop-blur-xs transition-colors">
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>Upload Suite Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleExistingSuitePicUpload(suite.id, e)}
                    />
                  </label>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{suite.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {suite.description}
                    </p>

                    {/* Direct Custom Price Inputs for Kennel & Dog Sitting Host */}
                    <div className="mt-4 p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-2.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                        <Edit3 className="w-3 h-3 text-emerald-700" />
                        <span>Input Your Custom Prices (£):</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <label className="text-slate-700 font-semibold">Overnight Stay Rate:</label>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-slate-700">£</span>
                          <input
                            type="number"
                            min="10"
                            value={suite.nightlyRate}
                            onChange={(e) =>
                              updateKennelSuite(host.id, suite.id, {
                                nightlyRate: Number(e.target.value),
                              })
                            }
                            className="w-20 px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-black text-slate-900 font-mono text-right"
                          />
                          <span className="text-[10px] text-slate-500">/night</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <label className="text-slate-700 font-semibold">Day Sitting Rate:</label>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-slate-700">£</span>
                          <input
                            type="number"
                            min="5"
                            value={suite.dayCareRate}
                            onChange={(e) =>
                              updateKennelSuite(host.id, suite.id, {
                                dayCareRate: Number(e.target.value),
                              })
                            }
                            className="w-20 px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-black text-emerald-900 font-mono text-right"
                          />
                          <span className="text-[10px] text-slate-500">/day</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <label className="text-slate-700 font-semibold">Max Family Dogs:</label>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={suite.capacityDogs}
                          onChange={(e) =>
                            updateKennelSuite(host.id, suite.id, {
                              capacityDogs: Number(e.target.value),
                            })
                          }
                          className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-right"
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Included Suite Amenities:
                      </span>
                      <ul className="text-[11px] text-slate-700 space-y-1">
                        {suite.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-emerald-600">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                      <input
                        type="checkbox"
                        checked={suite.available}
                        onChange={() => {
                          const updated = !suite.available;
                          updateKennelSuiteAvailability(host.id, suite.id, updated);
                        }}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                      />
                      <span className="font-semibold text-slate-800">
                        {suite.available ? 'Open for Bookings' : 'Booked Out'}
                      </span>
                    </label>

                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Auto-Saved ✓
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KENNELS, BOARDING & DOG SITTING SIGN-UP / MEMBERSHIP FEES */}
      {kennelTab === 'subscriptions' && (
        <div className="space-y-8">
          {/* Dog Owners Free Banner */}
          <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider">
                  Dog Owners — FREE
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Dog owners do not pay a monthly or annual subscription.
                </h3>
                <p className="text-xs text-slate-600">
                  Dog owners can create an account, create dog profiles, search pet professionals, view profiles and reviews, contact professionals, and make bookings for free.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-emerald-200 px-4 py-2.5 text-center shrink-0">
                <div className="text-xl font-black text-emerald-700">£0 / FREE</div>
                <div className="text-[11px] font-semibold text-slate-500">For Dog Owners</div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Walkers, Kennels & Sitters Pricing</span>
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Kennels, Sitters & Walkers Membership Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Simple, transparent monthly and annual pricing for professional dog walkers, kennels, and sitters.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-12 h-6 bg-emerald-800 rounded-full p-0.5 transition-colors relative cursor-pointer"
                aria-label="Toggle monthly or annual billing"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-amber-400 transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-black text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">
                  Save up to £29.89/yr
                </span>
              </button>
            </div>
          </div>

          {/* 3 Pricing Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1: FREE / STARTER (£0) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Walkers, Kennels & Sitters
                  </span>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    10% Commission
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">FREE / STARTER</h3>
                <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">£0</span>
                    <span className="text-xs text-slate-600 font-semibold">per month</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    £0 per year · Free starter account
                  </div>
                </div>

                <div className="mb-4 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold flex items-center justify-between">
                  <span>Completed Booking Commission</span>
                  <span className="font-mono text-sm font-black">10%</span>
                </div>

                <p className="text-xs font-bold text-slate-700 mb-3">Allows professionals to:</p>

                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  {[
                    'Create a profile',
                    'Advertise services',
                    'Set prices',
                    'Receive enquiries',
                    'Receive 5 bookings per week (limited bookings)',
                    'Collect reviews',
                    '10% commission on completed bookings',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateKennelSubscription(host.id, 'FREE / STARTER', billingCycle);
                }}
                className={`w-full py-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                  activePlan === 'FREE / STARTER'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {activePlan === 'FREE / STARTER' ? '✓ Current Active Plan' : 'Select FREE / STARTER (£0)'}
              </button>
            </div>

            {/* Tier 2: PRO – MOST POPULAR (£6.99/mo or £69.99/yr) */}
            <div className="bg-emerald-950 text-white rounded-3xl border-2 border-emerald-500 p-6 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 whitespace-nowrap">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>PRO – MOST POPULAR</span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pt-1">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Most Popular Plan
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full">
                    5% Commission
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">PRO</h3>
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700">
                  {billingCycle === 'monthly' ? (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white tabular-nums">£6.99</span>
                        <span className="text-xs text-emerald-200 font-semibold">per month</span>
                      </div>
                      <div className="text-[11px] text-emerald-200 mt-1 flex items-center justify-between">
                        <span>Or £69.99 per year</span>
                        <span className="font-bold text-amber-300">Save £13.89/yr</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white tabular-nums">£69.99</span>
                        <span className="text-xs text-emerald-200 font-semibold">per year</span>
                      </div>
                      <div className="text-[11px] text-emerald-200 mt-1 flex items-center justify-between">
                        <span>£6.99 per month billed monthly</span>
                        <span className="font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md">
                          Save £13.89/yr
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-900 border border-emerald-700 text-emerald-100 text-xs font-bold flex items-center justify-between">
                  <span>Completed Booking Commission</span>
                  <span className="font-mono text-sm font-black text-amber-300">5%</span>
                </div>

                <p className="text-xs font-bold text-emerald-200 mb-3">Includes:</p>

                <ul className="space-y-2.5 text-xs text-emerald-100 mb-6">
                  {[
                    'Unlimited bookings',
                    'Unlimited customers',
                    'Enhanced profile',
                    'Priority search placement',
                    'Booking calendar',
                    'Recurring bookings',
                    'Messaging',
                    'Business analytics',
                    'Promotional tools',
                    '5% commission on completed bookings',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (activePlan === 'PRO') {
                    showToast('Your PRO membership is already active & paid!');
                    return;
                  }
                  setPendingCheckoutPlan('PRO');
                }}
                className="w-full py-3 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md cursor-pointer"
              >
                {activePlan === 'PRO'
                  ? `✓ Currently Active (${billingCycle === 'annual' ? '£69.99/yr' : '£6.99/mo'})`
                  : `Pay & Activate PRO (${billingCycle === 'annual' ? '£69.99/yr' : '£6.99/mo'})`}
              </button>
            </div>

            {/* Tier 3: Elite Package (£14.99/mo or £149.99/yr) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Teams & Multi-Area
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    2.5% Commission
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">Elite Package</h3>
                <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  {billingCycle === 'monthly' ? (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-900 tabular-nums">£14.99</span>
                        <span className="text-xs text-slate-600 font-semibold">per month</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Or £149.99 per year</span>
                        <span className="font-bold text-emerald-700">Save £29.89/yr</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-900 tabular-nums">£149.99</span>
                        <span className="text-xs text-slate-600 font-semibold">per year</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>£14.99 per month billed monthly</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Save £29.89/yr
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center justify-between">
                  <span>Completed Booking Commission</span>
                  <span className="font-mono text-sm font-black text-emerald-700">2.5%</span>
                </div>

                <p className="text-xs font-bold text-slate-700 mb-3">Includes:</p>

                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  {[
                    'Everything in Pro',
                    'Multiple staff/walkers',
                    'Team management',
                    'Multiple service areas',
                    'Advanced analytics',
                    'Featured listing',
                    'Business management tools',
                    '2.5% commission on completed bookings',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (activePlan === 'Elite Package') {
                    showToast('Your Elite Package membership is already active & paid!');
                    return;
                  }
                  setPendingCheckoutPlan('Elite Package');
                }}
                className={`w-full py-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                  activePlan === 'Elite Package'
                    ? 'bg-[#0f5132] text-white border-[#0f5132]'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {activePlan === 'Elite Package'
                  ? `✓ Current Active Plan (${billingCycle === 'annual' ? '£149.99/yr' : '£14.99/mo'})`
                  : `Pay & Activate Elite Package (${billingCycle === 'annual' ? '£149.99/yr' : '£14.99/mo'})`}
              </button>
            </div>
          </div>

          {/* Recurring Subscription & 1-Month Cancellation Notice Management for Kennels & Sitters */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-4xl mx-auto space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Recurring Membership & 1-Month Cancellation Notice
                </h4>
                <p className="text-xs text-slate-500">
                  Paid kennel & sitter plans renew automatically on a recurring {billingCycle} cycle with a mandatory <strong>1-month (30-day) notice of cancellation period</strong>.
                </p>
              </div>
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full self-start sm:self-auto ${
                  kennelCancelPending
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : activePlan === 'FREE / STARTER'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                {kennelCancelPending
                  ? `Cancellation Notice Active (Ends ${kennelCancelEffectiveDate})`
                  : `Active Plan: ${activePlan}`}
              </span>
            </div>

            {activePlan === 'FREE / STARTER' ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Your kennel/sitting profile is on the <strong>FREE / STARTER (£0/mo)</strong> tier (10% commission, up to 5 bookings/week). No recurring subscription charge applies.
              </div>
            ) : kennelCancelPending ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1 text-amber-950">
                  <div className="font-extrabold">
                    1-Month Cancellation Notice Active for {activePlan}
                  </div>
                  <p className="text-amber-900">
                    Your {activePlan} benefits remain active throughout your 1-month notice period until <strong>{kennelCancelEffectiveDate}</strong>, after which your account switches to FREE / STARTER (£0/mo).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setKennelCancelPending(false);
                    setKennelCancelEffectiveDate('');
                    showToast(`Resumed your recurring ${activePlan} membership!`);
                  }}
                  className="px-4 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl shrink-0 cursor-pointer"
                >
                  Keep My Subscription
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1 text-slate-600">
                  <div className="font-bold text-slate-900">
                    Need to cancel your recurring {activePlan} subscription?
                  </div>
                  <p>
                    You can cancel anytime by giving 1 month’s notice. Your {activePlan} plan will remain active for 30 days from today before reverting to FREE / STARTER (£0/mo).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setMonth(d.getMonth() + 1);
                    const dateStr = d.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });
                    setKennelCancelPending(true);
                    setKennelCancelEffectiveDate(dateStr);
                    showToast(
                      `1-Month Cancellation Notice submitted for ${activePlan}. Active until ${dateStr}.`,
                      'info'
                    );
                  }}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl shrink-0 cursor-pointer"
                >
                  Cancel Subscription (1-Month Notice)
                </button>
              </div>
            )}
          </div>

          {/* Trusted Payment Providers for Host Subscription */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Preferred Recurring Membership Billing Method</h4>
              <span className="text-[11px] text-emerald-700 font-semibold">Recurring Billing · 1-Month Cancellation Notice</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'apple_pay', label: ' Pay', sub: 'Apple Pay' },
                { id: 'google_pay', label: 'G Pay', sub: 'Google Pay' },
                { id: 'paypal', label: 'PayPal', sub: 'Verified Business' },
                { id: 'card', label: 'Visa / MC', sub: 'Direct Debit' },
                { id: 'klarna', label: 'Klarna.', sub: 'Split Annual' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => {
                    setSelectedPaymentProvider(pm.id as any);
                    showToast(`Default membership payment method set to ${pm.sub}.`);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedPaymentProvider === pm.id
                      ? 'bg-[#0f5132] text-white border-[#0f5132] font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-black">{pm.label}</div>
                  <div className="text-[10px] opacity-75">{pm.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2.5: KENNEL & DOG SITTER AVAILABILITY CALENDAR & DOG PROFILES (Requires Paid PRO or Elite Subscription) */}
      {kennelTab === 'calendar' && !hasProKennelAccess && (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 text-center max-w-2xl mx-auto space-y-5 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-800">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
              Subscription Restriction · PRO or Elite Required
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Booking & Availability Calendar Requires a Paid PRO or Elite Subscription
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your kennel/sitting account is currently on the <strong>FREE / STARTER (£0/mo)</strong> tier (capped at 5 bookings/week, 10% commission). To unlock the interactive <strong>Booking & Availability Calendar</strong>, unlimited stays, promotional tools, and 5% commission, please complete your subscription payment.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setKennelTab('subscriptions')}
            className="px-6 py-3 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-black text-xs shadow-md cursor-pointer"
          >
            View Plans & Pay Subscription (£6.99/mo or £69.99/yr) →
          </button>
        </div>
      )}

      {kennelTab === 'calendar' && hasProKennelAccess && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Interactive Month Calendar */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  October 2026 — Kennel & Sitter Availability Calendar
                </h2>
                <p className="text-xs text-slate-500">
                  Tap any date to inspect booked boarding stays, click dogs to open their full Care Profile, or block out full dates.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => showToast('Previous month')}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Next month')}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-400 uppercase pb-2 border-b border-slate-100">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div className="text-emerald-700">Sat</div>
              <div className="text-rose-500">Sun</div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: leadingBlankDays }).map((_, idx) => (
                <div key={`blank_${idx}`} className="h-20 sm:h-24 rounded-2xl bg-slate-50/50" />
              ))}

              {daysInMonth.map((day) => {
                const dayStays = getKennelBookingsForDay(day);
                const isBlocked = blockedKennelDays.includes(day);
                const isSelected = selectedCalendarDay === day;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedCalendarDay(day)}
                    className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#0f5132] ring-2 ring-emerald-500/20 bg-emerald-50/40 shadow-xs'
                        : isBlocked
                        ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                        : dayStays.length > 0
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{day}</span>
                      {isBlocked ? (
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1 rounded">
                          Full
                        </span>
                      ) : (
                        dayStays.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        )
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayStays.slice(0, 1).map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="text-[9px] bg-[#0f5132] text-white rounded px-1.5 py-0.5 truncate font-semibold"
                        >
                          🐾 {st.dogNames.join(', ')}
                        </div>
                      ))}
                      {dayStays.length > 1 && (
                        <div className="text-[9px] text-emerald-800 font-bold">
                          +{dayStays.length - 1} more stay
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: Selected Date Bookings & Clickable Dog Profile Inspector */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {selectedCalendarDay} October 2026 — Suite Bookings
                </h3>
                <p className="text-xs text-slate-500">
                  Click any dog below to view their full Care Profile, Address & Vet Guide
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleBlockedKennelDay(selectedCalendarDay)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  blockedKennelDays.includes(selectedCalendarDay)
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {blockedKennelDays.includes(selectedCalendarDay)
                  ? 'Re-Open Date'
                  : 'Block Date'}
              </button>
            </div>

            {blockedKennelDays.includes(selectedCalendarDay) ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-rose-600" />
                  <span>Date Blocked / Fully Booked</span>
                </div>
                <p>No additional overnight boarding or day-sitting requests will be accepted for this date.</p>
              </div>
            ) : getKennelBookingsForDay(selectedCalendarDay).length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                All suites & sitting rooms are available on {selectedCalendarDay} October 2026.
              </div>
            ) : (
              <div className="space-y-3">
                {getKennelBookingsForDay(selectedCalendarDay).map((stay) => (
                  <div
                    key={stay.id}
                    className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-950">{stay.suiteName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-bold text-[10px]">
                        {stay.checkInDate} → {stay.checkOutDate}
                      </span>
                    </div>

                    <div className="text-slate-700">
                      Owner: <strong>{stay.ownerName}</strong> ({stay.ownerPhone}) ·{' '}
                      <strong className="text-[#0f5132]">£{stay.totalPrice.toFixed(2)} Escrow</strong>
                    </div>

                    {/* Clickable Dog Profile Buttons */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-600 block">
                        Booked Canine Guests (Tap dog to view Care Profile & Address):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {stay.dogNames.map((dName, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setInspectingDogName(dName)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#0f5132] text-slate-900 hover:text-white border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          >
                            <span>🐾 {dName}</span>
                            <Eye className="w-3.5 h-3.5" />
                            <span className="underline text-[10px]">View Dog Profile</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200/80 text-[11px] text-slate-700 space-y-0.5">
                      <div>
                        <strong>Feeding:</strong> {stay.feedingSchedule}
                      </div>
                      <div>
                        <strong>Meds:</strong> {stay.medicationNotes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OVERNIGHT GUESTS & BOOKINGS */}
      {kennelTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Active & Upcoming Canine Stays ({kennelBookings.length})
              </h2>
              <p className="text-xs text-slate-500">
                Click any dog name below to open their full Care Profile, Home Address & Vet Protocol.
              </p>
            </div>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              100% Escrow Protected
            </span>
          </div>

          <div className="space-y-3">
            {kennelBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-2.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{b.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                      {b.status}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-slate-800">{b.suiteName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Booked Dogs:</span>
                    {b.dogNames.map((dName, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInspectingDogName(dName)}
                        className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-[#0f5132] text-emerald-950 hover:text-white border border-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>🐾 {dName}</span>
                        <Eye className="w-3.5 h-3.5" />
                        <span className="underline text-[10px]">View Dog Profile</span>
                      </button>
                    ))}
                    <span className="text-slate-500 font-semibold">({b.totalNights} Nights)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-600">
                    <span>Check-in: <strong>{b.checkInDate}</strong></span>
                    <span>Check-out: <strong>{b.checkOutDate}</strong></span>
                    <span>Parent: <strong>{b.ownerName}</strong> ({b.ownerPhone})</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1 text-[11px] text-slate-700 border border-slate-100">
                    <div><strong>Feeding Routine:</strong> {b.feedingSchedule}</div>
                    <div><strong>Medications:</strong> {b.medicationNotes}</div>
                    <div className="text-emerald-800 font-semibold">
                      ✓ Emergency Vet Authorized under My Paws Walks RCVS protocol
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Held in Escrow</span>
                    <div className="text-xl font-black text-slate-900">£{b.totalPrice.toFixed(2)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Awarded +75 Pup Academy Points to ${b.dogNames.join(', ')} for exemplary overnight manners!`)}
                      className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-700" />
                      <span>Award Pup Points</span>
                    </button>
                    <button
                      onClick={() => showToast(`Stay marked as checked-in for ${b.dogNames.join(', ')}!`)}
                      className="px-4 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Guest Check-In
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PUP ACADEMY REWARDS & NIGHT CARE LOG */}
      {(kennelTab === 'night-routine' || kennelTab === 'overnight-routine') && (
        <div className="space-y-6">
          {/* Pup & Academy Points & Client Rewards Configuration */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Pup & Academy Points — Configure Stay Tasks & Client Rewards</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Define what training or settling milestones dogs complete during their stay and what rewards pet owners unlock.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full self-start">
                🐾 Academy Partner Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kennelRewards.map((kr) => (
                <div key={kr.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/30 text-amber-950 px-2 py-0.5 rounded-md">
                        +{kr.pointsAwarded} Pup Points
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">Active Offer</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">{kr.task}</h4>
                    <p className="text-xs text-emerald-900 font-semibold mt-2 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Reward: {kr.rewardOffer}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => showToast(`Issued "${kr.rewardOffer}" & +${kr.pointsAwarded} Pup Points to active guest!`)}
                    className="w-full py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    Grant Award to Guest Dog
                  </button>
                </div>
              ))}
            </div>

            {/* Form to add custom task & reward (Requires Paid PRO or Elite Subscription) */}
            {!hasProKennelAccess ? (
              <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-slate-900">
                      Promotional Tools & Custom Reward Publishing Locked on FREE / STARTER
                    </div>
                    <p className="text-slate-600">
                      Upgrade and pay for PRO (£6.99/mo) or Elite Package (£14.99/mo) to publish custom promotional stay rewards and client offers.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setKennelTab('subscriptions')}
                  className="px-4 py-2 bg-[#0f5132] text-white font-bold rounded-xl shrink-0 cursor-pointer"
                >
                  Upgrade Plan →
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddKennelReward} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Add New Stay Training Milestone & Client Reward</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task completed (e.g. Calm Grooming Session)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    placeholder="Points (e.g. 60)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  <input
                    type="text"
                    required
                    value={newRewardOffer}
                    onChange={(e) => setNewRewardOffer(e.target.value)}
                    placeholder="Reward unlocked (e.g. Free Nail Clip & Treat Bag)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0f5132] text-white text-xs font-bold rounded-xl hover:bg-[#0c3e29]"
                  >
                    + Publish Stay Reward
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Night Routine Log */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Moon className="w-5 h-5 text-amber-500" />
                  <span>Overnight Routine & Canine Sleep Care Log</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Strict UK DEFRA evening inspection routine, heating compliance, and live CCTV night audit.
                </p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                Live Monitoring Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Sleeping Pod Thermostat
                </span>
                <div className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                  <Thermometer className="w-5 h-5 text-amber-600" />
                  <span>{thermostatReading}</span>
                </div>
                <div className="text-[11px] text-slate-500">Underfloor radiant heating sensor</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Evening Paddock Stroll
                </span>
                <div className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Completed at 20:30</span>
                </div>
                <div className="text-[11px] text-slate-500">Full pack sensory decompression</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                  1080p Parent HD Webcams
                </span>
                <div className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                  <Video className="w-5 h-5 text-blue-600" />
                  <span>All {suites.length} Suites Live</span>
                </div>
                <div className="text-[11px] text-slate-500">Infrared night vision enabled</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-xs">Overnight Checklist & Bedtime Routine:</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eveningWalkCompleted}
                    onChange={(e) => setEveningWalkCompleted(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span className="font-medium text-slate-700">
                    Late evening comfort break and bladder relief (21:00)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bedtimeTreatsDelivered}
                    onChange={(e) => setBedtimeTreatsDelivered(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span className="font-medium text-slate-700">
                    Bedtime calming herbal chamomile chew & tuck-in cuddle
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cctvLiveStreamActive}
                    onChange={(e) => setCctvLiveStreamActive(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span className="font-medium text-slate-700">
                    Fresh filtered water bowls checked and quiet classical background audio started
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LICENSING & VET AUDIT */}
      {kennelTab === 'licensing' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Statutory Animal Boarding Establishment Licensing</span>
              </h2>
              <p className="text-slate-500">
                Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018.
              </p>
            </div>
            <span className="font-bold text-slate-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs">
              ⭐ 5 Stars (Higher Standard)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <span className="font-bold text-slate-900 block">Council Inspection Details</span>
              <div className="flex justify-between">
                <span className="text-slate-500">Issuing Council:</span>
                <span className="font-semibold text-slate-800">{host.issuingCouncil}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Licence Number:</span>
                <span className="font-mono font-bold text-emerald-900">{host.councilLicenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expiry Date:</span>
                <span className="font-semibold text-slate-800">{host.licenceExpiryDate}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <span className="font-bold text-slate-900 block">Emergency Veterinary Coverage</span>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Hospital:</span>
                <span className="font-semibold text-slate-800">{host.vetPracticeAssigned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Callout:</span>
                <span className="font-bold text-emerald-800">24/7 Priority RCVS Contract</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Isolation Unit:</span>
                <span className="font-semibold text-slate-800">Dedicated On-Site Warm Pod</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Add Custom Suite with Custom Prices */}
      {showAddSuiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">Add Custom Boarding / Sitting Suite</h3>
              <button
                onClick={() => setShowAddSuiteModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomSuite} className="space-y-3 text-xs">
              {/* Upload Suite Picture */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      newSuitePhotoUrl ||
                      'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=300&q=80'
                    }
                    alt="Suite preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600 bg-white shrink-0"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900">
                      Suite / Sitting Room Picture
                    </div>
                    <p className="text-[10px] text-slate-600">
                      Upload a photo of the suite for dog owners to see.
                    </p>
                  </div>
                </div>
                <label className="px-3 py-1.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                  <Camera className="w-3.5 h-3.5 text-amber-300" />
                  <span>Upload Picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleNewSuitePicUpload}
                  />
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Suite or Dog Sitting Room Name</label>
                <input
                  type="text"
                  required
                  value={newSuiteName}
                  onChange={(e) => setNewSuiteName(e.target.value)}
                  placeholder="e.g. Woodland Meadow Heated Cabin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Accommodation Category</label>
                <select
                  value={newSuiteType}
                  onChange={(e) => setNewSuiteType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Luxury Executive Suite">Luxury Executive Suite</option>
                  <option value="Standard Heated Pod">Standard Heated Pod</option>
                  <option value="Paws Garden Cabin">Paws Garden Cabin</option>
                  <option value="Quiet Puppy Nursery">Quiet Puppy Nursery / Home Sitting</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nightly Price (£)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newSuiteNightlyRate}
                    onChange={(e) => setNewSuiteNightlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Day Sitting (£)</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={newSuiteDayRate}
                    onChange={(e) => setNewSuiteDayRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Dogs</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newSuiteCapacity}
                    onChange={(e) => setNewSuiteCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Suite Description & Care Routine</label>
                <textarea
                  rows={2}
                  value={newSuiteDesc}
                  onChange={(e) => setNewSuiteDesc(e.target.value)}
                  placeholder="Describe bedding, heating, garden access, and sitting care..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSuiteModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f5132] text-white font-bold rounded-xl shadow-xs"
                >
                  Save & Publish Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Paid Subscription Payment Checkout Modal for Kennels & Sitters */}
      {pendingCheckoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                  Subscription Payment Required
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Activate {pendingCheckoutPlan} ({billingCycle === 'annual' ? 'Annual' : 'Monthly'})
                </h3>
                <p className="text-xs text-slate-500">
                  Features for {pendingCheckoutPlan} unlock immediately once payment is confirmed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPendingCheckoutPlan(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Selected Plan:</span>
                <span>{pendingCheckoutPlan}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Billing Cycle:</span>
                <span className="capitalize font-semibold">{billingCycle} (Recurring)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Completed Booking Commission:</span>
                <span className="font-mono font-black text-emerald-800">
                  {pendingCheckoutPlan === 'Elite Package' ? '2.5%' : '5%'}
                </span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-sm font-black text-slate-900">
                <span>Total Due Today:</span>
                <span className="text-lg text-[#0f5132]">
                  £
                  {pendingCheckoutPlan === 'PRO'
                    ? billingCycle === 'annual'
                      ? '69.99'
                      : '6.99'
                    : billingCycle === 'annual'
                    ? '149.99'
                    : '14.99'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              Recurring subscription with a <strong>1-month (30-day) cancellation notice period</strong>. Payment will be charged via your selected provider ({selectedPaymentProvider.replace('_', ' ').toUpperCase()}) and credited to the platform treasury.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingCheckoutPlan(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingKennelPayment}
                onClick={() => {
                  setIsProcessingKennelPayment(true);
                  setTimeout(() => {
                    setIsProcessingKennelPayment(false);
                    updateKennelSubscription(
                      host.id,
                      pendingCheckoutPlan,
                      billingCycle,
                      selectedPaymentProvider
                    );
                    setKennelCancelPending(false);
                    setKennelCancelEffectiveDate('');
                    setPendingCheckoutPlan(null);
                  }, 600);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-black text-xs shadow-md cursor-pointer"
              >
                {isProcessingKennelPayment
                  ? 'Processing Payment...'
                  : `Confirm & Pay £${
                      pendingCheckoutPlan === 'PRO'
                        ? billingCycle === 'annual'
                          ? '69.99'
                          : '6.99'
                        : billingCycle === 'annual'
                        ? '149.99'
                        : '14.99'
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dog Care Profile Modal when Kennel / Dog Sitter Clicks any Booked Dog */}
      <WalkerDogProfileModal
        dogNameOrId={inspectingDogName}
        onClose={() => setInspectingDogName(null)}
      />
    </div>
  );
};
