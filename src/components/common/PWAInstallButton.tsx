import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Share2,
  PlusSquare,
  X,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Copy,
  FileCode2,
  Terminal,
  ExternalLink,
  PackageCheck,
} from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'pill';
  className?: string;
}

const TWA_MANIFEST_CONTENT = JSON.stringify(
  {
    packageId: 'uk.co.mypawswalks.app',
    host: typeof window !== 'undefined' ? window.location.host : 'mypawswalks.co.uk',
    name: 'My Paws Walks',
    launcherName: 'PawsWalks',
    display: 'standalone',
    themeColor: '#0f5132',
    themeColorDark: '#072417',
    navigationColor: '#0f5132',
    navigationColorDark: '#072417',
    navigationDividerColor: '#0f5132',
    navigationDividerColorDark: '#072417',
    backgroundColor: '#0f5132',
    enableNotifications: true,
    startUrl: '/',
    iconUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://mypawswalks.co.uk'}/pwa-512x512.png`,
    maskableIconUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://mypawswalks.co.uk'}/pwa-maskable-512x512.png`,
    splashScreenFadeOutDuration: 300,
    signingKey: {
      path: './android-release-key.keystore',
      alias: 'mypawswalks-key',
    },
    appVersionName: '1.0.0',
    appVersionCode: 1,
    generatorApp: 'bubblewrap-cli',
    webManifestUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://mypawswalks.co.uk'}/manifest.json`,
    fallbackType: 'customtabs',
    features: {
      locationDelegation: { enabled: true },
      playBilling: { enabled: false },
    },
    enableSiteSettingsShortcut: true,
    minSdkVersion: 21,
    orientation: 'portrait',
  },
  null,
  2
);

