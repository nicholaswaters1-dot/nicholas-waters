import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Check,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Heart,
  Crown,
  Star,
  Repeat,
  AlertCircle,
  CalendarX,
  RotateCcw,
} from 'lucide-react';

export const SubscriptionPlans: React.FC = () => {
  const { walkers, updateWalkerSubscription, showToast } = useMarketplace();
  const activeWalker = walkers[0];
  const currentPlan = activeWalker?.subscriptionPlan || 'PRO';

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    activeWalker?.subscriptionBillingCycle || 'annual'
  );
  const [cancellationPending, setCancellationPending] = useState<boolean>(false);
  const [cancellationEffectiveDate, setCancellationEffectiveDate] = useState<string>('');
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<
    'apple_pay' | 'google_pay' | 'paypal' | 'card' | 'klarna'
  >('apple_pay');
  const [checkoutPlanModal, setCheckoutPlanModal] = useState<'PRO' | 'Elite Package' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const paymentLabels: Record<typeof selectedPaymentProvider, string> = {
    apple_pay: 'Apple Pay',
    google_pay: 'Google Pay',
    paypal: 'PayPal Business',
    card: 'Visa / Mastercard',
    klarna: 'Klarna Split Annual',
  };

  const handleSelectPlan = (planName: 'FREE / STARTER' | 'PRO' | 'Elite Package') => {
    if (planName === 'FREE / STARTER') {
      updateWalkerSubscription(activeWalker.id, 'FREE / STARTER', billingCycle, 'Free Tier');
      setCancellationPending(false);
      setCancellationEffectiveDate('');
      return;
    }
    if (currentPlan === planName && activeWalker?.subscriptionPaid) {
      showToast(`Your ${planName} subscription is already paid and active!`, 'info');
      return;
    }
    setCheckoutPlanModal(planName);
  };

  const handleConfirmPaidSubscription = () => {
    if (!checkoutPlanModal) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      updateWalkerSubscription(
        activeWalker.id,
        checkoutPlanModal,
        billingCycle,
        paymentLabels[selectedPaymentProvider]
      );
      setCancellationPending(false);
      setCancellationEffectiveDate('');
      setCheckoutPlanModal(null);
    }, 650);
  };

  const handleGiveOneMonthCancellationNotice = () => {
    const effective = new Date();
    effective.setMonth(effective.getMonth() + 1);
    const formattedDate = effective.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setCancellationPending(true);
    setCancellationEffectiveDate(formattedDate);
    showToast(
      `1-Month Cancellation Notice submitted for ${currentPlan}. Your subscription remains active until ${formattedDate}, then reverts to FREE / STARTER (£0/mo).`,
      'info'
    );
  };

  const handleKeepSubscription = () => {
    setCancellationPending(false);
    setCancellationEffectiveDate('');
    showToast(`Your ${currentPlan} recurring subscription has been resumed with no interruption!`);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Dog Owners Free Banner */}
      <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Dog Owners — 100% FREE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Dog owners do not pay a monthly or annual subscription.
            </h3>
            <p className="text-xs text-slate-600">
              Always free for pet parents to join, connect with verified professionals, and book trusted care.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 px-4 py-3 text-center shrink-0">
            <div className="text-2xl font-black text-emerald-700">FREE</div>
            <div className="text-[11px] font-semibold text-slate-500">No subscription fees ever</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-emerald-200/70 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs text-slate-800 font-semibold">
          {[
            'Create an account',
            'Create dog profiles',
            'Search pet professionals',
            'View profiles and reviews',
            'Contact professionals',
            'Make bookings',
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 bg-white/80 px-3 py-2 rounded-xl border border-emerald-100"
            >
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Header for Walkers, Kennels & Sitters */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Walkers, Kennels & Sitters Pricing</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Simple, Transparent Plans for Pet Professionals
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Choose the plan that fits your walking, kennel, or sitting business. All paid memberships are recurring subscriptions with a 1-month (30-day) cancellation notice period.
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
            Monthly Recurring
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
            <span>Annual Recurring</span>
            <span className="text-[10px] font-black text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">
              Save £13.89 to £29.89/yr
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: FREE / STARTER */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Walkers, Kennels & Sitters
              </span>
              <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                10% Commission
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-3">FREE / STARTER</h3>

            <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 tabular-nums">£0</span>
                <span className="text-xs text-slate-600 font-semibold">per month</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                £0 per year · No monthly or annual subscription fee
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
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('FREE / STARTER')}
            className={`w-full py-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
              currentPlan === 'FREE / STARTER'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {currentPlan === 'FREE / STARTER' ? '✓ Current Active Plan' : 'Select FREE / STARTER (£0)'}
          </button>
        </div>

        {/* Tier 2: PRO – MOST POPULAR */}
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
              <div className="mt-2 pt-2 border-t border-emerald-800/80 text-[10px] text-emerald-200 flex items-center gap-1">
                <Repeat className="w-3 h-3 text-amber-300 shrink-0" />
                <span>Recurring subscription · 1-month cancellation notice</span>
              </div>
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
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('PRO')}
            className="w-full py-3 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md cursor-pointer"
          >
            {currentPlan === 'PRO'
              ? `✓ Currently Active (${billingCycle === 'annual' ? '£69.99/yr' : '£6.99/mo'})`
              : `Select PRO (${billingCycle === 'annual' ? '£69.99/yr' : '£6.99/mo'})`}
          </button>
        </div>

        {/* Tier 3: Elite Package */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Teams & Multi-Area</span>
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
              <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1">
                <Repeat className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Recurring subscription · 1-month cancellation notice</span>
              </div>
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
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('Elite Package')}
            className={`w-full py-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
              currentPlan === 'Elite Package'
                ? 'bg-[#0f5132] text-white border-[#0f5132]'
                : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
            }`}
          >
            {currentPlan === 'Elite Package'
              ? `✓ Current Active Plan (${billingCycle === 'annual' ? '£149.99/yr' : '£14.99/mo'})`
              : `Select Elite Package (${billingCycle === 'annual' ? '£149.99/yr' : '£14.99/mo'})`}
          </button>
        </div>
      </div>

      {/* Recurring Subscription Management & 1-Month Notice Cancellation Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 max-w-4xl mx-auto space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-700" />
              <h4 className="text-sm font-extrabold text-slate-900">
                Recurring Subscription & Cancellation Management
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Paid professional subscriptions automatically renew on a recurring {billingCycle} cycle and require a <strong>1-month (30-day) notice period</strong> to cancel.
            </p>
          </div>

          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full self-start sm:self-auto ${
              cancellationPending
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : currentPlan === 'FREE / STARTER'
                ? 'bg-slate-100 text-slate-700'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            {cancellationPending
              ? `1-Month Cancellation Notice Active (Ends ${cancellationEffectiveDate})`
              : currentPlan === 'FREE / STARTER'
              ? 'FREE / STARTER (£0/mo · No Recurring Charge)'
              : `Active Recurring Plan: ${currentPlan}`}
          </span>
        </div>

        {currentPlan === 'FREE / STARTER' ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-4">
            <span>
              You are currently on the <strong>FREE / STARTER (£0/month)</strong> plan with 10% commission on completed bookings and up to 5 bookings per week. Upgrade to PRO or Elite anytime.
            </span>
          </div>
        ) : cancellationPending ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-amber-950">
              <div className="font-extrabold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>1-Month Cancellation Notice Received for {currentPlan}</span>
              </div>
              <p className="text-amber-900">
                Your 1-month notice period is underway. You will continue to enjoy full <strong>{currentPlan}</strong> benefits and lower commission rates until <strong>{cancellationEffectiveDate}</strong>, after which your account will automatically move to FREE / STARTER (£0/mo).
              </p>
            </div>
            <button
              type="button"
              onClick={handleKeepSubscription}
              className="px-4 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Withdraw Notice & Keep Plan</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-slate-600">
              <div className="font-bold text-slate-900">
                Want to cancel your recurring {currentPlan} subscription?
              </div>
              <p>
                Submit your 1-month cancellation notice below. Your {currentPlan} features remain active for 1 full month from today, with no further recurring renewals afterward.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGiveOneMonthCancellationNotice}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CalendarX className="w-4 h-4" />
              <span>Cancel Subscription (1-Month Notice)</span>
            </button>
          </div>
        )}
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 max-w-4xl mx-auto space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900">
              Preferred Recurring Subscription Payment Method
            </h4>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Recurring auto-renewal · 1-month cancellation notice · Instant Receipt</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 'apple_pay', label: ' Pay', sub: 'Apple Pay' },
            { id: 'google_pay', label: 'G Pay', sub: 'Google Pay' },
            { id: 'paypal', label: 'PayPal', sub: 'Verified Business' },
            { id: 'card', label: 'Visa / MC', sub: 'Debit / Credit' },
            { id: 'klarna', label: 'Klarna.', sub: 'Split Annual' },
          ].map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => {
                setSelectedPaymentProvider(pm.id as any);
                showToast(`Default subscription payment method set to ${pm.sub}.`);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
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

      {/* Paid Subscription Payment Confirmation Modal */}
      {checkoutPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  Secure Subscription Checkout
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Pay & Unlock {checkoutPlanModal} Plan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutPlanModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200 font-semibold">Selected Professional Plan:</span>
                <span className="font-black text-amber-300">{checkoutPlanModal}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200 font-semibold">Billing Cadence:</span>
                <span className="font-bold capitalize">{billingCycle} Recurring</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200 font-semibold">Completed Booking Commission:</span>
                <span className="font-mono font-black text-emerald-300">
                  {checkoutPlanModal === 'PRO' ? '5%' : '2.5%'} (Reduced from 10%)
                </span>
              </div>
              <div className="pt-2 border-t border-emerald-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Total Due Today:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {checkoutPlanModal === 'PRO'
                    ? billingCycle === 'annual'
                      ? '£69.99/yr'
                      : '£6.99/mo'
                    : billingCycle === 'annual'
                    ? '£149.99/yr'
                    : '£14.99/mo'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Select Payment Method to Complete Upgrade:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'apple_pay', label: ' Pay', sub: 'Apple Pay' },
                  { id: 'google_pay', label: 'G Pay', sub: 'Google Pay' },
                  { id: 'paypal', label: 'PayPal', sub: 'Business' },
                  { id: 'card', label: 'Card', sub: 'Visa / MC' },
                  { id: 'klarna', label: 'Klarna', sub: 'Split 3x' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedPaymentProvider(pm.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPaymentProvider === pm.id
                        ? 'bg-[#0f5132] text-white border-[#0f5132] font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-black">{pm.label}</div>
                    <div className="text-[9px] opacity-75">{pm.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              By confirming payment, your <strong>{checkoutPlanModal}</strong> features (Unlimited Bookings, Booking Calendar, Recurring Bookings, Messaging, Business Analytics{checkoutPlanModal === 'Elite Package' ? ', Multiple Staff & Service Areas' : ''}) will unlock immediately. Subscriptions auto-renew with a <strong>1-month (30-day) cancellation notice period</strong>.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setCheckoutPlanModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmPaidSubscription}
                className="px-6 py-2.5 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-black shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment
                  ? 'Processing Payment...'
                  : `Pay ${
                      checkoutPlanModal === 'PRO'
                        ? billingCycle === 'annual'
                          ? '£69.99'
                          : '£6.99'
                        : billingCycle === 'annual'
                        ? '£149.99'
                        : '£14.99'
                    } & Unlock ${checkoutPlanModal}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
