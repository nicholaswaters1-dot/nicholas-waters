import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ComplaintTicket } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Receipt,
  UserX,
  FileText,
  Search,
  Check,
  Send,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const ComplaintsResolutionAdmin: React.FC = () => {
  const {
    complaints,
    resolveComplaint,
    showToast,
  } = useMarketplace();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(complaints[0]?.id || '');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionType, setActionType] = useState<ComplaintTicket['status']>('Action Taken & Refund Issued');

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    if (!resolutionNotes.trim()) {
      showToast('Please provide administrative investigation and resolution notes', 'warning');
      return;
    }

    resolveComplaint(selectedComplaint.id, actionType, resolutionNotes.trim());
    setResolutionNotes('');
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus === 'All') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-7 shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Admin Safeguarding & Vetting Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Complaints & Grievance Resolution Desk
          </h1>
          <p className="text-xs text-slate-400">
            Adjudicate incoming disputes, verify evidence, issue platform escrow refunds, and enforce DBS safeguarding penalties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold font-mono">
            {complaints.filter((c) => c.status === 'Under Investigation').length} Pending Vetting
          </span>
        </div>
      </div>

      {/* Filter Tabs (Wraps cleanly inside screen) */}
      <div className="flex flex-wrap border-b border-slate-200 pb-2 gap-2 text-xs font-semibold max-w-full">
        {['All', 'Under Investigation', 'Awaiting Evidence', 'Action Taken & Refund Issued', 'Resolved / Dismissed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              filterStatus === status
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {status} ({status === 'All' ? complaints.length : complaints.filter((c) => c.status === status).length})
          </button>
        ))}
      </div>

      {/* Split Grid: Tickets List Left, Active Investigation Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Complaints List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredComplaints.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No complaint tickets match this filter.
            </div>
          ) : (
            filteredComplaints.map((comp) => {
              const isSelected = comp.id === selectedComplaint?.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => {
                    setSelectedComplaintId(comp.id);
                    setResolutionNotes(comp.adminResolutionNotes || '');
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all text-xs space-y-2 block ${
                    isSelected
                      ? 'bg-white border-red-600 ring-2 ring-red-500/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">
                      {comp.id} · {comp.submittedAt}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        comp.status === 'Under Investigation'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : comp.status === 'Action Taken & Refund Issued'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 leading-snug">{comp.subject}</h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>By: <strong className="text-slate-700">{comp.submittedBy}</strong></span>
                    <span className="text-red-700 font-semibold">{comp.urgency}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Active Ticket Investigation & Resolution Desk (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedComplaint ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-600">
                      {selectedComplaint.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {selectedComplaint.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedComplaint.subject}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Urgency Assessment
                  </span>
                  <span className="text-xs font-bold text-red-600 uppercase">
                    {selectedComplaint.urgency}
                  </span>
                </div>
              </div>

              {/* Complainant & Party Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Submitted By</span>
                  <span className="font-bold text-slate-800">{selectedComplaint.submittedBy}</span>
                  <span className="text-slate-500 block text-[10px]">{selectedComplaint.submitterEmail}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Involved Party</span>
                  <span className="font-bold text-red-700">{selectedComplaint.involvedPartyName}</span>
                  <span className="text-slate-500 block text-[10px]">Incident: {selectedComplaint.incidentDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Booking Reference</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedComplaint.bookingReference || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Description & Evidence */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Detailed Complainant Statement:
                </span>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                  {selectedComplaint.detailedDescription}
                </div>
              </div>

              {selectedComplaint.evidenceAttachmentName && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Evidence Document: <strong>{selectedComplaint.evidenceAttachmentName}</strong></span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">Verified Hash</span>
                </div>
              )}

              {/* Admin Resolution Form */}
              <form onSubmit={handleResolve} className="space-y-4 pt-3 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Administrative Adjudication & Action Taken</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1">
                      Determine Status Outcome
                    </label>
                    <select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="Action Taken & Refund Issued">
                        Action Taken & Escrow Refund Issued
                      </option>
                      <option value="Formal Warning Issued">
                        Formal Warning Issued to Walker / Provider
                      </option>
                      <option value="Awaiting Evidence">
                        Request Further Evidence from Parties
                      </option>
                      <option value="Resolved / Dismissed">
                        Resolved / Grievance Dismissed
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1">
                      Assigned Officer
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedComplaint.assignedAdmin}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-medium text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold text-xs mb-1">
                    Formal Investigation Summary & Resolution Notes *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter compliance determination, escrow refund details, or provider warning notes..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Save Adjudication & Notify Parties</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
              Select a complaint ticket from the list to investigate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
