import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { WalkerServicePricing, WalkerSubscriptionPackage, WalkDurationOption } from '../../types';
import {
  Sliders,
  DollarSign,
  Plus,
  Check,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Edit2,
  Save,
  Users,
  Trash2,
  Info,
  Lock,
} from 'lucide-react';

const PRESET_DURATIONS = [
  { minutes: 15, defaultRate: 12, label: '15-Min Quick Pee & Sniff' },
  { minutes: 20, defaultRate: 14, label: '20-Min Garden Break' },
  { minutes: 30, defaultRate: 16, label: '30-Min Neighborhood Loop' },
  { minutes: 45, defaultRate: 20, label: '45-Min Park Social' },
  { minutes: 60, defaultRate: 24, label: '60-Min Full Adventure', popular: true },
  { minutes: 90, defaultRate: 34, label: '90-Min Heath Explorer' },
  { minutes: 120, defaultRate: 44, label: '120-Min Forest Sniffari' },
];

export const WalkerServicesPricing: React.FC = () => {
  const {
    walkers,
    setWalkerTab,
    walkerServices,
    updateWalkerService,
    walkerSurcharge,
    setWalkerSurcharge,
    multiDogDiscountPercent,
    setMultiDogDiscountPercent,
    walkerPackages,
    addWalkerPackage,
    toggleWalkerPackage,
    showToast,
  } = useMarketplace();

  const activeWalker = walkers[0];
  const activePlan = activeWalker?.subscriptionPlan || 'PRO';
  const isStarterPlan = activePlan === 'FREE / STARTER';

  const [showNewPkgModal, setShowNewPkgModal] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgWalks, setNewPkgWalks] = useState<number>(3);
  const [newPkgPrice, setNewPkgPrice] = useState<string>('65.00');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgType, setNewPkgType] = useState<WalkerSubscriptionPackage['walkType']>('Group Walk');

  // Custom Duration State for custom addition
  const [selectedServiceForDuration, setSelectedServiceForDuration] = useState<string | null>(null);
  const [customMinutesInput, setCustomMinutesInput] = useState<number>(45);
  const [customPriceInput, setCustomPriceInput] = useState<number>(20);
  const [customLabelInput, setCustomLabelInput] = useState<string>('');

  // Pup & Academy Points & Custom Rewards State for Dog Walker
  const [walkerAcademyRewards, setWalkerAcademyRewards] = useState([
    { id: 'wr_1', task: 'Loose-Lead Heel Walk Mastery (No Pulling for 30 Mins)', points: 50, reward: 'Free 15-Min Sniffari Extension on Next Walk' },
    { id: 'wr_2', task: 'Instant Whistle Recall in High-Distraction Park', points: 75, reward: 'Artisanal Organic Liver Treat Bag + Academy Badge' },
    { id: 'wr_3', task: 'Polite Pack Socialization (5 Consecutive Group Walks)', points: 120, reward: '50% Off Next 60-Min Adventure Walk' },
  ]);
  const [newAcademyTask, setNewAcademyTask] = useState('');
  const [newAcademyPoints, setNewAcademyPoints] = useState<number>(50);
  const [newAcademyReward, setNewAcademyReward] = useState('');

  const handleAddAcademyReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcademyTask || !newAcademyReward) return;
    setWalkerAcademyRewards((prev) => [
      ...prev,
      {
        id: `wr_${Date.now()}`,
        task: newAcademyTask,
        points: Number(newAcademyPoints) || 50,
        reward: newAcademyReward,
      },
    ]);
    setNewAcademyTask('');
    setNewAcademyReward('');
    showToast('Added new Pup & Academy training reward for your dog walking clients!');
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle) return;

    addWalkerPackage({
      title: newPkgTitle,
      walksPerWeek: Number(newPkgWalks),
      weeklyPrice: parseFloat(newPkgPrice) || 60,
      description: newPkgDesc || 'Scheduled recurring walk subscription with guaranteed slots.',
      walkType: newPkgType,
      active: true,
    });

    setNewPkgTitle('');
    setNewPkgDesc('');
    setShowNewPkgModal(false);
  };

  const getServiceDurations = (service: WalkerServicePricing): WalkDurationOption[] => {
    if (service.customDurations && service.customDurations.length > 0) {
      return service.customDurations;
    }
    // Fallback default durations
    return [
      { minutes: 30, rate: service.halfHourRate || 16, label: '30-Min Walk' },
      { minutes: 45, rate: Math.round(((service.hourlyRate || 24) * 0.75)), label: '45-Min Walk' },
      { minutes: 60, rate: service.hourlyRate || 24, label: '60-Min Walk', popular: true },
      { minutes: 90, rate: Math.round(((service.hourlyRate || 24) * 1.45)), label: '90-Min Extended Walk' },
    ];
  };

  const handleUpdateDurationRate = (serviceId: string, minutes: number, newRate: number) => {
    const service = walkerServices.find((s) => s.serviceId === serviceId);
    if (!service) return;

    const currentDurations = getServiceDurations(service);
    const updated = currentDurations.map((d) =>
      d.minutes === minutes ? { ...d, rate: newRate } : d
    );

    // Also update hourlyRate or halfHourRate if matching
    const updates: Partial<WalkerServicePricing> = { customDurations: updated };
    if (minutes === 60) updates.hourlyRate = newRate;
    if (minutes === 30) updates.halfHourRate = newRate;

    updateWalkerService(serviceId, updates);
    showToast(`Updated ${minutes}-min duration rate to £${newRate}.`);
  };

  const handleAddCustomDuration = (serviceId: string) => {
    const service = walkerServices.find((s) => s.serviceId === serviceId);
    if (!service) return;

    if (!customMinutesInput || customMinutesInput <= 0) {
      showToast('Please enter a valid walk duration in minutes.', 'warning');
      return;
    }

    const currentDurations = getServiceDurations(service);
    if (currentDurations.some((d) => d.minutes === customMinutesInput)) {
      showToast(`Duration of ${customMinutesInput} mins already exists for this service.`, 'warning');
      return;
    }

    const newOption: WalkDurationOption = {
      minutes: customMinutesInput,
      rate: customPriceInput || 20,
      label: customLabelInput || `${customMinutesInput}-Min Custom Walk`,
    };

    const updated = [...currentDurations, newOption].sort((a, b) => a.minutes - b.minutes);
    updateWalkerService(serviceId, { customDurations: updated });
    setSelectedServiceForDuration(null);
    setCustomLabelInput('');
    showToast(`Added custom ${customMinutesInput}-minute walk duration slot!`);
  };

  const handleRemoveDuration = (serviceId: string, minutes: number) => {
    const service = walkerServices.find((s) => s.serviceId === serviceId);
    if (!service) return;

    const currentDurations = getServiceDurations(service);
    if (currentDurations.length <= 1) {
      showToast('Each service must maintain at least one duration option.', 'warning');
      return;
    }

    const updated = currentDurations.filter((d) => d.minutes !== minutes);
    updateWalkerService(serviceId, { customDurations: updated });
    showToast(`Removed ${minutes}-min duration option.`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Custom Walk Durations & Pricing</h2>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Sarah Jenkins (Pro Walker)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Choose your own walk durations in minutes (15m, 20m, 30m, 45m, 60m, 90m, 120m or any custom length) and set your custom pricing per duration.
          </p>
        </div>

        <button
          onClick={() => setShowNewPkgModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-xl transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Recurring Walk Pass</span>
        </button>
      </div>

      {/* Services List and Custom Duration Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Offered Walk Services & Custom Duration Tariffs</h3>
            <p className="text-xs text-slate-500">
              Select or customize duration options for each walk service. Pet owners will choose from these exact durations when booking.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {walkerServices.map((service) => {
            const durations = getServiceDurations(service);

            return (
              <div
                key={service.serviceId}
                className={`p-5 rounded-2xl border transition-all ${
                  service.enabled
                    ? 'bg-slate-50/70 border-slate-200 shadow-2xs'
                    : 'bg-slate-100/50 border-slate-200 opacity-60'
                }`}
              >
                {/* Service Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => updateWalkerService(service.serviceId, { enabled: !service.enabled })}
                      className="mt-0.5 text-emerald-700 focus:outline-none"
                      title={service.enabled ? 'Disable service' : 'Enable service'}
                    >
                      {service.enabled ? (
                        <ToggleRight className="w-7 h-7 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{service.name}</h4>
                        <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                          Max {service.maxDogs} dogs
                        </span>
                        {!service.enabled && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{service.description}</p>
                    </div>
                  </div>

                  {/* Add Duration Slot Button */}
                  {service.enabled && (
                    <button
                      onClick={() => {
                        setSelectedServiceForDuration(
                          selectedServiceForDuration === service.serviceId ? null : service.serviceId
                        );
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Add Duration Slot / Mins</span>
                    </button>
                  )}
                </div>

                {/* Custom Walk Duration Cards Grid */}
                {service.enabled && (
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Walk Duration Tiers for this Service ({durations.length} available):</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Click rate to edit</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {durations.map((duration) => (
                        <div
                          key={duration.minutes}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs relative flex flex-col justify-between space-y-2 group hover:border-emerald-300 transition-colors"
                        >
                          {duration.popular && (
                            <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider">
                              Popular
                            </span>
                          )}

                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                                <span>⏱️ {duration.minutes} Mins</span>
                              </div>
                              <div className="text-[10px] text-slate-500 line-clamp-1">{duration.label}</div>
                            </div>

                            <button
                              onClick={() => handleRemoveDuration(service.serviceId, duration.minutes)}
                              className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete duration slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <span className="text-[11px] text-slate-400">Your Price:</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-slate-800 font-mono">£</span>
                              <input
                                type="number"
                                min="1"
                                value={duration.rate}
                                onChange={(e) =>
                                  handleUpdateDurationRate(
                                    service.serviceId,
                                    duration.minutes,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 px-2 py-0.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-md text-xs font-extrabold text-slate-900 font-mono text-right"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Custom Duration Drawer */}
                    {selectedServiceForDuration === service.serviceId && (
                      <div className="mt-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Add New Walk Duration for {service.name}</span>
                          </h5>
                          <button
                            onClick={() => setSelectedServiceForDuration(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Preset quick buttons */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Select:</span>
                          {PRESET_DURATIONS.map((preset) => {
                            const alreadyAdded = durations.some((d) => d.minutes === preset.minutes);
                            return (
                              <button
                                key={preset.minutes}
                                disabled={alreadyAdded}
                                onClick={() => {
                                  setCustomMinutesInput(preset.minutes);
                                  setCustomPriceInput(preset.defaultRate);
                                  setCustomLabelInput(preset.label);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  alreadyAdded
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : customMinutesInput === preset.minutes
                                    ? 'bg-[#0f5132] text-white shadow-2xs font-bold'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                                }`}
                              >
                                {preset.minutes} mins
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Duration (Minutes)
                            </label>
                            <input
                              type="number"
                              min="5"
                              max="300"
                              step="5"
                              value={customMinutesInput}
                              onChange={(e) => setCustomMinutesInput(Number(e.target.value))}
                              placeholder="e.g. 45"
                              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Price (£ GBP)
                            </label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">£</span>
                              <input
                                type="number"
                                min="1"
                                value={customPriceInput}
                                onChange={(e) => setCustomPriceInput(Number(e.target.value))}
                                placeholder="20.00"
                                className="w-full pl-6 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Display Label (Optional)
                            </label>
                            <input
                              type="text"
                              value={customLabelInput}
                              onChange={(e) => setCustomLabelInput(e.target.value)}
                              placeholder={`e.g. ${customMinutesInput}-Min Woodland Sniff`}
                              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleAddCustomDuration(service.serviceId)}
                            className="px-4 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Save Duration Slot</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Policy Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block">Weekend & Holiday Surcharge</span>
            <p className="text-slate-500">Additional fee applied to bank holiday and weekend adventures.</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="font-mono font-bold text-sm text-slate-900">£</span>
              <input
                type="number"
                value={walkerSurcharge}
                onChange={(e) => {
                  setWalkerSurcharge(Number(e.target.value));
                  showToast('Weekend surcharge updated.');
                }}
                className="w-24 p-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-xs"
              />
              <span className="text-slate-500">per booking</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block">Multi-Dog Household Discount</span>
            <p className="text-slate-500">Discount applied to the 2nd (and 3rd) dog from the same household.</p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min="0"
                max="80"
                value={multiDogDiscountPercent}
                onChange={(e) => {
                  setMultiDogDiscountPercent(Number(e.target.value));
                  showToast('Multi-dog discount updated.');
                }}
                className="w-24 p-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-xs"
              />
              <span className="font-bold text-slate-800">% OFF second dog</span>
            </div>
          </div>
        </div>
      </div>

      {/* Walker's Subscription Packages Builder (Recurring Bookings — PRO / Elite Gated) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Recurring Walk Bookings & Weekly Packages
              </h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                PRO / Elite Feature
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Offer recurring weekly walk subscriptions so pet owners can auto-book their preferred slots at a steady rate.
            </p>
          </div>
          {!isStarterPlan && (
            <button
              type="button"
              onClick={() => setShowNewPkgModal(true)}
              className="px-4 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer self-start"
            >
              + New Recurring Package
            </button>
          )}
        </div>

        {isStarterPlan ? (
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <div className="max-w-lg mx-auto space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900">
                Recurring Bookings Locked on FREE / STARTER Plan
              </h4>
              <p className="text-xs text-slate-600">
                Standard service advertising and custom walk pricing above are included for free on Starter. Upgrade and pay for <strong>PRO (£6.99/mo or £69.99/yr)</strong> or <strong>Elite Package (£14.99/mo or £149.99/yr)</strong> to unlock Recurring Bookings and 5% / 2.5% commission.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWalkerTab('subscriptions')}
              className="px-5 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-black rounded-xl shadow-xs cursor-pointer"
            >
              Upgrade to PRO (£6.99/mo) to Unlock Recurring Bookings →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {walkerPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  pkg.active ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {pkg.walkType}
                    </span>
                    <button
                      onClick={() => toggleWalkerPackage(pkg.id)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      {pkg.active ? (
                        <span className="text-emerald-600 font-bold text-[10px]">Active</span>
                      ) : (
                        <span className="text-slate-400 font-bold text-[10px]">Paused</span>
                      )}
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{pkg.title}</h4>
                  <div className="mt-2 mb-3">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      £{pkg.weeklyPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 font-normal"> / week</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4">{pkg.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pkg.enrolledCount} Pups Enrolled</span>
                  </span>
                  <span className="font-semibold text-slate-700">{pkg.walksPerWeek} Walks / Wk</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promotional Tools: Pup & Academy Points & Client Rewards Studio (PRO / Elite Gated) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Promotional Tools & Client Rewards Studio</span>
            </h3>
            <p className="text-xs text-slate-500">
              Create promotional discount vouchers, loyalty perks, and Pup Academy rewards for your dog walking clients.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full self-start">
            🏆 PRO & Elite Promotional Tool
          </span>
        </div>

        {isStarterPlan ? (
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <div className="max-w-lg mx-auto space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900">
                Promotional Tools Require a Paid PRO or Elite Subscription
              </h4>
              <p className="text-xs text-slate-600">
                Upgrade to <strong>PRO (£6.99/mo or £69.99/yr)</strong> or <strong>Elite Package (£14.99/mo or £149.99/yr)</strong> to unlock Promotional Tools, Client Discount Vouchers, and Loyalty Rewards.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWalkerTab('subscriptions')}
              className="px-5 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-black rounded-xl shadow-xs cursor-pointer"
            >
              Upgrade to PRO (£6.99/mo) to Unlock Promotional Tools →
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {walkerAcademyRewards.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/40 text-amber-950 px-2 py-0.5 rounded-md">
                        +{item.points} Pup Points
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">Client Perk</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">{item.task}</h4>
                    <p className="text-xs text-emerald-900 font-semibold mt-2">
                      🎁 Reward: {item.reward}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      showToast(`Awarded +${item.points} Pup Points & "${item.reward}" to Buster & Barnaby!`)
                    }
                    className="w-full py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    Issue Award to Pack Dog
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddAcademyReward} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Add Custom Promotional Offer & Client Reward</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newAcademyTask}
                  onChange={(e) => setNewAcademyTask(e.target.value)}
                  placeholder="Promo Milestone (e.g. 5th Walk Loyalty Bonus)"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={newAcademyPoints}
                  onChange={(e) => setNewAcademyPoints(Number(e.target.value))}
                  placeholder="Pup Points (e.g. 50)"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
                <input
                  type="text"
                  required
                  value={newAcademyReward}
                  onChange={(e) => setNewAcademyReward(e.target.value)}
                  placeholder="Promotional Reward (e.g. £5 Off Next Walk)"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f5132] text-white text-xs font-bold rounded-xl hover:bg-[#0c3e29]"
                >
                  + Save Promotional Offer
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* New Package Modal */}
      {showNewPkgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Create Client Walk Subscription Plan</h3>
            <form onSubmit={handleCreatePackage} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4-Day Daily Explorer Club"
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Walks Per Week</label>
                  <select
                    value={newPkgWalks}
                    onChange={(e) => setNewPkgWalks(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value={2}>2 Walks / Wk</option>
                    <option value={3}>3 Walks / Wk</option>
                    <option value={4}>4 Walks / Wk</option>
                    <option value={5}>5 Walks / Wk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weekly Tariff (£)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Walk Format</label>
                <select
                  value={newPkgType}
                  onChange={(e) => setNewPkgType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Group Walk">Group Walk (Max 4 dogs)</option>
                  <option value="Solo Sniffari">Solo Sniffari (1-on-1)</option>
                  <option value="Puppy Drop-in">Puppy Drop-in</option>
                  <option value="Senior Stroll">Senior Stroll</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Description</label>
                <textarea
                  rows={2}
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  placeholder="Guaranteed recurring slot with live GPS broadcast..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewPkgModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f5132] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Publish Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
