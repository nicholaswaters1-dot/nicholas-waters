import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  ShieldCheck,
  FileText,
  Lock,
  Receipt,
  Scale,
  X,
  CheckCircle2,
  AlertTriangle,
  PenTool,
  Clock,
  Globe2,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Logo } from './Logo';

export const PolicySignUpAgreementModal: React.FC = () => {
  const {
    policyModalOpen,
    setPolicyModalOpen,
    policyAgreements,
    signPolicyAgreement,
    activeHouseholdMember,
    showToast,
  } = useMarketplace();

  const [selectedRole, setSelectedRole] = useState<'Pet Owner' | 'Walker' | 'Kennel Host' | 'Shelter Staff' | 'Advertiser'>('Pet Owner');
  const [fullName, setFullName] = useState(activeHouseholdMember.name || 'Oliver Harrison');
  const [signature, setSignature] = useState(activeHouseholdMember.name || 'Oliver Harrison');

  // Policy toggles
  const [welfareAct, setWelfareAct] = useState(true);
  const [gdprConsent, setGdprConsent] = useState(true);
  const [escrowRefund, setEscrowRefund] = useState(true);
  const [dbsSafeguard, setDbsSafeguard] = useState(true);
  const [emergencyVet, setEmergencyVet] = useState(true);

  if (!policyModalOpen) return null;

  const isComplete =
    welfareAct &&
    gdprConsent &&
    escrowRefund &&
    dbsSafeguard &&
    emergencyVet &&
    signature.trim().length >= 3 &&
    fullName.trim().length >= 3;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      showToast('Please agree to all mandatory policy sections and provide your digital signature.', 'warning');
      return;
    }

    signPolicyAgreement({
      userId: activeHouseholdMember.id,
      userName: fullName.trim(),
      userRole: selectedRole,
      agreedAnimalWelfareAct: welfareAct,
      agreedUkGdprPrivacy: gdprConsent,
      agreedEscrowRefundTerms: escrowRefund,
      agreedDbsSafeguarding: dbsSafeguard,
      agreedEmergencyVetProtocol: emergencyVet,
      signatureText: signature.trim(),
    });

    setPolicyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0f5132] to-[#0c3e29] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Scale className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  Policies & Operational Procedures
                </h3>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Mandatory Sign-Up
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                UK Animal Welfare Act 2006 · GDPR 2018 · Escrow & Safe Conduct
              </p>
            </div>
          </div>

          <button
            onClick={() => setPolicyModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Role & Name Selection */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>User Sign-Up Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Your Account Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Pet Owner">Pet Owner (Household Guardian)</option>
                  <option value="Walker">Certified Professional Dog Walker</option>
                  <option value="Kennel Host">Dog Kennel & Boarding Establishment Host</option>
                  <option value="Shelter Staff">Local Rescue Shelter Staff / Coordinator</option>
                  <option value="Advertiser">Local Pet Business Advertiser (Vet/Groomer)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Oliver Harrison"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Mandatory Checkboxes with UK Law Badges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">
                Mandatory Declarations & Statutory Consents
              </h4>
              <span className="text-[11px] text-slate-500">All 5 sections required</span>
            </div>

            {/* 1. Animal Welfare Act */}
            <label className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white flex items-start gap-3 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={welfareAct}
                onChange={(e) => setWelfareAct(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    1. UK Animal Welfare Act 2006 Duty of Care Compliance
                  </span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                    Statutory Law
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  I agree to uphold the statutory Five Animal Welfare Needs (suitable environment, suitable diet, normal behavior patterns, suitable housing, and protection from pain, injury, and disease). For walkers and boarding hosts, pack limits and secure leads are strictly adhered to.
                </p>
              </div>
            </label>

            {/* 2. UK GDPR & Data Protection Act 2018 */}
            <label className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white flex items-start gap-3 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    2. UK GDPR & Data Protection Act 2018 Privacy Agreement
                  </span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                    ICO Compliant
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  I consent to the lawful processing of dog medical records, microchip identifiers, emergency vet contacts, and real-time GPS telemetry during active walks and boarding stays. Data is encrypted in transit and at rest and never sold to third parties.
                </p>
              </div>
            </label>

            {/* 3. Escrow Payment, Recurring Subscriptions & 1-Month Cancellation Notice */}
            <label className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white flex items-start gap-3 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={escrowRefund}
                onChange={(e) => setEscrowRefund(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    3. Escrow Protection & Recurring Subscription 1-Month Notice Terms
                  </span>
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                    Billing & Notice
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  I agree that walk and boarding booking fees are held in escrow until service completion, and that all recurring subscriptions renew automatically and require a <strong>1-month (30-day) notice period for cancellation</strong>. Dog owners use the platform for FREE (£0 subscription).
                </p>
              </div>
            </label>

            {/* 4. Enhanced DBS & Safeguarding Protocol */}
            <label className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white flex items-start gap-3 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={dbsSafeguard}
                onChange={(e) => setDbsSafeguard(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    4. Enhanced DBS & Safeguarding Declaration
                  </span>
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold text-[10px]">
                    Trust & Vetting
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  I verify that all information, certifications, and identity disclosures provided are accurate. Professional dog walkers and kennel hosts confirm absence of animal cruelty convictions or relevant criminal records.
                </p>
              </div>
            </label>

            {/* 5. Platform Non-Liability Waiver & Emergency Vet Authorization */}
            <label className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white flex items-start gap-3 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={emergencyVet}
                onChange={(e) => setEmergencyVet(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    5. Platform Non-Liability / No-Claims Waiver & Emergency Vet Authorization
                  </span>
                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">
                    Liability Waiver
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  I acknowledge that <strong>My Paws Walks</strong> is strictly a connecting venue and <strong>has no responsibility, liability, or claims against it</strong> for any pet care services, incidents, injuries, or veterinary costs. All walkers, kennels, and sitters operate as independent professionals covered by their own insurance, and pet owners are responsible for emergency RCVS veterinary costs.
                </p>
              </div>
            </label>
          </div>

          {/* Digital Signature Pad */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-emerald-700" />
                <span>Legally Binding Electronic Signature</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Electronic Communications Act 2000
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your full legal name as your electronic signature..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-300 font-serif italic text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              />
              <span className="absolute right-3 top-3.5 text-xs text-emerald-700 font-bold">
                ✓ Valid E-Sign
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 pt-1">
              <span>Timestamp: <strong>Today, {new Date().toLocaleTimeString()} BST</strong></span>
              <span>IP Verification: <strong>82.165.197.42 (London, UK)</strong></span>
              <span>Signed on: <strong>My Paws Walks Portal</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Binding agreement under England & Wales jurisdiction</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setPolicyModalOpen(false)}
              className="w-1/2 sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSign}
              disabled={!isComplete}
              className={`w-1/2 sm:w-auto px-6 py-2.5 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 ${
                isComplete
                  ? 'bg-[#0f5132] hover:bg-[#0c3e29] text-white cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Agree & Sign Policies</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
