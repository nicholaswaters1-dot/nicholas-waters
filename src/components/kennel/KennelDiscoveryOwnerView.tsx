import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { KennelHost, KennelSuite } from '../../types';
import {
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  X,
  Phone,
  Video,
  Thermometer,
  Moon,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';
import { StarRatingReviewsSection } from '../common/StarRatingReviewsSection';

export const KennelDiscoveryOwnerView: React.FC = () => {
  const {
    kennels,
    selectedKennel,
    setSelectedKennel,
    selectedKennelSuite,
    createKennelBooking,
    activeHouseholdMember,
    dogs,
    showToast,
  } = useMarketplace();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeHost, setActiveHost] = useState<KennelHost>(selectedKennel || kennels[0]);
  const [activeSuite, setActiveSuite] = useState<KennelSuite>(activeHost.suites[0]);

  // Booking Form State
  const [selectedDogNames, setSelectedDogNames] = useState<string[]>([dogs[0]?.name || 'Buster']);
  const [checkIn, setCheckIn] = useState('Friday, 16 Oct 2026 (14:00)');
  const [checkOut, setCheckOut] = useState('Sunday, 18 Oct 2026 (11:00)');
  const [nights, setNights] = useState(2);
  const [feedingNotes, setFeedingNotes] = useState('Hypoallergenic kibble 200g morning & night. Clean bowl after meal.');
  const [medNotes, setMedNotes] = useState('1 joint chew with breakfast.');
  const [vetAuth, setVetAuth] = useState(true);

  const toggleDogSelect = (dogName: string) => {
    setSelectedDogNames((prev) =>
      prev.includes(dogName)
        ? prev.length > 1
          ? prev.filter((n) => n !== dogName)
          : prev
        : [...prev, dogName]
    );
  };

  const handleBookStay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vetAuth) {
      showToast('Please authorize emergency veterinary protocol for your dog', 'warning');
      return;
    }

    const calculatedPrice = activeSuite.nightlyRate * nights * (selectedDogNames.length > 1 ? 1.5 : 1);

    createKennelBooking({
      kennelId: activeHost.id,
      kennelName: activeHost.businessName,
      suiteName: activeSuite.name,
      ownerName: activeHouseholdMember.name,
      ownerPhone: activeHouseholdMember.phone,
      dogNames: selectedDogNames,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights: nights,
      totalPrice: calculatedPrice,
      feedingSchedule: feedingNotes,
      medicationNotes: medNotes,
      emergencyVetAuthorised: vetAuth,
    });

    setBookingModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0f5132] to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>DEFRA 5-Star Licensed Dog Kennels & Overnight Retreats</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dog Kennels & Overnight Boarding
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Going on holiday or business travel? Browse vetted luxury boarding suites, heated pods, and countryside retreats with 24/7 on-site care, live webcams, and full escrow protection.
          </p>
        </div>
      </div>

      <SponsoredAdBanner category="Dog Grooming Spa" />

      {/* Kennels Grid (Sorted by Elite Featured Listing -> PRO Priority Placement -> Starter) */}
      <div className="space-y-8">
        {[...kennels]
          .sort((a, b) => {
            const rank = (k: KennelHost) => {
              if (k.subscriptionPaid === false) return 0;
              if (k.subscriptionPlan === 'Elite Package') return 3;
              if (k.subscriptionPlan === 'PRO') return 2;
              return 1;
            };
            return rank(b) - rank(a);
          })
          .map((kennel) => (
          <div
            key={kennel.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-6 p-6 sm:p-7"
          >
            {/* Host Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <img
                  src={kennel.avatar}
                  alt={kennel.businessName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{kennel.businessName}</h2>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      ⭐ {kennel.councilLicenceRating}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                      📍 Postcode: {kennel.postcode || kennel.postcodeArea}
                    </span>
                    {kennel.subscriptionPlan === 'Elite Package' && kennel.subscriptionPaid !== false ? (
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured Listing · Elite Package</span>
                      </span>
                    ) : kennel.subscriptionPlan === 'PRO' && kennel.subscriptionPaid !== false ? (
                      <span className="text-[10px] bg-emerald-900 text-emerald-100 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        PRO Verified · Priority Search Placement
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full">
                        Starter Host (Max 5 Bookings/Week)
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 max-w-2xl">{kennel.bio}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      {kennel.location} · Postcode: <strong>{kennel.postcode || kennel.postcodeArea}</strong> ({kennel.distanceMiles} miles away)
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-emerald-900 font-bold">
                      Licence: {kennel.councilLicenceNumber}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 font-extrabold text-slate-950 shadow-2xs">
                      <span className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= Math.round(kennel.rating)
                                ? 'text-amber-500 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </span>
                      <span className="tabular-nums">{kennel.rating.toFixed(2)} / 5.0</span>
                      <span className="text-amber-900 font-semibold">
                        ({kennel.reviewCount} verified reviews)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Host Badges */}
              <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 text-xs">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 font-semibold rounded-xl border border-emerald-200">
                  <Thermometer className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Thermostatic Heated Suites</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-900 font-semibold rounded-xl border border-blue-200">
                  <Video className="w-3.5 h-3.5 text-blue-700" />
                  <span>1080p Parent HD Webcams</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>24/7 Vet Hospital on Call</span>
                </span>
              </div>
            </div>

            {/* Kennel & Sitting Dashboard Pictures Showcase */}
            {(kennel.dashboardPhotoUrl || (kennel.dashboardPhotos && kennel.dashboardPhotos.length > 0)) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Kennel & Sitting Facility Dashboard Photos:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {(kennel.dashboardPhotos || [kennel.dashboardPhotoUrl]).filter(Boolean).length} Facility Photo(s)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(kennel.dashboardPhotos && kennel.dashboardPhotos.length > 0
                    ? kennel.dashboardPhotos
                    : [kennel.dashboardPhotoUrl!]
                  )
                    .filter(Boolean)
                    .map((pic, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={pic}
                          alt={`${kennel.businessName} Dashboard ${pIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {pIdx === 0 && (
                          <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            Main Dashboard Photo
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Interactive Kennel & Sitter Availability Calendar for Dog Owners */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>October 2026 — Live Kennel & Sitter Availability Calendar</span>
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Click any available date below to book an overnight boarding suite or day-sitting session with {kennel.businessName}.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Suites Available
                  </span>
                  <span className="flex items-center gap-1 text-amber-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Limited (1 Suite)
                  </span>
                  <span className="flex items-center gap-1 text-rose-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Fully Booked
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

              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {[0, 1, 2].map((b) => (
                  <div key={`kblank_${b}`} className="h-10 rounded-xl bg-white/50" />
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isFull = day === 26 || day === 27;
                  const isLimited = day === 16 || day === 17 || day === 18 || day === 24;
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isFull}
                      onClick={() => {
                        setActiveHost(kennel);
                        setActiveSuite(kennel.suites[0]);
                        setCheckIn(`${day} Oct 2026 (14:00)`);
                        setCheckOut(`${Math.min(day + 2, 31)} Oct 2026 (11:00)`);
                        setNights(2);
                        setBookingModalOpen(true);
                      }}
                      className={`h-10 rounded-xl border text-[10px] font-bold flex flex-col items-center justify-center transition-all ${
                        isFull
                          ? 'bg-rose-50/70 border-rose-200 text-rose-400 cursor-not-allowed line-through'
                          : isLimited
                          ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100 cursor-pointer'
                          : 'bg-white border-emerald-200 text-slate-900 hover:bg-[#0f5132] hover:text-white cursor-pointer shadow-2xs'
                      }`}
                    >
                      <span>{day} Oct</span>
                      <span className="text-[8px] font-semibold opacity-80">
                        {isFull ? 'Full' : isLimited ? '1 Suite' : 'Open'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suites Cards Grid */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Available Overnight Suites & Lodges:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {kennel.suites.map((suite) => (
                  <div
                    key={suite.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative h-32 rounded-xl overflow-hidden">
                        <img
                          src={suite.photoUrl}
                          alt={suite.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/95 px-2.5 py-0.5 rounded-full text-xs font-black text-slate-900 shadow-2xs">
                          £{suite.nightlyRate}/night
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs">{suite.name}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{suite.description}</p>

                      <div className="space-y-1 text-[11px] text-slate-700 pt-1">
                        {suite.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="text-emerald-700">✓</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveHost(kennel);
                        setActiveSuite(suite);
                        setBookingModalOpen(true);
                      }}
                      className="w-full py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Book Overnight Stay
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Star-Based Service Reviews & Aggregated Score Section for Kennel & Sitter */}
            <StarRatingReviewsSection
              targetId={kennel.id}
              targetType="kennel"
              targetName={kennel.businessName}
              baseRating={kennel.rating}
              baseReviewCount={kennel.reviewCount}
              compact={false}
            />
          </div>
        ))}
      </div>

      {/* Booking Overnight Stay Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-[#0f5132] to-[#0c3e29] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base text-white">Book Overnight Boarding Stay</h3>
                <p className="text-xs text-emerald-200">
                  {activeHost.businessName} · {activeSuite.name}
                </p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookStay} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Dogs Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Select Dogs for Stay (+50% discount for 2nd dog sharing suite):
                </label>
                <div className="flex flex-wrap gap-2">
                  {dogs.map((dog) => {
                    const isSelected = selectedDogNames.includes(dog.name);
                    return (
                      <button
                        type="button"
                        key={dog.id}
                        onClick={() => toggleDogSelect(dog.name)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>🐾</span>
                        <span>{dog.name}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates & Nights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Check-In Date *</label>
                  <input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Check-Out Date *</label>
                  <input
                    type="text"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nights</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Feeding & Medication */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Feeding Routine & Dietary Instructions
                </label>
                <input
                  type="text"
                  value={feedingNotes}
                  onChange={(e) => setFeedingNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Medication / Night Routine Special Instructions
                </label>
                <input
                  type="text"
                  value={medNotes}
                  onChange={(e) => setMedNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Vet Authorization & Non-Liability Checkbox */}
              <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vetAuth}
                  onChange={(e) => setVetAuth(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 h-4 w-4"
                />
                <span className="text-[11px] text-slate-700 leading-relaxed">
                  I authorize emergency veterinary care if required during my dog’s stay and acknowledge that <strong>{activeHost.businessName}</strong> is an independent provider and <strong>My Paws Walks accepts no platform responsibility, liability, or claims</strong>.
                </span>
              </label>

              {/* Trusted Payment Providers */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Select Instant Escrow Payment Method:</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    🔒 256-Bit Encrypted Escrow
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[11px] font-extrabold">
                  <div className="p-2 rounded-xl border border-slate-900 bg-slate-900 text-white text-center">
                     Pay
                  </div>
                  <div className="p-2 rounded-xl border border-blue-600 bg-blue-600 text-white text-center">
                    G Pay
                  </div>
                  <div className="p-2 rounded-xl border border-[#003087] bg-[#003087] text-white text-center italic">
                    PayPal
                  </div>
                  <div className="p-2 rounded-xl border border-emerald-700 bg-emerald-50 text-emerald-950 text-center">
                    Card
                  </div>
                  <div className="p-2 rounded-xl border border-pink-500 bg-pink-50 text-pink-900 text-center">
                    Klarna.
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Total Overnight Stay Escrow:</span>
                  <span className="text-[11px] text-emerald-800">
                    {nights} nights · {selectedDogNames.length} dog(s) · {activeSuite.name}
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  £{(activeSuite.nightlyRate * nights * (selectedDogNames.length > 1 ? 1.5 : 1)).toFixed(2)}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Authorize & Pay into Escrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
