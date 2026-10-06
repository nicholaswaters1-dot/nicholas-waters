import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { WalkingPack, PackDog } from '../../types';
import { WalkerDogProfileModal } from './WalkerDogProfileModal';
import { LiveGpsWalkGoogleMap } from '../maps/LiveGpsWalkGoogleMap';
import {
  Users,
  ShieldCheck,
  Clock,
  MapPin,
  Plus,
  Phone,
  Sparkles,
  Compass,
  Share2,
  Radio,
  Send,
  Camera,
  Eye,
  Droplets,
  Activity,
  MessageSquare,
  CheckCircle2,
  Upload,
  Lock,
  TrendingUp,
  Briefcase,
} from 'lucide-react';

export const PackConnectHub: React.FC = () => {
  const {
    packs,
    walkers,
    toggleDogAttendance,
    addDogToPack,
    nativeShare,
    showToast,
    walkEvents,
    addWalkEvent,
    walkerLiveGpsActive,
    setWalkerLiveGpsActive,
    chatMessages,
    sendChatMessage,
    localBusinesses,
    completeWalkAndRequestEscrowRelease,
    setWalkerTab,
    bookings,
  } = useMarketplace();
  const activeWalker = walkers[0];
  const currentTier = activeWalker?.subscriptionPlan || 'PRO';
  const isPaidSub = activeWalker?.subscriptionPaid !== false;
  const hasProAccess =
    (currentTier === 'PRO' || currentTier === 'Elite Package') && isPaidSub;
  const hasEliteAccess = currentTier === 'Elite Package' && isPaidSub;

  const [selectedPackId, setSelectedPackId] = useState<string>(packs[0].id);
  const [newDogName, setNewDogName] = useState('');
  const [newDogBreed, setNewDogBreed] = useState('Cockapoo');
  const [showAddModal, setShowAddModal] = useState(false);

  // Inspecting Dog Profile Modal State
  const [inspectingDogName, setInspectingDogName] = useState<string | null>(null);

  // Live Walker GPS & Trail Event Recorder State (Poos, Waters, Off-the-Leash)
  const [isPausedGps, setIsPausedGps] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(1420); // 23m 40s in progress
  const [selectedEventDog, setSelectedEventDog] = useState<string>('All Pack Dogs');
  const [pooCounts, setPooCounts] = useState<Record<string, number>>({
    Buster: 1,
    Luna: 1,
    Milo: 0,
    Bailey: 1,
  });
  const [waterCounts, setWaterCounts] = useState<Record<string, number>>({
    Buster: 2,
    Luna: 1,
    Milo: 1,
    Bailey: 2,
  });
  const [offLeashStatus, setOffLeashStatus] = useState<Record<string, boolean>>({
    Buster: true,
    Luna: false,
    Milo: false,
    Bailey: true,
  });

  // Live On-Walk Chat & Photo Update State per Dog Owner
  const [selectedChatDogId, setSelectedChatDogId] = useState<string>('ALL');
  const [chatInput, setChatInput] = useState('');
  const [attachedPhotoPreview, setAttachedPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const activePack = packs.find((p) => p.id === selectedPackId) || packs[0];

  useEffect(() => {
    let timer: any;
    if (walkerLiveGpsActive && !isPausedGps) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [walkerLiveGpsActive, isPausedGps]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const liveDistanceKm = +(1.4 + elapsedSeconds * 0.0012).toFixed(2);
  const totalPoos = (Object.values(pooCounts) as number[]).reduce((a, b) => a + b, 0);
  const totalWaters = (Object.values(waterCounts) as number[]).reduce((a, b) => a + b, 0);
  const activeOffLeashCount = Object.values(offLeashStatus).filter(Boolean).length;

  const targetDogObj: PackDog | undefined =
    selectedChatDogId === 'ALL'
      ? undefined
      : activePack.currentDogs.find((d) => d.id === selectedChatDogId);

  const handleToggleGpsWalk = () => {
    if (!walkerLiveGpsActive) {
      setWalkerLiveGpsActive(true);
      setIsPausedGps(false);
      addWalkEvent({
        type: 'pickup',
        title: `📡 Live GPS Walk Started (${activePack.packName})`,
        description: `Sarah Jenkins started live GPS tracking for ${activePack.currentDogs
          .map((d) => d.name)
          .join(', ')} at ${activePack.location}.`,
      });
      showToast('📡 Live GPS Walk Started! All dog owners are now receiving real-time trail telemetry.');
    } else {
      setWalkerLiveGpsActive(false);
      setIsPausedGps(false);
      const summary = `${liveDistanceKm} km walked · ${totalPoos} poos · ${totalWaters} water stops · safe drop-off`;
      addWalkEvent({
        type: 'dropoff',
        title: `🏁 Live GPS Walk Completed (${liveDistanceKm} km)`,
        description: `Walk finished safely! Logged ${totalPoos} poos, ${totalWaters} hydration breaks, and safe off-leash recall. Escrow release notification sent to dog owner.`,
      });
      completeWalkAndRequestEscrowRelease(undefined, summary);
    }
  };

  // One-Tap Log Poo
  const handleRecordPoo = (dogName?: string) => {
    const target = dogName || (selectedEventDog === 'All Pack Dogs' ? activePack.currentDogs[0]?.name || 'Buster' : selectedEventDog);
    setPooCounts((prev) => ({ ...prev, [target]: (prev[target] || 0) + 1 }));
    addWalkEvent({
      type: 'potty',
      dogName: target,
      title: `💩 Poo Recorded — ${target}`,
      description: `Sarah logged a healthy poo & biodegradable bag disposal for ${target} along ${activePack.location}.`,
    });
    const dogRecord = activePack.currentDogs.find((d) => d.name === target);
    sendChatMessage(
      `💩 Live Trail Log: ${target} just had a healthy poo break on the walk!`,
      undefined,
      dogRecord?.ownerName || 'All Pack Owners',
      target
    );
    showToast(`💩 Logged Poo for ${target} & notified ${dogRecord?.ownerName || 'owner'}!`);
  };

  // One-Tap Log Water
  const handleRecordWater = (dogName?: string) => {
    const target = dogName || selectedEventDog;
    if (target === 'All Pack Dogs') {
      const nextMap: Record<string, number> = { ...waterCounts };
      activePack.currentDogs.forEach((d) => {
        nextMap[d.name] = (nextMap[d.name] || 0) + 1;
      });
      setWaterCounts(nextMap);
    } else {
      setWaterCounts((prev) => ({ ...prev, [target]: (prev[target] || 0) + 1 }));
    }

    addWalkEvent({
      type: 'water',
      dogName: target,
      title: `💧 Fresh Water Break — ${target}`,
      description: `Filtered travel bowl hydration break logged for ${target} on trail.`,
    });
    const dogRecord = activePack.currentDogs.find((d) => d.name === target);
    sendChatMessage(
      `💧 Live Trail Log: Fresh water & hydration break completed for ${target}!`,
      undefined,
      dogRecord?.ownerName || 'All Pack Owners',
      target
    );
    showToast(`💧 Logged Water Break for ${target} & updated owner feed!`);
  };

  // One-Tap Toggle Off-the-Leash
  const handleToggleOffLeash = (dogName?: string) => {
    const target =
      dogName ||
      (selectedEventDog === 'All Pack Dogs'
        ? activePack.currentDogs[0]?.name || 'Buster'
        : selectedEventDog);
    const nextState = !offLeashStatus[target];
    setOffLeashStatus((prev) => ({ ...prev, [target]: nextState }));

    addWalkEvent({
      type: 'off_leash',
      dogName: target,
      title: nextState
        ? `🐕‍🦺 Off-the-Leash Run Started — ${target}`
        : `🦮 Back on Lead — ${target}`,
      description: nextState
        ? `${target} is enjoying supervised off-the-leash play in the safe enclosed meadow (GPS collar active).`
        : `${target} recalled cleanly on whistle cue and is clipped safely back on lead.`,
    });

    const dogRecord = activePack.currentDogs.find((d) => d.name === target);
    sendChatMessage(
      nextState
        ? `🐕‍🦺 Off-the-Leash Update: ${target} is now off the leash enjoying a safe meadow run with active GPS tracking!`
        : `🦮 Lead Update: ${target} recalled straight back to heel and is safely clipped back on the leash.`,
      undefined,
      dogRecord?.ownerName || 'All Pack Owners',
      target
    );
    showToast(
      nextState
        ? `🐕‍🦺 ${target} marked as Off-the-Leash (Owner notified)!`
        : `🦮 ${target} marked as Back on Lead (Owner notified)!`
    );
  };

  // Photo Upload Handler for Walker Chat
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachedPhotoPreview(reader.result);
        showToast('📸 Walk photo attached! Tap Send to share with dog owner.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick Instant Photo Snap Preset
  const handleQuickPhotoSnap = () => {
    const dogLabel = targetDogObj ? targetDogObj.name : activePack.currentDogs.map((d) => d.name).join(' & ');
    const ownerLabel = targetDogObj ? targetDogObj.ownerName : 'All Pack Owners';
    const samplePhoto = targetDogObj
      ? targetDogObj.avatar
      : activePack.currentDogs[0]?.avatar ||
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80';

    sendChatMessage(
      `📸 Live Trail Snapshot of ${dogLabel} having the best time at ${activePack.location}!`,
      samplePhoto,
      ownerLabel,
      dogLabel
    );
    addWalkEvent({
      type: 'photo',
      dogName: dogLabel,
      title: `📸 Photo Sent to ${ownerLabel}`,
      description: `Live trail photo of ${dogLabel} shared via instant walk messenger.`,
      photoUrl: samplePhoto,
    });
    showToast(`📸 Sent live walk photo to ${ownerLabel}!`);
  };

  const handleSendWalkerChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !attachedPhotoPreview) return;

    const dogLabel = targetDogObj ? targetDogObj.name : 'All Pack Dogs';
    const ownerLabel = targetDogObj ? targetDogObj.ownerName : 'All Pack Owners';

    sendChatMessage(
      chatInput.trim() || `📸 Sent a live walk photo of ${dogLabel}!`,
      attachedPhotoPreview || undefined,
      ownerLabel,
      dogLabel
    );

    if (attachedPhotoPreview) {
      addWalkEvent({
        type: 'photo',
        dogName: dogLabel,
        title: `📸 Photo Update for ${dogLabel}`,
        description: chatInput.trim() || `Shared a live photo with ${ownerLabel}.`,
        photoUrl: attachedPhotoPreview,
      });
    }

    setChatInput('');
    setAttachedPhotoPreview(null);
    showToast(`Sent live walk update to ${ownerLabel}!`);
  };

  const handleAddDog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDogName.trim()) return;
    addDogToPack(activePack.id, newDogName.trim(), newDogBreed);
    setNewDogName('');
    setShowAddModal(false);
  };

  const nearbyBusinesses = localBusinesses.filter(
    (b) => b.postcodeArea === 'NW3' && b.mapCoordinates
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Pack Header & Summary Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">
                Walker Live GPS Command & Pack Hub
              </h2>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Licensing Cap: Max 4 Dogs
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Click any booked dog to view their full Care Profile, start/stop live GPS, record poos, waters & off-leash runs, and chat live with owners on the walk.
            </p>
          </div>

          {/* Pack Selector Tabs & Share Verified Walker Profile */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const w = walkers[0];
                nativeShare({
                  type: 'profile',
                  title: `🦮 Verified Dog Walker: ${w.name} (${w.rating}★)`,
                  subtitle: `${w.headline} · ${w.location}`,
                  badge: `DBS Verified (${w.dbsCertificateNumber})`,
                  text: `Book a walk with ${w.name} on My Paws Walks! Enhanced DBS Checked (${w.dbsCertificateNumber}), ${w.insuranceCoverAmount} Insured, and Council Licensed in ${w.location}.`,
                });
              }}
              className="px-3.5 py-2 text-xs font-extrabold text-[#0f5132] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share My Verified Profile</span>
            </button>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {packs.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedPackId === pack.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pack.packName} ({pack.currentDogs.length}/{pack.maxDogs})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mandatory Walker Postcode & Region Covered Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-700">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-extrabold">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Postcode: {activeWalker?.postcode || `${activeWalker?.postcodeArea || 'NW3'} 1AA`}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>Region Covered: {activeWalker?.regionCovered || activeWalker?.location || 'North London & Hampstead Heath'}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWalkerTab('services-pricing')}
            className="text-xs font-bold text-[#0f5132] hover:underline cursor-pointer"
          >
            Edit Postcode & Region Covered →
          </button>
        </div>
      </div>

      {/* 1. LIVE GPS START / STOP & ONE-TAP TRAIL RECORDINGS (POOS, WATERS, OFF THE LEASH) */}
      <div className="bg-[#0f5132] text-white rounded-3xl p-5 sm:p-6 shadow-lg border border-emerald-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-800/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold">
              <Radio className={`w-3.5 h-3.5 text-emerald-400 ${walkerLiveGpsActive && !isPausedGps ? 'animate-ping' : ''}`} />
              <span>
                {walkerLiveGpsActive
                  ? isPausedGps
                    ? 'WALKER GPS PAUSED — WATER / SNIFF BREAK'
                    : `LIVE GPS BROADCASTING TO ${activePack.currentDogs.length} DOG OWNERS`
                  : 'GPS STANDBY — READY TO START WALK'}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white">
              {activePack.packName} · Live GPS & Trail Telemetry Recorder
            </h3>
            <p className="text-xs text-emerald-100">
              One-tap buttons built for walking with one hand: log <strong>Poos 💩</strong>, <strong>Waters 💧</strong>, and <strong>Off-the-Leash 🐕‍🦺</strong> for any dog in the walk.
            </p>
          </div>

          {/* Start / Pause / Stop Live GPS Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!walkerLiveGpsActive ? (
              <button
                type="button"
                onClick={handleToggleGpsWalk}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="w-3 h-3 rounded-full bg-slate-950 animate-ping" />
                <span>▶ START LIVE GPS WALK</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsPausedGps(!isPausedGps);
                    showToast(
                      !isPausedGps
                        ? '⏸ GPS Walk Paused.'
                        : '▶ GPS Walk Resumed!'
                    );
                  }}
                  className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all cursor-pointer"
                >
                  {isPausedGps ? '▶ RESUME GPS' : '⏸ PAUSE GPS'}
                </button>
                <button
                  type="button"
                  onClick={handleToggleGpsWalk}
                  className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>⏹ STOP LIVE GPS & FINISH WALK</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Select Which Dog to Record For + Big One-Tap Action Pads */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              1. Select Dog for Quick Trail Recording:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedEventDog('All Pack Dogs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedEventDog === 'All Pack Dogs'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-900 border border-emerald-700'
                }`}
              >
                🐾 All Pack Dogs
              </button>
              {activePack.currentDogs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedEventDog(d.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedEventDog === d.name
                      ? 'bg-white text-[#0f5132] shadow-xs'
                      : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-900 border border-emerald-700'
                  }`}
                >
                  <img
                    src={d.avatar}
                    alt={d.name}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Metrics & Big 3 Recording Buttons: POOS, WATERS, OFF THE LEASH */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-center flex flex-col justify-center">
              <span className="text-[10px] font-bold text-emerald-300 uppercase">Live GPS Timer</span>
              <span className="text-xl font-black text-white font-mono mt-0.5">
                {walkerLiveGpsActive ? formatTimer(elapsedSeconds) : '00:00'}
              </span>
              <span className="text-[10px] text-emerald-400">{liveDistanceKm} km covered</span>
            </div>

            {/* Record Poo Button */}
            <button
              type="button"
              onClick={() => handleRecordPoo()}
              className="p-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-center transition-all shadow-md flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                Tap to Log ({selectedEventDog})
              </span>
              <span className="text-base sm:text-lg font-black">💩 Record Poo ({totalPoos})</span>
              <span className="text-[10px] font-bold">Auto-alerts dog owner</span>
            </button>

            {/* Record Water Button */}
            <button
              type="button"
              onClick={() => handleRecordWater()}
              className="p-3.5 rounded-2xl bg-sky-400 hover:bg-sky-300 active:scale-95 text-slate-950 text-center transition-all shadow-md flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                Tap to Log ({selectedEventDog})
              </span>
              <span className="text-base sm:text-lg font-black">💧 Water Stop ({totalWaters})</span>
              <span className="text-[10px] font-bold">Fresh bowl hydration</span>
            </button>

            {/* Toggle Off-the-Leash Button */}
            <button
              type="button"
              onClick={() => handleToggleOffLeash()}
              className="p-3.5 rounded-2xl bg-emerald-300 hover:bg-emerald-200 active:scale-95 text-slate-950 text-center transition-all shadow-md flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                Toggle ({selectedEventDog})
              </span>
              <span className="text-base sm:text-lg font-black">
                🐕‍🦺 Off the Leash ({activeOffLeashCount})
              </span>
              <span className="text-[10px] font-bold">Tap to log off/on lead</span>
            </button>

            {/* Quick Snap Photo to Owner */}
            <button
              type="button"
              onClick={handleQuickPhotoSnap}
              className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50 active:scale-95 text-[#0f5132] text-center transition-all shadow-md flex flex-col items-center justify-center gap-0.5 col-span-2 sm:col-span-1 cursor-pointer"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Instant Snap
              </span>
              <span className="text-base sm:text-lg font-black flex items-center gap-1">
                <Camera className="w-4 h-4" />
                <span>Send Photo</span>
              </span>
              <span className="text-[10px] font-bold text-slate-600">To owner live feed</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BOOKED DOGS IN WALK — CLICK ANY DOG TO VIEW FULL CARE PROFILE & PER-DOG CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Booked Dogs in {activePack.packName} ({activePack.currentDogs.length}/{activePack.maxDogs})
              </h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Tap any dog to view full Care Profile
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {activePack.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {activePack.scheduledTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              disabled={activePack.currentDogs.length >= activePack.maxDogs}
              className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dog to Walk</span>
            </button>
          </div>
        </div>

        {/* Dog Cards Grid — Clickable to View Dog Profile + Direct Per-Dog Poo/Water/Off-Leash & Message Owner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePack.currentDogs.map((dog) => {
            const isOffLeash = !!offLeashStatus[dog.name];
            const dogPoos = pooCounts[dog.name] || 0;
            const dogWaters = waterCounts[dog.name] || 0;

            return (
              <div
                key={dog.id}
                className="bg-slate-50/80 border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 flex flex-col justify-between space-y-3.5 transition-all shadow-2xs"
              >
                {/* Top Row: Clickable Dog Avatar & Name opens Full Dog Profile */}
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => setInspectingDogName(dog.name)}
                    className="relative group shrink-0 cursor-pointer"
                    title={`View ${dog.name}'s Full Care Profile`}
                  >
                    <img
                      src={dog.avatar}
                      alt={dog.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-[#0f5132] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
                      Profile
                    </span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectingDogName(dog.name)}
                        className="text-left group flex items-center gap-1.5 cursor-pointer"
                      >
                        <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 underline decoration-emerald-500/50 underline-offset-2 truncate">
                          {dog.name}
                        </h4>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          View Profile
                        </span>
                      </button>

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isOffLeash
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {isOffLeash ? '🐕‍🦺 Off-Leash Active' : '🦮 On Lead'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      {dog.breed} · {dog.weightKg} kg · Owner: <strong>{dog.ownerName}</strong>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug mt-1">
                      {dog.socialNotes}
                    </p>

                    {/* Dog Address & Pick-Up / Drop-Off Access Arrangements Box (Visible Only for Booked Pack Dogs) */}
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                          <span className="truncate">
                            {dog.homeAddress || '18 Downshire Hill, Hampstead, NW3 1NR'}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold bg-emerald-800 text-white px-1.5 py-0.5 rounded shrink-0">
                          🔒 Booked Walker Only
                        </span>
                      </div>
                      <div className="text-slate-700">
                        <strong className="text-amber-950">🔑 Pick-Up:</strong>{' '}
                        {dog.pickupAccessArrangement ||
                          'Key Safe by front porch (#4829). Harness on hallway peg.'}
                      </div>
                      <div className="text-slate-700">
                        <strong className="text-emerald-950">🚪 Drop-Off:</strong>{' '}
                        {dog.dropoffAccessArrangement ||
                          'Towel dry paws in porch, refill water bowl, double-lock front door.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Per-Dog Instant Trail Log Bar (Poo, Water, Off-Leash, Chat Owner) */}
                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => handleRecordPoo(dog.name)}
                    className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>💩 Poo ({dogPoos})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRecordWater(dog.name)}
                    className="py-1.5 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>💧 Water ({dogWaters})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleOffLeash(dog.name)}
                    className={`py-1.5 px-2 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
                      isOffLeash
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span>{isOffLeash ? '🐕‍🦺 Off-Lead' : '🦮 Off-Lead?'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChatDogId(dog.id);
                      const chatEl = document.getElementById('walker-live-chat-panel');
                      chatEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-1.5 px-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Chat</span>
                  </button>
                </div>

                {/* Footer with Attendance Status & Direct Owner Call */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Walk Check-In:</span>
                    <button
                      onClick={() => toggleDogAttendance(activePack.id, dog.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        dog.status === 'Checked In'
                          ? 'bg-emerald-600 text-white'
                          : dog.status === 'Completed'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {dog.status}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setInspectingDogName(dog.name)}
                      className="text-emerald-800 hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Care & Vet Guide →
                    </button>
                    <a
                      href={`tel:${dog.emergencyContact}`}
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(`Calling owner (${dog.ownerName}) at ${dog.emergencyContact}...`, 'info');
                      }}
                      className="text-slate-600 hover:text-emerald-700 font-medium flex items-center gap-1 text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{dog.ownerName}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SPLIT VIEW: LIVE GPS MAP & WALK TIMELINE (LEFT) + EASY ON-WALK OWNER MESSENGER & PHOTO CHAT (RIGHT) */}
      <div id="walker-live-chat-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Live GPS Map & Recorded Trail Log */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Live Walker GPS Trail: {activePack.location}</span>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  walkerLiveGpsActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {walkerLiveGpsActive ? '● GPS Active' : 'GPS Paused'}
              </span>
            </div>

            <LiveGpsWalkGoogleMap
              nearbyBusinesses={nearbyBusinesses}
              showBusinesses={true}
              selectedBusiness={null}
              onSelectBusiness={() => {}}
            />
          </div>

          {/* Live Recorded Walk Timeline (Poos, Waters, Off-Leash, Photos) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Live Walk Recordings (Poos, Waters & Off-Leash)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">
                Synced to Dog Owners
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {walkEvents.map((evt) => (
                <div key={evt.id} className="relative flex items-start gap-3.5 pl-8 text-xs">
                  <div
                    className={`absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                      evt.type === 'potty'
                        ? 'bg-amber-500'
                        : evt.type === 'water'
                        ? 'bg-sky-500'
                        : evt.type === 'off_leash'
                        ? 'bg-purple-600'
                        : 'bg-emerald-600'
                    }`}
                  />
                  <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{evt.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                        {evt.time}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 text-[11px]">{evt.description}</p>
                    {evt.photoUrl && (
                      <img
                        src={evt.photoUrl}
                        alt="Walk event"
                        referrerPolicy="no-referrer"
                        className="mt-2 w-28 h-20 object-cover rounded-lg border border-slate-200"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Easy On-Walk Chat & Photo Updates to Each Dog Owner (Requires Paid PRO or Elite Subscription) */}
        <div
          id="walker-live-chat-panel"
          className="lg:col-span-6 flex flex-col bg-white rounded-3xl border-2 border-emerald-600 shadow-md overflow-hidden h-[660px]"
        >
          {/* Chat Header with Owner Selector Tabs */}
          <div className="p-4 bg-[#0f5132] text-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-black flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Live Walk Owner Chat & Photo Messenger</span>
                </h3>
                <p className="text-[11px] text-emerald-100">
                  {hasProAccess
                    ? 'Select a dog below to message their owner individually or broadcast to all owners in the pack'
                    : 'PRO & Elite Feature — Upgrade your plan to unlock instant two-way Owner Messaging & Photo Drops'}
                </p>
              </div>

              {hasProAccess && (
                <button
                  type="button"
                  onClick={handleQuickPhotoSnap}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Quick Snap</span>
                </button>
              )}
            </div>

            {/* Recipient Owner Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedChatDogId('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedChatDogId === 'ALL'
                    ? 'bg-white text-[#0f5132] shadow-xs'
                    : 'bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                📢 All Pack Owners ({activePack.currentDogs.length})
              </button>
              {activePack.currentDogs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedChatDogId(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedChatDogId === d.id
                      ? 'bg-white text-[#0f5132] shadow-xs'
                      : 'bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  <img
                    src={d.avatar}
                    alt={d.name}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>
                    {d.name} ({d.ownerName.split(' ')[0]})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {!hasProAccess ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-slate-50 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shadow-xs">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Subscription Restriction · PRO / Elite Required
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  Direct Owner Messaging & Live Photo Messenger Locked
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your account is currently on the <strong>FREE / STARTER (£0/mo)</strong> tier, which allows you to receive enquiries and up to 5 bookings/week. Direct two-way Owner Messaging & Live Photo Drops require a paid <strong>PRO (£6.99/mo or £69.99/yr)</strong> or <strong>Elite Package (£14.99/mo or £149.99/yr)</strong> subscription.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWalkerTab('subscriptions')}
                className="px-5 py-3 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-black text-xs shadow-md transition-colors cursor-pointer"
              >
                Upgrade & Pay for PRO (£6.99/mo) to Unlock Messaging →
              </button>
            </div>
          ) : (
            <>
              {/* Chat Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {chatMessages.map((msg) => {
                  const isWalker = msg.sender === 'walker';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isWalker ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                        <span>{msg.senderName}</span>
                        {msg.recipientOwnerName && (
                          <span className="text-emerald-700 font-bold">
                            → To: {msg.recipientOwnerName} {msg.dogName ? `(${msg.dogName})` : ''}
                          </span>
                        )}
                        <span>· {msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                          isWalker
                            ? 'bg-[#0f5132] text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                        {msg.photoUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-white/20">
                            <img
                              src={msg.photoUrl}
                              alt="Walk photo update"
                              referrerPolicy="no-referrer"
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* One-Tap On-Walk Quick Message Buttons (Easy to use whilst walking!) */}
              <div className="px-3 py-2 border-t border-slate-200 bg-emerald-50/60 space-y-1.5">
                <div className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider">
                  One-Tap Live Walk Updates (Send to{' '}
                  {targetDogObj ? `${targetDogObj.ownerName} (${targetDogObj.name})` : 'All Pack Owners'}
                  ):
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {[
                    `🐾 Just picked up ${targetDogObj ? targetDogObj.name : 'the pack'}! Heading to the park now.`,
                    `🐕‍🦺 ${targetDogObj ? targetDogObj.name : 'Everyone'} is having a great off-leash run with the pack!`,
                    `💧 Fresh water break & shaded rest completed!`,
                    `💩 Healthy poo logged and bagged on the trail!`,
                    `🏠 On our way back now — paws towel-dried and happy!`,
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const dogLabel = targetDogObj ? targetDogObj.name : 'All Pack Dogs';
                        const ownerLabel = targetDogObj ? targetDogObj.ownerName : 'All Pack Owners';
                        sendChatMessage(preset, undefined, ownerLabel, dogLabel);
                        showToast(`Sent quick update to ${ownerLabel}!`);
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-emerald-950 bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 rounded-xl whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attached Photo Preview if selected */}
              {attachedPhotoPreview && (
                <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <img
                      src={attachedPhotoPreview}
                      alt="Attached preview"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-300"
                    />
                    <span>Photo ready to send to {targetDogObj ? targetDogObj.ownerName : 'All Owners'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedPhotoPreview(null)}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Chat Input & Camera Upload Bar */}
              <form
                onSubmit={handleSendWalkerChat}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shrink-0 cursor-pointer"
                  title="Upload or take a live walk photo"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    targetDogObj
                      ? `Message ${targetDogObj.ownerName} about ${targetDogObj.name}...`
                      : 'Message all dog owners in this walk...'
                  }
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#0f5132] text-white hover:bg-[#0c3e29] rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* 3. SUBSCRIPTION-GATED BUSINESS ANALYTICS (PRO) & ELITE TEAM / MULTI-AREA MANAGEMENT (ELITE PACKAGE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PRO & Elite Feature: Business Analytics */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {hasEliteAccess ? 'Advanced Business & Fleet Analytics' : 'Walker Business Analytics'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Weekly revenue, commission savings, repeat client retention & booking cap status
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                hasEliteAccess
                  ? 'bg-amber-400 text-slate-950'
                  : hasProAccess
                  ? 'bg-emerald-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {hasEliteAccess ? 'Elite Analytics Unlocked' : hasProAccess ? 'PRO Analytics Unlocked' : 'Locked · PRO Required'}
            </span>
          </div>

          {!hasProAccess ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <Lock className="w-6 h-6 text-amber-600 mx-auto" />
              <div className="text-xs font-extrabold text-slate-900">
                Business Analytics Requires a Paid PRO (£6.99/mo) or Elite (£14.99/mo) Subscription
              </div>
              <p className="text-[11px] text-slate-600">
                Your FREE / STARTER plan is capped at <strong>5 bookings/week</strong> ({bookings.filter((b) => b.walkerId === activeWalker?.id && b.status !== 'Cancelled').length}/5 used) with a 10% commission rate. Upgrade to PRO for unlimited bookings, 5% commission, and full Business Analytics.
              </p>
              <button
                type="button"
                onClick={() => setWalkerTab('subscriptions')}
                className="px-4 py-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs cursor-pointer"
              >
                Upgrade to PRO (£6.99/mo) →
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Weekly Net Earnings</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">£842.50</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">+18% vs last week</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Commission Rate</div>
                  <div className="text-lg font-black text-[#0f5132] mt-0.5">
                    {hasEliteAccess ? '2.5%' : '5%'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {hasEliteAccess ? 'Saving 75% vs Starter' : 'Saving 50% vs Starter'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="text-[10px] font-bold text-amber-900 uppercase">Booking Limit</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">Unlimited</div>
                  <div className="text-[10px] text-amber-800 font-semibold">Uncapped Customers</div>
                </div>
              </div>

              {hasEliteAccess && (
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1.5">
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                    ★ Elite Advanced Analytics & Featured Listing Metrics
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Profile Search Impressions: <strong className="text-emerald-300">1,420 / wk (#1 Featured)</strong></div>
                    <div>Multi-Walker Fleet Utilisation: <strong className="text-emerald-300">94.2% Capacity</strong></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Elite Package Exclusive: Multiple Staff/Walkers, Team Management & Multiple Service Areas */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Team Management, Staff Walkers & Multiple Service Areas
                </h3>
                <p className="text-[11px] text-slate-500">
                  Elite Package exclusive business management tools, multiple staff & multi-borough coverage
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                hasEliteAccess ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {hasEliteAccess ? 'Elite Unlocked (2.5% Comm.)' : 'Locked · Elite Required'}
            </span>
          </div>

          {!hasEliteAccess ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <Lock className="w-6 h-6 text-slate-700 mx-auto" />
              <div className="text-xs font-extrabold text-slate-900">
                Multiple Staff/Walkers, Team Management & Multiple Service Areas Locked
              </div>
              <p className="text-[11px] text-slate-600">
                Upgrade to the paid <strong>Elite Package (£14.99/mo or £149.99/yr)</strong> to add multiple staff walkers, manage team rotas, advertise across multiple London postcode areas, get a Featured Listing badge, and drop your commission to <strong>2.5%</strong>.
              </p>
              <button
                type="button"
                onClick={() => setWalkerTab('subscriptions')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Upgrade to Elite Package (£14.99/mo) →
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-bold text-slate-800 mb-1.5">
                  Active Staff Walkers & Handlers ({activeWalker?.staffMembers?.length || 2}):
                </div>
                <div className="space-y-1.5">
                  {(
                    activeWalker?.staffMembers || [
                      {
                        id: 'staff_1',
                        name: 'Liam O’Connor',
                        role: 'Senior Assistant Pack Handler',
                        dbsVerified: true,
                      },
                      {
                        id: 'staff_2',
                        name: 'Chloe Vance',
                        role: 'Weekend & Solo Sniffari Walker',
                        dbsVerified: true,
                      },
                    ]
                  ).map((st) => (
                    <div
                      key={st.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{st.name}</span>
                        <span className="text-slate-500 ml-2">· {st.role}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        DBS Verified ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-1">Active Multiple Service Areas:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0f5132] text-white font-bold text-[11px]">
                    Primary: {activeWalker?.location} ({activeWalker?.postcodeArea})
                  </span>
                  {(
                    activeWalker?.additionalServiceAreas || [
                      'Highgate (N6)',
                      'Primrose Hill (NW1)',
                      'St John’s Wood (NW8)',
                    ]
                  ).map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200 font-bold text-[11px]"
                    >
                      + {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Dog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Dog to {activePack.packName}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Local council bylaws enforce a maximum of 4 dogs per certified handler.
            </p>

            <form onSubmit={handleAddDog} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dog Name</label>
                <input
                  type="text"
                  required
                  value={newDogName}
                  onChange={(e) => setNewDogName(e.target.value)}
                  placeholder="e.g. Barnaby"
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Breed</label>
                <select
                  value={newDogBreed}
                  onChange={(e) => setNewDogBreed(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Cockapoo">Cockapoo</option>
                  <option value="Miniature Schnauzer">Miniature Schnauzer</option>
                  <option value="Labrador Retriever">Labrador Retriever</option>
                  <option value="Whippet">Whippet</option>
                  <option value="Dachshund">Dachshund</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-lg transition-colors"
                >
                  Confirm & Add to Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dog Care Profile Modal when Walker Clicks any Dog */}
      <WalkerDogProfileModal
        dogNameOrId={inspectingDogName}
        onClose={() => setInspectingDogName(null)}
        onMessageOwner={(dogName) => {
          const found = activePack.currentDogs.find(
            (d) => d.name.toLowerCase() === dogName.toLowerCase()
          );
          if (found) {
            setSelectedChatDogId(found.id);
          }
          const chatEl = document.getElementById('walker-live-chat-panel');
          chatEl?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
};
