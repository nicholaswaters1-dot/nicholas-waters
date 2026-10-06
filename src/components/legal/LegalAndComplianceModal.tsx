import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  ShieldCheck,
  FileText,
  Lock,
  Receipt,
  Scale,
  X,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { Logo } from '../common/Logo';

export const LegalAndComplianceModal: React.FC = () => {
  const { legalModalOpen, setLegalModalOpen, showToast } = useMarketplace();
  const [activeDoc, setActiveDoc] = useState<'terms' | 'gdpr' | 'refunds' | 'dbs' | 'advertising'>('terms');

  if (!legalModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (docName: string) => {
    showToast(`Downloading official UK compliance package: ${docName}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#0f5132] text-white flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Scale className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">UK Legal Policies & Compliance Portal</h3>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  UK Law Compliant
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Operated under UK Animal Welfare Act 2006 & Data Protection Act 2018 (UK GDPR)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print document"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLegalModalOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Wraps cleanly inside modal screen) */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5 text-xs font-semibold shrink-0 max-w-full">
          <button
            onClick={() => setActiveDoc('terms')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeDoc === 'terms'
                ? 'bg-[#0f5132] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>Terms of Service & Walking Agreement</span>
          </button>

          <button
            onClick={() => setActiveDoc('gdpr')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeDoc === 'gdpr'
                ? 'bg-[#0f5132] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>UK GDPR & Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveDoc('refunds')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeDoc === 'refunds'
                ? 'bg-[#0f5132] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 shrink-0" />
            <span>Payments, Escrow & Refund Policy</span>
          </button>

          <button
            onClick={() => setActiveDoc('dbs')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeDoc === 'dbs'
                ? 'bg-[#0f5132] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>DBS & Safety Vetting Standard</span>
          </button>

          <button
            onClick={() => setActiveDoc('advertising')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeDoc === 'advertising'
                ? 'bg-[#0f5132] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Local Advertiser Guidelines</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {activeDoc === 'terms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    My Paws Walks - Master Service Agreement & Dog Walking Terms
                  </h4>
                  <p className="text-xs text-slate-500">Effective Date: 1 January 2026 · Version 3.4 (UK Jurisdiction)</p>
                </div>
                <button
                  onClick={() => handleDownload('Master_Terms_Of_Service')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Prominent Platform Non-Liability & No Claims Notice */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Important Legal Notice: No Platform Responsibility, Liability or Claims Against My Paws Walks</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong>My Paws Walks</strong> operates strictly as an independent introductory technology marketplace connecting dog owners with independent third-party pet professionals (dog walkers, kennels, boarders, and sitters). <strong>My Paws Walks accepts no responsibility, legal liability, or financial claims of any kind</strong> arising from any walk, boarding stay, sitting session, animal behavior, injury, loss, property damage, or dispute. All service contracts and duties of care exist solely and directly between the pet owner and the independent pet professional, who is required to maintain their own independent Public Liability Insurance.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">1. Statutory Animal Welfare & Five Freedoms Compliance</h5>
                <p>
                  All walkers, kennel hosts, sitters, and pet parents registered on <strong>My Paws Walks</strong> agree to strictly uphold the statutory duties of care outlined in <strong>Section 9 of the Animal Welfare Act 2006</strong>. Independent professionals are solely responsible for ensuring the dog’s need for a suitable environment, suitable diet, ability to exhibit normal behavior patterns, suitable housing with or apart from other animals, and protection from pain, suffering, injury, and disease.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">2. Collar Identification & Microchip Mandate</h5>
                <p>
                  In compliance with the <strong>Control of Dogs Order 1992</strong> and <strong>Microchipping of Dogs (England) Regulations 2015</strong> (and equivalent Welsh regulations), all dogs attending walks must be fitted with a secure collar bearing an identification tag displaying the owner’s surname and telephone number/address, and possess an active, registered microchip recorded on their My Paws Walks digital care profile.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">3. Key Holding, Access & Independent Professional Insurance</h5>
                <p>
                  Where a pet parent entrusts property keys or access codes to a walker or sitter, keys shall remain unlabelled with any property address or identifying particulars. Independent professionals on My Paws Walks are required to hold their own verified <strong>£5,000,000 Public Liability Insurance with Key-Holder Custody & Care extensions</strong>. My Paws Walks is not a party to key-holding arrangements and accepts no claims for property access or security.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">4. Emergency Veterinary Medical Authorisation</h5>
                <p>
                  By completing a booking on My Paws Walks, the pet owner grants the appointed independent walker, kennel, or sitter authority to transport the animal to the designated veterinary clinic (or the nearest Royal College of Veterinary Surgeons accredited 24hr facility) if the animal sustains acute illness or traumatic injury during the booking. The pet owner is solely responsible for all veterinary and clinical costs incurred, and no veterinary or medical claims may be made against the My Paws Walks app.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">5. Limitation of Liability, Indemnification & Waiver of Claims</h5>
                <p>
                  To the fullest extent permitted under the laws of England and Wales, users expressly agree that <strong>My Paws Walks has zero liability, responsibility, or obligation for any claims, damages, losses, injuries, veterinary bills, or disputes</strong> between dog owners, walkers, kennels, sitters, or third parties. Users agree to hold harmless and indemnify the platform from any claims arising out of or related to use of the app or any booked pet care services.
                </p>
              </div>
            </div>
          )}

          {activeDoc === 'gdpr' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    UK GDPR & Data Protection Privacy Notice
                  </h4>
                  <p className="text-xs text-slate-500">In Accordance with the Data Protection Act 2018 & ICO Guidelines</p>
                </div>
                <button
                  onClick={() => handleDownload('UK_GDPR_Privacy_Notice')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">1. Data Controller Identification</h5>
                <p>
                  The data controller is <strong>My Paws Walks</strong>, operating in accordance with the UK Data Protection Act 2018 and UK GDPR guidelines. You can contact our Data Protection Desk at <em>privacy@mypawswalks.co.uk</em>.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">2. Lawful Bases for Processing</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Contractual Necessity (Article 6(1)(b)):</strong> To execute booking fulfillment, live GPS telemetry tracking, walker verification audits, and escrow payment disbursements.</li>
                  <li><strong>Legal Obligation (Article 6(1)(c)):</strong> To verify DBS criminal check compliance, right to work in the UK, HMRC tax compliance, and commercial dog walking permits.</li>
                  <li><strong>Vital Interests (Article 6(1)(d)):</strong> To transmit urgent medical and pet microchip records to veterinary surgeons during acute incidents.</li>
                </ul>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">3. Live GPS Location Data & Photo Telemetry</h5>
                <p>
                  During an active walk, real-time GPS breadcrumb coordinates are streamed securely to pet parents for reassurance and safety verification. Walkers upload photographic drops of the dogs. GPS logs are archived for 90 days for safety review, after which they are permanently obfuscated or deleted.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">4. Your Statutory Rights</h5>
                <p>
                  Under UK GDPR, you have the right to access your personal data, rectify inaccurate records, request erasure ("Right to be Forgotten"), restrict processing, and lodge a complaint directly with the <strong>Information Commissioner’s Office (ICO)</strong> at <em>ico.org.uk</em>.
                </p>
              </div>
            </div>
          )}

          {activeDoc === 'refunds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Payment Processing, Escrow Protection & Refund Policy
                  </h4>
                  <p className="text-xs text-slate-500">Regulated Escrow Safeguards & Payout Cadences</p>
                </div>
                <button
                  onClick={() => handleDownload('Refund_And_Escrow_Policy')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">1. Secure Escrow Mechanism</h5>
                <p>
                  When a pet owner books an appointment or sets up a recurring subscription, payment is collected via encrypted Stripe processing and held in an <strong>authorised ring-fenced escrow account</strong>. Funds are NOT released to the walker until the walk has been verified as completed via GPS drop-off confirmation or 24 hours post-session without unresolved dispute.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">2. Cancellation Windows & Full Refunds</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Notice greater than 24 hours:</strong> 100% full refund returned automatically to original payment card with zero cancellation fees.</li>
                  <li><strong>Notice between 12 and 24 hours:</strong> 50% refund returned, with remaining 50% paid to walker for reserved slot compensation.</li>
                  <li><strong>Notice under 12 hours / Walker En Route:</strong> Non-refundable except under force majeure or certified medical/veterinary emergency.</li>
                </ul>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">3. UK Severe Weather & Heatwave Safeguard</h5>
                <p>
                  Under British veterinary advisory codes, when ambient temperature reaches <strong>24°C or above</strong> (or during Met Office Red/Amber weather warnings), walkers are permitted and encouraged to replace active vigorous park runs with shaded garden decompression, paw-safe sniffaris, or indoor enrichment sessions at no financial penalty to the owner.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">4. Recurring Subscriptions & 1-Month Cancellation Notice</h5>
                <p>
                  All professional membership plans (PRO at £6.99/month or £69.99/year; Elite Package at £14.99/month or £149.99/year) and recurring client walk subscriptions automatically renew on a recurring basis. Users may cancel their subscription at any time inside the app, subject to a mandatory <strong>1-month (30-day) cancellation notice period</strong>. Full plan benefits and scheduled services remain active throughout the 1-month notice period, after which no further recurring charges will be made. Dog owners do not pay any platform subscription fee (£0/FREE).
                </p>
              </div>
            </div>
          )}

          {activeDoc === 'dbs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    DBS Verification & Independent Handler Safeguarding Protocol
                  </h4>
                  <p className="text-xs text-slate-500">Industry-Leading Trust & Vetting Framework</p>
                </div>
                <button
                  onClick={() => handleDownload('DBS_Verification_Framework')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">1. Mandatory Enhanced DBS Criminal Record Audit</h5>
                <p>
                  No dog walker profile may become active on My Paws Walks without submitting a verified <strong>Enhanced Disclosure and Barring Service (DBS) Certificate</strong> issued within the prior 12 months or enrolled in the continuous DBS Update Service. The audit checks for any unspent convictions relating to animal cruelty, property theft, violence, or fraud.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">2. Local Authority Council Licensing Limits</h5>
                <p>
                  Under commercial dog walking bylaws established by councils across London and the UK (e.g. Royal Parks, Hampstead Heath, City of London Corporation), handlers are legally capped at a <strong>maximum of 4 to 6 dogs per pack</strong> depending on borough licenses. My Paws Walks strictly enforces digital pack caps to prevent unlawful overload.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">3. Canine First Aid & CPR Certification</h5>
                <p>
                  All walkers carrying the First Aid badge must hold verifiable certification from an accredited body (e.g. British College of Canine Studies, Pet First Aid UK) covering canine resuscitation, shock treatment, gastric torsion triage, and thermal regulation.
                </p>
              </div>
            </div>
          )}

          {activeDoc === 'advertising' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Local Business Directory & Advertising Standards
                  </h4>
                  <p className="text-xs text-slate-500">Veterinary & Grooming Partner Vetting Code</p>
                </div>
                <button
                  onClick={() => handleDownload('Advertiser_Code_Of_Practice')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">1. Advertising Standards Authority (ASA) & CAP Code Alignment</h5>
                <p>
                  All business advertisements displayed on My Paws Walks must comply with the <strong>UK Code of Non-broadcast Advertising and Direct & Promotional Marketing (CAP Code)</strong>. Promotional offers (e.g. discounts, free nail trims) must be genuine, verifiable, and clearly stated with any relevant terms.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">2. Vetting of Veterinary & Clinical Advertisers</h5>
                <p>
                  Veterinary hospitals and clinics advertising on the platform must be registered with the <strong>Royal College of Veterinary Surgeons (RCVS)</strong>. Canine hydrotherapists must hold current membership in the <strong>Canine Hydrotherapy Association (CHA)</strong> or NARCH.
                </p>

                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">3. Postcode Zoning & Transparent Sponsorship</h5>
                <p>
                  Advertisements are strictly served based on local geographic relevance by outward postcode (e.g. NW3, TW9, CF10). Every advertisement is clearly badged with a "Featured Local Partner" badge so consumers distinguish organic walker listings from paid advertiser sponsorships.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Updated regularly in consultation with UK canine legal specialists</span>
          </div>

          <button
            onClick={() => {
              showToast('Acknowledged UK Legal & Compliance Policies.');
              setLegalModalOpen(false);
            }}
            className="px-6 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl shadow-xs transition-colors w-full sm:w-auto"
          >
            I Acknowledge & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
