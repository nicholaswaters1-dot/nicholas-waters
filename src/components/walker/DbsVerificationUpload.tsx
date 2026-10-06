import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { VerificationDocument } from '../../types';
import {
  UploadCloud,
  ShieldCheck,
  FileCheck,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  BookOpen,
  Award,
  Check,
  Scale,
  HeartPulse,
  GraduationCap,
} from 'lucide-react';

const VERIFIED_WALKER_REQUIREMENTS = [
  {
    step: '01',
    title: 'UK Government DBS Criminal Record Check',
    authority: 'Disclosure & Barring Service (GOV.UK)',
    mandatory: true,
    summary:
      'Required because professional dog walkers and home sitters hold keys and alarm codes to client homes. Must be renewed or checked via the DBS Update Service every 12 months.',
    requirements: [
      'Clean criminal background check certificate issued within the last 12 months',
      'Matching biometric Passport or UK Driving Licence photo ID',
      'Proof of current UK residential address (utility bill or council tax statement)',
    ],
    officialUrl: 'https://www.gov.uk/request-copy-criminal-record',
    linkLabel: 'Apply on GOV.UK DBS Portal',
    icon: ShieldCheck,
  },
  {
    step: '02',
    title: 'Canine First Aid & Emergency CPR (Level 2 VTQ)',
    authority: 'Ofqual / PDSA / ProTrainings UK',
    mandatory: true,
    summary:
      'Practical and theoretical training in field stabilization: heatstroke cooling protocols, GDV (gastric torsion/bloat) recognition, choking, adder bites, and arterial paw bandaging.',
    requirements: [
      'Valid 1-day practical or accredited VTQ Level 2 Canine First Aid certificate',
      'Must carry a stocked Canine First Aid Kit + portable water bowl on every walk',
      'Refresher certification required every 3 years',
    ],
    officialUrl: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/all-pets/pet-first-aid',
    linkLabel: 'PDSA Canine First Aid Guide & Courses',
    icon: HeartPulse,
  },
  {
    step: '03',
    title: 'Commercial Public Liability & Keyholder Insurance (£5M)',
    authority: 'ABI Specialist Pet Business Insurers',
    mandatory: true,
    summary:
      'Standard household insurance does not cover commercial dog walking or boarding. Walkers must hold specialist Care, Custody & Control (CCC) and Loss of Keys cover.',
    requirements: [
      'Minimum £2,000,000 to £5,000,000 Public Liability Indemnity',
      'Care, Custody & Control (veterinary injury cover for dogs in your charge)',
      'Keyholder & Lock Replacement cover up to £10,000',
    ],
    officialUrl: 'https://www.gov.uk/guidance/animal-welfare-legislation-protecting-pets',
    linkLabel: 'View UK Pet Business Insurance Standards',
    icon: Scale,
  },
  {
    step: '04',
    title: 'Local Council Pack Limit & DEFRA Animal Welfare Compliance',
    authority: 'Animal Welfare Act 2006 & Local Borough Councils',
    mandatory: true,
    summary:
      'Compliance with the Animal Welfare Act 2006, Control of Dogs Order 1992 (collar ID tags), and local council Public Spaces Protection Orders (maximum 4 dogs per handler).',
    requirements: [
      'Strict adherence to the 4-Dog Maximum Pack Cap in public parks and heaths',
      'DEFRA Higher Standard 5-Star Licence if offering overnight home boarding or day care',
      'Ventilated, crash-tested crated vehicle transport under the Highway Code (Rule 57)',
    ],
    officialUrl: 'https://www.legislation.gov.uk/ukpga/2006/45/contents',
    linkLabel: 'Read Animal Welfare Act 2006 Legislation',
    icon: BookOpen,
  },
  {
    step: '05',
    title: 'Force-Free Canine Behavior & Recall Accreditation',
    authority: 'IMDT / APDT UK Positive Reinforcement Charter',
    mandatory: false,
    summary:
      'My Paws Walks is a strictly force-free platform. Prong collars, e-collars (shock collars), and choke chains are banned. Walkers are trained in positive reinforcement and calming signals.',
    requirements: [
      'Completion of My Paws Walks Pack Dynamics & Recall Safety Module',
      'Optional IMDT (Institute of Modern Dog Trainers) or APDT accreditation badge',
      'Signed Force-Free Handling Pledge',
    ],
    officialUrl: 'https://www.imdt.uk.com',
    linkLabel: 'Explore IMDT Dog Trainer & Walker Courses',
    icon: GraduationCap,
  },
];

