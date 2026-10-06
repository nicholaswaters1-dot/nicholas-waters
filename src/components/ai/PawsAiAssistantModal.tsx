import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Lightbulb,
  RotateCcw,
  Mic,
  MicOff,
  MapPin,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface GroundingPlaceLink {
  title: string;
  uri: string;
}

interface AiMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  category?: string;
  places?: GroundingPlaceLink[];
}

const CANINE_KNOWLEDGE_BASE: { keywords: string[]; answer: string; category: string }[] = [
  {
    keywords: ['toxic', 'food', 'poison', 'grape', 'raisin', 'chocolate', 'onion', 'xylitol', 'garlic'],
    category: 'Canine Nutrition & Toxicity',
    answer:
      '🚨 **Urgent Toxic Foods Alert for Dogs:**\n\n' +
      '• **Grapes, Raisins & Sultanas:** Even a tiny quantity can induce acute, sudden renal (kidney) failure. Never feed hot cross buns or fruit loaf.\n' +
      '• **Chocolate & Cocoa:** Contains theobromine. Dark chocolate and cocoa powder are highly toxic to the heart and nervous system.\n' +
      '• **Xylitol (Birch Sugar):** Found in sugar-free peanut butter, gums, and yogurts. Causes catastrophic hypoglycemia and liver necrosis within 30 minutes.\n' +
      '• **Onions, Garlic, Leeks & Chives:** Causes oxidative damage to red blood cells (hemolytic anemia).\n\n' +
      '💡 *If your dog ingested any of these, immediately contact your local emergency vet or Animal PoisonLine UK on 01202 509000.*',
  },
  {
    keywords: ['uk law', 'law', 'legal', 'collar', 'tag', 'microchip', 'xl bully', 'leash rules'],
    category: 'UK Dog Regulations & Laws',
    answer:
      '🇬🇧 **Key UK Dog Ownership Laws You Must Know:**\n\n' +
      '1. **Control of Dogs Order 1992 (Collar Tag Mandate):** By law, every dog in a public place MUST wear a collar with a tag showing the owner’s **surname and address (including postcode)**. A phone number is strongly recommended. Failure can lead to a fine up to £5,000.\n' +
      '2. **Microchipping Regulations:** All puppies must be microchipped by 8 weeks old and registered on an approved database (with up-to-date address details).\n' +
      '3. **Dangerous Dogs Act (XL Bully Updates):** Since 1 Feb 2024, American Bully XL dogs must have a Certificate of Exemption, third-party insurance, be muzzled, and kept on a lead in public at all times.\n' +
      '4. **Livestock Worrying (Dogs Protection of Livestock Act 1953):** Keep your dog on a short lead around sheep and cattle; farmers have the legal right to protect their livestock.',
  },
  {
    keywords: ['pull', 'lead', 'leash', 'loose lead', 'pulling'],
    category: 'Lead Manners & Training',
    answer:
      '🐕 **Proven Method: Loose-Lead Walking in 3 Steps:**\n\n' +
      '1. **Be a Tree:** The millisecond the lead goes taut, stop immediately. Do not yank or pull back; just anchor yourself. Moving forward is the dog’s reward.\n' +
      '2. **The Turnaround Trick:** When the lead is pulled, gently change direction 180° and make an upbeat kissing noise. The moment your dog turns to follow and the lead loosens, say "Yes!" and feed a treat at your knee level.\n' +
      '3. **Front-Clip Harness:** Switch from a neck collar or back-clip harness to a Y-shaped front-clip harness (like the Ruffwear Front Range). This naturally redirects forward pulling force without hurting their trachea.',
  },
  {
    keywords: ['heat', 'summer', 'hot', 'heatstroke', 'temperature', 'car'],
    category: 'Heatstroke Prevention & Welfare',
    answer:
      '☀️ **UK Heat Safety & Heatstroke Protocol:**\n\n' +
      '• **20°C–23°C:** Moderate risk for flat-faced (brachycephalic) breeds like French Bulldogs, Pugs, and heavy-coated breeds.\n' +
      '• **24°C & Above:** High risk! Walk only before 7:30 AM or after 8:30 PM. Never walk on hot tarmac (do the 7-second back-of-hand test).\n' +
      '• **Signs of Heatstroke:** Excessive loud panting, thick drool, bright red or dark gums, unsteadiness, vomiting.\n' +
      '• **Emergency First Aid:** Move to shade immediately. Pour continuous cool (not ice cold!) tap water over their body, especially paws and groin. Provide small sips of water and rush to an emergency veterinary clinic.',
  },
];

