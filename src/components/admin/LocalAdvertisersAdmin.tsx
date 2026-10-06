import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { LocalBusinessAd } from '../../types';
import {
  Store,
  MapPin,
  Phone,
  ExternalLink,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Tag,
  Plus,
  ShieldCheck,
  Building2,
  Globe2,
} from 'lucide-react';

export const LocalAdvertisersAdmin: React.FC = () => {
  const { localBusinesses, reviewBusinessAd, setAdvertiseModalOpen, showToast } = useMarketplace();

  const pendingBusinesses = localBusinesses.filter((b) => b.status === 'Pending Review');
  const activeBusinesses = localBusinesses.filter((b) => b.status === 'Active');

  const totalMonthlyAdRevenue = activeBusinesses.reduce((sum, b) => sum + b.monthlyFee, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Local Business Advertisers & Sponsor Moderation</h2>
          <p className="text-xs text-slate-500">
            Vetting and approval queue for dog groomers, veterinary clinics, and pet boutiques before publication.
          </p>
        </div>

        <button
          onClick={() => setAdvertiseModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Business Sponsor</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Active Local Sponsors</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {activeBusinesses.length} Live Partners
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">Live on GPS Maps & Public Directory</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Pending Vetting Reviews</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 tabular-nums">
            {pendingBusinesses.length} Queued
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">Payment completed · Awaiting Admin Approval</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Monthly Recurring Ad Revenue (MRR)</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
            £{totalMonthlyAdRevenue.toFixed(2)}<span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">Self-serve monthly & annual subscriptions</div>
        </div>
      </div>

      {/* PENDING APPROVAL SECTION */}
      {pendingBusinesses.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-300 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                Pending Advertiser Vetting Queue ({pendingBusinesses.length})
              </h3>
            </div>
            <span className="text-xs font-medium text-amber-800">
              Payment Confirmed via Stripe · Requires Admin Verification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-white rounded-2xl border border-amber-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                        🏢
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{biz.businessName}</h4>
                        <span className="text-[11px] text-slate-500">{biz.category} · {biz.postcodeArea}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                      {biz.subscriptionTier}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic">"{biz.tagline}"</p>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{biz.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{biz.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
                      <a
                        href={biz.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline truncate"
                      >
                        {biz.website}
                      </a>
                    </div>
                    <div className="text-emerald-800 font-semibold pt-1">
                      Offer: {biz.promoOffer}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-xs font-mono font-bold text-slate-700">
                    £{biz.monthlyFee}/mo <span className="font-normal text-slate-400">({biz.billingCadence.split(' ')[0]})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => reviewBusinessAd(biz.id, 'Rejected')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => reviewBusinessAd(biz.id, 'Active')}
                      className="px-4 py-1.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Approve & Publish Live</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL REGISTERED ADVERTISERS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">All Local Business Sponsors</h3>
            <p className="text-xs text-slate-500">Postcode Geotargeted & Live GPS Pins</p>
          </div>
          <span className="text-xs text-slate-400">{localBusinesses.length} Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Business & Website</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Postcode</th>
                <th className="px-5 py-3">Subscription Tier</th>
                <th className="px-5 py-3">Promo Offer</th>
                <th className="px-5 py-3">Fee / Cadence</th>
                <th className="px-5 py-3 text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {localBusinesses.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{b.businessName}</div>
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>{b.website}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{b.category}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-800">{b.postcodeArea}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                      {b.subscriptionTier}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{b.promoOffer}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 font-mono tabular-nums">
                    £{b.monthlyFee}/mo <span className="text-[10px] font-normal text-slate-400">({b.billingCadence.split(' ')[0]})</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        b.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Pending Review'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
