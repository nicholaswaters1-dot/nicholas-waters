import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  variant?: 'default' | 'compact' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'default' }) => {
  const isLight = variant === 'light';
  const isCompact = variant === 'compact';

  return (
    <div className="inline-flex items-center gap-2 select-none group max-w-full shrink-0">
      {/* Custom SVG Crest Badge: Forest Green & Warm Gold Paw + Heart */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0f5132] via-[#146c43] to-[#0a3622] shadow-xs border border-emerald-400/30 transition-transform duration-200 group-hover:scale-105 shrink-0 ${
          isCompact ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-10 h-10 sm:w-11 sm:h-11'
        }`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isCompact ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-7 sm:h-7'}
        >
          {/* Outer Shield Ring */}
          <path
            d="M32 6L10 15V31C10 45.2 19.4 57.6 32 61C44.6 57.6 54 45.2 54 31V15L32 6Z"
            fill="#0F5132"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Golden Paw Pads */}
          <ellipse cx="22" cy="24" rx="3.8" ry="5" transform="rotate(-18 22 24)" fill="#FBBF24" />
          <ellipse cx="29" cy="20" rx="3.6" ry="4.8" transform="rotate(-5 29 20)" fill="#FBBF24" />
          <ellipse cx="36" cy="20" rx="3.6" ry="4.8" transform="rotate(8 36 20)" fill="#FBBF24" />
          <ellipse cx="43" cy="24" rx="3.8" ry="5" transform="rotate(20 43 24)" fill="#FBBF24" />
          {/* Main Heart-Shaped Paw Pad */}
          <path
            d="M32 28C26.5 28 21 32.2 21 37.5C21 41.2 24.2 43.2 27.5 43.2C29.4 43.2 30.8 42.5 32 42.5C33.2 42.5 34.6 43.2 36.5 43.2C39.8 43.2 43 41.2 43 37.5C43 32.2 37.5 28 32 28Z"
            fill="#FFFFFF"
          />
        </svg>

        {/* Verified Trust Dot */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-2xs" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1 leading-none">
          <span
            className={`font-black tracking-tight whitespace-nowrap ${
              isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            } ${isLight ? 'text-white' : 'text-slate-900'}`}
          >
            My Paws <span className={isLight ? 'text-emerald-300' : 'text-[#0f5132]'}>Walks</span>
          </span>
        </div>

        <div className="flex items-center gap-1 mt-0.5">
          <ShieldCheck
            className={`w-2.5 h-2.5 shrink-0 ${isLight ? 'text-amber-300' : 'text-emerald-700'}`}
          />
          <span
            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate ${
              isLight ? 'text-emerald-200/90' : 'text-slate-500'
            }`}
          >
            UK Pet Care & Shelters
          </span>
        </div>
      </div>
    </div>
  );
};
