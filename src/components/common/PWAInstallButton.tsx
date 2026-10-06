import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'pill';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showPlayStoreGuide, setShowPlayStoreGuide] = useState(false);

  // If already running as an installed PWA / standalone, suppress prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'pill') {
      return (
        <button
          onClick={install}
          className={`flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border border-emerald-500/30 transition-all shadow-xs ${className}`}
        title="Install My Paws Walks directly to your Home Screen"
      >
        <Download className="w-3.5 h-3.5 text-emerald-300" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 text-emerald-200 hover:bg-emerald-900/40 text-xs font-semibold transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold">
                    🐾
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Install Paws Walks</h3>
                    <p className="text-[11px] text-slate-500">Fast home screen access & offline use</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-500 mx-0.5" /> in the Safari toolbar at the bottom of your screen.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Scroll down and select <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-600 mx-0.5" />.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Tap <strong>Add</strong> in the top-right corner to finish installing!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 bg-[#0f5132] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#0c3e29]"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback Play Store / Android / Desktop button
  return (
    <>
      <button
        onClick={() => setShowPlayStoreGuide(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 rounded-xl text-emerald-200 text-xs font-semibold transition ${className}`}
        title="Google Play Store / PWA info"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Play Store / App</span>
        <span className="sm:hidden">App</span>
      </button>

      {showPlayStoreGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold text-lg">
                  🐾
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Google Play Store & PWA Ready</h3>
                  <p className="text-xs text-slate-500">My Paws Walks meets 100% Android TWA Standards</p>
                </div>
              </div>
              <button
                onClick={() => setShowPlayStoreGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Web App Manifest configured with 512x512 maskable icons</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Offline Service Worker enabled with background caching</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Standalone full-screen display & biometric/payment readiness</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready for Google Play Store packaging via Bubblewrap / Digital Asset Links</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>You can also install this app immediately on your Android phone by opening the Chrome menu (⋮) and selecting <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
            </div>

            <button
              onClick={() => setShowPlayStoreGuide(false)}
              className="w-full py-2.5 bg-[#0f5132] text-white font-bold text-xs rounded-xl hover:bg-[#0c3e29]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
