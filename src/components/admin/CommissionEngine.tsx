import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Receipt,
  DollarSign,
  CreditCard,
  TrendingUp,
  Sliders,
  Send,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

export const CommissionEngine: React.FC = () => {
  const { ledger, commissionRate, setCommissionRate, payoutWalker, showToast } = useMarketplace();
  const [payoutWalkerName, setPayoutWalkerName] = useState('Sarah Jenkins');
  const [payoutAmount, setPayoutAmount] = useState('185.00');

  const totalGMV = ledger
    .filter((l) => l.type === 'Booking Payment')
    .reduce((sum, l) => sum + l.amount, 0);

  const totalCommission = ledger.reduce((sum, l) => sum + l.commissionEarned, 0);

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payoutAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid payout amount.', 'warning');
      return;
    }
    payoutWalker(payoutWalkerName, amt);
    setPayoutAmount('');
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Financials & Commission Engine</h2>
          <p className="text-xs text-slate-500">
            Escrow fee clearing, variable platform take-rates, walker payout ledgers, and BACS batch transfers.
          </p>
        </div>

        <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>FCA & UK Banking Escrow Compliant</span>
        </div>
      </div>

      {/* Financial Controls & Metric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Commission Rate Slider (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Dynamic Platform Take Rate</span>
            </h3>
            <span className="text-base font-extrabold text-emerald-700 font-mono tabular-nums">
              {commissionRate}%
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Completed booking commission is automatically set by professional plan tier: <strong>FREE / STARTER (10%)</strong>, <strong>PRO – Most Popular (5%)</strong>, and <strong>Elite Package (2.5%)</strong>. Dog owners pay £0 subscription.
          </p>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="2.5"
              max="10"
              step="2.5"
              value={commissionRate}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCommissionRate(val);
                showToast(`Active platform commission rate set to ${val}%`);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>2.5% (Elite)</span>
              <span>5% (PRO)</span>
              <span>10% (Starter)</span>
            </div>
          </div>

          {/* Quick Payout Dispatch Box */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Walker Payout (BACS Direct)</span>
            </h4>

            <form onSubmit={handlePayoutSubmit} className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Select Walker</label>
                  <select
                    value={payoutWalkerName}
                    onChange={(e) => setPayoutWalkerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="David Brooks">David Brooks</option>
                    <option value="Maya Patel">Maya Patel</option>
                    <option value="Liam O’Connor">Liam O’Connor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Amount (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                    placeholder="150.00"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Release Cleared Escrow Payout</span>
              </button>
            </form>
          </div>
        </div>

        {/* Financial Metrics Summary (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Platform Financial Flow Summary</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 mb-1 flex items-center gap-1">
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gross Volume</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums font-mono">
                £{totalGMV.toFixed(2)}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Commission Earned</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-700 tabular-nums font-mono">
                £{totalCommission.toFixed(2)}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>In Escrow Reserve</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums font-mono">
                £31.86
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed">
            <strong>Payout Automation Rules:</strong> Escrow disbursements are automatically queued for BACS batch transfer 2 hours following verified walk completion and owner photo receipt. 0 chargebacks reported this cycle.
          </div>
        </div>
      </div>

      {/* Financial Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
        <div className="p-5 pb-0 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Transaction & Payout Audit Ledger</h3>
          <span className="text-xs text-slate-400">All ledger events cryptographically signed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Tx Ref</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Event Type</th>
                <th className="px-5 py-3">Gross Amount</th>
                <th className="px-5 py-3">Take Rate</th>
                <th className="px-5 py-3">Net Walker Payout</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{entry.transactionRef}</td>
                  <td className="px-5 py-3.5 text-slate-500">{entry.date}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{entry.type}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 tabular-nums font-mono">
                    £{entry.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-500 tabular-nums">
                    {entry.commissionRate > 0 ? `${entry.commissionRate}%` : '—'}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700 tabular-nums font-mono">
                    £{entry.walkerPayout.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        entry.status === 'Settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.status === 'Escrow'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {entry.status}
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
