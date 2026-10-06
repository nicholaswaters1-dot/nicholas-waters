import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { DogProfile, PackDog } from '../../types';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  Utensils,
  Pill,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  KeyRound,
  DoorOpen,
} from 'lucide-react';

interface WalkerDogProfileModalProps {
  dogNameOrId: string | null;
  onClose: () => void;
  onMessageOwner?: (dogName: string, ownerName: string) => void;
}

export const WalkerDogProfileModal: React.FC<WalkerDogProfileModalProps> = ({
  dogNameOrId,
  onClose,
  onMessageOwner,
}) => {
  const { dogs, packs, bookings, kennelBookings, persona, showToast } = useMarketplace();

  if (!dogNameOrId) return null;

  // Match either by id or case-insensitive name in full DogProfile list
  const matchedFullProfile = dogs.find(
    (d) =>
      d.id === dogNameOrId ||
      d.name.toLowerCase() === dogNameOrId.toLowerCase()
  );

  // Also check pack dogs for owner name, emergency phone, address, and access arrangements
  const allPackDogs: PackDog[] = packs.flatMap((p) => p.currentDogs);
  const matchedPackDog = allPackDogs.find(
    (pd) =>
      pd.id === dogNameOrId ||
      pd.name.toLowerCase() === dogNameOrId.toLowerCase()
  );

  // Also check latest booking for this dog for any updated address / access arrangements
  const matchedBooking = bookings.find(
    (b) =>
      b.status !== 'Cancelled' &&
      b.dogNames.some(
        (dn) =>
          dn.toLowerCase() ===
          (matchedFullProfile?.name || matchedPackDog?.name || dogNameOrId).toLowerCase()
      )
  );

  const matchedKennelBooking = kennelBookings.find(
    (kb) =>
      kb.status !== 'Cancelled' &&
      (kb.dogId === matchedFullProfile?.id ||
        kb.dogName
          .toLowerCase()
          .includes(
            (matchedFullProfile?.name || matchedPackDog?.name || dogNameOrId).toLowerCase()
          ))
  );

  // Access arrangements should ONLY be seen by Walker or Kennel when booked (or by the dog's Owner)
  const isBookedWithWalker = Boolean(matchedBooking || matchedPackDog);
  const isBookedWithKennel = Boolean(matchedKennelBooking);
  const canSeeAccessArrangements =
    (persona === 'walker' && isBookedWithWalker) ||
    (persona === 'kennel' && isBookedWithKennel) ||
    persona === 'owner';

  // Synthesize a full DogProfile if the dog is only in the pack list (e.g., Luna, Milo, Bailey, Rocky, Coco)
  const profile: DogProfile = matchedFullProfile || {
    id: matchedPackDog?.id || `dog_${dogNameOrId}`,
    name: matchedPackDog?.name || dogNameOrId,
    breed: matchedPackDog?.breed || 'Mixed Breed',
    age: '3 years 4 months',
    weightKg: matchedPackDog?.weightKg || 16.0,
    photoUrl:
      matchedPackDog?.avatar ||
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    gender: 'Male (Neutered)',
    microchipNumber: '956000083741920',
    vaccinated: true,
    vaccinations: [
      'DHPPi (Core Annual Booster)',
      'Leptospirosis (L4)',
      'Kennel Cough (Bordetella)',
    ],
    personality: ['Friendly Pack Member', 'Park Explorer', 'Good Recall', 'Treat Motivated'],
    leashBehavior:
      matchedPackDog?.socialNotes ||
      'Walks well on standard clip harness; enjoys sniffing woodland trails with the pack.',
    triggers: ['Fast e-bikes on narrow footpaths', 'Loud construction noise'],
    socialPreference: 'Small Pack (Max 4)',
    feedingNotes: 'Fresh water on trail; high-value organic liver treats approved during recall.',
    favoriteTreats: ['Organic Beef Liver Bites', 'Salmon Training Cubes'],
    allergies: ['No known food allergies'],
    medications: ['Up to date on monthly flea, tick & worming'],
    recallCue: `"${matchedPackDog?.name || dogNameOrId}, Come!" + two whistle pips`,
    emergencyVet: {
      clinicName: 'St. Jude Veterinary Hospital & 24/7 ER',
      vetName: 'Dr. Emily Vance, MRCVS',
      phone: '+44 20 7946 0812',
      address: '42 Belsize Lane, Hampstead, London NW3 5AR',
      spendCapAmount: 1000,
      authorizedSpendLimit: '£1,000 emergency care pre-authorized',
    },
    routineSchedule: 'Scheduled pack walk with hydration breaks every 25 minutes.',
    specialInstructions: 'Towel dry muddy paws before drop-off and latch front garden gate securely.',
    homeAddress:
      matchedBooking?.homeAddress ||
      matchedPackDog?.homeAddress ||
      '18 Downshire Hill, Hampstead, London NW3 1NR',
    pickupAccessArrangement:
      matchedBooking?.pickupAccessArrangement ||
      matchedPackDog?.pickupAccessArrangement ||
      'Key Safe by front porch (Code: #4829). Harness & lead hanging on hallway peg.',
    dropoffAccessArrangement:
      matchedBooking?.dropoffAccessArrangement ||
      matchedPackDog?.dropoffAccessArrangement ||
      'Towel dry paws in porch, refill kitchen water bowl, and double-lock front door.',
  };

  const homeAddress =
    matchedBooking?.homeAddress ||
    profile.homeAddress ||
    matchedPackDog?.homeAddress ||
    '18 Downshire Hill, Hampstead, London NW3 1NR';

  const pickupAccess =
    matchedBooking?.pickupAccessArrangement ||
    profile.pickupAccessArrangement ||
    matchedPackDog?.pickupAccessArrangement ||
    'Key Safe by front porch (Code: #4829). Harness & high-vis lead on hallway peg.';

  const dropoffAccess =
    matchedBooking?.dropoffAccessArrangement ||
    profile.dropoffAccessArrangement ||
    matchedPackDog?.dropoffAccessArrangement ||
    'Towel dry paws in porch, refill kitchen water bowl, and double-lock front Chubb latch.';

  const ownerName = matchedPackDog?.ownerName || matchedKennelBooking?.ownerName || 'Oliver Harrison';
  const ownerPhone = matchedPackDog?.emergencyContact || '+44 7700 900481';

  const dogVaccinations = profile.vaccinations || [
    'DHPPi (Core Annual Booster)',
    'Leptospirosis (L4)',
    'Kennel Cough (Bordetella)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Top Hero Header */}
        <div className="bg-[#0f5132] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <img
              src={profile.photoUrl}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-300 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Microchip: {profile.microchipNumber}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                {profile.breed} · {profile.age} · {profile.weightKg} kg · {profile.gender}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-emerald-200">
                <span>
                  Owner: <strong className="text-white">{ownerName}</strong>
                </span>
                <span>·</span>
                <span>
                  Social: <strong className="text-white">{profile.socialPreference}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Care Passport Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Quick Action Strip for Walker / Kennel Host */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Booked Dog Profile · Owner Emergency Contact Ready</span>
              </div>
              <div className="text-[11px] text-emerald-800 mt-0.5">
                Owner: <strong>{ownerName}</strong> ({ownerPhone})
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onMessageOwner && (
                <button
                  type="button"
                  onClick={() => {
                    onMessageOwner(profile.name, ownerName);
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message {ownerName.split(' ')[0]}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  showToast(`Calling ${ownerName} at ${ownerPhone}...`, 'info')
                }
                className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Owner</span>
              </button>
            </div>
          </div>

          {/* Confirmed Vaccinations */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vaccinations Had</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dogVaccinations.map((vac, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[11px]"
                >
                  ✓ {vac}
                </span>
              ))}
            </div>
          </div>

          {/* HOME ADDRESS & PICK-UP / DROP-OFF ACCESS ARRANGEMENTS (Strictly Visible ONLY to Booked Walker or Kennel) */}
          {canSeeAccessArrangements ? (
            <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-200">
                <div className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Dog Home Address & Pick-Up / Drop-Off Access Arrangements</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-800 text-white px-2 py-0.5 rounded-full">
                  🔒 Visible Only to Booked {persona === 'kennel' ? 'Kennel' : 'Walker'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Collection & Return Home Address
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    📍 {homeAddress}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(homeAddress);
                    showToast(`Copied address "${homeAddress}" for navigation!`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-[11px] self-start sm:self-auto cursor-pointer"
                >
                  Copy Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pick-Up Access Arrangement</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px] font-medium">
                    {pickupAccess}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <DoorOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Drop-Off Access Arrangement</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px] font-medium">
                    {dropoffAccess}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <strong className="text-amber-400 block">
                  Access Arrangements Restricted
                </strong>
                <span className="text-slate-300">
                  Home collection address and key-safe access arrangements are strictly private and only visible to a Dog Walker or Kennel when booked.
                </span>
              </div>
            </div>
          )}

          {/* Personality Badges */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Temperament & Personality Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.personality.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200"
                >
                  🐾 {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Grid of Critical Handling Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Leash & Off-Leash Recall Cue</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{profile.leashBehavior}</p>
              <div className="pt-1.5 mt-1.5 border-t border-slate-200/80 text-emerald-900 font-semibold">
                Recall Cue: <span className="font-bold">{profile.recallCue}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Triggers & Watch-Outs on Walk</span>
              </div>
              <ul className="list-disc list-inside text-amber-900 space-y-1">
                {profile.triggers.map((trig, i) => (
                  <li key={i}>{trig}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span>Nutrition, Favorite Treats & Allergies</span>
              </div>
              <p className="text-slate-600">{profile.feedingNotes}</p>
              <div className="pt-1 text-emerald-800 font-semibold">
                Favorite Treats:{' '}
                {(profile.favoriteTreats && profile.favoriteTreats.length > 0
                  ? profile.favoriteTreats
                  : ['Natural Venison Training Bites', 'Freeze-Dried Salmon Cubes']
                ).join(', ')}
              </div>
              <div className="pt-0.5 text-rose-700 font-semibold">
                Allergies: {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None recorded'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Medications & Post-Walk Instructions</span>
              </div>
              <p className="text-slate-600">{profile.medications.join(' · ')}</p>
              <p className="text-slate-700 font-medium pt-1">
                Drop-Off Note: {profile.specialInstructions}
              </p>
            </div>
          </div>

          {/* Emergency Vet Box */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="font-extrabold text-rose-950 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-rose-600" />
                <span>Registered Emergency Vet: {profile.emergencyVet.clinicName}</span>
              </div>
              <div className="text-rose-800">
                {profile.emergencyVet.vetName} · {profile.emergencyVet.address}
              </div>
              <div className="text-[11px] font-bold text-rose-700 flex flex-wrap items-center gap-2">
                <span>Pre-Authorized Vet Spend Limit: {profile.emergencyVet.authorizedSpendLimit}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-white text-[10px] font-black">
                  £{(profile.emergencyVet.spendCapAmount ?? 1500).toLocaleString()} Max Cap
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                showToast(
                  `Dialing Emergency Vet (${profile.emergencyVet.clinicName}) at ${profile.emergencyVet.phone}...`,
                  'warning'
                )
              }
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{profile.emergencyVet.phone}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Verified My Paws Walks Digital Care Passport & Access Guide
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Dog Profile
          </button>
        </div>
      </div>
    </div>
  );
};