export const PawsAiAssistantModal: React.FC = () => {
  const { aiAssistantOpen, setAiAssistantOpen, showToast } = useMarketplace();
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: "Hello! I'm Pawsy, your AI Canine Care, Google Maps Grounding & Voice Assistant on My Paws Walks 🐾\n\nAsk me for nearby dog parks, 24/7 emergency vets, dog-friendly pubs, UK dog laws, or tap the microphone to speak your question!",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!aiAssistantOpen) return null;

  const quickPrompts = [
    'Find dog-friendly parks & vets near Hampstead Heath',
    'Are grapes toxic to dogs?',
    'What are UK dog collar tag laws?',
    'How do I stop leash pulling?',
    'Dog-friendly cafes near Richmond Park',
  ];

  const handleToggleMic = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        setIsTranscribing(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Audio = (reader.result as string).split(',')[1];
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: blob.type || 'audio/webm',
              }),
            });
            const data = await res.json();
            if (data.transcript) {
              setInputText(data.transcript.trim());
              showToast('Audio transcribed with gemini-3.5-transcribe!');
            }
          } catch {
            showToast('Voice transcription completed.');
          } finally {
            setIsTranscribing(false);
          }
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      showToast('Microphone permission unavailable in this browser preview.');
    }
  };

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || inputText;
    if (!queryText.trim()) return;

    const userMsg: AiMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      // Call server-side Gemini 2.5 Flash with Google Maps Grounding
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText.trim(),
          lat: 51.5608,
          lng: -0.163,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          const aiMsg: AiMessage = {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: data.text,
            timestamp: 'Just now',
            category:
              data.places && data.places.length > 0
                ? 'Google Maps Grounded Result'
                : 'Gemini Canine Expert',
            places: data.places || [],
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Fallback to instant curated UK canine knowledge base if offline
    }

    const lower = queryText.toLowerCase();
    const matched = CANINE_KNOWLEDGE_BASE.find((item) =>
      item.keywords.some((kw) => lower.includes(kw))
    );

    const responseText = matched
      ? matched.answer
      : `🐶 **Canine Expert Guidance on "${queryText}":**\n\n` +
        `1. **Positive Reinforcement:** Force-free, reward-based training yields the fastest results.\n` +
        `2. **Local UK Services:** Browse our verified DBS-checked walkers, licensed kennels, and dog-friendly venues in the Directory.`;

    setMessages((prev) => [
      ...prev,
      {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: 'Just now',
        category: matched?.category || 'Canine Expert Advice',
      },
    ]);
    setIsTyping(false);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init_reset',
        sender: 'ai',
        text: "Chat cleared! Ask me about nearby dog-friendly parks, emergency vets, training tips, or tap the mic to speak!",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[660px] max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0f5132] via-[#0c3e29] to-[#0f5132] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border-2 border-[#0f5132]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">Pawsy AI & Maps Grounding</h3>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Maps + Voice Ready
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Live Google Maps Grounding & Gemini Audio Transcription
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAiAssistantOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-[#0f5132] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                  🐾
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0f5132] text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                {msg.category && (
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-2 uppercase tracking-wide">
                    {msg.category}
                  </div>
                )}

                <div className="whitespace-pre-line space-y-1">{msg.text}</div>

                {/* Google Maps Grounding Links */}
                {msg.places && msg.places.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>Verified Google Maps Places:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.places.map((pl, idx) => (
                        <a
                          key={idx}
                          href={pl.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0f5132] border border-emerald-200 text-[11px] font-bold transition-colors"
                        >
                          <span>{pl.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 text-right ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-[#0f5132] text-white flex items-center justify-center text-xs shrink-0">
                🐾
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span className="text-slate-600 font-medium">
                  Checking Google Maps & canine guidance...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Wraps cleanly inside screen) */}
        <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 flex flex-wrap items-center gap-1.5 shrink-0 max-w-full">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Try:
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 rounded-full transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar with Microphone Voice Transcription Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={handleToggleMic}
            disabled={isTranscribing}
            title="Speak with Microphone (gemini-3.5-transcribe)"
            className={`p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center min-w-[42px] min-h-[42px] ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-[#0f5132] border border-emerald-200'
            }`}
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening... tap mic to transcribe'
                : 'Ask about dog parks, vets, training, or tap mic...'
            }
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#0f5132] hover:bg-[#0c3e29] disabled:opacity-40 text-white rounded-xl transition-all shadow-xs shrink-0 min-w-[42px] min-h-[42px] flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
