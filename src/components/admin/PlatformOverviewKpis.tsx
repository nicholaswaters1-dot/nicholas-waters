import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  AlertTriangle,
  Award,
  CalendarCheck,
  CreditCard,
  Building2,
  PieChart,
} from 'lucide-react';

export const PlatformOverviewKpis: React.FC = () => {
  const { bookings, walkers, incidents, ledger } = useMarketplace();

  return (
    <div className="space-y-8 pb-16">
      {/* Overview Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Platform Overview & Core KPIs</h2>
          <p className="text-xs text-slate-500">
            Real-time gross merchandise volume, walker compliance audits, and trust metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Platform Activity (Oct 2026)</span>
        </div>
      </div>

      {/* KPI Cards Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly GMV */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Gross Merchandise Volume (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            £142,850
          </div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <span>+18.4%</span>
            <span className="text-slate-400 font-normal">vs previous month</span>
          </div>
        </div>

        {/* Metric 2: Active Verified Walkers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Verified Walkers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            1,240
          </div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>99.2% DBS Audit Clean</span>
          </div>
        </div>

        {/* Metric 3: Completed Walks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Completed Walks (Month)</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            8,420
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Average 4.96/5.0 Dog Owner Rating</span>
          </div>
        </div>

        {/* Metric 4: Safety Incident Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Platform Incident Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            0.04%
          </div>
          <div className="text-xs text-emerald-700 font-semibold">
            Industry Benchmark is 0.25% (6x safer)
          </div>
        </div>
      </div>

      {/* Borough Breakdown & Growth Chart Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Borough Performance (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Regional London Market Share & Pack Density</h3>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              { borough: 'Camden & Hampstead Heath', walks: 3120, gmv: '£53,040', growth: '+22%', percent: 37 },
              { borough: 'Richmond upon Thames & Kew', walks: 2450, gmv: '£41,650', growth: '+19%', percent: 29 },
              { borough: 'Islington & Highbury', walks: 1540, gmv: '£26,180', growth: '+14%', percent: 18 },
              { borough: 'Greenwich & Blackheath', walks: 1310, gmv: '£21,980', growth: '+16%', percent: 16 },
            ].map((reg, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{reg.borough}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 tabular-nums">{reg.walks} walks</span>
                    <strong className="text-slate-900 tabular-nums">{reg.gmv}</strong>
                    <span className="text-emerald-700 font-semibold">{reg.growth}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${reg.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Retention Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Platform Health & Quality Indicators</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Customer NPS (Pet Parents)</div>
                <div className="text-[11px] text-slate-500">Based on 3,400 post-walk reviews</div>
              </div>
              <div className="text-xl font-extrabold text-emerald-700 tabular-nums">+78</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Walker 90-Day Retention</div>
                <div className="text-[11px] text-slate-500">Consistent recurring pack handlers</div>
              </div>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums">92.4%</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Average Walk Response Time</div>
                <div className="text-[11px] text-slate-500">From owner booking to confirmation</div>
              </div>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums">6.2 min</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Active Booking Escrow Volume</div>
                <div className="text-[11px] text-slate-500">Client booking funds held pending walk completion</div>
              </div>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums">£25,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
