import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ASSET_PATHS } from '../../data/initialData';
import { LocalBusinessAd } from '../../types';
import {
  Send,
  Camera,
  MapPin,
  Radio,
  Clock,
  Activity,
  Droplets,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Store,
  Tag,
  X,
  ExternalLink,
  ShieldAlert,
  Share2,
  Users,
} from 'lucide-react';
import { HouseholdUserSwitcher } from '../common/HouseholdUserSwitcher';
import { SosHelpModal } from '../common/SosHelpModal';
import { LiveGpsWalkGoogleMap } from '../maps/LiveGpsWalkGoogleMap';

export const LiveWalkAndChat: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    walkEvents,
    localBusinesses,
    showToast,
    openShareModal,
    activeHouseholdMember,
    householdMembers,
    activeDog,
    saveRecordedWalk,
    recordedWalks,
  } = useMarketplace();
  const [inputText, setInputText] = useState('');
  const [selectedMapBusiness, setSelectedMapBusiness] = useState<LocalBusinessAd | null>(null);
  const [showBusinessPins, setShowBusinessPins] = useState(true);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  // Easy One-Tap Dog Owner GPS Walk Recorder State
  const [isRecordingOwnWalk, setIsRecordingOwnWalk] = useState(false);
  const [isPausedOwnWalk, setIsPausedOwnWalk] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pottyCount, setPottyCount] = useState(0);
  const [waterStops, setWaterStops] = useState(0);

  React.useEffect(() => {
    let interval: any;
    if (isRecordingOwnWalk && !isPausedOwnWalk) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingOwnWalk, isPausedOwnWalk]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const liveDistanceKm = +(0.12 + elapsedSeconds * 0.015).toFixed(2);
  const livePupPoints = Math.max(25, Math.round(liveDistanceKm * 30) + pottyCount * 10);

  const handleStartOwnWalk = () => {
    setIsRecordingOwnWalk(true);
    setIsPausedOwnWalk(false);
    showToast(`📡 GPS Locked! Recording live walk with ${activeDog.name} (Offline Cache Active).`);
  };

  const handleStopAndSaveOwnWalk = () => {
    const durationMins = Math.max(5, Math.round(elapsedSeconds / 60) || 15);
    saveRecordedWalk({
      title: `${activeDog.name}'s GPS Neighbourhood & Park Walk`,
      date: 'Today, Just Now',
      durationMinutes: durationMins,
      distanceKm: liveDistanceKm,
      caloriesBurned: Math.round(liveDistanceKm * 68),
      pawPointsEarned: livePupPoints,
      routeSummary: `Hampstead & Highgate Loop · ${pottyCount} Potty Drops · ${waterStops} Water Stops`,
    });
    setIsRecordingOwnWalk(false);
    setIsPausedOwnWalk(false);
    setElapsedSeconds(0);
    setPottyCount(0);
    setWaterStops(0);
  };

  // Filter local businesses located in NW3 (Hampstead Heath walk route area)
  const nearbyBusinesses = localBusinesses.filter(
    (b) => b.postcodeArea === 'NW3' && b.mapCoordinates
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  const handleSimulatePhotoDrop = () => {
    sendChatMessage('Sarah Jenkins took a new live photo of Buster drinking from the shaded brook!', ASSET_PATHS.buster);
    showToast('New walk photo update received from Sarah.');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* EASY ONE-TAP DOG OWNER GPS START / STOP WALK RECORDER DOCK */}
      <div className="bg-white rounded-3xl border-2 border-emerald-600 p-5 sm:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-extrabold">
              <Radio className={`w-3.5 h-3.5 text-emerald-700 ${isRecordingOwnWalk ? 'animate-ping' : ''}`} />
              <span>
                {isRecordingOwnWalk
                  ? isPausedOwnWalk
                    ? 'GPS Walk Paused — Offline Route Cached'
                    : `RECORDING LIVE GPS WALK WITH ${activeDog.name.toUpperCase()}`
                  : 'One-Tap Dog Owner GPS Walk Tracker (Works Offline)'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Record Your Own Walk with {activeDog.name} & Earn Pup Points
            </h2>
            <p className="text-xs text-slate-500">
              Tap <strong>START GPS WALK</strong> below to track your route, log potty/water breaks, and automatically cache breadcrumbs even with poor mobile reception.
            </p>
          </div>

          {/* Big High-Contrast Start / Pause / Stop Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!isRecordingOwnWalk ? (
              <button
                onClick={handleStartOwnWalk}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                <span>▶ START GPS WALK NOW</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsPausedOwnWalk(!isPausedOwnWalk)}
                  className="px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-all"
                >
                  {isPausedOwnWalk ? '▶ RESUME WALK' : '⏸ PAUSE WALK'}
                </button>
                <button
                  onClick={handleStopAndSaveOwnWalk}
                  className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/25 flex items-center gap-2 transition-all"
                >
                  <span>⏹ STOP & SAVE WALK (+{livePupPoints} Pts)</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Telemetry Bar when Recording or Recent Summary */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Walk Timer</span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {isRecordingOwnWalk ? formatTimer(elapsedSeconds) : '00:00'}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Live Distance</span>
            <span className="text-lg font-black text-emerald-700 font-mono">
              {isRecordingOwnWalk ? `${liveDistanceKm} km` : '0.00 km'}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Pup Points</span>
            <span className="text-lg font-black text-amber-900 font-mono">
              +{isRecordingOwnWalk ? livePupPoints : 0} Pts
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setPottyCount((c) => c + 1);
              showToast(`Logged Potty Pin for ${activeDog.name} (+10 Pup Points)!`);
            }}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-center transition-colors"
          >
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Tap to Log</span>
            <span className="text-xs font-extrabold text-emerald-950">💩 Potty Pin ({pottyCount})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setWaterStops((w) => w + 1);
              showToast(`Logged Hydration Break for ${activeDog.name}!`);
            }}
            className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-center transition-colors col-span-2 sm:col-span-1"
          >
            <span className="text-[10px] font-bold text-blue-800 uppercase block">Tap to Log</span>
            <span className="text-xs font-extrabold text-blue-950">💧 Water Stop ({waterStops})</span>
          </button>
        </div>
      </div>

      {/* Top Walk Status Bar */}
      <div className="bg-[#0f5132] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={ASSET_PATHS.sarah}
              alt="Sarah Jenkins"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-bold text-white">Live Walk with Sarah Jenkins</h2>
              <span className="text-[11px] font-semibold text-emerald-950 bg-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#0f5132] animate-pulse" />
                Live GPS Trail Active
              </span>
            </div>
            <p className="text-xs text-emerald-100">
              Heath Morning Frolics Pack · Buster, Luna & Milo · Hampstead Heath Woods (NW3)
            </p>
          </div>
        </div>

        {/* Quick controls: Household switcher, Social Share, Call Walker, SOS Emergency */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Family Account Switcher */}
          <HouseholdUserSwitcher />

          {/* Social Share Walk */}
          <button
            onClick={() =>
              openShareModal({
                title: 'Heath Morning Frolics Pack Walk',
                distanceKm: 2.4,
                durationMinutes: 45,
                dogNames: ['Buster', 'Luna', 'Milo'],
              })
            }
            className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Share walk to social media"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Call Walker */}
          <button
            onClick={() => showToast('Calling Sarah Jenkins at +44 7700 900841...', 'info')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#0f5132] bg-emerald-300 hover:bg-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Walker</span>
          </button>

          {/* SOS Call for Help */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="px-4 py-1.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md animate-pulse"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>Call for Help (SOS)</span>
          </button>
        </div>
      </div>

      <SosHelpModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        currentLocationName="Hampstead Heath Sandy Pond Trail (NW3)"
        currentGpsCoords="51.5606° N, 0.1631° W"
      />

      {/* Split Dashboard: Left Route & Metrics, Right Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live GPS Route Map & Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Map Display */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Live Route Trail: Hampstead Heath (NW3 Postcode)</span>
              </div>

              {/* Local Business Pin Toggle */}
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showBusinessPins}
                  onChange={(e) => setShowBusinessPins(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                />
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  Show Dog-Friendly Places & ER Vets
                </span>
              </label>
            </div>

            {/* Real Google Maps with Live Walk GPS Route & Dog-Friendly Venues */}
            <LiveGpsWalkGoogleMap
              nearbyBusinesses={nearbyBusinesses}
              showBusinesses={showBusinessPins}
              selectedBusiness={selectedMapBusiness}
              onSelectBusiness={setSelectedMapBusiness}
            />

            {/* Metric Counters */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 border-t border-slate-100">
              <div className="p-3.5 text-center">
                <div className="text-xs text-slate-500 mb-0.5">Distance Covered</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">3.12 km</div>
              </div>
              <div className="p-3.5 text-center">
                <div className="text-xs text-slate-500 mb-0.5">Potty & Water</div>
                <div className="text-lg font-bold text-emerald-700 tabular-nums">3 Pee · 1 Poop</div>
              </div>
              <div className="p-3.5 text-center">
                <div className="text-xs text-slate-500 mb-0.5">Estimated Drop-off</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">11:35 AM</div>
              </div>
            </div>
          </div>

          {/* Timeline of Walk Milestones */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Today’s Walk Log Timeline</span>
            </h3>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {walkEvents.map((evt) => (
                <div key={evt.id} className="relative flex items-start gap-4 pl-8 text-xs">
                  <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{evt.title}</span>
                      <span className="text-slate-400 font-mono tabular-nums">{evt.time}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{evt.description}</p>
                    {evt.photoUrl && (
                      <div className="mt-2">
                        <img
                          src={evt.photoUrl}
                          alt="Walk update"
                          className="w-32 h-24 object-cover rounded-lg border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Direct Messenger with Sarah (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[680px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <img
                src={ASSET_PATHS.sarah}
                alt="Sarah Jenkins"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Sarah Jenkins</div>
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>On Trail with Buster</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulatePhotoDrop}
              title="Request a live photo snapshot"
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulate Photo</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
            {chatMessages.map((msg) => {
              const isOwner = msg.sender === 'owner';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                    {msg.senderName} · {msg.timestamp}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                      isOwner
                        ? 'bg-[#0f5132] text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}

                    {msg.photoUrl && (
                      <div className="mt-2.5 rounded-xl overflow-hidden border border-black/10">
                        <img
                          src={msg.photoUrl}
                          alt="Live walk snap"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 pt-2 pb-1 border-t border-slate-100 flex flex-wrap gap-1.5 bg-white max-w-full">
            {[
              'Fresh water given? 💧',
              'How is he playing with Luna?',
              'Looking forward to seeing him!',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send message to Sarah..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="p-2 bg-[#0f5132] text-white hover:bg-[#0c3e29] active:bg-emerald-950 rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
