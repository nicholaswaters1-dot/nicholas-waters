import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ComplaintTicket } from '../../types';
import {
  AlertTriangle,
  Send,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Paperclip,
  Check,
  ChevronDown,
  X,
  MessageSquare,
} from 'lucide-react';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';

export const ComplaintsSubmissionView: React.FC = () => {
  const {
    complaints,
    submitComplaint,
    activeHouseholdMember,
    currentUserEmail,
    isAuthorizedAdmin,
    showToast,
  } = useMarketplace();

  // Only the user who submitted a complaint can see their own complaints (no other user can see them)
  const userVisibleComplaints = complaints.filter((comp) => {
    if (isAuthorizedAdmin) return true;
    const activeEmail = (currentUserEmail || activeHouseholdMember.email || '').trim().toLowerCase();
    const activeName = (activeHouseholdMember.name || '').trim().toLowerCase();
    const compEmail = (comp.submitterEmail || '').trim().toLowerCase();
    const compName = (comp.submittedBy || '').trim().toLowerCase();
    return (
      (activeEmail && compEmail === activeEmail) ||
      (activeName && compName === activeName)
    );
  });

  const [category, setCategory] = useState<ComplaintTicket['category']>('Walker Tardiness or Conduct');
  const [involvedParty, setInvolvedParty] = useState('');
  const [incidentDate, setIncidentDate] = useState('Yesterday, 14:30');
  const [bookingRef, setBookingRef] = useState('BK-991204');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<ComplaintTicket['urgency']>('Medium');
  const [attachment, setAttachment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || !involvedParty.trim()) {
      showToast('Please fill out all required complaint fields', 'warning');
      return;
    }

    submitComplaint({
      submittedBy: activeHouseholdMember.name,
      submitterRole: 'Pet Owner',
      submitterEmail: currentUserEmail || activeHouseholdMember.email,
      submitterPhone: activeHouseholdMember.phone,
      category,
      involvedPartyName: involvedParty.trim(),
      incidentDate: incidentDate.trim(),
      bookingReference: bookingRef.trim() || undefined,
      subject: subject.trim(),
      detailedDescription: description.trim(),
      evidenceAttachmentName: attachment.trim() || undefined,
      urgency,
    });

    setSubmittedSuccess(true);
    setSubject('');
    setDescription('');
    setInvolvedParty('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-rose-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Safety, Trust & Grievance Desk · Private to Your Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Complaints & Incident Reporting
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            We hold every walker, kennel boarding host, and advertised business to the highest standard of animal welfare. All grievances are strictly confidential — <strong>only you can see your own submitted complaints</strong>, and no other user can view them.
          </p>
        </div>
      </div>

      <SponsoredAdBanner category="Veterinary Hospital" />

      {/* Main Grid: Form Left, Status Tracker Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Complaint Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Submit Formal Grievance</span>
              </h2>
              <p className="text-xs text-slate-500">
                Official report handled confidentially under UK GDPR & Safeguarding standards. Visible only to you ({activeHouseholdMember.name}).
              </p>
            </div>
            <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
              Private & Vetted
            </span>
          </div>

          {submittedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block font-bold">Complaint Ticket Created!</strong>
                  <span>Your private report has been queued for immediate compliance officer review.</span>
                </div>
              </div>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Complaint Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500"
                >
                  <option value="Walker Tardiness or Conduct">Walker Tardiness or Conduct</option>
                  <option value="Kennel / Boarding Hygiene">Kennel / Boarding Hygiene or Temperature</option>
                  <option value="Animal Safety Concern">Animal Safety or Welfare Concern</option>
                  <option value="Billing or Escrow Dispute">Billing or Escrow Dispute</option>
                  <option value="Misleading Local Business Ad">Misleading Local Business Ad / Deal</option>
                  <option value="Shelter Visit Incident">Shelter Visit or Foster Incident</option>
                  <option value="App Technical Issue">App Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Severity / Urgency *</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500"
                >
                  <option value="Low">Low (Informational / Voucher Issue)</option>
                  <option value="Medium">Medium (Tardiness / Escrow Query)</option>
                  <option value="High">High (Service Breach / Contract Issue)</option>
                  <option value="Critical / Safety">Critical (Immediate Canine Safety / Neglect)</option>
                </select>
              </div>
            </div>

            {/* Involved Party & Incident Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Involved Individual or Establishment Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Thorne, Oakwood Lodge, Groomer"
                  value={involvedParty}
                  onChange={(e) => setInvolvedParty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Incident Date & Time</label>
                <input
                  type="text"
                  placeholder="e.g. 01 Oct 2026, 14:30"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Booking Ref */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Booking Reference (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. BK-991204 or KENNEL-701"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Complaint Summary (Subject) *</label>
              <input
                type="text"
                placeholder="Brief summary of the issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Detailed Chronological Description *
              </label>
              <textarea
                rows={4}
                placeholder="Explain exactly what happened, what was communicated, and what resolution you are requesting..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Evidence attachment */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Attach Evidence Photo or Vet Note (Filename)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. vet_invoice_receipt.pdf or photos_of_radiator.jpg"
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => setAttachment('walk_evidence_photo_timestamped.jpg')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1 shrink-0"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach Demo</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Private Complaint for Compliance Vetting</span>
            </button>
          </form>
        </div>

        {/* Right: Complaints History & Status Tracker (5 Cols) — Strictly User's Own Complaints */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>My Private Complaints ({userVisibleComplaints.length})</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  🔒 Strictly private to {activeHouseholdMember.name} — hidden from all other users
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Private View
              </span>
            </div>

            <div className="space-y-3">
              {userVisibleComplaints.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center space-y-1.5 text-xs text-slate-500">
                  <ShieldAlert className="w-6 h-6 text-slate-400 mx-auto" />
                  <div className="font-bold text-slate-700">No Complaints Submitted by You</div>
                  <p className="text-[11px] text-slate-500">
                    For privacy and GDPR compliance, you can only view complaints submitted from your own account ({activeHouseholdMember.name}).
                  </p>
                </div>
              ) : (
                userVisibleComplaints.map((comp) => {
                const isResolved =
                  comp.status === 'Resolved / Dismissed' ||
                  comp.status === 'Action Taken & Refund Issued';

                return (
                  <div
                    key={comp.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold block">
                          {comp.id} · {comp.submittedAt}
                        </span>
                        <h4 className="font-bold text-slate-900 mt-0.5">{comp.subject}</h4>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
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

                    <div className="text-[11px] text-slate-600">
                      Party: <strong className="text-slate-800">{comp.involvedPartyName}</strong> · Category:{' '}
                      <span className="font-medium text-slate-800">{comp.category}</span>
                    </div>

                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      {comp.detailedDescription}
                    </p>

                    {/* Admin resolution notes */}
                    {comp.adminResolutionNotes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] space-y-1">
                        <div className="font-bold text-emerald-900 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Admin Vetting Decision ({comp.assignedAdmin}):</span>
                        </div>
                        <p className="text-emerald-800">{comp.adminResolutionNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
