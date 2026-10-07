import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Booking } from '../../types';
import {
  X,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Plus,
  PawPrint,
  MapPin,
  KeyRound,
  DoorOpen,
} from 'lucide-react';

export const BookingCheckoutModal: React.FC = () => {
  const {
    bookingModalOpen,
    closeBookingModal,
    selectedWalker,
    dogs,
    activeDogId,
    createBooking,
    subscribeToWalk,
    showToast,
  } = useMarketplace();

  // Booking mode: One-off walk vs Recurring Walk Subscription
  const [bookingMode, setBookingMode] = useState<'one_off' | 'subscription'>('one_off');

  // Selected dogs (multi-dog support!)
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([activeDogId]);

  const [serviceType, setServiceType] = useState<'Group Walk' | 'Solo Sniffari' | 'Puppy Drop-in' | 'Senior Stroll'>('Group Walk');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 02 Oct 2026');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([
    'Warm Towel Dry & Paw Balm',
    'Grain-Free Post-Walk Treat',
  ]);
  const [specialNotes, setSpecialNotes] = useState(
    'Please use high-vis harnesses. Towels are in the front hallway.'
  );
  const [homeAddress, setHomeAddress] = useState(
    '18 Downshire Hill, Hampstead, London NW3 1NR'
  );
  const [pickupAccessArrangement, setPickupAccessArrangement] = useState(
    'Key Safe by front porch (Code: #4829). Harness & high-vis lead on hallway peg.'
  );
  const [dropoffAccessArrangement, setDropoffAccessArrangement] = useState(
    'Towel dry paws in porch, refill kitchen water bowl, double-lock front Chubb latch.'
  );

  // Subscription specific options
  const [subWalksPerWeek, setSubWalksPerWeek] = useState<number>(3);
  const [subDays, setSubDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);

  // Custom Walk Duration (Minutes)
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(60);

  // Trusted Payment Providers
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'klarna'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingModalOpen || !selectedWalker) return null;

  const toggleDogSelection = (id: string) => {
    if (selectedDogIds.includes(id)) {
      if (selectedDogIds.length === 1) {
        showToast('At least one dog must be selected for this walk.', 'warning');
        return;
      }
      setSelectedDogIds(selectedDogIds.filter((dId) => dId !== id));
    } else {
      setSelectedDogIds([...selectedDogIds, id]);
    }
  };

  const selectedDogs = dogs.filter((d) => selectedDogIds.includes(d.id));

  // Dynamic pricing calculation based on selected duration in minutes
  const getRateForDuration = (mins: number) => {
    if (mins === 30) return selectedWalker.halfHourRate;
    if (mins === 60) return selectedWalker.hourlyRate;
    if (mins === 15) return Math.round(selectedWalker.halfHourRate * 0.75);
    if (mins === 20) return Math.round(selectedWalker.halfHourRate * 0.85);
    if (mins === 45) return Math.round(selectedWalker.hourlyRate * 0.8);
    if (mins === 90) return Math.round(selectedWalker.hourlyRate * 1.45);
    if (mins === 120) return Math.round(selectedWalker.hourlyRate * 1.85);
    return Math.round((selectedWalker.hourlyRate / 60) * mins);
  };

  const singleDogBasePrice =
    getRateForDuration(selectedDurationMinutes) +
    (serviceType === 'Solo Sniffari' ? 4 : 0);

  // Multi-dog discount: 1st dog full price, additional dogs get 50% discount
  const additionalDogsCount = Math.max(0, selectedDogIds.length - 1);
  const multiDogBasePrice =
    singleDogBasePrice + additionalDogsCount * (singleDogBasePrice * 0.5);

  const availableAddOns = [
    { id: 'towel', name: 'Warm Towel Dry & Paw Balm', price: 3.5 },
    { id: 'treat', name: 'Grain-Free Post-Walk Treat', price: 2.0 },
    { id: 'video', name: 'Live HD Video Clip & Photo Drop', price: 4.0 },
    { id: 'meds', name: 'Administer Oral Supplements/Meds', price: 2.5 },
  ];

  const addOnTotal = availableAddOns
    .filter((a) => selectedAddOns.includes(a.name))
    .reduce((sum, a) => sum + a.price * selectedDogIds.length, 0);

  const subtotal = multiDogBasePrice + addOnTotal;
  const platformFee = +(subtotal * 0.08).toFixed(2);
  const grandTotal = +(subtotal + platformFee).toFixed(2);

  // Subscription calculation (10% discount on recurring weekly walks)
  const weeklyBase = singleDogBasePrice * subWalksPerWeek * (additionalDogsCount > 0 ? 1.5 : 1);
  const weeklySubscriptionTotal = +(weeklyBase * 0.9).toFixed(2);

  const toggleAddOn = (name: string) => {
    if (selectedAddOns.includes(name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a !== name));
    } else {
      setSelectedAddOns([...selectedAddOns, name]);
    }
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      if (bookingMode === 'subscription') {
        subscribeToWalk({
          walkerId: selectedWalker.id,
          walkerName: selectedWalker.name,
          walkerAvatar: selectedWalker.avatar,
          packageName: `${subWalksPerWeek}-Day Weekly Pack Subscription`,
          walksPerWeek: subWalksPerWeek,
          weeklyPrice: weeklySubscriptionTotal,
          dogIds: selectedDogIds,
          dogNames: selectedDogs.map((d) => d.name),
          preferredDays: subDays,
          pickupTimeWindow: timeSlot,
          billingCadence: 'Weekly',
        });
        closeBookingModal();
      } else {
        createBooking({
          walkerId: selectedWalker.id,
          walkerName: selectedWalker.name,
          walkerAvatar: selectedWalker.avatar,
          dogIds: selectedDogIds,
          dogNames: selectedDogs.map((d) => d.name),
          serviceType,
          date: selectedDate,
          timeSlot,
          durationMinutes: selectedDurationMinutes,
          paymentProvider: paymentMethod,
          basePrice: multiDogBasePrice,
          addOns: availableAddOns.filter((a) => selectedAddOns.includes(a.name)),
          platformFee,
          totalAmount: grandTotal,
          homeAddress: homeAddress.trim() || '18 Downshire Hill, Hampstead, London NW3 1NR',
          pickupAccessArrangement:
            pickupAccessArrangement.trim() || 'Key Safe by front porch (Code: #4829).',
          dropoffAccessArrangement:
            dropoffAccessArrangement.trim() || 'Towel dry paws and lock front door.',
          notes: specialNotes,
          gpsTracked: true,
        });
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900">Book or Subscribe with {selectedWalker.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Enhanced DBS Verified
              </span>
              <span aria-hidden="true">·</span>
              <span>{selectedWalker.location} ({selectedWalker.postcodeArea})</span>
            </div>
          </div>
          <button
            onClick={closeBookingModal}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Booking Option Mode: Single Walk vs Walk Subscription (Recurring Bookings require Walker PRO/Elite) */}
          <div className="p-1 bg-slate-100 rounded-xl grid grid-cols-2 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setBookingMode('one_off')}
              className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                bookingMode === 'one_off'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              One-Off Walk Appointment
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  selectedWalker.subscriptionPlan === 'FREE / STARTER' ||
                  selectedWalker.subscriptionPaid === false
                ) {
                  showToast(
                    `${selectedWalker.name} is on the FREE / STARTER plan (One-off walks only, max 5/week). Recurring bookings require a PRO or Elite walker plan.`,
                    'warning'
                  );
                  return;
                }
                setBookingMode('subscription');
              }}
              className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                bookingMode === 'subscription'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : selectedWalker.subscriptionPlan === 'FREE / STARTER' ||
                    selectedWalker.subscriptionPaid === false
                  ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {selectedWalker.subscriptionPlan === 'FREE / STARTER' ||
              selectedWalker.subscriptionPaid === false ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recurring Locked (Starter Walker)</span>
                </>
              ) : (
                <>
                  <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Subscribe & Save (10% Off)</span>
                </>
              )}
            </button>
          </div>

          {/* Multi-Dog Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Select Dog(s) for this walk
              </label>
              {selectedDogIds.length > 1 && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  🎉 Multi-Dog 50% discount on 2nd dog applied!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {dogs.map((d) => {
                const isChecked = selectedDogIds.includes(d.id);
                return (
                  <div
                    key={d.id}
                    onClick={() => toggleDogSelection(d.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 pointer-events-none"
                    />
                    <img
                      src={d.photoUrl}
                      alt={d.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{d.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{d.breed.split(' ')[0]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscription Specific Configuration */}
          {bookingMode === 'subscription' ? (
            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <Repeat className="w-4 h-4 text-emerald-700" />
                <span>Weekly Recurring Walk Subscription Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Walks per Week (Mon–Sun)</label>
                  <select
                    value={subWalksPerWeek}
                    onChange={(e) => setSubWalksPerWeek(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    <option value={2}>2 walks / week (10% discount)</option>
                    <option value={3}>3 walks / week (10% discount)</option>
                    <option value={4}>4 walks / week (12% discount)</option>
                    <option value={5}>5 walks / week (15% discount)</option>
                    <option value={6}>6 walks / week incl. Weekend (15% discount)</option>
                    <option value={7}>7 walks / week Full Mon–Sun (18% discount)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pickup Time Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    <option value="9:30 AM - 10:30 AM">Morning: 9:30 AM - 10:30 AM</option>
                    <option value="11:00 AM - 12:00 PM">Midday Adventure: 11:00 AM - 12:00 PM</option>
                    <option value="2:00 PM - 3:00 PM">Afternoon: 2:00 PM - 3:00 PM</option>
                    <option value="10:00 AM - 11:30 AM (Weekend Pack)">Weekend Morning: 10:00 AM - 11:30 AM</option>
                    <option value="1:00 PM - 2:30 PM (Weekend Stroll)">Weekend Afternoon: 1:00 PM - 2:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-700">
                    Scheduled Recurring Days (Weekdays & Weekends Available)
                  </label>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    ✓ Saturday & Sunday Weekend Walks Supported
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const active = subDays.includes(day);
                    const isWeekend = day === 'Saturday' || day === 'Sunday';
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (active) {
                            if (subDays.length > 1) setSubDays(subDays.filter((d) => d !== day));
                          } else {
                            setSubDays([...subDays, day]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                          active
                            ? 'bg-[#0f5132] text-white'
                            : isWeekend
                              ? 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100'
                              : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span>{day}</span>
                        {isWeekend && (
                          <span className={`text-[9px] font-extrabold uppercase ${active ? 'text-amber-300' : 'text-amber-700'}`}>
                            Wknd
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Weekly Subscription Rate:</span>
                <span className="font-mono text-emerald-800 text-base tabular-nums">
                  £{weeklySubscriptionTotal.toFixed(2)} / week
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white/90 border border-emerald-200 text-[11px] text-emerald-950">
                <strong>Recurring Subscription Terms:</strong> Auto-renews weekly. You may cancel anytime in your Bookings & Subscriptions tab with a <strong>1-month (30-day) cancellation notice period</strong>. Dog owners pay £0 platform subscription fees.
              </div>
            </div>
          ) : (
            <>
              {/* One-off Service Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Service Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      type: 'Group Walk' as const,
                      title: 'Group Pack Walk (60 mins)',
                      desc: 'Social adventure with max 4 dogs · See who is attending below.',
                      price: singleDogBasePrice,
                    },
                    {
                      type: 'Solo Sniffari' as const,
                      title: 'Solo Sniffari (60 mins)',
                      desc: '1-on-1 sensory exploration.',
                      price: singleDogBasePrice + 4,
                    },
                    {
                      type: 'Puppy Drop-in' as const,
                      title: 'Puppy Drop-in & Feed (30 mins)',
                      desc: 'Garden pee break & playtime.',
                      price: selectedWalker.halfHourRate,
                    },
                    {
                      type: 'Senior Stroll' as const,
                      title: 'Senior Gentle Stroll (45 mins)',
                      desc: 'Low-impact flat terrain walking.',
                      price: selectedWalker.hourlyRate - 2,
                    },
                  ].map((svc) => (
                    <button
                      key={svc.type}
                      type="button"
                      onClick={() => setServiceType(svc.type)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        serviceType === svc.type
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{svc.title}</span>
                        <span className="text-xs font-bold text-slate-900 tabular-nums font-mono">£{svc.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{svc.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Walk Attending Dogs Roster (Shown when Group Walk is selected) */}
              {serviceType === 'Group Walk' && (
                <div className="p-4 rounded-2xl bg-emerald-50/75 border border-emerald-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-extrabold text-slate-900">
                        Who Is Attending This Group Walk ({selectedDate} · {timeSlot})
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {Math.min(4, 2 + selectedDogs.length)} / 4 Pack Spots Filled
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    All dogs attending {selectedWalker.name.split(' ')[0]}’s group walk are temperament-matched, vaccinated, and friendly:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Selected user dogs attending */}
                    {selectedDogs.map((userDog) => (
                      <div
                        key={`attending_${userDog.id}`}
                        className="p-2.5 rounded-xl bg-white border border-emerald-300 flex items-center gap-2.5 shadow-2xs"
                      >
                        <img
                          src={userDog.photoUrl}
                          alt={userDog.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-emerald-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-extrabold text-slate-900 truncate">
                              {userDog.name} (Your Dog)
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Joining
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {userDog.breed} · {userDog.temperament?.[0] || 'Friendly'}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Confirmed Pack Mates Attending */}
                    {[
                      {
                        id: 'pack_mate_1',
                        name: 'Barnaby',
                        owner: 'Sarah M. (NW3)',
                        breed: 'Golden Retriever (3 yrs)',
                        trait: 'Gentle & Social',
                        avatar:
                          'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80',
                      },
                      {
                        id: 'pack_mate_2',
                        name: 'Poppy',
                        owner: 'James T. (NW3)',
                        breed: 'Cockapoo (2 yrs)',
                        trait: 'Playful Recall Star',
                        avatar:
                          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80',
                      },
                    ].map((mate) => (
                      <div
                        key={mate.id}
                        className="p-2.5 rounded-xl bg-white/90 border border-slate-200 flex items-center gap-2.5"
                      >
                        <img
                          src={mate.avatar}
                          alt={mate.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {mate.name}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-800">
                              ✓ Attending
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {mate.breed} · Owner: {mate.owner}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium truncate">
                            Temperament: {mate.trait}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Walk Duration / Minutes Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Select Walk Duration (Minutes)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    {selectedDurationMinutes} Mins Selected · £{getRateForDuration(selectedDurationMinutes)} base
                  </span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[15, 20, 30, 45, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSelectedDurationMinutes(mins)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        selectedDurationMinutes === mins
                          ? 'bg-[#0f5132] text-white border-[#0f5132] shadow-xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="text-xs font-bold">{mins}m</div>
                      <div className={`text-[10px] font-mono ${selectedDurationMinutes === mins ? 'text-emerald-200' : 'text-slate-500'}`}>
                        £{getRateForDuration(mins)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Walker Availability Calendar & Weekend Operation Selection */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedWalker.name}’s 7-Day Availability (Weekdays & Weekends Open)</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Selected: {selectedDate}
                  </span>
                </div>

                {/* Quick Day Type Filter / Weekend Shortcuts */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 mr-1">Quick Select:</span>
                  {[
                    { label: 'Tomorrow (Fri 02 Oct)', value: 'Tomorrow, 02 Oct 2026', isWeekend: false },
                    { label: 'This Saturday (03 Oct · Weekend)', value: 'Sat, 03 Oct 2026 (Weekend)', isWeekend: true },
                    { label: 'This Sunday (04 Oct · Weekend)', value: 'Sun, 04 Oct 2026 (Weekend)', isWeekend: true },
                    { label: 'Next Saturday (10 Oct · Weekend)', value: 'Sat, 10 Oct 2026 (Weekend)', isWeekend: true },
                    { label: 'Next Sunday (11 Oct · Weekend)', value: 'Sun, 11 Oct 2026 (Weekend)', isWeekend: true },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSelectedDate(preset.value)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        selectedDate === preset.value
                          ? 'bg-[#0f5132] text-white border-[#0f5132]'
                          : preset.isWeekend
                            ? 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400 uppercase">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div className="text-amber-700">Sat (Wknd)</div>
                  <div className="text-amber-700">Sun (Wknd)</div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {[0, 1, 2].map((b) => (
                    <div key={`chk_blank_${b}`} className="h-9 rounded-lg bg-slate-100/60" />
                  ))}
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => {
                    // Oct 1, 2026 is Thursday (col 4). So day 3 & 4 (Sat/Sun) and day 10 & 11 (Sat/Sun) are weekends!
                    const isSat = day === 3 || day === 10;
                    const isSun = day === 4 || day === 11;
                    const isWeekendDay = isSat || isSun;
                    const dateLabel =
                      day === 1
                        ? 'Today, 01 Oct 2026'
                        : day === 2
                          ? 'Tomorrow, 02 Oct 2026'
                          : isSat
                            ? `Sat, ${day.toString().padStart(2, '0')} Oct 2026 (Weekend)`
                            : isSun
                              ? `Sun, ${day.toString().padStart(2, '0')} Oct 2026 (Weekend)`
                              : `${day.toString().padStart(2, '0')} Oct 2026`;
                    const isSelected = selectedDate === dateLabel;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDate(dateLabel)}
                        className={`h-9 rounded-lg border text-[10px] font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f5132] text-white border-[#0f5132] shadow-2xs'
                            : isWeekendDay
                              ? 'bg-amber-50/90 border-amber-300 text-amber-950 hover:border-amber-500'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-400'
                        }`}
                      >
                        <span>{day} Oct</span>
                        {isWeekendDay && (
                          <span className={`text-[8px] font-extrabold uppercase leading-none ${isSelected ? 'text-amber-300' : 'text-amber-700'}`}>
                            Wknd
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Appointment Date (Weekdays & Weekends)
                    </label>
                    <input
                      type="text"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Available Pickup Window (Mon–Sun)
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                    >
                      <option value="8:30 AM - 9:30 AM (Weekend Early Bird)">8:30 AM - 9:30 AM (Early Bird / Weekend)</option>
                      <option value="9:30 AM - 10:30 AM">Morning Early: 9:30 AM - 10:30 AM</option>
                      <option value="11:00 AM - 12:00 PM">Midday Adventure: 11:00 AM - 12:00 PM</option>
                      <option value="1:30 PM - 2:30 PM">Early Afternoon: 1:30 PM - 2:30 PM</option>
                      <option value="3:30 PM - 4:30 PM">Late Afternoon: 3:30 PM - 4:30 PM</option>
                      <option value="5:00 PM - 6:00 PM (Weekend Sunset Walk)">5:00 PM - 6:00 PM (Weekend Sunset Walk)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Add-on Care Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Tailored Post-Walk Care Add-ons
                </label>
                <div className="space-y-2">
                  {availableAddOns.map((addon) => {
                    const active = selectedAddOns.includes(addon.name);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.name)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          active ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 pointer-events-none"
                          />
                          <span className="text-xs text-slate-800 font-medium">{addon.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 tabular-nums">+£{addon.price.toFixed(2)}/dog</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Home Address & Pick-Up / Drop-Off Access Arrangements for Walker */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Collection Address & Pick-Up / Drop-Off Access Arrangements</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Shared Securely with {selectedWalker.name}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dog Collection & Drop-Off Home Address *</span>
              </label>
              <input
                type="text"
                required
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                placeholder="e.g. 18 Downshire Hill, Hampstead, London NW3 1NR"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pick-Up Access Arrangement *</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={pickupAccessArrangement}
                  onChange={(e) => setPickupAccessArrangement(e.target.value)}
                  placeholder="e.g. Key Safe code, concierge, side gate keypad, or owner home..."
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <DoorOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Drop-Off Access Arrangement *</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={dropoffAccessArrangement}
                  onChange={(e) => setDropoffAccessArrangement(e.target.value)}
                  placeholder="e.g. Towel dry paws, leave in kitchen, double-lock front door..."
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Additional Care & Behavioral Instructions for Walker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Behavioral or Routine Notes for {selectedWalker.name}
            </label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g. harness location, recall treats, post-walk routine..."
            />
          </div>

          {/* Pricing Breakdown */}
          {bookingMode === 'one_off' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>
                  {serviceType} · {selectedDurationMinutes} mins ({selectedDogIds.length} {selectedDogIds.length === 1 ? 'dog' : 'dogs'})
                </span>
                <span className="tabular-nums font-mono">£{multiDogBasePrice.toFixed(2)}</span>
              </div>
              {addOnTotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Care Add-ons</span>
                  <span className="tabular-nums font-mono">+£{addOnTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>Escrow Processing Fee (Dog Owner Subscription: £0 FREE)</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </span>
                <span className="tabular-nums font-mono">+£{platformFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Due</span>
                <span className="tabular-nums font-mono text-emerald-800 text-base">£{grandTotal.toFixed(2)}</span>
              </div>

              <div className="pt-2 flex items-start gap-2 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Escrow & Independent Provider Notice:</strong> Funds are held in escrow and released when you confirm walk completion. {selectedWalker.name} is an independent professional; My Paws Walks accepts no liability or claims.
                </span>
              </div>
            </div>
          )}

          {/* Trusted Payment Providers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">Select Trusted Payment Provider</label>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                🔒 256-Bit Encrypted Escrow
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black"> Pay</span>
                <span className="text-[9px] opacity-75 font-normal">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('google_pay')}
                className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                  paymentMethod === 'google_pay'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black">G Pay</span>
                <span className="text-[9px] opacity-75 font-normal">Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-[#003087] bg-[#003087] text-white shadow-xs'
                    : 'border-slate-200 bg-[#ffc439]/20 text-[#003087] hover:bg-[#ffc439]/30'
                }`}
              >
                <span className="text-sm font-black italic">PayPal</span>
                <span className="text-[9px] opacity-80 font-normal">Buyer Protected</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-800 bg-[#0f5132] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </div>
                <span className="text-[9px] opacity-75 font-normal">Visa / Amex</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('klarna')}
                className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all col-span-2 sm:col-span-1 ${
                  paymentMethod === 'klarna'
                    ? 'border-pink-600 bg-pink-600 text-white shadow-xs'
                    : 'border-pink-200 bg-pink-50/50 text-pink-900 hover:bg-pink-100/60'
                }`}
              >
                <span className="text-sm font-black">Klarna.</span>
                <span className="text-[9px] opacity-80 font-normal">Pay in 3 (0% APR)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {bookingMode === 'subscription'
              ? 'Recurring subscription · 1-month cancellation notice period'
              : 'Free cancellation up to 24h before walk'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={closeBookingModal}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] active:bg-emerald-950 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : bookingMode === 'subscription' ? (
                <>
                  <Repeat className="w-4 h-4 text-emerald-400" />
                  <span>Confirm Subscription (£{weeklySubscriptionTotal.toFixed(2)}/wk)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize £{grandTotal.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
