import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Share2,
  X,
  Copy,
  Check,
  Clock,
  Activity,
  ShieldCheck,
  CalendarCheck,
  Smartphone,
} from 'lucide-react';
import { Logo } from './Logo';

export const ShareWalkModal: React.FC = () => {
  const { shareModalOpen, setShareModalOpen, shareData, showToast } = useMarketplace();
  const [copied, setCopied] = useState(false);

  if (!shareModalOpen || !shareData) return null;

  const shareType = shareData.type || 'walk';
  const shareUrl =
    shareData.url ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://mypawswalks.co.uk');

  const shareText =
    shareData.customText ||
    `🐾 Just finished an awesome walk with ${(shareData.dogNames || ['Buster']).join(' & ')} on My Paws Walks! Tracked ${shareData.distanceKm || 3.4} km in ${shareData.durationMinutes || 60} minutes. Check it out on My Paws Walks: ${shareUrl}`;

  const handleNativeWebShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareText,
          url: shareUrl,
        });
        showToast('Shared via native Web Share API!', 'success');
        setShareModalOpen(false);
        return;
      } catch (err: any) {
        if (err && err.name === 'AbortError') return;
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    showToast('Verified share card & link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const modalHeading =
    shareType === 'profile'
      ? 'Share Verified Profile'
      : shareType === 'booking'
        ? 'Share Confirmed Booking'
        : 'Share Live Walk Adventure';

  const badgeLabel =
    shareData.badge ||
    (shareType === 'profile'
      ? 'DBS & Vet Verified Profile'
      : shareType === 'booking'
        ? 'Escrow Confirmed Booking'
        : 'Verified GPS Walk');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0f5132] to-[#0c3e29] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Share2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">{modalHeading}</h3>
              <p className="text-xs text-emerald-200">
                Web Share API & Social Media Distribution
              </p>
            </div>
          </div>

          <button
            onClick={() => setShareModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Preview Card */}
        <div className="p-6 space-y-5">
          <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 rounded-2xl border border-emerald-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Logo variant="compact" />
              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>{badgeLabel}</span>
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm">{shareData.title}</h4>
              {shareData.subtitle && (
                <p className="text-xs font-semibold text-emerald-800">{shareData.subtitle}</p>
              )}
              <p className="text-xs text-slate-600 leading-relaxed pt-1">{shareText}</p>
            </div>

            {(shareData.distanceKm || shareData.durationMinutes) && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100 text-xs">
                {shareData.distanceKm !== undefined && (
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Activity className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{shareData.distanceKm} km</span>
                  </div>
                )}
                {shareData.durationMinutes !== undefined && (
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{shareData.durationMinutes} mins</span>
                  </div>
                )}
              </div>
            )}

            {shareType === 'booking' && (
              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900 font-bold">
                <span className="flex items-center gap-1">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>£5M Insured & Escrow Protected</span>
                </span>
              </div>
            )}
          </div>

          {/* Native Web Share API Trigger Button */}
          <button
            type="button"
            onClick={handleNativeWebShare}
            className="w-full py-3 px-4 rounded-2xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>Share via Device Native Share Sheet (Web Share API)</span>
          </button>

          {/* Direct Social Media Platform Targets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Or Share Directly to Social Media
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-base">💬</span>
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  handleCopyLink();
                  showToast('Verified caption copied! Paste into Instagram Story or Post.');
                }}
                className="p-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-base">📸</span>
                <span>Instagram</span>
              </button>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-base">🐦</span>
                <span>X / Twitter</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-base">📘</span>
                <span>Facebook</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer col-span-2"
              >
                <span className="text-base">💼</span>
                <span>Share Professional Credentials on LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Copy Link Button */}
          <div className="pt-1">
            <button
              onClick={handleCopyLink}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                copied
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copy Verified Share Link & Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
