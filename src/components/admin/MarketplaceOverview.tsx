import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Globe2,
  MapPin,
  Clock,
  Radio,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const MarketplaceOverview: React.FC = () => {
  const { bookings, walkers, packs } = useMarketplace();
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Upcoming' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesSearch =
      b.walkerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.dogNames && b.dogNames.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Live Walk Operations & Dispatch</h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of active dog walking sessions, pending appointments, and route verifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>42 Walks Currently Active in Greater London</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking ID, dog or walker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto max-w-full">
          {(['All', 'In Progress', 'Upcoming', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Dog & Owner</th>
                <th className="px-5 py-3">Assigned Walker</th>
                <th className="px-5 py-3">Service & Schedule</th>
                <th className="px-5 py-3">Total / Fee</th>
                <th className="px-5 py-3">Live Status</th>
                <th className="px-5 py-3 text-right">Escrow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900">{b.dogNames ? b.dogNames.join(' & ') : 'Buster'}</div>
                    <div className="text-[11px] text-slate-400">Oliver Harrison</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={b.walkerAvatar}
                        alt={b.walkerName}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-800">{b.walkerName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-800">{b.serviceType}</div>
                    <div className="text-[11px] text-slate-400">{b.date}, {b.timeSlot}</div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 tabular-nums">
                    £{b.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        b.status === 'In Progress'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Upcoming'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {b.status === 'In Progress' && <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />}
                      <span>{b.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-slate-600">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[11px]">
                      {b.paymentStatus}
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
