import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Store,
  Users,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Star,
  Search,
  TrendingUp,
  Award,
  Power,
  DollarSign,
  UserPlus,
} from 'lucide-react';

interface AdminMobileCommandCenterProps {
  initialSubTab?: 'new-businesses' | 'walkers-manage' | 'kennels-manage' | 'owners-manage' | 'revenue-ledger';
}

export const AdminMobileCommandCenter: React.FC<AdminMobileCommandCenterProps> = ({
  initialSubTab = 'new-businesses',
}) => {
  const {
    localBusinesses,
    reviewBusinessAd,
    walkers,
    kennels,
    dogs,
    householdMembers,
    bookings,
    kennelBookings,
    ledger,
    commissionRate,
    isAuthorizedAdmin,
    showToast,
  } = useMarketplace();

  if (!isAuthorizedAdmin) {
    return null;
  }

  const [activeSubTab, setActiveSubTab] = useState<
    'new-businesses' | 'walkers-manage' | 'kennels-manage' | 'owners-manage' | 'revenue-ledger'
  >(initialSubTab);
  const [businessSearch, setBusinessSearch] = useState('');
  const [bizStatusFilter, setBizStatusFilter] = useState<'All' | 'Active' | 'Pending Review' | 'Rejected'>('All');

  // Admin Deactivate / Reactivate Control State for Users, Walkers, and Kennels
  const [deactivatedWalkerIds, setDeactivatedWalkerIds] = useState<string[]>([]);
  const [deactivatedKennelIds, setDeactivatedKennelIds] = useState<string[]>([]);
  const [deactivatedOwnerIds, setDeactivatedOwnerIds] = useState<string[]>([]);

  const toggleWalkerActive = (id: string, name: string) => {
    setDeactivatedWalkerIds((prev) => {
      const isDeactivated = prev.includes(id);
      showToast(
        isDeactivated
          ? `Reactivated dog walker account: ${name} ✓`
          : `Deactivated dog walker account: ${name}`,
        isDeactivated ? 'success' : 'warning'
      );
      return isDeactivated ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const toggleKennelActive = (id: string, name: string) => {
    setDeactivatedKennelIds((prev) => {
      const isDeactivated = prev.includes(id);
      showToast(
        isDeactivated
          ? `Reactivated kennel & boarding host: ${name} ✓`
          : `Deactivated kennel & boarding host: ${name}`,
        isDeactivated ? 'success' : 'warning'
      );
      return isDeactivated ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const toggleOwnerActive = (id: string, name: string) => {
    setDeactivatedOwnerIds((prev) => {
      const isDeactivated = prev.includes(id);
      showToast(
        isDeactivated
          ? `Reactivated pet owner account: ${name} ✓`
          : `Deactivated pet owner account: ${name}`,
        isDeactivated ? 'success' : 'warning'
      );
      return isDeactivated ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  // Filter businesses
  const filteredBusinesses = localBusinesses.filter((b) => {
    const matchStatus = bizStatusFilter === 'All' || b.status === bizStatusFilter;
    const matchSearch =
      b.businessName.toLowerCase().includes(businessSearch.toLowerCase()) ||
      b.category.toLowerCase().includes(businessSearch.toLowerCase()) ||
      b.postcodeArea.toLowerCase().includes(businessSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Calculate platform financial revenue metrics
  const totalWalkRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalKennelRevenue = kennelBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalAdvertiserRevenue = localBusinesses
    .filter((b) => b.status === 'Active')
    .reduce((sum, b) => sum + b.monthlyFee, 0);
  const totalWalkerSubscriptions = walkers.length * 6.99;
  const totalKennelSubscriptions = kennels.length * 6.99;
  const platformWalkCommission = totalWalkRevenue * (commissionRate / 100);
  const platformKennelCommission = totalKennelRevenue * (commissionRate / 100);
  const netPlatformRevenue =
    platformWalkCommission +
    platformKennelCommission +
    totalAdvertiserRevenue +
    totalWalkerSubscriptions +
    totalKennelSubscriptions;

  return (
    <div className="space-y-6 pb-20">
      {/* Mobile Admin Command Bar */}
      <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-7 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile Platform Operations & Master Admin Controls</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Admin Mobile Command Center & Revenue
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Approve or deactivate businesses, manage walkers, kennels & pet owners, and audit every sign-up and revenue stream from your phone.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3 sm:p-4 rounded-2xl flex items-center gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                £{Math.round(netPlatformRevenue)}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Net Platform Revenue</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {walkers.length + kennels.length + householdMembers.length + localBusinesses.length}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Total Signed Up</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation (Wraps cleanly inside screen) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl max-w-full shadow-xs">
        <button
          onClick={() => setActiveSubTab('new-businesses')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'new-businesses'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4 shrink-0" />
          <span>New Businesses ({localBusinesses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('walkers-manage')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'walkers-manage'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Dog Walkers ({walkers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kennels-manage')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'kennels-manage'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>Kennels & Stays ({kennels.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('owners-manage')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'owners-manage'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>Pet Owners ({householdMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('revenue-ledger')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'revenue-ledger'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Sign-Ups & Revenue (£{Math.round(netPlatformRevenue)})</span>
        </button>
      </div>

      {/* 1. NEW BUSINESSES & ADVERTISERS MANAGEMENT (Approve / Deactivate / Reactivate) */}
      {activeSubTab === 'new-businesses' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search business name, category, or postcode..."
                value={businessSearch}
                onChange={(e) => setBusinessSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto max-w-full">
              {(['All', 'Pending Review', 'Active', 'Rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setBizStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    bizStatusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'Rejected' ? 'Deactivated' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBusinesses.map((biz) => (
              <div
                key={biz.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 flex flex-col justify-between transition-all ${
                  biz.status === 'Rejected' ? 'border-red-200 opacity-75 bg-red-50/10' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {biz.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {biz.postcodeArea}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">{biz.businessName}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{biz.tagline}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        biz.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : biz.status === 'Pending Review'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {biz.status === 'Rejected' ? 'Deactivated' : biz.status}
                    </span>
                  </div>

                  <div className="pt-2 text-xs text-slate-600 space-y-1">
                    <div>📍 <strong>Address:</strong> {biz.address}</div>
                    <div>📞 <strong>Phone:</strong> {biz.phone}</div>
                    <div>💰 <strong>Ad Revenue:</strong> {biz.subscriptionTier} (£{biz.monthlyFee}/mo)</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">
                    Signed Up: {biz.submittedDate || 'Oct 2026'}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {biz.status === 'Pending Review' ? (
                      <>
                        <button
                          onClick={() => {
                            reviewBusinessAd(biz.id, 'Active');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Activate</span>
                        </button>
                        <button
                          onClick={() => {
                            reviewBusinessAd(biz.id, 'Rejected');
                          }}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          Deactivate
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          reviewBusinessAd(biz.id, biz.status === 'Active' ? 'Rejected' : 'Active');
                        }}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1.5 ${
                          biz.status === 'Active'
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{biz.status === 'Active' ? 'Deactivate Business' : 'Reactivate Business'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. DOG WALKERS MANAGEMENT (Deactivate / Reactivate + Revenue) */}
      {activeSubTab === 'walkers-manage' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {walkers.map((walker) => {
              const isDeactivated = deactivatedWalkerIds.includes(walker.id);
              return (
                <div
                  key={walker.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition-all ${
                    isDeactivated ? 'border-red-200 bg-red-50/10 opacity-75' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={walker.avatar}
                        alt={walker.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{walker.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isDeactivated
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isDeactivated ? 'Deactivated' : 'Active Pro'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {walker.location} ({walker.postcodeArea})
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{walker.rating}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">60m / 30m Rate</div>
                      <div className="font-bold text-slate-900">
                        £{walker.hourlyRate} / £{walker.halfHourRate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Plan Fee Paid</div>
                      <div className="font-bold text-emerald-700">£6.99/mo (PRO)</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Walks Completed</div>
                      <div className="font-bold text-slate-900">{walker.completedWalks}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>DBS: {walker.dbsCertificateNumber}</span>
                    <button
                      onClick={() => toggleWalkerActive(walker.id, walker.name)}
                      className={`px-3.5 py-1.5 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                        isDeactivated
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isDeactivated ? 'Reactivate Walker' : 'Deactivate Walker'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. KENNELS & STAYS MANAGEMENT (Deactivate / Reactivate + Custom Rates) */}
      {activeSubTab === 'kennels-manage' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kennels.map((k) => {
              const isDeactivated = deactivatedKennelIds.includes(k.id);
              return (
                <div
                  key={k.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition-all ${
                    isDeactivated ? 'border-red-200 bg-red-50/10 opacity-75' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          ★ DEFRA {k.councilLicenceRating}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDeactivated
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isDeactivated ? 'Deactivated' : 'Active Host'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">{k.businessName}</h3>
                      <p className="text-xs text-slate-500">
                        Contact: {k.contactName} · {k.location}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-slate-900 text-right">
                      <span className="text-[10px] text-slate-400 block">Membership</span>
                      <span className="text-emerald-700">£6.99/mo (PRO)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Suites Configured</span>
                      <strong className="text-slate-800">{k.suites.length} Active Suites</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Custom Nightly Rates</span>
                      <strong className="text-emerald-700">
                        £{Math.min(...k.suites.map((s) => s.nightlyRate))} - £
                        {Math.max(...k.suites.map((s) => s.nightlyRate))}/night
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Licence: {k.councilLicenceNumber}</span>
                    <button
                      onClick={() => toggleKennelActive(k.id, k.businessName)}
                      className={`px-3.5 py-1.5 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                        isDeactivated
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isDeactivated ? 'Reactivate Kennel' : 'Deactivate Kennel'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. PET OWNERS & REGISTERED DOGS (Deactivate / Reactivate User Accounts) */}
      {activeSubTab === 'owners-manage' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Signed-Up Pet Owners & Household Accounts ({householdMembers.length})
              </h3>
              <span className="text-xs text-slate-500">{dogs.length} Registered Dogs</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {householdMembers.map((member) => {
                const isDeactivated = deactivatedOwnerIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDeactivated ? 'bg-red-50/20 opacity-75' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {member.role}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isDeactivated
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isDeactivated ? 'Deactivated' : 'Active'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Phone: {member.phone} · Dogs: {dogs.map((d) => d.name).join(', ')} · Spend: £
                          {totalWalkRevenue.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => toggleOwnerActive(member.id, member.name)}
                        className={`px-3.5 py-1.5 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                          isDeactivated
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{isDeactivated ? 'Reactivate User' : 'Deactivate User'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. SIGN-UP ROSTER & FULL REVENUE BREAKDOWN BY USER, BUSINESS & ADVERTISER */}
      {activeSubTab === 'revenue-ledger' && (
        <div className="space-y-6">
          {/* Revenue Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Walk Commissions
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                £{Math.round(platformWalkCommission)}
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5">{commissionRate}% Take Rate</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Kennels & Sitting Fees
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                £{Math.round(platformKennelCommission + totalKennelSubscriptions)}
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5">{commissionRate}% Stay + £6.99/mo Plan</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Advertiser Subscriptions
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                £{totalAdvertiserRevenue}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {localBusinesses.filter((b) => b.status === 'Active').length} Active Sponsors
              </div>
            </div>

            <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                Total Net Platform Revenue
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                £{Math.round(netPlatformRevenue)}
              </div>
              <div className="text-[10px] text-emerald-200 mt-0.5">All Users & Businesses</div>
            </div>
          </div>

          {/* Master Sign-Up & Revenue Attribution Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span>Complete Sign-Up Directory & Revenue Generated per Account</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tracks every Pet Owner, Dog Walker, Kennel & Stay Host, and Local Advertiser who has signed up.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Live Mobile Audit
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {/* Walkers Sign-ups */}
              {walkers.map((w) => (
                <div key={w.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-800 px-2 py-0.5 rounded mr-2">
                      Dog Walker
                    </span>
                    <strong className="text-slate-900">{w.name}</strong>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Plan: PRO (£6.99/mo or £69.99/yr) · {w.completedWalks} Walks · {w.postcodeArea}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-black text-emerald-800">+£6.99/mo + 5% Comm</div>
                    <div className="text-[10px] text-slate-400">Signed Up & DBS Verified</div>
                  </div>
                </div>
              ))}

              {/* Kennels Sign-ups */}
              {kennels.map((k) => (
                <div key={k.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded mr-2">
                      Kennel & Stay
                    </span>
                    <strong className="text-slate-900">{k.businessName}</strong>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Host: {k.contactName} · Plan: {k.subscriptionPlan || 'PRO (£6.99/mo)'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-black text-emerald-800">+£6.99/mo + 5% Comm</div>
                    <div className="text-[10px] text-slate-400">DEFRA 5-Star Verified</div>
                  </div>
                </div>
              ))}

              {/* Pet Owners Sign-ups */}
              {householdMembers.map((m) => (
                <div key={m.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded mr-2">
                      Pet Owner
                    </span>
                    <strong className="text-slate-900">{m.name}</strong>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Role: {m.role} · Phone: {m.phone} · £0 Free Owner Account
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-black text-slate-900">
                      £{(totalWalkRevenue / householdMembers.length).toFixed(2)} Gross Spend
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">FREE Subscription · Policies Signed ✓</div>
                  </div>
                </div>
              ))}

              {/* Local Advertisers Sign-ups */}
              {localBusinesses.slice(0, 6).map((b) => (
                <div key={b.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-900 px-2 py-0.5 rounded mr-2">
                      Advertiser
                    </span>
                    <strong className="text-slate-900">{b.businessName}</strong>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {b.category} · Tier: {b.subscriptionTier}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-black text-emerald-800">+£{b.monthlyFee}/mo</div>
                    <div className="text-[10px] text-slate-400">{b.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Financial Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">Real-Time Escrow & Payout Ledger</h3>
              <span className="text-[11px] text-slate-400">UK Banking Compliance Active</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {ledger.map((entry) => (
                <div key={entry.id} className="p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{entry.type}</span>
                      <span className="text-[10px] font-mono text-slate-400">({entry.transactionRef})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {entry.ownerName} → {entry.walkerName} · {entry.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">£{entry.amount.toFixed(2)}</div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        entry.status === 'Settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
