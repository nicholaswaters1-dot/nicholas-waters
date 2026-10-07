import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Sparkles, Phone, ExternalLink, MapPin, Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface SponsoredAdBannerProps {
  postcodeArea?: string;
  category?: string;
  className?: string;
}

export const SponsoredAdBanner: React.FC<SponsoredAdBannerProps> = ({
  postcodeArea,
  category,
  className = '',
}) => {
  const { localBusinesses, setPersona, setOwnerTab, setAdvertiseModalOpen } = useMarketplace();

  // Find matching sponsored partner
  const matchingAd = localBusinesses.find((b) => {
    const matchPostcode = !postcodeArea || postcodeArea === 'All' || b.postcodeArea === postcodeArea;
    const matchCat = !category || b.category.includes(category);
    return matchPostcode && matchCat && b.status === 'Active';
  }) || localBusinesses[0];

  if (!matchingAd) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 p-4 sm:p-5 shadow-xs transition-all hover:border-emerald-300 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#0f5132] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            {matchingAd.category === 'Grooming & Spa' && '✂️'}
            {matchingAd.category === 'Veterinary Hospital' && '🏥'}
            {matchingAd.category === 'Pet Boutique & Food' && '🦴'}
            {matchingAd.category === 'Training & Behavior' && '🎓'}
            {matchingAd.category === 'Canine Therapy & Hydro' && '🏊'}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Featured Local Partner ({matchingAd.postcodeArea})
              </span>
              <span className="text-xs font-bold text-slate-900 truncate">
                {matchingAd.businessName}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="tabular-nums text-slate-800">{matchingAd.rating}</span>
                <span className="text-slate-400 font-normal">({matchingAd.reviewCount})</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-1 mb-1.5 font-medium">
              {matchingAd.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3 h-3 text-emerald-700" />
                {matchingAd.address}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded text-[10px]">
                {matchingAd.promoOffer}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <a
            href={`tel:${matchingAd.phone}`}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
          >
            <Phone className="w-3 h-3 text-emerald-700" />
            <span>Call</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setPersona('owner');
              setOwnerTab('directory');
              setAdvertiseModalOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Business / Advertise Sign Up (£9.99/mo)</span>
          </button>

          <button
            type="button"
            onClick={() => setOwnerTab('directory')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-lg transition-colors flex items-center gap-1 shadow-xs whitespace-nowrap cursor-pointer"
          >
            <span>View Services</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