export const DbsVerificationUpload: React.FC = () => {
  const { verifications, submitVerificationDoc, showToast } = useMarketplace();

  const [activeView, setActiveView] = useState<'guide' | 'upload'>('guide');
  const [docType, setDocType] = useState<VerificationDocument['documentType']>('Enhanced DBS Check');
  const [docNumber, setDocNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-10-01');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>(['01', '02', '03', '04']);

  const toggleStepComplete = (step: string) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  const handleSimulateSelectFile = () => {
    setFileName(`scan_${docType.toLowerCase().replace(/\s+/g, '_')}_2026.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) {
      showToast('Please enter the document reference number.', 'warning');
      return;
    }
    if (!fileName) {
      showToast('Please choose or upload a document file.', 'warning');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      submitVerificationDoc({
        documentType: docType,
        documentNumber: docNumber,
        expiryDate: expiryDate,
      });
      setDocNumber('');
      setFileName(null);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0f5132] to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Official UK Walker & Pet Sitter Accreditation Pathway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How to Become a Verified Dog Walker & Upload Credentials
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Review the statutory UK regulations, mandatory training courses, and official government links required to unlock your Gold Verified Badge on My Paws Walks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/15 shrink-0 self-start">
            <button
              onClick={() => setActiveView('guide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'guide'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              1. Regulations & Training Guide
            </button>
            <button
              onClick={() => setActiveView('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'upload'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              2. Upload Certificates ({verifications.length})
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: HOW TO BECOME A VERIFIED DOG WALKER — REGULATIONS, TRAINING & LINKS */}
      {activeView === 'guide' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                5-Step Verification Checklist & Statutory UK Requirements
              </h2>
              <p className="text-xs text-slate-500">
                Complete each regulatory requirement below using the official links, then upload your certificates for 24-hour admin approval.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">
                  {completedSteps.length} of {VERIFIED_WALKER_REQUIREMENTS.length} Completed
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {completedSteps.length >= 4 ? '✓ Ready for Gold Badge' : 'In Progress'}
                </div>
              </div>
              <button
                onClick={() => setActiveView('upload')}
                className="px-4 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Upload My Documents →
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {VERIFIED_WALKER_REQUIREMENTS.map((item) => {
              const IconComp = item.icon;
              const isDone = completedSteps.includes(item.step);
              return (
                <div
                  key={item.step}
                  className={`bg-white rounded-3xl border p-6 transition-all shadow-2xs ${
                    isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex items-start gap-4 max-w-3xl">
                      <div className="w-12 h-12 rounded-2xl bg-[#0f5132] text-white flex flex-col items-center justify-center shrink-0 font-black">
                        <span className="text-[9px] text-emerald-300 uppercase">Step</span>
                        <span className="text-sm">{item.step}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{item.title}</h3>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {item.authority}
                          </span>
                          {item.mandatory && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                              Mandatory
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>

                        <div className="pt-2 space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-800">What you need to provide:</div>
                          <ul className="space-y-1">
                            {item.requirements.map((req, i) => (
                              <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <IconComp className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{item.linkLabel}</span>
                        <ExternalLink className="w-3 h-3 text-emerald-700" />
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStepComplete(item.step)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                            isDone
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isDone ? 'Requirement Met ✓' : 'Mark Completed'}</span>
                        </button>

                        <button
                          onClick={() => setActiveView('upload')}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                        >
                          Upload Proof
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: UPLOAD VERIFICATION CERTIFICATES */}
      {activeView === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span>Submit Official Verification Document</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as VerificationDocument['documentType'])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Enhanced DBS Check">Enhanced DBS Check (Annual Disclosure)</option>
                  <option value="Government ID">Government Biometric Photo ID (Passport/License)</option>
                  <option value="Public Liability Insurance">Public Liability Insurance (£2M–£5M Coverage)</option>
                  <option value="Pet First Aid Certification">Canine First Aid & CPR Level 2</option>
                  <option value="Local Council License">Local Borough Commercial Dog Walking License</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Document / Reference Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DBS-002849182"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Valid Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Drag & Drop Simulation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Scanned Certificate File (PDF, PNG, JPG)</label>
                <div
                  onClick={handleSimulateSelectFile}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                    fileName
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50 text-slate-500'
                  }`}
                >
                  {fileName ? (
                    <div className="flex items-center justify-center gap-2 font-semibold">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                      <span>{fileName}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="font-semibold text-slate-700">Click to select certificate scan</p>
                      <p className="text-[11px] text-slate-400">Encrypted 256-bit compliance vault upload</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                {isUploading ? 'Encrypting & Uploading...' : 'Submit to Admin Compliance Queue'}
              </button>
            </form>
          </div>

          {/* Submitted Documents Status (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Your Uploaded Compliance Vault ({verifications.length})</span>
            </h3>

            <div className="space-y-3">
              {verifications.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{doc.documentType}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Ref: {doc.documentNumber} · Exp: {doc.expiryDate}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                      doc.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {doc.status === 'Approved' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span>{doc.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
