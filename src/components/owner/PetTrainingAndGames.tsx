import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  Volume2,
  BookOpen,
  Brain,
  RotateCcw,
  Check,
  Star,
  Flame,
  Zap,
  Crown,
  Medal,
  ShieldCheck,
  Mic,
  MicOff,
  Loader2,
  CloudUpload,
  LogIn,
  Smartphone,
  MapPin,
} from 'lucide-react';
import {
  auth,
  db,
  signInWithGoogle,
  syncLeaderboardScore,
  LeaderboardDoc,
} from '../../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsBonus: number;
  checkUnlocked: (stats: {
    masteredCount: number;
    gamesCompletedCount: number;
    quizScore: number;
    quizCompleted: boolean;
    voiceLogCount: number;
  }) => boolean;
}

const BADGE_CATALOG: BadgeDefinition[] = [
  {
    id: 'badge_first_paw',
    name: 'First Paw Print',
    description: 'Master at least 3 foundation obedience tricks',
    icon: '🐾',
    pointsBonus: 50,
    checkUnlocked: (s) => s.masteredCount >= 3,
  },
  {
    id: 'badge_recall_pro',
    name: 'Rocket Recall Champion',
    description: 'Master 5+ tricks including off-lead safety cues',
    icon: '🚀',
    pointsBonus: 100,
    checkUnlocked: (s) => s.masteredCount >= 5,
  },
  {
    id: 'badge_trick_grandmaster',
    name: 'Canine Trick Grandmaster',
    description: 'Master at least 8 tricks in the curriculum',
    icon: '👑',
    pointsBonus: 200,
    checkUnlocked: (s) => s.masteredCount >= 8,
  },
  {
    id: 'badge_scent_detective',
    name: 'Sniffari Scent Detective',
    description: 'Complete 2+ interactive enrichment & brain games',
    icon: '🔍',
    pointsBonus: 75,
    checkUnlocked: (s) => s.gamesCompletedCount >= 2,
  },
  {
    id: 'badge_scholar',
    name: 'Canine IQ Scholar',
    description: 'Complete the Canine IQ Trivia Quiz with 3+ correct answers',
    icon: '🎓',
    pointsBonus: 120,
    checkUnlocked: (s) => s.quizCompleted && s.quizScore >= 3,
  },
  {
    id: 'badge_voice_trainer',
    name: 'Voice Diary Trainer',
    description: 'Record a voice training log using AI Audio Transcription',
    icon: '🎙️',
    pointsBonus: 80,
    checkUnlocked: (s) => s.voiceLogCount >= 1,
  },
];

const INITIAL_COMMUNITY_LEADERBOARD: LeaderboardDoc[] = [
  {
    uid: 'comm_1',
    ownerName: 'Amelia & Barnaby',
    dogName: 'Barnaby',
    dogBreed: 'Golden Retriever · Hampstead NW3',
    points: 940,
    rankTitle: 'Grandmaster Pack Leader',
    masteredTricksCount: 9,
    gamesCompletedCount: 6,
    badges: [
      'First Paw Print',
      'Rocket Recall Champion',
      'Canine Trick Grandmaster',
      'Sniffari Scent Detective',
      'Canine IQ Scholar',
    ],
    updatedAt: '2 mins ago',
  },
  {
    uid: 'comm_2',
    ownerName: 'Marcus & Luna',
    dogName: 'Luna',
    dogBreed: 'Border Collie · Richmond TW9',
    points: 815,
    rankTitle: 'Grandmaster Pack Leader',
    masteredTricksCount: 8,
    gamesCompletedCount: 5,
    badges: [
      'First Paw Print',
      'Rocket Recall Champion',
      'Canine Trick Grandmaster',
      'Sniffari Scent Detective',
    ],
    updatedAt: '14 mins ago',
  },
  {
    uid: 'comm_3',
    ownerName: 'Priya & Winston',
    dogName: 'Winston',
    dogBreed: 'French Bulldog · Kensington W8',
    points: 610,
    rankTitle: 'Canine Academy Champion',
    masteredTricksCount: 6,
    gamesCompletedCount: 4,
    badges: ['First Paw Print', 'Rocket Recall Champion', 'Canine IQ Scholar'],
    updatedAt: '1 hour ago',
  },
  {
    uid: 'comm_4',
    ownerName: 'Callum & Skye',
    dogName: 'Skye',
    dogBreed: 'Cockapoo · Wimbledon SW19',
    points: 445,
    rankTitle: 'Pack Scholar',
    masteredTricksCount: 5,
    gamesCompletedCount: 2,
    badges: ['First Paw Print', 'Rocket Recall Champion'],
    updatedAt: '3 hours ago',
  },
  {
    uid: 'comm_5',
    ownerName: 'Hannah & Milo',
    dogName: 'Milo',
    dogBreed: 'Dachshund · Clapham SW4',
    points: 290,
    rankTitle: 'Rising Star Pup',
    masteredTricksCount: 3,
    gamesCompletedCount: 1,
    badges: ['First Paw Print'],
    updatedAt: 'Today',
  },
];

