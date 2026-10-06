import React, { useState, useEffect } from 'react';
import { WifiOff, Download, CheckCircle2, X, Sparkles, Smartphone } from 'lucide-react';

export const OfflineConnectivityBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setInstalledSuccess(true);
      setShowInstallBanner(false);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      // If native prompt not available, show instructions
      alert('To install on Android: Tap the 3 dots in Chrome and select "Install app" or "Add to Home screen".');
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalledSuccess(true);
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  return (
    <>
      {/* Offline Status Warning Pill */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between gap-3 sticky top-0 z-50 animate-in fade-in">
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> Poor network detected. Local pet directory listings & walk routes are served from your offline local storage cache.
            </span>
          </div>
          <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
            Offline Cached
          </span>
        </div>
      )}

      {/* PWA / Google Play Store Install Banner */}
      {showInstallBanner && !installedSuccess && (
        <div className="bg-gradient-to-r from-emerald-950 via-[#0f5132] to-slate-900 text-white px-4 py-2.5 text-xs shadow-lg border-b border-emerald-800 flex items-center justify-between gap-3 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              🐾
            </div>
            <div>
              <div className="font-extrabold text-white flex items-center gap-1.5">
                <span>Install My Paws Walks App</span>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                  PWA · Google Play Ready
                </span>
              </div>
              <div className="text-[11px] text-emerald-200">
                Install on your Android or mobile device for 1-tap offline access & full-screen GPS walks.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1 text-emerald-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
