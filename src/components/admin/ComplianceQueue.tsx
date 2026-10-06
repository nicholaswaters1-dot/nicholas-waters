import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { VerificationDocument } from '../../types';
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  Search,
} from 'lucide-react';

export const ComplianceQueue: React.FC = () => {
  const { verifications, reviewDocument, showToast } = useMarketplace();
  const [activeDoc, setActiveDoc] = useState<VerificationDocument | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Needs Resubmission'>('All');

  const filteredDocs = verifications.filter((d) => {
    return filterStatus === 'All' || d.status === filterStatus;
  });

  const handleAction = (status: VerificationDocument['status']) => {
    if (!activeDoc) return;
    reviewDocument(activeDoc.id, status, reviewNote || undefined);
    setActiveDoc(null);
    setReviewNote('');
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Walker Compliance & Verification Queue</h2>
          <p className="text-xs text-slate-500">
            Review Government DBS disclosures, biometric photo IDs, and council license permits before approving walker accounts.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Pending', 'Approved', 'Needs Resubmission'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Walker Name</th>
                <th className="px-5 py-3">Document Category</th>
                <th className="px-5 py-3">Reference / Number</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{doc.walkerName}</div>
                    <div className="text-[11px] text-slate-400">{doc.walkerEmail}</div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{doc.documentType}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-700">{doc.documentNumber}</td>
                  <td className="px-5 py-3.5 text-slate-500">{doc.submittedAt}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        doc.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        setActiveDoc(doc);
                        setReviewNote(doc.reviewerNotes || '');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Audit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Document Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Audit Verification Certificate</h3>
                <p className="text-xs text-slate-500">Applicant: {activeDoc.walkerName} ({activeDoc.walkerEmail})</p>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block mb-0.5">Document Type:</span>
                  <strong className="text-slate-900">{activeDoc.documentType}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Reference / DBS ID:</span>
                  <strong className="font-mono text-slate-900">{activeDoc.documentNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Submitted On:</span>
                  <span className="text-slate-700">{activeDoc.submittedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Expiry Date:</span>
                  <span className="text-slate-700">{activeDoc.expiryDate}</span>
                </div>
              </div>

              {/* Simulated Government Gateway Verification */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>DBS Disclosure Gateway Match: Successful</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Government certificate cryptographic signature verified. Barred list check returned 0 matches.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Compliance Officer Audit Log & Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Enter reason for approval or specific re-submission request notes..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleAction('Needs Resubmission')}
                className="px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Request Resubmission</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction('Rejected')}
                  className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleAction('Approved')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Verify</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
