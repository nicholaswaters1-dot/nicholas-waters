import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Heart,
  ShieldCheck,
  MapPin,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  X,
  Compass,
  Radio,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { ASSET_PATHS } from '../../data/initialData';

export const AboutUsModal: React.FC = () => {
  const { aboutModalOpen, setAboutModalOpen, setPersona, setOwnerTab } = useMarketplace();

  if (!aboutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Hero */}
        <div className="relative bg-[#0f5132] text-white p-6 sm:p-8 shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Our Story & Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                About My Paws Walks
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
                Setting a new gold standard for safety, verified care, and community in British dog walking.
              </p>
            </div>

            <button
              onClick={() => setAboutModalOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Logo Spotlight */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="shrink-0 p-3 bg-white rounded-2xl shadow-xs border border-emerald-100">
              <Logo variant="compact" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Trusted Pet Care, Right Near You
              </h4>
              <p className="text-xs text-slate-600">
                Our green heart and local pin emblem symbolize compassionate, vetted care rooted directly in your local neighborhood. From London parks to Welsh valleys, we connect dogs with passionate, vetted companions.
              </p>
            </div>
          </div>

          {/* Founding Narrative */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Why We Founded My Paws Walks</h3>
            <p>
              Like many dog parents across the UK, we found hiring a dog walker to be fraught with uncertainty. Classified boards and unregulated forums offered zero background checks, unclear pack safety limits, and no real-time reassurance while you were at work.
            </p>
            <p>
              We built <strong>My Paws Walks</strong> to change that forever. We set out to create a trust-first platform where every single walker is independently vetted with an <strong>Enhanced DBS criminal background check</strong>, holds <strong>£5,000,000 Public Liability Insurance</strong>, and carries <strong>Canine First Aid & CPR certification</strong>.
            </p>
          </div>

          {/* The 4 Core Platform Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0f5132] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Rigorous 5-Point Vetting</h4>
              <p className="text-xs text-slate-600">
                Enhanced DBS criminal records, photo ID, residential address confirmation, £5M insurance, and dog pack temperament assessments.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0f5132] flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Live GPS Telemetry & Photos</h4>
              <p className="text-xs text-slate-600">
                Watch your dog’s live trail, potty updates, and photo drops in real-time. Full peace of mind from pickup to towel-dry dropoff.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0f5132] flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Fair Pay for Walkers</h4>
              <p className="text-xs text-slate-600">
                We champion independent pet carers with the lowest commission take-rate in Britain, letting walkers set custom pricing and subscription packages.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0f5132] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Local Pet Ecosystem</h4>
              <p className="text-xs text-slate-600">
                Connecting dog parents directly with vetted local veterinary clinics, independent groomers, hydrotherapists, and natural pet bakeries.
              </p>
            </div>
          </div>


          {/* Independent Marketplace & Non-Liability Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">Independent Marketplace Notice</div>
            <p>
              My Paws Walks is an introductory digital platform connecting pet owners with independent walkers, kennels, and sitters. All pet care professionals operate as independent businesses carrying their own public liability insurance. My Paws Walks accepts no responsibility, liability, or claims for third-party services.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            My Paws Walks · Operated in England & Wales
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAboutModalOpen(false);
                setPersona('owner');
                setOwnerTab('discover');
              }}
              className="px-5 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Explore Verified Walkers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
