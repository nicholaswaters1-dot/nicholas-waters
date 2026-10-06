import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { SoloWalkMeetup, RecordedPersonalWalk, PetOwnerFriend, PupTrainingTask, TrainingReward } from '../../types';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';
import {
  Users,
  Compass,
  Play,
  Square,
  Pause,
  MapPin,
  Calendar,
  Clock,
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  Plus,
  MessageCircle,
  UserPlus,
  UserCheck,
  Send,
  Camera,
  Activity,
  Droplets,
  Heart,
  Share2,
  X,
  Radio,
  Flame,
  Star,
  Gift,
  ShieldAlert,
} from 'lucide-react';
import { HouseholdUserSwitcher } from '../common/HouseholdUserSwitcher';
import { SosHelpModal } from '../common/SosHelpModal';

export const PawMatesCommunity: React.FC = () => {
  const {
    dogs,
    activeDog,
    meetups,
    toggleRsvpMeetup,
    createMeetup,
    recordedWalks,
    saveRecordedWalk,
    friends,
    toggleFriend,
    trainingTasks,
    toggleTrainingTask,
    pawPoints,
    rewards,
    claimReward,
    showToast,
    openShareModal,
  } = useMarketplace();

  const [activeSubTab, setActiveSubTab] = useState<'linkups' | 'tracker' | 'friends' | 'training'>('linkups');
  const [sosModalOpen, setSosModalOpen] = useState(false);

  // New Meetup Modal state
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [newMeetupPark, setNewMeetupPark] = useState('Hampstead Heath Sandy Woods');
  const [newMeetupPostcode, setNewMeetupPostcode] = useState('NW3');
  const [newMeetupDate, setNewMeetupDate] = useState('Tomorrow, 10:30 AM');
  const [newMeetupDesc, setNewMeetupDesc] = useState('Casual off-lead morning social for friendly, playful dogs.');
  const [newMeetupDog, setNewMeetupDog] = useState(activeDog.name);

  // Live Walk Recorder state
  const [isWalking, setIsWalking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0.0);
  const [peeCount, setPeeCount] = useState(0);
  const [poopCount, setPoopCount] = useState(0);
  const [waterMl, setWaterMl] = useState(0);
  const [walkPhotos, setWalkPhotos] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Chat between dog owners state
  const [activeChatFriend, setActiveChatFriend] = useState<PetOwnerFriend | null>(null);
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});
  const [friendMessages, setFriendMessages] = useState<Record<string, { id: string; sender: 'me' | 'them'; text: string; time: string }[]>>({
    fr_1: [
      { id: '1', sender: 'them', text: "Hey Oliver! Are you and Buster heading up to the Heath this Saturday?", time: 'Yesterday' },
      { id: '2', sender: 'me', text: "Yes! Planning on the 10:30 AM Link-Up near Parliament Hill. Luna coming along?", time: 'Yesterday' },
      { id: '3', sender: 'them', text: "Definitely! She loved bounding through the long grass with Buster last time.", time: '10:14 AM' },
    ],
    fr_2: [
      { id: '1', sender: 'them', text: "Hi! Milo is loving the scent trail on our long line walks.", time: '2 days ago' },
    ],
  });

  // Timer for walk recorder
  useEffect(() => {
    let interval: any = null;
    if (isWalking && !isPaused) {
      interval = setInterval(() => {
        setWalkSeconds((s) => s + 1);
        setDistanceKm((d) => Math.round((d + 0.0012) * 1000) / 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isWalking, isPaused]);

  // Live GPS Route Animation Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background terrain
    ctx.fillStyle = '#ecfdf5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Park trees and pond
    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.arc(80, 70, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.ellipse(320, 110, 60, 35, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Route path
    ctx.strokeStyle = '#0f5132';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([6, 3]);

    ctx.beginPath();
    ctx.moveTo(60, 160);
    ctx.quadraticCurveTo(140, 60, 240, 90);
    ctx.quadraticCurveTo(340, 120, 380, 60);
    ctx.stroke();

    // Start Pin
    ctx.setLineDash([]);
    ctx.fillStyle = '#0f5132';
    ctx.beginPath();
    ctx.arc(60, 160, 6, 0, Math.PI * 2);
    ctx.fill();

    // Current walking head
    const progress = Math.min(1, walkSeconds / 90);
    const currX = 60 + progress * 320;
    const currY = 160 - Math.sin(progress * Math.PI) * 80;

    // Glowing ring
    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.beginPath();
    ctx.arc(currX, currY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Pulsing head
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(currX, currY, 7, 0, Math.PI * 2);
    ctx.fill();
  }, [walkSeconds, isWalking]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWalk = () => {
    setIsWalking(true);
    setIsPaused(false);
    setWalkSeconds(0);
    setDistanceKm(0.0);
    setPeeCount(0);
    setPoopCount(0);
    setWaterMl(0);
    setWalkPhotos([]);
    showToast(`Started live GPS tracking walk with ${activeDog.name}!`);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleFinishWalk = () => {
    if (walkSeconds < 5 && distanceKm === 0) {
      setIsWalking(false);
      return;
    }

    const durationMins = Math.max(1, Math.round(walkSeconds / 60));
    const pointsAwarded = Math.max(30, Math.round(distanceKm * 40) + (poopCount > 0 ? 20 : 0));

    saveRecordedWalk({
      date: 'Today, Just Now',
      dogNames: [activeDog.name],
      durationMinutes: durationMins,
      distanceKm: Math.max(0.1, distanceKm),
      pottyCount: { pee: peeCount, poop: poopCount },
      waterMl: waterMl || 250,
      routeTitle: `${activeDog.name}’s Neighborhood Adventure`,
      pawPointsEarned: pointsAwarded,
    });

    setIsWalking(false);
    setIsPaused(false);
  };

  const handleSnapPhoto = () => {
    setWalkPhotos((p) => [...p, activeDog.photoUrl]);
    showToast('Photo logged to walk diary!');
  };

  const handleHostMeetup = (e: React.FormEvent) => {
    e.preventDefault();
    createMeetup({
      ownerName: 'Oliver Harrison',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      dogName: newMeetupDog,
      dogBreed: activeDog.breed,
      dogPhoto: activeDog.photoUrl,
      date: newMeetupDate,
      time: '10:30 AM',
      parkLocation: newMeetupPark,
      postcodeArea: newMeetupPostcode,
      description: newMeetupDesc,
      dogTemperament: 'Friendly & Social · Open to all breeds',
    });
    setHostModalOpen(false);
  };

  const handleSendFriendMsg = (friendId: string) => {
    const text = chatInputs[friendId];
    if (!text?.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'me' as const,
      text: text.trim(),
      time: 'Just now',
    };

    setFriendMessages((prev) => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), newMsg],
    }));

    setChatInputs((prev) => ({ ...prev, [friendId]: '' }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner: PawMates Community Hub */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0f5132] via-[#0c3e29] to-[#0f5132] text-white p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Pet Owner Social & Community Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              PawMates: Meet, Walk & Train Together
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Connect with fellow dog parents, host solo walk link-ups in local parks, record personal walks with live GPS tracking, and complete fun pup training challenges for Paw Points!
            </p>
          </div>

          {/* Paw Points XP Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-xs">
              🐾
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Paw Points Balance
              </div>
              <div className="text-2xl font-black text-white flex items-baseline gap-1">
                <span>{pawPoints}</span>
                <span className="text-xs font-semibold text-emerald-200">PTS</span>
              </div>
              <div className="text-[10px] text-emerald-200">Level 3: Pack Pioneer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Partner Banner */}
      <SponsoredAdBanner category="Pet Boutique & Food" />

      {/* Sub-Navigation Tabs (Wraps cleanly inside screen) */}
      <div className="flex flex-wrap border-b border-slate-200 pb-2 gap-2 text-xs font-semibold max-w-full">
        <button
          onClick={() => setActiveSubTab('linkups')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'linkups'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Walk Link-Ups & Meetups ({meetups.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tracker')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'tracker'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Live Walk Tracker & Recorder</span>
          {isWalking && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
        </button>

        <button
          onClick={() => setActiveSubTab('friends')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'friends'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Dog Parent Friends ({friends.filter((f) => f.isFriend).length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('training')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'training'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Pup Academy & Points Rewards</span>
        </button>
      </div>

      {/* TAB 1: SOLO WALK LINK-UPS & MEETUPS */}
      {activeSubTab === 'linkups' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Neighborhood Solo Walk Link-Ups</h2>
              <p className="text-xs text-slate-500">
                Join casual dog walking meetups or host your own in local British parks!
              </p>
            </div>

            <button
              onClick={() => setHostModalOpen(true)}
              className="px-4 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Host a Walk Link-Up</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {meetups.map((meetup) => (
              <div
                key={meetup.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={meetup.dogPhoto}
                        alt={meetup.dogName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{meetup.dogName}’s Link-Up</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                            {meetup.postcodeArea}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          Hosted by {meetup.ownerName} ({meetup.dogBreed})
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      {meetup.attendeesCount} Attending
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{meetup.description}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{meetup.parkLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{meetup.date}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Temperament: <strong>{meetup.dogTemperament}</strong></span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Off-lead friendly</span>

                  <button
                    onClick={() => toggleRsvpMeetup(meetup.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      meetup.userRsvp
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-[#0f5132] text-white hover:bg-[#0c3e29]'
                    }`}
                  >
                    {meetup.userRsvp ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>You're Attending!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Join Walk Link-Up</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WALK TRACKER & RECORDER */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={activeDog.photoUrl}
                  alt={activeDog.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>Live GPS Walk Recorder</span>
                    {isWalking && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                        Active Walk with {activeDog.name}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track distance, pace, potty stops, and earn Paw Points for daily fitness!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {!isWalking ? (
                  <button
                    onClick={handleStartWalk}
                    className="px-5 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Solo Walk</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handlePauseResume}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5 fill-slate-700" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>

                    <button
                      onClick={() => setSosModalOpen(true)}
                      className="px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md animate-pulse"
                      title="Trigger Emergency SOS Call with Live GPS"
                    >
                      <ShieldAlert className="w-4 h-4 text-white" />
                      <span>SOS Help</span>
                    </button>

                    <button
                      onClick={handleFinishWalk}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      <span>Finish & Save</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Duration</div>
                <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                  {formatTimer(walkSeconds)}
                </div>
                <div className="text-[10px] text-slate-500">Live Timer</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Distance</div>
                <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                  {distanceKm.toFixed(2)} <span className="text-xs font-semibold text-slate-500">km</span>
                </div>
                <div className="text-[10px] text-slate-500">GPS Breadcrumbs</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Potty Log</div>
                <div className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <span>💧 {peeCount}</span>
                  <span>💩 {poopCount}</span>
                </div>
                <div className="text-[10px] text-slate-500">Health Tracker</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Paw Points</div>
                <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
                  +{Math.max(10, Math.round(distanceKm * 40) + (poopCount > 0 ? 20 : 0))}
                </div>
                <div className="text-[10px] text-slate-500">Estimated XP</div>
              </div>
            </div>

            {/* Live GPS Canvas Map */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-64 bg-slate-100">
              <canvas
                ref={canvasRef}
                width={800}
                height={260}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 shadow-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hampstead Heath Loop Trail (NW3)</span>
              </div>

              {isWalking && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPeeCount((p) => p + 1);
                      showToast('Pee break logged!');
                    }}
                    className="px-3 py-1.5 bg-white/95 text-slate-800 hover:bg-white text-xs font-bold rounded-xl border border-slate-200 shadow-sm"
                  >
                    💧 Pee
                  </button>
                  <button
                    onClick={() => {
                      setPoopCount((p) => p + 1);
                      showToast('Poop logged!');
                    }}
                    className="px-3 py-1.5 bg-white/95 text-slate-800 hover:bg-white text-xs font-bold rounded-xl border border-slate-200 shadow-sm"
                  >
                    💩 Poop
                  </button>
                  <button
                    onClick={handleSnapPhoto}
                    className="px-3 py-1.5 bg-[#0f5132] text-white hover:bg-[#0c3e29] text-xs font-bold rounded-xl shadow-sm flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Past Recorded Walks Log */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Past Recorded Solo Walks</h3>
            <div className="space-y-3">
              {recordedWalks.map((walk) => (
                <div
                  key={walk.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{walk.routeTitle}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                        +{walk.pawPointsEarned} XP
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>{walk.date}</span>
                      <span>·</span>
                      <span>{walk.distanceKm} km ({walk.durationMinutes} mins)</span>
                      <span>·</span>
                      <span>💧 {walk.pottyCount.pee} pees, 💩 {walk.pottyCount.poop} poops</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-800">
                      Dogs: {walk.dogNames.join(', ')}
                    </span>
                    <button
                      onClick={() =>
                        openShareModal({
                          title: walk.routeTitle,
                          distanceKm: walk.distanceKm,
                          durationMinutes: walk.durationMinutes,
                          dogNames: walk.dogNames,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Share walk to social media"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FRIENDS & DOG PARENT CHAT */}
      {activeSubTab === 'friends' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Friends List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Local Dog Parent Friends</h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                {friends.filter((f) => f.isFriend).length} Connected
              </span>
            </div>

            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    activeChatFriend?.id === friend.id
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setActiveChatFriend(friend)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{friend.name}</div>
                      <div className="text-xs text-slate-500">
                        {friend.dogName} ({friend.dogBreed}) · {friend.neighborhood}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFriend(friend.id);
                      }}
                      className={`p-2 rounded-xl text-xs transition-colors ${
                        friend.isFriend
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title={friend.isFriend ? 'Connected Friend' : 'Add to Friends'}
                    >
                      {friend.isFriend ? <UserCheck className="w-4 h-4 text-emerald-700" /> : <UserPlus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col h-[520px]">
            {activeChatFriend ? (
              <>
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeChatFriend.avatar}
                      alt={activeChatFriend.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{activeChatFriend.name}</h4>
                      <p className="text-xs text-slate-500">
                        Owner of {activeChatFriend.dogName} · {activeChatFriend.neighborhood}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Online to Chat
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {(friendMessages[activeChatFriend.id] || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'me'
                            ? 'bg-[#0f5132] text-white rounded-tr-xs'
                            : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={`text-[10px] mt-1 text-right ${
                            msg.sender === 'me' ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendFriendMsg(activeChatFriend.id);
                  }}
                  className="pt-3 border-t border-slate-100 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInputs[activeChatFriend.id] || ''}
                    onChange={(e) =>
                      setChatInputs((prev) => ({ ...prev, [activeChatFriend.id]: e.target.value }))
                    }
                    placeholder={`Message ${activeChatFriend.name} about a walk playdate...`}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-900"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-2">
                <MessageCircle className="w-10 h-10 text-slate-300" />
                <p className="text-xs">Select a local dog parent to start chatting and coordinate walks!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PUP ACADEMY TRAINING & REWARDS */}
      {activeSubTab === 'training' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50 border border-amber-200/80 rounded-2xl p-5">
            <div className="space-y-1">
              <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span>Pup Academy: Train, Earn & Redeem Points</span>
              </h3>
              <p className="text-xs text-amber-900/90">
                Complete daily positive-reinforcement training exercises with your dog to unlock perks and vouchers!
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-amber-800">Your XP Balance:</span>
              <div className="text-2xl font-black text-amber-900">{pawPoints} PTS</div>
            </div>
          </div>

          {/* Section 1: Training Tasks */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Active Training Challenges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                    task.completed ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {task.category} · {task.difficulty}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{task.title}</h4>
                      </div>

                      <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl">
                        +{task.points} PTS
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800 text-[11px] mb-1">Steps to complete:</div>
                      {task.steps.map((st, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-emerald-700 font-bold">{i + 1}.</span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {task.completed ? 'Completed & Rewarded' : 'Reward available'}
                    </span>

                    <button
                      onClick={() => toggleTrainingTask(task.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        task.completed
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-[#0f5132] text-white hover:bg-[#0c3e29]'
                      }`}
                    >
                      {task.completed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Challenge Completed!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Mark Complete (+{task.points} XP)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Reward Redemption Store */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-700" />
              <span>Paw Points Rewards Store</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {reward.category}
                      </span>
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {reward.costPoints} PTS
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">
                      {reward.title}
                    </h4>

                    <p className="text-[11px] text-slate-500">Provided by {reward.partner}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    {reward.claimed ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-center">
                        <span className="text-[10px] text-emerald-800 font-bold block">Redeemed Code:</span>
                        <span className="text-xs font-mono font-black text-[#0f5132]">{reward.code}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => claimReward(reward.id)}
                        disabled={pawPoints < reward.costPoints}
                        className="w-full py-2 bg-[#0f5132] hover:bg-[#0c3e29] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                      >
                        Redeem Reward
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Host Solo Walk Link-Up Modal */}
      {hostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Host a Solo Walk Link-Up</h3>
              <button
                onClick={() => setHostModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleHostMeetup} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Which dog are you walking?</label>
                <select
                  value={newMeetupDog}
                  onChange={(e) => setNewMeetupDog(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {dogs.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.breed})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Park Location</label>
                  <input
                    type="text"
                    value={newMeetupPark}
                    onChange={(e) => setNewMeetupPark(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Postcode Area</label>
                  <input
                    type="text"
                    value={newMeetupPostcode}
                    onChange={(e) => setNewMeetupPostcode(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date & Time</label>
                <input
                  type="text"
                  value={newMeetupDate}
                  onChange={(e) => setNewMeetupDate(e.target.value)}
                  required
                  placeholder="e.g. Saturday, 10:30 AM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Social Style</label>
                <textarea
                  rows={3}
                  value={newMeetupDesc}
                  onChange={(e) => setNewMeetupDesc(e.target.value)}
                  required
                  placeholder="Friendly puppy socialization, long line sniffs, etc..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHostModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-xl font-bold shadow-xs"
                >
                  Publish Walk Link-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Call for Help (SOS) Modal */}
      <SosHelpModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        currentLocationName="Hampstead Heath West Woods (NW3)"
        currentGpsCoords="51.5606° N, 0.1631° W"
      />
    </div>
  );
};