export function getRankTitleFromPoints(points: number): {
  title: string;
  tierColor: string;
  nextMilestone: number;
} {
  if (points >= 800) {
    return {
      title: 'Grandmaster Pack Leader',
      tierColor: 'from-amber-400 via-yellow-500 to-amber-600 text-slate-950',
      nextMilestone: 1000,
    };
  }
  if (points >= 550) {
    return {
      title: 'Canine Academy Champion',
      tierColor: 'from-emerald-400 to-teal-600 text-white',
      nextMilestone: 800,
    };
  }
  if (points >= 350) {
    return {
      title: 'Pack Scholar',
      tierColor: 'from-sky-400 to-indigo-600 text-white',
      nextMilestone: 550,
    };
  }
  return {
    title: 'Rising Star Pup',
    tierColor: 'from-emerald-600 to-emerald-800 text-white',
    nextMilestone: 350,
  };
}

export const PetTrainingAndGames: React.FC = () => {
  const { activeDog, showToast } = useMarketplace();
  const [activeTab, setActiveTab] = useState<
    'leaderboard' | 'tips' | 'tricks' | 'clicker' | 'quiz'
  >('leaderboard');

  // Firebase Auth & Firestore Live Leaderboard state
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [cloudEntries, setCloudEntries] = useState<LeaderboardDoc[]>([]);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // Tricks state
  const [tricks, setTricks] = useState(() => {
    try {
      const saved = localStorage.getItem('mpw_training_tricks_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: '1', name: 'Sit on Cue', difficulty: 'Beginner', mastered: true, tip: 'Lure treat from nose to forehead until rump touches floor.' },
      { id: '2', name: 'Lie Down (Drop)', difficulty: 'Beginner', mastered: true, tip: 'Lower treat in a straight line between paws.' },
      { id: '3', name: 'Stay (30 Seconds)', difficulty: 'Intermediate', mastered: true, tip: 'Build distance gradually; reward returning to starting position.' },
      { id: '4', name: 'High-Five / Give Paw', difficulty: 'Beginner', mastered: false, tip: 'Hold treat in closed fist; mark when paw touches hand.' },
      { id: '5', name: 'Bulletproof Recall ("Come")', difficulty: 'Intermediate', mastered: true, tip: 'Never call dog to punish. Make returning the highest reward event of the day.' },
      { id: '6', name: 'Leave It / Drop It', difficulty: 'Intermediate', mastered: false, tip: 'Cover treat on floor; reward eye contact away from the food.' },
      { id: '7', name: 'Spin in a Circle', difficulty: 'Intermediate', mastered: false, tip: 'Guide nose in full 360 circle with a tasty bite.' },
      { id: '8', name: 'Loose-Lead Heel Walk', difficulty: 'Advanced', mastered: false, tip: 'Turn into a tree when leash goes taut; walk only when slack.' },
      { id: '9', name: 'Roll Over', difficulty: 'Advanced', mastered: false, tip: 'From down position, lure treat toward shoulder blade.' },
      { id: '10', name: 'Weave Through Legs', difficulty: 'Advanced', mastered: false, tip: 'Step forward and lure through alternating legs.' },
    ];
  });

  const [completedGameIds, setCompletedGameIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mpw_completed_games_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['game_1'];
  });

  const [gamePointsEarned, setGamePointsEarned] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mpw_game_points_v2');
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 35;
  });

  // Voice Note Transcription state (gemini-3.5-transcribe)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [voiceTrainingLogs, setVoiceTrainingLogs] = useState<
    { id: string; text: string; date: string; dogName: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem('mpw_voice_training_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'vlog_1',
        text: 'Practiced 30-second stay at Hampstead Heath gate with distractions; Buster held eye contact for 40 seconds!',
        date: 'Yesterday',
        dogName: 'Buster',
      },
    ];
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Quiz state
  const quizQuestions = [
    {
      q: 'When your dog yawns while being hugged, what is this typically a sign of?',
      options: [
        'They are tired and ready for a nap',
        'It is a calming stress signal asking for personal space',
        'They are excited and wanting to play',
        'They are hungry',
      ],
      correct: 1,
      explanation:
        'Yawning, lip licking, and turning away are common subtle displacement/calming signals dogs use when feeling overwhelmed or constrained.',
    },
    {
      q: 'What is the "Rule of 3s" when adopting or welcoming a rescue dog?',
      options: [
        '3 walks, 3 treats, 3 toys',
        '3 hours to sleep, 3 days to feed, 3 weeks to train',
        '3 days to decompress, 3 weeks to learn routine, 3 months to feel at home',
        '3 vaccinations required by law',
      ],
      correct: 2,
      explanation:
        'The 3-3-3 rule represents the decompression timeline: 3 days of feeling overwhelmed, 3 weeks settling into daily patterns, and 3 months building true trust.',
    },
    {
      q: 'Why should you avoid letting your dog pull when walking on a regular neck collar?',
      options: [
        'It ruins their coat fur',
        'Excessive pulling can cause trachea collapse and intraocular pressure',
        'It slows down the walk',
        'It drains their energy too quickly',
      ],
      correct: 1,
      explanation:
        'Heavy cervical pulling strains the delicate thyroid gland and windpipe. Using a Y-shaped front-clip harness protects their neck.',
    },
    {
      q: 'Which common food is highly toxic to dogs even in tiny amounts?',
      options: [
        'Cooked plain rice',
        'Xylitol (birch bark sweetener in peanut butter & gum)',
        'Blueberries',
        'Pumpkin puree',
      ],
      correct: 1,
      explanation:
        'Xylitol causes rapid, severe hypoglycemia (blood sugar crash) and acute liver failure in dogs within 30 minutes.',
    },
  ];

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(3);
  const [quizFinished, setQuizFinished] = useState(false);

  // Persist local changes
  useEffect(() => {
    try {
      localStorage.setItem('mpw_training_tricks_v2', JSON.stringify(tricks));
      localStorage.setItem('mpw_completed_games_v2', JSON.stringify(completedGameIds));
      localStorage.setItem('mpw_game_points_v2', String(gamePointsEarned));
      localStorage.setItem('mpw_voice_training_logs', JSON.stringify(voiceTrainingLogs));
    } catch {
      // ignore storage quota errors
    }
  }, [tricks, completedGameIds, gamePointsEarned, voiceTrainingLogs]);

  // Listen to Firebase Auth & Firestore Leaderboard
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setFbUser(u);
    });

    const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'), limit(20));
    const unsubBoard = onSnapshot(
      q,
      (snap) => {
        const docs: LeaderboardDoc[] = [];
        snap.forEach((d) => {
          docs.push(d.data() as LeaderboardDoc);
        });
        setCloudEntries(docs);
      },
      () => {
        // Fallback silently if offline
      }
    );

    return () => {
      unsubAuth();
      unsubBoard();
    };
  }, []);

  const masteredCount = tricks.filter((t: any) => t.mastered).length;

  // Compute unlocked badges and total milestone points
  const unlockedBadges = BADGE_CATALOG.filter((b) =>
    b.checkUnlocked({
      masteredCount,
      gamesCompletedCount: completedGameIds.length,
      quizScore,
      quizCompleted: true,
      voiceLogCount: voiceTrainingLogs.length,
    })
  );

  const badgeBonusPoints = unlockedBadges.reduce((acc, b) => acc + b.pointsBonus, 0);
  const totalUserPoints =
    masteredCount * 50 + gamePointsEarned + quizScore * 25 + badgeBonusPoints;
  const rankInfo = getRankTitleFromPoints(totalUserPoints);

  // Merge current user + cloud entries + community entries into sorted leaderboard
  const currentUserEntry: LeaderboardDoc = {
    uid: fbUser?.uid || 'local_current_user',
    ownerName: fbUser?.displayName
      ? `${fbUser.displayName} & ${activeDog?.name || 'Buster'} (You)`
      : `Oliver & ${activeDog?.name || 'Buster'} (You)`,
    dogName: activeDog?.name || 'Buster',
    dogBreed: `${activeDog?.breed || 'Golden Retriever'} · Hampstead NW3`,
    points: totalUserPoints,
    rankTitle: rankInfo.title,
    masteredTricksCount: masteredCount,
    gamesCompletedCount: completedGameIds.length,
    badges: unlockedBadges.map((b) => b.name),
    updatedAt: 'Live Now',
  };

  const combinedLeaderboard = (() => {
    const map = new Map<string, LeaderboardDoc>();
    INITIAL_COMMUNITY_LEADERBOARD.forEach((item) => map.set(item.uid, item));
    cloudEntries.forEach((item) => map.set(item.uid, item));
    map.set(currentUserEntry.uid, currentUserEntry);
    return Array.from(map.values()).sort((a, b) => b.points - a.points);
  })();

  const userRankPosition =
    combinedLeaderboard.findIndex((e) => e.uid === currentUserEntry.uid) + 1;

  // Sync score to Firebase Firestore when signed in
  const handleSyncToCloudLeaderboard = async () => {
    setIsSyncingCloud(true);
    try {
      let currentUser = fbUser;
      if (!currentUser) {
        currentUser = await signInWithGoogle();
        setFbUser(currentUser);
      }
      if (currentUser) {
        await syncLeaderboardScore(currentUser, {
          dogName: activeDog?.name || 'Buster',
          dogBreed: `${activeDog?.breed || 'Golden Retriever'} · NW3`,
          points: totalUserPoints,
          rankTitle: rankInfo.title,
          masteredTricksCount: masteredCount,
          gamesCompletedCount: completedGameIds.length,
          badges: unlockedBadges.map((b) => b.name),
        });
        showToast(
          `Synced ${totalUserPoints} pts & ${unlockedBadges.length} badges to the live Cloud Leaderboard!`
        );
      }
    } catch (err: any) {
      showToast('Score saved locally and updated on your device leaderboard!');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Microphone recording + gemini-3.5-transcribe
  const handleToggleVoiceNote = async () => {
    if (isRecordingAudio) {
      mediaRecorderRef.current?.stop();
      setIsRecordingAudio(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });

        setIsTranscribingAudio(true);
        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64String,
                mimeType: audioBlob.type || 'audio/webm',
              }),
            });
            const data = await res.json();
            const transcribedText =
              data.transcript?.trim() ||
              `Completed 15-minute recall and heel training session with ${activeDog?.name || 'Buster'} in the park.`;

            const newLog = {
              id: `vlog_${Date.now()}`,
              text: transcribedText,
              date: 'Just now',
              dogName: activeDog?.name || 'Buster',
            };
            setVoiceTrainingLogs((prev) => [newLog, ...prev]);
            setGamePointsEarned((p) => p + 30);
            showToast('Voice note transcribed with Gemini Audio & +30 Pts awarded!');
            setIsTranscribingAudio(false);
          };
          reader.readAsDataURL(audioBlob);
        } catch {
          setIsTranscribingAudio(false);
          showToast('Could not transcribe audio right now.');
        }
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      showToast('Listening... Speak your training milestone, then tap Stop.');
    } catch {
      showToast('Microphone permission unavailable in this browser frame.');
    }
  };

  // Sound generator using Web Audio API for 100% offline reliability
  const playClickerSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
      showToast('Click! Reward with a high-value treat immediately.');
    } catch {
      showToast('Click!');
    }
  };

  const playWhistleSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(3800, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
      showToast('High-frequency recall whistle emitted!');
    } catch {
      showToast('Recall Whistle!');
    }
  };

  const toggleTrick = (id: string) => {
    setTricks((prev: any[]) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.mastered;
          if (nextState) {
            showToast(`Milestone Unlocked: "${t.name}" mastered! +50 Leaderboard Points!`);
          }
          return { ...t, mastered: nextState };
        }
        return t;
      })
    );
  };

  const handleCompleteGame = (gameId: string, gameName: string, pts: number) => {
    if (!completedGameIds.includes(gameId)) {
      setCompletedGameIds((prev) => [...prev, gameId]);
    }
    setGamePointsEarned((prev) => prev + pts);
    showToast(
      `Played "${gameName}" with ${activeDog?.name || 'Buster'}! Climbed leaderboard with +${pts} Pup Points!`
    );
  };

  const handleAnswer = (optionIdx: number) => {
    setSelectedAnswer(optionIdx);
    if (optionIdx === quizQuestions[currentQuizIndex].correct) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex((i) => i + 1);
    } else {
      setQuizFinished(true);
      showToast('Canine IQ Quiz Complete! Points added to your Leaderboard Rank!');
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Mobile-First Hero Banner with Rank, Points & Quick Stats */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0f5132] via-[#0c3e29] to-slate-950 text-white p-5 sm:p-7 shadow-md border border-emerald-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-extrabold">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Rank #{userRankPosition} · {rankInfo.title}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-[11px] font-bold">
                <Smartphone className="w-3 h-3" />
                <span>Mobile Touch Optimised</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pet Training, Games & Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Complete trick milestones, play enrichment brain games, earn verified badges, and climb the national UK pack ranks with {activeDog?.name || 'Buster'}.
            </p>
          </div>

          {/* Live Score & Rank Card */}
          <div className="bg-slate-950/60 border border-emerald-700/60 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="grid grid-cols-3 gap-3 text-center flex-1">
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-black text-amber-400">{totalUserPoints}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Total Pts</div>
              </div>
              <div className="px-2 border-x border-emerald-800/80">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">
                  {unlockedBadges.length}/{BADGE_CATALOG.length}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Badges</div>
              </div>
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-black text-white">
                  {masteredCount}/{tricks.length}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Tricks</div>
              </div>
            </div>

            <button
              onClick={handleSyncToCloudLeaderboard}
              disabled={isSyncingCloud}
              className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0 min-h-[44px]"
            >
              {isSyncingCloud ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CloudUpload className="w-4 h-4" />
              )}
              <span>{fbUser ? 'Sync Cloud Rank' : 'Sign In & Save Rank'}</span>
            </button>
          </div>
        </div>

        {/* Next Rank Progress Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-emerald-200 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Tier: <strong className="text-white">{rankInfo.title}</strong></span>
            </span>
            <span className="text-amber-300 font-extrabold">
              {totalUserPoints} / {rankInfo.nextMilestone} pts to next rank
            </span>
          </div>
          <div className="w-full h-2.5 bg-emerald-950 rounded-full overflow-hidden p-0.5 border border-emerald-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((totalUserPoints / rankInfo.nextMilestone) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Large Mobile-Friendly Pill Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-extrabold transition-all min-h-[46px] ${
            activeTab === 'leaderboard'
              ? 'bg-[#0f5132] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Leaderboard & Badges</span>
        </button>

        <button
          onClick={() => setActiveTab('tricks')}
          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-extrabold transition-all min-h-[46px] ${
            activeTab === 'tricks'
              ? 'bg-[#0f5132] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Milestones ({masteredCount}/{tricks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-extrabold transition-all min-h-[46px] ${
            activeTab === 'tips'
              ? 'bg-[#0f5132] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Tips & Brain Games</span>
        </button>

        <button
          onClick={() => setActiveTab('clicker')}
          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-extrabold transition-all min-h-[46px] ${
            activeTab === 'clicker'
              ? 'bg-[#0f5132] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Volume2 className="w-4 h-4 text-sky-500 shrink-0" />
          <span>Clicker & Whistle</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-extrabold transition-all min-h-[46px] ${
            activeTab === 'quiz'
              ? 'bg-[#0f5132] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Brain className="w-4 h-4 text-purple-500 shrink-0" />
          <span>Canine IQ Quiz</span>
        </button>
      </div>

      {/* TAB 0: LEADERBOARD & EARNED BADGES */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {combinedLeaderboard.slice(0, 3).map((entry, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const isCurrentUser = entry.uid === currentUserEntry.uid;
              return (
                <div
                  key={entry.uid}
                  className={`relative rounded-3xl p-5 border transition-all ${
                    isFirst
                      ? 'bg-gradient-to-b from-amber-50/90 via-white to-white border-amber-300 shadow-md ring-2 ring-amber-200/70'
                      : isCurrentUser
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                        : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                        isFirst
                          ? 'bg-amber-400 text-slate-950'
                          : isSecond
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isFirst ? '🥇 #1 Pack Leader' : isSecond ? '🥈 #2 Runner-Up' : '🥉 #3 Podium'}
                    </span>
                    <span className="text-lg font-black text-[#0f5132]">{entry.points} pts</span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                      <span>{entry.ownerName}</span>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-[#0f5132] text-white px-2 py-0.5 rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{entry.dogBreed}</div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>
                      <strong className="text-slate-900">{entry.masteredTricksCount}</strong> Tricks Mastered
                    </span>
                    <span>
                      <strong className="text-slate-900">{entry.badges.length}</strong> Badges Earned
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {entry.badges.slice(0, 3).map((bName, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-lg"
                      >
                        ★ {bName}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Standings Table + Quick Action to Climb Ranks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Live Leaderboard Standings */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>National Pet Training & Games Standings</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Updated live as owners master tricks, play brain games, and log training sessions.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('tricks')}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0f5132] font-extrabold text-xs rounded-xl transition-colors self-start sm:self-auto"
                >
                  + Complete Trick (+50 pts)
                </button>
              </div>

              <div className="space-y-2.5">
                {combinedLeaderboard.map((entry, idx) => {
                  const rank = idx + 1;
                  const isMe = entry.uid === currentUserEntry.uid;
                  return (
                    <div
                      key={entry.uid}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                        isMe
                          ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-300 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                            rank === 1
                              ? 'bg-amber-400 text-slate-950 shadow-2xs'
                              : rank === 2
                                ? 'bg-slate-300 text-slate-900'
                                : rank === 3
                                  ? 'bg-amber-200 text-amber-950'
                                  : isMe
                                    ? 'bg-[#0f5132] text-white'
                                    : 'bg-white border border-slate-200 text-slate-700'
                          }`}
                        >
                          #{rank}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                              {entry.ownerName}
                            </span>
                            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                              {entry.rankTitle}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {entry.dogBreed} · {entry.masteredTricksCount} tricks · {entry.badges.length} badges
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm sm:text-base font-black text-[#0f5132]">
                          {entry.points} <span className="text-[10px] font-bold">pts</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{entry.updatedAt}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Cols: Milestone Badges & AI Voice Training Log */}
            <div className="lg:col-span-5 space-y-5">
              {/* Earned Milestone Badges Showcase */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Medal className="w-5 h-5 text-amber-500" />
                      <span>Milestone Badges ({unlockedBadges.length}/{BADGE_CATALOG.length})</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unlock badges to earn instant bonus points on the leaderboard.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BADGE_CATALOG.map((badge) => {
                    const isUnlocked = unlockedBadges.some((b) => b.id === badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-emerald-50/90 to-amber-50/40 border-emerald-300 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 opacity-65'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-2xl">{badge.icon}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isUnlocked
                                ? 'bg-emerald-700 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isUnlocked ? `✓ +${badge.pointsBonus} pts` : `Locked (+${badge.pointsBonus})`}
                          </span>
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">{badge.name}</div>
                          <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hands-Free Voice Training Log (Gemini Audio Transcription) */}
              <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                      <Mic className="w-3 h-3" />
                      <span>Hands-Free Mobile Voice Diary</span>
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      Voice Log Training Milestones (+30 Pts)
                    </h3>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      Out on a muddy walk? Tap the microphone to speak your dog’s progress and transcribe it automatically.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleVoiceNote}
                  disabled={isTranscribingAudio}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2.5 transition-all shadow-md min-h-[48px] ${
                    isRecordingAudio
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  {isTranscribingAudio ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transcribing with Gemini Audio...</span>
                    </>
                  ) : isRecordingAudio ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop Recording & Transcribe (+30 Pts)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Tap to Record Voice Training Milestone</span>
                    </>
                  )}
                </button>

                <div className="space-y-2 pt-1">
                  {voiceTrainingLogs.slice(0, 3).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-emerald-300 font-bold">
                        <span>🎙️ {log.dogName} Training Note</span>
                        <span>{log.date}</span>
                      </div>
                      <p className="text-white/95 text-xs leading-relaxed">“{log.text}”</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: EXPERT TRAINING TIPS & INTERACTIVE BRAIN GAMES */}
      {activeTab === 'tips' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: '1. The Tree Method for Loose-Lead Walking',
                tag: 'Walking Protocol',
                desc: 'Whenever your dog pulls on the lead, stop immediately and freeze like a tree. Do not yank back. The second they turn around or slacken the lead, mark with "Yes!" and take 3 brisk steps forward.',
                badge: 'Essential Daily Habit',
              },
              {
                title: '2. The "Rocket Recall" Whistle Cue',
                tag: 'Safety Protocol',
                desc: 'Condition a 2-pip whistle cue indoors with boiled chicken. Blow twice, deliver chicken 10 times in a row. Never call your dog to end play or for a bath—always reward with jackpot treats when they return.',
                badge: 'Life Saver',
              },
              {
                title: '3. Mental Stimulation Beats 10-Mile Runs',
                tag: 'Brain Health',
                desc: '15 minutes of sniffing or solving a snuffle mat burns as much mental energy as a 45-minute sprint. Hide kibble in rolled towels or freeze peanut butter in a KONG to soothe an overstimulated pup.',
                badge: 'Calming Protocol',
              },
              {
                title: '4. Separation Decompression & Independence',
                tag: 'Anxiety Relief',
                desc: 'Practice "calm departures". Do not give dramatic emotional goodbyes. Give a long-lasting chew 5 minutes before leaving so your exit is associated with quiet luxury, not sudden abandonment.',
                badge: 'Comfort Protocol',
              },
              {
                title: '5. The Emergency "Drop It" Trade Game',
                tag: 'Resource Guarding',
                desc: 'Never chase or pry open jaws—chasing turns socks into high-value prizes. Instead, scatter 5 fragrant liver treats on the floor and say "Search!". Pick up the forbidden item while they happily feast.',
                badge: 'Zero Conflict',
              },
              {
                title: '6. Reading Canine Subtle Body Language',
                tag: 'Communication',
                desc: 'A wagging tail does NOT always mean friendly—a stiff, high, vibrating tail signals tense arousal. Relaxed soft eyes, curved bodies, and open loose jaws signal genuine contentment.',
                badge: 'Decoding Cues',
              },
              {
                title: '7. The "Engage-Disengage" Reactivity Protocol',
                tag: 'Leash Reactivity',
                desc: 'At a safe distance where your dog notices another dog without barking, mark the look with a click and deliver a treat. Soon your dog will look at triggers and immediately turn to you with a smile.',
                badge: 'Confidence Builder',
              },
              {
                title: '8. Pub & Cafe "Under-Table Settle" Mat Training',
                tag: 'Social Etiquette',
                desc: 'Bring a dedicated travel fleece mat. Drop tiny treats between your dog’s front paws every 20 seconds while they lie quietly on the mat, building a rock-solid pub & restaurant settle.',
                badge: 'Directory Perk Ready',
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {tip.tag}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    ★ {tip.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{tip.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive At-Home & Park Games for Pet Owners */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Interactive Games to Play with {activeDog?.name || 'Buster'} Today</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Fun enrichment & scent-work games designed for rainy afternoons or garden play. Tap to log game completion and climb the Leaderboard!
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                {completedGameIds.length} Games Logged
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                {
                  id: 'game_1',
                  name: 'The 3-Cup Shell Scent Game',
                  duration: '10 Mins · Indoor Brain Game',
                  points: 35,
                  howToPlay:
                    'Place 3 plastic cups upside down. Let your dog watch you hide a smelly cheese cube under one cup, shuffle slowly, and say "Find it!".',
                },
                {
                  id: 'game_2',
                  name: 'Muffin Tin Tennis Ball Puzzle',
                  duration: '15 Mins · Problem Solving',
                  points: 45,
                  howToPlay:
                    'Scatter kibble into the cups of a 12-hole muffin tin and cover each cup with a tennis ball. Your dog must nudge each ball out to win the prize.',
                },
                {
                  id: 'game_3',
                  name: 'Hide & Seek Family Recall Relay',
                  duration: '15 Mins · Recall & Impulse',
                  points: 50,
                  howToPlay:
                    'Two family members stand in different rooms. Take turns calling your dog’s name once and celebrating with a tug toy when they track you down.',
                },
                {
                  id: 'game_4',
                  name: 'Garden "Sniffari" Treasure Hunt',
                  duration: '20 Mins · Olfactory Decompression',
                  points: 40,
                  howToPlay:
                    'Hide 10 freeze-dried sprats along tree bark, flowerpots, and lawn edges. Cue "Go Sniff!" to lower heart rate and cortisol levels naturally.',
                },
              ].map((game) => {
                const played = completedGameIds.includes(game.id);
                return (
                  <div
                    key={game.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                      played
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                          {game.duration}
                        </span>
                        <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          +{game.points} Leaderboard Pts
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{game.name}</h4>
                      <p className="text-slate-600 leading-relaxed">{game.howToPlay}</p>
                    </div>
                    <button
                      onClick={() => handleCompleteGame(game.id, game.name, game.points)}
                      className="w-full py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] active:scale-98 text-white font-bold rounded-xl transition-all min-h-[42px]"
                    >
                      {played
                        ? `✓ Play Again & Claim +${game.points} Pts`
                        : `✓ Complete Game & Claim +${game.points} Pts`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRICK TRACKER */}
      {activeTab === 'tricks' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {activeDog?.name || 'Buster'}’s Trick Mastery Milestones (+50 Pts Each)
              </h3>
              <p className="text-xs text-slate-500">
                Tap any trick below to mark it as mastered and immediately climb the national leaderboard.
              </p>
            </div>
            <div className="text-xs font-extrabold text-[#0f5132] bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 self-start">
              {Math.round((masteredCount / tricks.length) * 100)}% Completed ({masteredCount * 50} pts)
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(masteredCount / tricks.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {tricks.map((trick: any) => (
              <div
                key={trick.id}
                onClick={() => toggleTrick(trick.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 min-h-[72px] ${
                  trick.mastered
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{trick.name}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        trick.difficulty === 'Beginner'
                          ? 'bg-blue-100 text-blue-800'
                          : trick.difficulty === 'Intermediate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {trick.difficulty}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-800">+50 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{trick.tip}</p>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    trick.mastered ? 'bg-[#0f5132] text-white' : 'border-2 border-slate-300 bg-white'
                  }`}
                >
                  {trick.mastered && <Check className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLICKER & SOUNDBOARD */}
      {activeTab === 'clicker' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Positive Reinforcement Soundboard</h3>
            <p className="text-xs text-slate-500">
              Operates 100% offline using your phone’s native audio synthesis. Tap to mark exact behaviors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Clicker Button */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-black text-sm text-emerald-950">Mechanical Clicker</div>
                <div className="text-[10px] text-emerald-700">Crisp 1400Hz Bridge Sound</div>
              </div>

              <button
                onClick={playClickerSound}
                className="w-28 h-28 rounded-full bg-[#0f5132] hover:bg-[#0c3e29] active:scale-95 text-white flex flex-col items-center justify-center gap-1 shadow-xl transition-all border-4 border-emerald-400 group"
              >
                <Zap className="w-8 h-8 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-black uppercase tracking-wider">CLICK</span>
              </button>

              <span className="text-[11px] text-slate-500">Pair with immediate treat reward</span>
            </div>

            {/* Whistle Button */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-50 to-blue-50 border border-indigo-200 flex flex-col items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-black text-sm text-indigo-950">Recall Whistle</div>
                <div className="text-[10px] text-indigo-700">High-Pitch 3800Hz Tone</div>
              </div>

              <button
                onClick={playWhistleSound}
                className="w-28 h-28 rounded-full bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white flex flex-col items-center justify-center gap-1 shadow-xl transition-all border-4 border-indigo-300 group"
              >
                <Volume2 className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-wider">WHISTLE</span>
              </button>

              <span className="text-[11px] text-slate-500">Cuts through loud park wind</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CANINE IQ TRIVIA QUIZ */}
      {activeTab === 'quiz' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {!quizFinished ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900">
                  Question {currentQuizIndex + 1} of {quizQuestions.length}
                </span>
                <span className="font-bold text-[#0f5132] bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Score: {quizScore} (+{quizScore * 25} Leaderboard Pts)
                </span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                {quizQuestions[currentQuizIndex].q}
              </h3>

              <div className="space-y-2.5">
                {quizQuestions[currentQuizIndex].options.map((opt, idx) => {
                  const isChosen = selectedAnswer === idx;
                  const isCorrect = idx === quizQuestions[currentQuizIndex].correct;
                  let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700';

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isChosen) {
                      btnStyle = 'bg-red-100 border-red-500 text-red-950 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between min-h-[48px] ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && isCorrect && (
                        <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2 text-emerald-950 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Expert Canine Insight:</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {quizQuestions[currentQuizIndex].explanation}
                  </p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={handleNextQuiz}
                      className="px-4 py-2 bg-[#0f5132] text-white font-bold text-xs rounded-xl hover:bg-[#0c3e29]"
                    >
                      {currentQuizIndex + 1 < quizQuestions.length
                        ? 'Next Question →'
                        : 'See Final Score 🏆'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
                🏆
              </div>
              <h3 className="text-xl font-black text-slate-900">Canine IQ Challenge Complete!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                You scored <strong>{quizScore} out of {quizQuestions.length}</strong> and earned{' '}
                <strong>+{quizScore * 25} Leaderboard Points</strong>!
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-extrabold text-xs transition-all shadow-sm"
                >
                  View Rank on Leaderboard
                </button>
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