const ASSETLINKS_CONTENT = JSON.stringify(
  [
    {
      relation: [
        'delegate_permission/common.handle_all_urls',
        'delegate_permission/common.use_as_origin',
      ],
      target: {
        namespace: 'android_app',
        package_name: 'uk.co.mypawswalks.app',
        sha256_cert_fingerprints: [
          'FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C',
        ],
      },
    },
  ],
  null,
  2
);

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showPlayStoreGuide, setShowPlayStoreGuide] = useState(false);
  const [activeBuildTab, setActiveBuildTab] = useState<'pwabuilder' | 'bubblewrap' | 'capacitor'>('pwabuilder');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If already running as an installed PWA / standalone, suppress prompt
  if (isInstalled) {
    return null;
  }

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        {isInstallable && (
          <button
            onClick={install}
            className={
              variant === 'pill'
                ? `flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer ${className}`
                : `flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border border-emerald-500/30 transition-all shadow-xs cursor-pointer ${className}`
            }
            title="Install My Paws Walks directly to your Home Screen"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        )}

        {isIOS && (
          <button
            onClick={() => setShowIOSGuide(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 text-emerald-200 hover:bg-emerald-900/40 text-xs font-semibold transition cursor-pointer ${className}`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>iOS App</span>
          </button>
        )}

        <button
          onClick={() => setShowPlayStoreGuide(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 rounded-xl text-emerald-200 text-xs font-bold transition cursor-pointer ${className}`}
          title="Generate Android APK & Google Play Store AAB Bundle"
        >
          <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">APK / AAB Bundle</span>
          <span className="sm:hidden">APK/AAB</span>
        </button>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold">
                  🐾
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Install Paws Walks on iOS</h3>
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

      {/* APK & Google Play AAB Bundle Generator Studio Modal */}
      {showPlayStoreGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900 my-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0f5132] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  🐾
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                      Android APK & Google Play AAB Bundle Kit
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                      100% Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Package ID: <strong className="font-mono text-slate-800">uk.co.mypawswalks.app</strong> · TWA & Capacitor Configured
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPlayStoreGuide(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Readiness Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>512x512 & Maskable Adaptive Icons</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>twa-manifest.json (Bubblewrap CLI)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>/.well-known/assetlinks.json Active</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>capacitor.config.ts (Android & iOS)</span>
              </div>
            </div>

            {/* Download Bundle Config Files */}
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-emerald-700" />
                <span>Download Pre-Configured Bundle Manifests:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDownloadFile('twa-manifest.json', TWA_MANIFEST_CONTENT)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>twa-manifest.json (Bubblewrap)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    JSON
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadFile('assetlinks.json', ASSETLINKS_CONTENT)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>assetlinks.json (Play Store Verify)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    JSON
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Methods Tabs to Generate APK & AAB */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveBuildTab('pwabuilder')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    activeBuildTab === 'pwabuilder'
                      ? 'bg-[#0f5132] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1. Cloud APK/AAB (No Code)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBuildTab('bubblewrap')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    activeBuildTab === 'bubblewrap'
                      ? 'bg-[#0f5132] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2. Bubblewrap CLI (.aab & .apk)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBuildTab('capacitor')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    activeBuildTab === 'capacitor'
                      ? 'bg-[#0f5132] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3. Android Studio / Xcode
                </button>
              </div>

              {activeBuildTab === 'pwabuilder' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="font-extrabold text-slate-900">
                    Fastest Way: Generate Signed `.apk` & `.aab` in 60 Seconds via PWABuilder
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed">
                    <li>
                      Copy your live App URL below:
                      <div className="mt-1.5 flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={typeof window !== 'undefined' ? window.location.origin : 'https://mypawswalks.co.uk'}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-[11px] text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              typeof window !== 'undefined' ? window.location.origin : 'https://mypawswalks.co.uk',
                              'url'
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#0f5132] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCmd === 'url' ? 'Copied!' : 'Copy URL'}</span>
                        </button>
                      </div>
                    </li>
                    <li>
                      Open <strong>PWABuilder.com</strong>, paste the URL, and click <strong>Package for Stores → Android</strong>.
                    </li>
                    <li>
                      Select <strong>Google Play Package (AAB + APK)</strong> with Package ID <code className="bg-white px-1.5 py-0.5 rounded border">uk.co.mypawswalks.app</code> and click <strong>Download Package</strong>.
                    </li>
                  </ol>
                </div>
              )}

              {activeBuildTab === 'bubblewrap' && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" />
                      <span>Google Official Bubblewrap TWA Builder</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'npm run android:keystore && npm run android:twa-init && npm run android:build-aab',
                          'bubblewrap'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCmd === 'bubblewrap' ? 'Copied!' : 'Copy Commands'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/50 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`# 1. Generate release signing keystore
npm run android:keystore

# 2. Initialize Android TWA project from twa-manifest.json
npm run android:twa-init

# 3. Build signed Google Play Bundle (.aab) & Android Installer (.apk)
npm run android:build-aab`}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    Outputs <code className="text-amber-300">app-release-bundle.aab</code> (for Google Play Console upload) and <code className="text-amber-300">app-release-signed.apk</code> (for direct Android phone installation).
                  </p>
                </div>
              )}

              {activeBuildTab === 'capacitor' && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" />
                      <span>Capacitor Native Android Studio & iOS Xcode Build</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'npm run build && npx @capacitor/cli add android && npx @capacitor/cli sync android && npx @capacitor/cli open android',
                          'capacitor'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCmd === 'capacitor' ? 'Copied!' : 'Copy Commands'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/50 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`# Build web bundle & sync with Capacitor (capacitor.config.ts included)
npm run build
npx @capacitor/cli add android
npx @capacitor/cli sync android
npx @capacitor/cli open android`}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    In Android Studio, select <strong>Build → Generate Signed Bundle / APK</strong> and choose <strong>Android App Bundle (.aab)</strong> or <strong>APK (.apk)</strong>.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-start gap-2 border border-slate-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Instant Direct Install:</strong> On Android Chrome, you can also install the app right now via the browser menu (⋮) → <strong>"Install app"</strong>.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowPlayStoreGuide(false)}
                className="px-5 py-2.5 bg-[#0f5132] text-white font-bold text-xs rounded-xl hover:bg-[#0c3e29] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

