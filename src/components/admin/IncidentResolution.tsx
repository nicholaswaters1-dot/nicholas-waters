import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { SafetyIncident } from '../../types';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MapPin,
  HeartPulse,
  DollarSign,
  FileText,
  User,
} from 'lucide-react';

export const IncidentResolution: React.FC = () => {
  const { incidents, resolveIncident, showToast } = useMarketplace();
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;
    resolveIncident(selectedIncident.id, resolutionText || 'Resolved according to safety protocols.');
    setSelectedIncident(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Safety & Incident Resolution Desk</h2>
          <p className="text-xs text-slate-500">
            Triage dog safety alerts, minor scrape injury reports, £5M insurance claim dispatches, and behavioral infractions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>24/7 Safety Emergency Dispatch Online</span>
        </div>
      </div>

      {/* Incident Cards List */}
      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
              inc.status === 'Open'
                ? 'border-rose-300 ring-1 ring-rose-200'
                : inc.status === 'Investigating'
                ? 'border-amber-300 ring-1 ring-amber-100'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                  {inc.ticketNumber}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    inc.severity.includes('P1')
                      ? 'bg-rose-100 text-rose-800'
                      : inc.severity.includes('P2')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {inc.severity}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    inc.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {inc.status}
                </span>
              </div>

              <div className="text-xs text-slate-400">
                Reported: {inc.reportedAt}
              </div>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <h3 className="text-sm font-bold text-slate-900">{inc.title}</h3>
              <p className="text-slate-600 leading-relaxed">{inc.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-600 text-[11px]">
                <div>
                  <span className="text-slate-400">Affected Dog:</span>{' '}
                  <strong className="text-slate-800">{inc.dogName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Walker:</span>{' '}
                  <strong className="text-slate-800">{inc.walkerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Location:</span>{' '}
                  <strong className="text-slate-800">{inc.location}</strong>
                </div>
              </div>

              {inc.resolutionNotes && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-900 text-xs">
                  <strong>Resolution Audit Log:</strong> {inc.resolutionNotes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {inc.insuranceClaimTriggered && (
                  <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 text-[11px]">
                    <HeartPulse className="w-3 h-3" />
                    <span>Veterinary Guarantee Claim Paid (£{inc.claimAmount?.toFixed(2)})</span>
                  </span>
                )}
              </div>

              {inc.status !== 'Resolved' && (
                <button
                  onClick={() => {
                    setSelectedIncident(inc);
                    setResolutionText(inc.resolutionNotes || '');
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Resolve Incident Ticket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resolution Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Close Incident {selectedIncident.ticketNumber}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedIncident.title} ({selectedIncident.dogName})
            </p>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Final Safety Resolution Findings & Actions
                </label>
                <textarea
                  rows={4}
                  required
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Record veterinary invoice payment, owner phone debrief, walker re-briefing, or disciplinary action..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIncident(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Resolution & Close</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
