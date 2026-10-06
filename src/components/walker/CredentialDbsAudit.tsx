import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ASSET_PATHS } from '../../data/initialData';
import {
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  FileText,
  ExternalLink,
  QrCode,
  Star,
} from 'lucide-react';
import { StarRatingReviewsSection } from '../common/StarRatingReviewsSection';

export const CredentialDbsAudit: React.FC = () => {
  const { walkers, setWalkerTab, showToast } = useMarketplace();
  const activeWalker = walkers[0];

  const handleDownloadBadge = () => {
    showToast('Digital Verified Trust Badge downloaded for your marketing flyer.');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner with Health Score */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={ASSET_PATHS.dbsBadge}
              alt="DBS Trust Badge"
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">Walker Credential & DBS Audit</h2>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Audit Score: 100% Complete
              </span>
              {activeWalker && (
                <span className="text-xs font-extrabold text-slate-950 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>
                    {activeWalker.rating.toFixed(2)} / 5.00 ★ ({activeWalker.reviewCount} Verified Reviews)
                  </span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              All government background checks, council operating permits, and professional insurance certificates are currently active and publicly verified for pet parents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleDownloadBadge}
            className="flex-1 md:flex-none px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Badge</span>
          </button>
          <button
            onClick={() => setWalkerTab('verify-upload')}
            className="flex-1 md:flex-none px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            Upload Renewal Doc
          </button>
        </div>
      </div>

      {/* Prominent Aggregated Walker Star Rating & Verified Customer Reviews */}
      {activeWalker && (
        <StarRatingReviewsSection
          targetId={activeWalker.id}
          targetType="walker"
          targetName={activeWalker.name}
          baseRating={activeWalker.rating}
          baseReviewCount={activeWalker.reviewCount}
          compact={false}
        />
      )}

      {/* Grid of Verified Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certificate 1: Enhanced DBS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Enhanced DBS Certificate</h4>
                <span className="text-[11px] text-slate-400">Government Disclosure Service</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Valid & Clean
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Certificate Reference:</span>
              <span className="font-mono font-bold text-slate-900">DBS-00192847192</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Issue Date:</span>
              <span className="text-slate-800">14 May 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Next Scheduled Audit:</span>
              <span className="text-slate-800 font-medium">14 May 2027 (11 months left)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Barred List Check:</span>
              <span className="text-emerald-700 font-semibold">Passed & Fully Clear</span>
            </div>
          </div>
        </div>

        {/* Certificate 2: Public Liability */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Public Liability Insurance</h4>
                <span className="text-[11px] text-slate-400">Direct Line Pet Business Fleet</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              £5,000,000 Active
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Policy Number:</span>
              <span className="font-mono font-bold text-slate-900">POL-UK-84920491</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Coverage Rider:</span>
              <span className="text-slate-800">Care, Custody & Control of Animals</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Policy Expiration:</span>
              <span className="text-slate-800 font-medium">12 Jun 2027</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Keyholder Indemnity:</span>
              <span className="text-emerald-700 font-semibold">Included (£50,000 lock replacement)</span>
            </div>
          </div>
        </div>

        {/* Certificate 3: Pet First Aid & CPR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Canine First Aid & CPR Level 2</h4>
                <span className="text-[11px] text-slate-400">RCVS / CPD Accredited</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Certified
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Accreditation ID:</span>
              <span className="font-mono font-bold text-slate-900">CPD-CANINE-48192</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Skills Covered:</span>
              <span className="text-slate-800">Canine CPR, choking, heat stroke triage, bandaging</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Renewal Window:</span>
              <span className="text-slate-800">Valid until Nov 2027</span>
            </div>
          </div>
        </div>

        {/* Certificate 4: Council License */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Council Commercial Walker License</h4>
                <span className="text-[11px] text-slate-400">London Borough of Camden</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Licensed
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">License ID:</span>
              <span className="font-mono font-bold text-slate-900">CAM-DOG-2026-081</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Maximum Ratio:</span>
              <span className="text-slate-800 font-semibold">Strict 4 Dogs Maximum</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Approved Green Spaces:</span>
              <span className="text-slate-800">Hampstead Heath, Regent’s Park, Primrose Hill</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shareable QR Client Card */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 border border-emerald-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <span>Digital Client Trust Passport</span>
          </h3>
          <p className="text-xs text-emerald-200 leading-relaxed">
            Pet parents can scan your digital passport to instantly verify your Enhanced DBS record, policy number, and council license before handing over their house keys.
          </p>
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText('https://mypawswalks.co.uk/verify/sarah-jenkins');
            showToast('Digital verification link copied to clipboard.');
          }}
          className="px-5 py-2.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          Copy Client Verification Link
        </button>
      </div>

      {/* HOW TO BECOME A VERIFIED DOG WALKER: UK REGULATIONS, TRAINING & OFFICIAL LINKS */}
      <div className="bg-white rounded-3xl border-2 border-emerald-600/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official UK Compliance & Onboarding Roadmap</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              How to Become a Verified Dog Walker (Regulations & Required Training)
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl">
              Complete guide to UK statutory regulations, mandatory criminal record screening, canine first aid accreditation, and council permits required to earn the My Paws Walks Verified Badge.
            </p>
          </div>
          <button
            onClick={() => setWalkerTab('verify-upload')}
            className="px-4 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start md:self-auto shrink-0"
          >
            Submit Verification Docs →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Step 1: Enhanced DBS */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-900 text-white font-black text-[10px]">
                  STEP 1 · MANDATORY
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">Cost: ~£18–£38</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                1. UK Government Basic / Enhanced DBS Check
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Because dog walkers hold keys to client homes, you must complete an official Disclosure and Barring Service (DBS) criminal record check (or Disclosure Scotland / AccessNI).
              </p>
            </div>
            <a
              href="https://www.gov.uk/request-copy-criminal-record"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-slate-200 transition-colors"
            >
              <span>Apply on GOV.UK DBS Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            </a>
          </div>

          {/* Step 2: Canine First Aid & CPR Training */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-900 text-white font-black text-[10px]">
                  STEP 2 · TRAINING
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">CPD / Ofqual Level 2/3</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                2. Accredited Canine First Aid & CPR Course
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Complete a VET/CPD-approved Canine First Aid & Emergency Triage course covering canine resuscitation, heatstroke, GDV bloat, paw lacerations, and adder bites.
              </p>
            </div>
            <div className="space-y-1.5">
              <a
                href="https://www.protrainings.uk/courses/213-pet-first-aid"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-slate-200 transition-colors"
              >
                <span>ProTrainings UK Pet First Aid</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              </a>
              <a
                href="https://www.britishredcross.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-[11px]"
              >
                <span>iPET Network Level 3 Canine First Aid</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Step 3: £5M Public Liability & Keyholder Insurance */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-900 text-white font-black text-[10px]">
                  STEP 3 · INSURANCE
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">Min £5,000,000 Cover</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                3. Pet Business Public Liability & Key Insurance
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Must include Care, Custody & Control of Animals (vet fees during walks), Public Liability (min £5M), and Loss of Client Keys / Lock Replacement cover.
              </p>
            </div>
            <div className="space-y-1.5">
              <a
                href="https://www.petbusinessinsurance.co.uk/dog-walking-insurance/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-slate-200 transition-colors"
              >
                <span>Pet Business Insurance (PBI UK)</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              </a>
              <a
                href="https://www.cliverton.co.uk/animal-related-insurance/dog-walkers-pet-sitters/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-[11px]"
              >
                <span>Cliverton Specialist Dog Walker Cover</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Step 4: UK Animal Welfare Regulations & Council Permits */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">
                  STEP 4 · UK LAW
                </span>
                <span className="text-[11px] font-semibold text-slate-600">Max 4 Dogs Rule</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                4. Animal Welfare Act 2006 & Council Park Permits
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Comply with the Animal Welfare Act 2006, Control of Dogs Order 1992 (collar ID tag law), Royal Parks / Local Council commercial walking permits, and strict 4-dog maximum group ratios.
              </p>
            </div>
            <a
              href="https://www.gov.uk/guidance/animal-welfare-legislation-protecting-pets"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-slate-200 transition-colors"
            >
              <span>Read DEFRA & GOV.UK Pet Legislation</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            </a>
          </div>

          {/* Step 5: Canine Body Language & Pack Management Diploma */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[10px]">
                  STEP 5 · ACADEMY
                </span>
                <span className="text-[11px] font-semibold text-blue-700">Force-Free Charter</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                5. Canine Body Language & Professional Standards
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Learn positive reinforcement recall, dog-to-dog greeting decompression, safe crated air-conditioned vehicle transit, and PIF / NARPSUK professional codes of practice.
              </p>
            </div>
            <a
              href="https://www.narpsuk.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-slate-200 transition-colors"
            >
              <span>NARPSUK & Pet Industry Federation</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            </a>
          </div>

          {/* Step 6: Day Boarding & Home Sitting DEFRA Licence */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#0f5132] text-white font-black text-[10px]">
                  BOARDING & SITTING
                </span>
                <span className="text-[11px] font-semibold text-emerald-800">LAIA Regs 2018</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                6. Home Boarding & Day Care Council Licence
              </h4>
              <p className="text-slate-600 leading-relaxed">
                If you also offer home dog sitting, day care, or overnight kennel boarding, you require a Local Authority Animal Activity Licence under the 2018 DEFRA Regulations.
              </p>
            </div>
            <a
              href="https://www.gov.uk/guidance/animal-activities-licensing-guidance-for-local-authorities"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-100 text-emerald-950 font-bold rounded-xl border border-emerald-300 transition-colors"
            >
              <span>DEFRA Boarding Licensing Guidance</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
