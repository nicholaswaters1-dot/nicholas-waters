import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/translations';
import { Globe2, Check, X, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export const LanguagePickerModal: React.FC = () => {
  const { language, setLanguage, languageModalOpen, setLanguageModalOpen, showToast } = useMarketplace();

  if (!languageModalOpen) return null;

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    showToast(`Language updated to ${langObj?.name} (${langObj?.nativeName})`);
    setLanguageModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-emerald-50/80 to-white border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0f5132] text-white flex items-center justify-center shadow-xs">
              <Globe2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Select Your Language</h3>
              <p className="text-xs text-slate-500">Dewiswch eich iaith / Global Language Support</p>
            </div>
          </div>

          <button
            onClick={() => setLanguageModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 mb-2 flex items-start gap-3">
            <span className="text-2xl">🏴󠁧󠁢󠁷󠁬󠁳󠁿</span>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#0f5132]">
                <span>Croeso i My Paws Walks!</span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-bold uppercase">
                  Welsh Supported
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                Mae gwasanaeth llawn ar gael yn y Gymraeg ar gyfer perchnogion cŵn a cherddwyr ledled y Deyrnas Unedig.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">{lang.flag}</span>
                    <div className="text-left">
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <span>{lang.nativeName}</span>
                        {lang.code === 'cy' && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-medium">
                            Cymru
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-normal">{lang.name}</div>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#0f5132] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 group-hover:text-slate-600">Select</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Translations apply immediately across all tabs</span>
          </div>
          <button
            onClick={() => setLanguageModalOpen(false)}
            className="px-4 py-1.5 bg-[#0f5132] text-white rounded-xl font-bold text-xs hover:bg-[#0c3e29] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
