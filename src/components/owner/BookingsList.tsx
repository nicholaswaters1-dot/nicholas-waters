import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';
import {
  CalendarCheck,
  Clock,
  ShieldCheck,
  Radio,
  Repeat,
  Pause,
  Play,
  XCircle,
  Plus,
  PawPrint,
  Calendar as CalendarIcon,
  List,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Share2,
  KeyRound,
  DoorOpen,
  Lock,
  Star,
  X,
} from 'lucide-react';

export const BookingsList: React.FC = () => {
  const {
    bookings,
    ownerSubscriptions,
    cancelSubscription,
    openBookingModal,
    setOwnerTab,
    showToast,
    nativeShare,
    confirmAndReleaseEscrowPayment,
    addServiceReview,
    walkers,
    activeHouseholdMember,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'appointments' | 'calendar' | 'subscriptions'>('appointments');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(1); // 1st October

  // Star Rating Modal State for Completed / Active Bookings
  const [reviewingBooking, setReviewingBooking] = useState<{
    id: string;
    walkerName: string;
    serviceType: string;
    dogNames: string[];
  } | null>(null);
  const [reviewStars, setReviewStars] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // October 2026 calendar days
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlankDays = 3; // Starts on Thursday

  const getBookingsForDate = (day: number) => {
    if (day === 1) {
      return bookings.filter((b) => b.status === 'In Progress' || b.status === 'Upcoming');
    }
    if (day === 2) {
      return [
        {
          id: 'MPW-SUB-8812',
          walkerName: 'Sarah Jenkins',
          dogNames: ['Buster', 'Luna'],
          serviceType: 'Group Walk',
          date: 'Tomorrow, 02 Oct 2026',
          timeSlot: '10:30 AM - 11:45 AM',
          status: 'Upcoming' as const,
          totalAmount: 26.0,
        },
      ];
    }
    if (day === 5 || day === 7 || day === 9) {
      return [
        {
          id: `MPW-SUB-902${day}`,
          walkerName: 'Sarah Jenkins',
          dogNames: ['Buster'],
          serviceType: 'Group Walk',
          date: `${day} Oct 2026`,
          timeSlot: '10:30 AM - 11:45 AM',
          status: 'Upcoming' as const,
          totalAmount: 18.0,
        },
      ];
    }
    return [];
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Bookings, Schedule & Subscriptions</h2>
          <p className="text-xs text-slate-500">
            All appointments are escrow-protected. Walkers, kennels & sitters are independent professionals; My Paws Walks accepts no platform liability or claims.
          </p>
        </div>

        <button
          onClick={() => openBookingModal()}
          className="px-4 py-2 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book or Subscribe to a Walk</span>
        </button>
      </div>

      {/* Sponsored Partner Banner */}
      <SponsoredAdBanner category="Grooming & Spa" />

      {/* Segmented Filter: Appointments vs Calendar vs Recurring Subscriptions */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl w-full sm:w-fit max-w-full text-xs font-semibold">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <List className="w-3.5 h-3.5 shrink-0" />
          <span>Appointments List ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'calendar' ? 'bg-[#0f5132] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
          <span>Calendar Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'subscriptions' ? 'bg-[#0f5132] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Repeat className="w-3.5 h-3.5 shrink-0" />
          <span>Recurring Subscriptions ({ownerSubscriptions.length})</span>
        </button>
      </div>

      {/* View 1: Calendar Schedule */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Month Grid (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">October 2026</h3>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                  Upcoming Booked Walks
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => showToast('Previous month')}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showToast('Next month')}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div className="text-emerald-700">Sat</div>
              <div className="text-rose-600">Sun</div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: leadingBlankDays }).map((_, i) => (
                <div key={`blank_${i}`} className="h-20 rounded-2xl bg-slate-50/50" />
              ))}

              {daysInMonth.map((day) => {
                const dayBookings = getBookingsForDate(day);
                const isSelected = selectedCalendarDate === day;
                const isToday = day === 1;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedCalendarDate(day)}
                    className={`h-20 p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#0f5132] ring-2 ring-emerald-500/20 bg-emerald-50/40 shadow-xs'
                        : dayBookings.length > 0
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isToday
                            ? 'w-5 h-5 rounded-full bg-[#0f5132] text-white flex items-center justify-center text-[11px]'
                            : 'text-slate-800'
                        }`}
                      >
                        {day}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      {dayBookings.slice(0, 1).map((b, idx) => (
                        <div
                          key={idx}
                          className="text-[9px] bg-[#0f5132] text-white rounded px-1 py-0.5 truncate font-semibold"
                        >
                          {b.serviceType}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              {selectedCalendarDate ? `${selectedCalendarDate} October 2026 Schedule` : 'Select a date'}
            </h3>

            {selectedCalendarDate && (
              <div className="space-y-3">
                {getBookingsForDate(selectedCalendarDate).length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                    No walks scheduled for this date.
                    <button
                      onClick={() => openBookingModal()}
                      className="mt-2 block mx-auto text-emerald-700 font-bold hover:underline"
                    >
                      + Book a walk
                    </button>
                  </div>
                ) : (
                  getBookingsForDate(selectedCalendarDate).map((b, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 text-sm">{b.serviceType}</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                          {b.timeSlot}
                        </span>
                      </div>

                      <div className="text-slate-600">
                        Assigned Walker: <strong>{b.walkerName}</strong>
                      </div>
                      <div className="text-slate-600">
                        Dogs: <strong>{b.dogNames.join(', ')}</strong>
                      </div>

                      <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                        <span className="font-bold text-[#0f5132]">£{b.totalAmount.toFixed(2)}</span>
                        {b.status === 'In Progress' ? (
                          <button
                            onClick={() => setOwnerTab('live-walk')}
                            className="px-3 py-1 bg-[#0f5132] text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                          >
                            <Radio className="w-3 h-3 animate-pulse" />
                            <span>Track Live</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Escrow Confirmed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Appointments List */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={booking.walkerAvatar}
                  alt={booking.walkerName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{booking.serviceType}</span>
                    <span className="text-slate-400 font-mono text-xs">({booking.id})</span>
                    {booking.status === 'In Progress' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                        Live Walk In Progress
                      </span>
                    )}
                    {booking.status === 'Awaiting Owner Release' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1 animate-pulse">
                        💷 Walk Completed — Awaiting Your Escrow Release
                      </span>
                    )}
                    {booking.status === 'Upcoming' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        Confirmed
                      </span>
                    )}
                    {booking.status === 'Completed' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900">
                        Completed & Paid
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span>Walker: <strong>{booking.walkerName}</strong></span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <PawPrint className="w-3 h-3 text-emerald-600" />
                      Dogs: <strong>{booking.dogNames.join(', ')}</strong>
                    </span>
                    <span>·</span>
                    <span>{booking.date} · {booking.timeSlot}</span>
                  </div>

                  {/* Collection Address & Pick-Up / Drop-Off Access Arrangements */}
                  {(booking.homeAddress ||
                    booking.pickupAccessArrangement ||
                    booking.dropoffAccessArrangement) && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          Collection Address:{' '}
                          {booking.homeAddress || '18 Downshire Hill, Hampstead, NW3 1NR'}
                        </span>
                      </div>
                      {booking.pickupAccessArrangement && (
                        <div className="flex items-start gap-1">
                          <KeyRound className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Pick-Up Access:</strong> {booking.pickupAccessArrangement}
                          </span>
                        </div>
                      )}
                      {booking.dropoffAccessArrangement && (
                        <div className="flex items-start gap-1">
                          <DoorOpen className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Drop-Off Access:</strong> {booking.dropoffAccessArrangement}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      £5M Insured
                    </span>
                    <span>·</span>
                    <span className="text-slate-600 font-medium">
                      Escrow Status:{' '}
                      <strong
                        className={
                          booking.paymentStatus === 'Released'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }
                      >
                        {booking.paymentStatus}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Price */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {booking.paymentStatus === 'Released' ? 'Released to Walker' : 'Held in Escrow'}
                  </span>
                  <div className="text-base font-extrabold text-slate-900">
                    £{booking.totalAmount.toFixed(2)}
                  </div>
                </div>

                {/* Confirm & Release Escrow Money Button for Owner */}
                {booking.paymentStatus !== 'Released' && (
                  <button
                    onClick={() => confirmAndReleaseEscrowPayment(booking.id)}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                      booking.status === 'Awaiting Owner Release'
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-500/40 animate-pulse'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Confirm & Release £{booking.totalAmount.toFixed(2)}</span>
                  </button>
                )}

                {booking.status === 'In Progress' && (
                  <button
                    onClick={() => setOwnerTab('live-walk')}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                    <span>View Live Map</span>
                  </button>
                )}

                {booking.status === 'Upcoming' && (
                  <button
                    onClick={() => setOwnerTab('live-walk')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Chat with Walker
                  </button>
                )}

                <button
                  onClick={() => {
                    setReviewingBooking({
                      id: booking.id,
                      walkerName: booking.walkerName,
                      serviceType: booking.serviceType,
                      dogNames: booking.dogNames,
                    });
                    setReviewStars(5);
                    setReviewComment('');
                  }}
                  className="px-3 py-2 text-xs font-extrabold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Leave a 1-5 Star Review for this Walker"
                >
                  <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Rate ★</span>
                </button>

                <button
                  onClick={() =>
                    nativeShare({
                      type: 'booking',
                      title: `✅ Confirmed Walk Booking (${booking.id})`,
                      subtitle: `${booking.serviceType} with ${booking.walkerName}`,
                      badge: '£5M Insured Escrow Booking',
                      text: `🐾 Booked a ${booking.serviceType} for ${booking.dogNames.join(' & ')} with DBS-verified walker ${booking.walkerName} on ${booking.date} (${booking.timeSlot}) via My Paws Walks!`,
                      dogNames: booking.dogNames,
                    })
                  }
                  className="px-3 py-2 text-xs font-bold text-[#0f5132] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Share Confirmed Booking via Web Share API"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 3: Recurring Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-3">
            <Repeat className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Recurring Walk Subscriptions (1-Month Cancellation Notice):</span> Dog owners pay <strong>£0 platform subscription fees</strong>. Recurring walk packages with your chosen walker auto-renew weekly and can be cancelled anytime with a <strong>1-month (30-day) notice period</strong>.
            </div>
          </div>

          {ownerSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={sub.walkerAvatar}
                  alt={sub.walkerName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{sub.packageName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        sub.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Walker: <strong>{sub.walkerName}</strong> · Dogs: <strong>{sub.dogNames.join(', ')}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Days: {sub.preferredDays.join(', ')}</span>
                    <span>·</span>
                    <span>Window: {sub.pickupTimeWindow}</span>
                    <span>·</span>
                    <span>Renews: {sub.nextRenewalDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Weekly Rate</span>
                  <div className="text-base font-extrabold text-[#0f5132]">
                    £{sub.weeklyPrice.toFixed(2)}/wk
                  </div>
                </div>

                {sub.status === 'Active' && (
                  <button
                    onClick={() => cancelSubscription(sub.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel Subscription (1-Month Notice)
                  </button>
                )}

                <button
                  onClick={() =>
                    nativeShare({
                      type: 'booking',
                      title: `🔁 Weekly Walk Subscription: ${sub.packageName}`,
                      subtitle: `Walker: ${sub.walkerName} · Dogs: ${sub.dogNames.join(', ')}`,
                      badge: 'Verified Weekly Routine',
                      text: `🐾 ${sub.dogNames.join(' & ')} are enrolled in the ${sub.packageName} with DBS-verified walker ${sub.walkerName} (${sub.preferredDays.join(', ')}) on My Paws Walks!`,
                      dogNames: sub.dogNames,
                    })
                  }
                  className="px-3 py-1.5 text-xs font-bold text-[#0f5132] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Star Rating & Review Modal */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Rate {reviewingBooking.walkerName}
                </h3>
                <p className="text-xs text-slate-500">
                  Booking {reviewingBooking.id} · {reviewingBooking.serviceType}
                </p>
              </div>
              <button
                onClick={() => setReviewingBooking(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setReviewStars(starVal)}
                    className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        reviewStars >= starVal ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-black text-slate-900">{reviewStars}.0 / 5.0 ★</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Share your feedback for {reviewingBooking.walkerName} *
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={`How did ${reviewingBooking.walkerName} look after ${reviewingBooking.dogNames.join(' & ')}?`}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewingBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const matchedWalker =
                    walkers.find((w) => w.name === reviewingBooking.walkerName) || walkers[0];
                  addServiceReview({
                    targetId: matchedWalker.id,
                    targetType: 'walker',
                    targetName: matchedWalker.name,
                    reviewerName: activeHouseholdMember?.name || 'Verified Dog Owner',
                    reviewerAvatar:
                      activeHouseholdMember?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                    dogNames: reviewingBooking.dogNames,
                    rating: reviewStars,
                    serviceType: reviewingBooking.serviceType,
                    comment:
                      reviewComment.trim() ||
                      `Wonderful ${reviewingBooking.serviceType} with ${reviewingBooking.walkerName}!`,
                  });
                  setReviewingBooking(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Publish {reviewStars}-Star Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
