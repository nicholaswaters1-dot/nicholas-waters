import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { WalkerDogProfileModal } from './WalkerDogProfileModal';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Lock,
  Eye,
  RotateCcw,
  CopyCheck,
} from 'lucide-react';

export const WalkerCalendarView: React.FC = () => {
  const {
    walkers,
    walkerAvailability,
    updateWalkerAvailability,
    blockedDates,
    toggleBlockedDate,
    bookings,
    setWalkerTab,
    showToast,
  } = useMarketplace();

  const activeWalker = walkers[0];
  const activePlan = activeWalker?.subscriptionPlan || 'PRO';
  const isStarterPlan = activePlan === 'FREE / STARTER';

  const [selectedMonth] = useState('October 2026');
  const [selectedDate, setSelectedDate] = useState<number | null>(1); // 1st October (Today)
  const [inspectingDogName, setInspectingDogName] = useState<string | null>(null);

  // Calendar days in October 2026 (Starts on a Thursday)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlankDays = 3; // Thursday start: Mon=0, Tue=1, Wed=2, Thu=3

  const getBookingsForDay = (day: number) => {
    // October 1 is Today
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
          timeSlot: '10:30 AM - 11:45 AM',
          status: 'Upcoming',
        },
      ];
    }
    if (day === 5 || day === 7 || day === 9) {
      return [
        {
          id: 'MPW-SUB-9021',
          walkerName: 'Sarah Jenkins',
          dogNames: ['Buster'],
          serviceType: 'Group Walk',
          timeSlot: '10:30 AM - 11:45 AM',
          status: 'Upcoming',
        },
        {
          id: 'MPW-BOOK-4410',
          walkerName: 'Sarah Jenkins',
          dogNames: ['Bailey'],
          serviceType: 'Solo Sniffari',
          timeSlot: '2:00 PM - 3:00 PM',
          status: 'Upcoming',
        },
      ];
    }
    return [];
  };

  const isBlocked = (day: number) => {
    const formatted = `2026-10-${day.toString().padStart(2, '0')}`;
    return blockedDates.includes(formatted);
  };

  const applyMondayToWeekdays = () => {
    const mon = walkerAvailability.find((a) => a.day === 'Monday');
    if (!mon) return;
    ['Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((dayName) => {
      updateWalkerAvailability(dayName, {
        enabled: mon.enabled,
        startTime: mon.startTime,
        endTime: mon.endTime,
        maxDailyDogs: mon.maxDailyDogs,
      });
    });
    showToast(`Copied Monday hours (${mon.startTime} - ${mon.endTime}) to all weekdays (Mon–Fri)!`);
  };

  if (isStarterPlan) {
    return (
      <div className="space-y-6 pb-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 shadow-md text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
              Subscription Restriction · PRO / Elite Feature
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Booking Calendar Requires a Paid PRO or Elite Subscription
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your account is currently on the <strong>FREE / STARTER (£0/month)</strong> plan, which includes profile creation, service advertising, price setting, receiving up to 5 bookings/week, and collecting reviews (10% commission).
            </p>
            <p className="text-xs text-slate-500">
              To unlock the interactive <strong>Booking Calendar</strong>, <strong>Unlimited Bookings</strong>, <strong>Recurring Bookings</strong>, <strong>Direct Owner Messaging</strong>, and <strong>5% commission</strong>, upgrade to <strong>PRO (£6.99/mo or £69.99/yr)</strong> or <strong>Elite Package (£14.99/mo or £149.99/yr)</strong>.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setWalkerTab('subscriptions')}
              className="px-6 py-3 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-black shadow-md transition-colors cursor-pointer"
            >
              Upgrade & Pay Subscription (£6.99/mo PRO) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-[#0f5132] text-white rounded-3xl p-6 sm:p-8 border border-emerald-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Walker Schedule & Editable Operating Hours · {activePlan} Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Sarah Jenkins’s Availability & Operating Hours
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            Edit your daily start and finish operating times, set your daily dog capacity, click any booked dog to view their full Care Passport, and block out holidays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/70 border border-emerald-800 rounded-2xl px-4 py-3 text-right">
            <div className="text-[10px] uppercase font-bold text-emerald-300">Council Pack Safety Cap</div>
            <div className="text-xl font-black text-white">Max 4 Dogs / Pack</div>
            <div className="text-[10px] text-emerald-200">Hampstead Heath By-laws</div>
          </div>
        </div>
      </div>

      {/* Grid: Left Calendar View (7 cols), Right Day Inspector & Editable Weekly Hours (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Month Calendar */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">{selectedMonth}</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                Autumn Walking Term
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Previous month')}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Next month')}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div className="text-emerald-700">Sat</div>
            <div className="text-rose-500">Sun</div>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Blank leading days */}
            {Array.from({ length: leadingBlankDays }).map((_, i) => (
              <div key={`blank_${i}`} className="h-20 sm:h-24 rounded-2xl bg-slate-50/50 border border-transparent" />
            ))}

            {daysInMonth.map((day) => {
              const dayBookings = getBookingsForDay(day);
              const blocked = isBlocked(day);
              const isToday = day === 1;
              const isSelected = selectedDate === day;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer text-left ${
                    isSelected
                      ? 'border-[#0f5132] ring-2 ring-emerald-500/20 bg-emerald-50/30 shadow-xs'
                      : blocked
                      ? 'bg-rose-50/40 border-rose-200/80 text-rose-900'
                      : dayBookings.length > 0
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-[#0f5132] text-white flex items-center justify-center'
                          : blocked
                          ? 'text-rose-700'
                          : 'text-slate-800'
                      }`}
                    >
                      {day}
                    </span>

                    {blocked && (
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-100 px-1 rounded">
                        Off
                      </span>
                    )}

                    {!blocked && dayBookings.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  {/* Day Content Badges */}
                  <div className="space-y-1">
                    {dayBookings.slice(0, 1).map((b, idx) => (
                      <div
                        key={idx}
                        className="text-[10px] bg-emerald-100/90 text-emerald-900 rounded px-1.5 py-0.5 truncate font-semibold"
                      >
                        {b.serviceType}
                      </div>
                    ))}
                    {dayBookings.length > 1 && (
                      <div className="text-[9px] text-slate-500 font-medium">
                        +{dayBookings.length - 1} more walk
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Day Inspector & Editable Operating Hours */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selected Date Inspector with Clickable Booked Dogs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedDate ? `${selectedDate} October 2026` : 'Select a Day'}
                </h3>
                <p className="text-xs text-slate-500">
                  Click any booked dog below to view their full Care Profile
                </p>
              </div>

              {selectedDate && (
                <button
                  onClick={() => {
                    const str = `2026-10-${selectedDate.toString().padStart(2, '0')}`;
                    toggleBlockedDate(str);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isBlocked(selectedDate)
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {isBlocked(selectedDate) ? 'Unblock Day' : 'Block Out Day'}
                </button>
              )}
            </div>

            {selectedDate && (
              <div className="space-y-3">
                {isBlocked(selectedDate) ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    <div className="font-bold flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-rose-600" />
                      <span>Day Marked as Unavailable</span>
                    </div>
                    <p className="mt-1 text-rose-700">
                      No new client walk requests or recurring subscriptions will be scheduled for this date.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-xs font-bold text-slate-700">Scheduled Walks & Booked Dogs:</div>
                    {getBookingsForDay(selectedDate).length === 0 ? (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs text-center">
                        No appointments currently scheduled for this day. Open for new bookings!
                      </div>
                    ) : (
                      getBookingsForDay(selectedDate).map((b, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-emerald-950">
                            <span>{b.serviceType}</span>
                            <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full font-bold">
                              {b.timeSlot}
                            </span>
                          </div>

                          {/* Clickable Dog Chips to Open Dog Profile */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-semibold text-slate-600 block">
                              Booked Dogs (Tap dog to view Care Profile):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {b.dogNames.map((dName, dIdx) => (
                                <button
                                  key={dIdx}
                                  type="button"
                                  onClick={() => setInspectingDogName(dName)}
                                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-700 text-slate-900 hover:text-white border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                                >
                                  <span>🐾 {dName}</span>
                                  <Eye className="w-3.5 h-3.5 opacity-80" />
                                  <span className="text-[10px] underline">View Profile</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-1 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Confirmed & Escrow Protected
                            </span>
                            <button
                              type="button"
                              onClick={() => setWalkerTab('pack-hub')}
                              className="font-extrabold text-[#0f5132] hover:underline cursor-pointer"
                            >
                              Open in Live Walk Hub →
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Editable Standard Operating Hours per Weekday */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Editable Weekly Operating Hours</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click any start or end time below to edit your working hours
                </p>
              </div>

              <button
                type="button"
                onClick={applyMondayToWeekdays}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy Monday's start and end times to Tue–Fri"
              >
                <CopyCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Copy Mon to Mon–Fri</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {walkerAvailability.map((avail) => (
                <div
                  key={avail.day}
                  className={`p-3 rounded-2xl border transition-all text-xs space-y-2 ${
                    avail.enabled
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-slate-100/60 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={avail.enabled}
                        onChange={(e) =>
                          updateWalkerAvailability(avail.day, { enabled: e.target.checked })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                      />
                      <span className="font-bold text-slate-900">{avail.day}</span>
                    </label>

                    {avail.enabled ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Open ({avail.startTime} – {avail.endTime})
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">Off / Closed</span>
                    )}
                  </div>

                  {avail.enabled && (
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/70">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={avail.startTime}
                          onChange={(e) =>
                            updateWalkerAvailability(avail.day, { startTime: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-slate-300 focus:border-emerald-600 rounded-lg font-mono text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={avail.endTime}
                          onChange={(e) =>
                            updateWalkerAvailability(avail.day, { endTime: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-slate-300 focus:border-emerald-600 rounded-lg font-mono text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Max Dogs/Day
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={16}
                          value={avail.maxDailyDogs}
                          onChange={(e) =>
                            updateWalkerAvailability(avail.day, {
                              maxDailyDogs: Math.max(1, Number(e.target.value) || 4),
                            })
                          }
                          className="w-full px-2 py-1 bg-white border border-slate-300 focus:border-emerald-600 rounded-lg font-mono text-xs font-bold text-slate-900 focus:outline-none text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dog Care Profile Inspector Modal */}
      <WalkerDogProfileModal
        dogNameOrId={inspectingDogName}
        onClose={() => setInspectingDogName(null)}
        onMessageOwner={() => {
          setWalkerTab('pack-hub');
        }}
      />
    </div>
  );
};
