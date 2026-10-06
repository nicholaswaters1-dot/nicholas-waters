import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { DogProfile } from '../../types';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';
import {
  PawPrint,
  Heart,
  AlertTriangle,
  Utensils,
  PhoneCall,
  Shield,
  Clock,
  Sparkles,
  Edit3,
  Printer,
  Share2,
  Check,
  Save,
  X,
  FileCheck,
  Plus,
  Camera,
  Upload,
  MapPin,
  KeyRound,
  DoorOpen,
} from 'lucide-react';

export const BusterProfileCareGuide: React.FC = () => {
  const {
    dogs,
    activeDogId,
    setActiveDogId,
    activeDog,
    updateDog,
    addDog,
    persona,
    bookings,
    kennelBookings,
    showToast,
    openBookingModal,
    nativeShare,
  } = useMarketplace();

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [formData, setFormData] = useState<DogProfile>(activeDog);

  const [editPersonalityText, setEditPersonalityText] = useState(activeDog.personality.join(', '));
  const [editTriggersText, setEditTriggersText] = useState(activeDog.triggers.join(', '));
  const [editAllergiesText, setEditAllergiesText] = useState(activeDog.allergies.join(', '));
  const [editFavoriteTreatsText, setEditFavoriteTreatsText] = useState(
    (activeDog.favoriteTreats || ['Dried Beef Liver Bites', 'Freeze-Dried Salmon Cubes']).join(', ')
  );
  const [editVaccinationsText, setEditVaccinationsText] = useState(
    (
      activeDog.vaccinations || [
        'DHPPi (Core Annual Booster)',
        'Leptospirosis (L4)',
        'Kennel Cough (Bordetella)',
      ]
    ).join(', ')
  );
  const [editMedicationsText, setEditMedicationsText] = useState(
    (activeDog.medications || []).join(', ')
  );
  const [editSpendCapAmount, setEditSpendCapAmount] = useState<number>(
    activeDog.emergencyVet.spendCapAmount || 1200
  );

  // New dog form state
  const [newName, setNewName] = useState('');
  const [newBreed, setNewBreed] = useState('Cockapoo');
  const [newAge, setNewAge] = useState('1 year 8 months');
  const [newWeight, setNewWeight] = useState<number>(12);
  const [newGender, setNewGender] = useState<DogProfile['gender']>('Female (Spayed)');
  const [newMicrochip, setNewMicrochip] = useState('956000038471920');
  const [newVaccinations, setNewVaccinations] = useState(
    'DHPPi (Core Booster), Leptospirosis (L4), Kennel Cough (Bordetella)'
  );
  const [newPersonality, setNewPersonality] = useState('Friendly, Playful, Gentle');
  const [newLeash, setNewLeash] = useState('Walks gently on a padded front-clip harness.');
  const [newSocialPref, setNewSocialPref] = useState<DogProfile['socialPreference']>('Loves all dogs');
  const [newTriggers, setNewTriggers] = useState('Sudden loud claps, Fast kick-scooters');
  const [newFeeding, setNewFeeding] = useState('1 scoop grain-free kibble morning & evening.');
  const [newFavoriteTreats, setNewFavoriteTreats] = useState('Natural Venison Training Bites, Sweet Potato Chews');
  const [newAllergies, setNewAllergies] = useState('None');
  const [newMedications, setNewMedications] = useState('Monthly flea, tick & worming preventative');
  const [newRecall, setNewRecall] = useState('Two short whistle pips or "Come, Touch!"');
  const [newVetClinic, setNewVetClinic] = useState(activeDog.emergencyVet.clinicName);
  const [newVetDoctor, setNewVetDoctor] = useState(activeDog.emergencyVet.vetName);
  const [newVetPhone, setNewVetPhone] = useState(activeDog.emergencyVet.phone);
  const [newVetAddress, setNewVetAddress] = useState(activeDog.emergencyVet.address);
  const [newSpendCap, setNewSpendCap] = useState<number>(1200);
  const [newHomeAddress, setNewHomeAddress] = useState(
    activeDog.homeAddress || '18 Downshire Hill, Hampstead, London NW3 1NR'
  );
  const [newPickupAccess, setNewPickupAccess] = useState(
    activeDog.pickupAccessArrangement ||
      'Key Safe by front porch (Code: #4829). Harness & lead hanging on hallway peg.'
  );
  const [newDropoffAccess, setNewDropoffAccess] = useState(
    activeDog.dropoffAccessArrangement ||
      'Towel dry paws in porch, refill kitchen water bowl, double-lock front Chubb latch.'
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
  );

  // Access Arrangements are strictly only visible to the Pet Owner (editing their own dog) OR a Walker / Kennel when booked
  const isBookedForDog =
    bookings.some(
      (b) =>
        b.status !== 'Cancelled' &&
        (b.dogIds.includes(activeDog.id) ||
          b.dogNames.some((n) => n.toLowerCase() === activeDog.name.toLowerCase()))
    ) ||
    kennelBookings.some(
      (kb) =>
        kb.status === 'Confirmed' &&
        kb.dogNames.some((n) => n.toLowerCase() === activeDog.name.toLowerCase())
    );

  const canViewAccessArrangements =
    persona === 'owner' ||
    ((persona === 'walker' || persona === 'kennel') && isBookedForDog);

  const handleDogPhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: 'active' | 'new' | 'edit'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (mode === 'active') {
          updateDog(activeDog.id, { photoUrl: reader.result });
        } else if (mode === 'new') {
          setNewPhotoUrl(reader.result);
        } else {
          setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    setFormData(activeDog);
    setEditPersonalityText((activeDog.personality || []).join(', '));
    setEditTriggersText((activeDog.triggers || []).join(', '));
    setEditAllergiesText((activeDog.allergies || []).join(', '));
    setEditFavoriteTreatsText(
      (activeDog.favoriteTreats || ['Dried Beef Liver Bites', 'Freeze-Dried Salmon Cubes']).join(', ')
    );
    setEditVaccinationsText(
      (
        activeDog.vaccinations || [
          'DHPPi (Core Annual Booster)',
          'Leptospirosis (L4)',
          'Kennel Cough (Bordetella)',
        ]
      ).join(', ')
    );
    setEditMedicationsText((activeDog.medications || []).join(', '));
    setEditSpendCapAmount(activeDog.emergencyVet.spendCapAmount || 1200);
  }, [activeDog]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parseList = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const parsedVaccinations = parseList(editVaccinationsText);
    const parsedPersonality = parseList(editPersonalityText);

    const updatedDog: DogProfile = {
      ...formData,
      vaccinated: parsedVaccinations.length > 0,
      vaccinations: parsedVaccinations,
      personality: parsedPersonality.length > 0 ? parsedPersonality : ['Friendly'],
      triggers: parseList(editTriggersText),
      allergies: parseList(editAllergiesText),
      favoriteTreats: parseList(editFavoriteTreatsText),
      medications: parseList(editMedicationsText),
      emergencyVet: {
        ...formData.emergencyVet,
        spendCapAmount: Number(editSpendCapAmount) || 0,
        authorizedSpendLimit: `Up to £${(Number(editSpendCapAmount) || 0).toLocaleString()} pre-authorized emergency spend cap`,
      },
    };

    updateDog(activeDog.id, updatedDog);
    setIsEditing(false);
  };

  const handleAddNewDog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const parseList = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const parsedVaccinations = parseList(newVaccinations);
    const parsedAllergies =
      newAllergies.trim().toLowerCase() === 'none' || !newAllergies.trim()
        ? []
        : parseList(newAllergies);

    const newDog: DogProfile = {
      id: `dog_${Date.now()}`,
      name: newName.trim(),
      breed: newBreed,
      age: newAge,
      weightKg: Number(newWeight) || 10,
      photoUrl: newPhotoUrl,
      gender: newGender,
      microchipNumber:
        newMicrochip.trim() || `9560000${Math.floor(10000000 + Math.random() * 90000000)}`,
      vaccinated: parsedVaccinations.length > 0,
      vaccinations: parsedVaccinations,
      personality: parseList(newPersonality),
      leashBehavior: newLeash,
      triggers: parseList(newTriggers),
      socialPreference: newSocialPref,
      feedingNotes: newFeeding,
      favoriteTreats: parseList(newFavoriteTreats),
      allergies: parsedAllergies,
      medications: parseList(newMedications),
      recallCue: newRecall,
      emergencyVet: {
        clinicName: newVetClinic,
        vetName: newVetDoctor,
        phone: newVetPhone,
        address: newVetAddress,
        spendCapAmount: Number(newSpendCap) || 1000,
        authorizedSpendLimit: `Up to £${(Number(newSpendCap) || 1000).toLocaleString()} pre-authorized emergency spend cap`,
      },
      routineSchedule: 'Morning and afternoon outdoor walks.',
      specialInstructions: 'Towel paws after outdoor garden play.',
      homeAddress: newHomeAddress,
      pickupAccessArrangement: newPickupAccess,
      dropoffAccessArrangement: newDropoffAccess,
    };

    addDog(newDog);
    setIsAddingDog(false);
    setNewName('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    nativeShare({
      type: 'profile',
      title: `🐾 Verified Pet Profile: ${activeDog.name} (${activeDog.breed})`,
      subtitle: `${activeDog.age} · Microchip Verified (${activeDog.microchipNumber})`,
      badge: 'Verified Pet Care Passport',
      text: `Meet ${activeDog.name} (${activeDog.breed}, ${activeDog.age}) on My Paws Walks! Fully vaccinated, microchipped & ready for adventures. Personality: ${activeDog.personality.join(', ')}.`,
      dogNames: [activeDog.name],
    });
  };

  const dogVaccinations = activeDog.vaccinations || [
    'DHPPi (Core Annual Booster)',
    'Leptospirosis (L4)',
    'Kennel Cough (Bordetella)',
  ];

  const dogFavoriteTreats = activeDog.favoriteTreats || [
    'Natural Venison Training Bites',
    'Freeze-Dried Salmon Cubes',
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Dog Switcher and Multi-Dog Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          <span className="text-xs font-semibold text-slate-400 px-1 shrink-0">Your Dogs:</span>
          {dogs.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDogId(d.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                d.id === activeDogId
                  ? 'bg-[#0f5132] text-white border-[#0f5132] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <img
                src={d.photoUrl}
                alt={d.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
              <span>{d.name}</span>
              <span className="text-[10px] opacity-80 font-normal">({d.breed.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddingDog(true)}
          className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ Add Another Dog</span>
        </button>
      </div>

      {/* Dog Hero Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <img
                src={activeDog.photoUrl}
                alt={activeDog.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <label
                className="absolute -bottom-2 -right-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-xl shadow-md border border-white flex items-center gap-1 text-[10px] font-extrabold cursor-pointer transition-transform hover:scale-105"
                title={`Upload new picture for ${activeDog.name}`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleDogPhotoUpload(e, 'active')}
                />
              </label>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeDog.name}
                </h1>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {activeDog.vaccinated ? 'Vaccinated & Microchipped' : 'Microchipped'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">{activeDog.breed}</span>
                <span aria-hidden="true">·</span>
                <span>{activeDog.age}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activeDog.weightKg} kg</span>
                <span aria-hidden="true">·</span>
                <span>{activeDog.gender}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Microchip Number:</span>
                <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold border border-slate-200">
                  {activeDog.microchipNumber}
                </code>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] font-bold text-emerald-700 hover:underline ml-1 cursor-pointer"
                >
                  Edit Microchip / Vaccinations
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 md:flex-none px-3.5 py-2 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit {activeDog.name}’s Full Profile & Care Guide</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Handout</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 md:flex-none px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Passport</span>
            </button>
          </div>
        </div>

        {/* Personality Tags & Vaccinations */}
        <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Temperament:</span>
            {activeDog.personality.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Vaccinations Had:</span>
            {dogVaccinations.map((vac, i) => (
              <span
                key={i}
                className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1"
              >
                <span>✓</span>
                <span>{vac}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsored Partner Card */}
      <SponsoredAdBanner category="Veterinary Hospital" />

      {/* Home Address & Pick-Up / Drop-Off Access Arrangements Card (Strictly visible ONLY to Owner or Booked Walker/Kennel) */}
      {canViewAccessArrangements ? (
        <div className="bg-amber-50/80 rounded-2xl border-2 border-amber-300 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-200">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Home Collection Address & Pick-Up / Drop-Off Access Arrangements</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                🔒 Strictly Visible Only to Booked Walker or Kennel
              </span>
              {persona === 'owner' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] font-bold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg cursor-pointer"
                >
                  Edit Access Info
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dog Home Address</span>
              </div>
              <p className="text-slate-700 font-semibold">
                {activeDog.homeAddress || '18 Downshire Hill, Hampstead, London NW3 1NR'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Pick-Up Access Arrangement</span>
              </div>
              <p className="text-slate-700">
                {activeDog.pickupAccessArrangement ||
                  'Key Safe by front porch (Code: #4829). Harness & high-vis lead on hallway peg.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <DoorOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Drop-Off Access Arrangement</span>
              </div>
              <p className="text-slate-700">
                {activeDog.dropoffAccessArrangement ||
                  'Towel dry paws in porch, refill kitchen water bowl, double-lock front Chubb latch.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                Protected Home Access Arrangements
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Home collection address, key-safe codes, and pick-up/drop-off access arrangements are strictly encrypted and only revealed to a Dog Walker or Kennel once a booking for {activeDog.name} is confirmed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Essential Care Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leash Behavior & Outdoor Handling */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>Outdoor Handling & Leash Behavior</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-600">
            <div>
              <strong className="text-slate-800 block mb-1">Walking Demeanor & Leash Notes:</strong>
              <p>{activeDog.leashBehavior}</p>
            </div>

            <div>
              <strong className="text-slate-800 block mb-1">Emergency Recall Cue:</strong>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 font-semibold font-mono">
                {activeDog.recallCue}
              </div>
            </div>

            <div>
              <strong className="text-slate-800 block mb-1">Social Group Preference:</strong>
              <p className="text-slate-700">{activeDog.socialPreference}</p>
            </div>
          </div>
        </div>

        {/* Behavioral Quirks & Reactive Triggers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Behavioral Triggers & Safety Alerts</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-600">
            <p className="text-slate-500">
              Please observe these triggers to keep {activeDog.name} calm and confident:
            </p>

            <ul className="space-y-2">
              {activeDog.triggers.map((trigger, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-amber-50/50 border border-amber-200/60 rounded-lg text-amber-900 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feeding, Favorite Treats & Allergies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Nutrition, Favorite Treats & Allergies</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-600">
            <div>
              <strong className="text-slate-800 block mb-1">Diet & Feeding Routine:</strong>
              <p>{activeDog.feedingNotes}</p>
            </div>

            <div>
              <strong className="text-emerald-800 block mb-1 font-semibold">Favorite Treats & Rewards:</strong>
              <div className="flex flex-wrap gap-1.5">
                {dogFavoriteTreats.map((treat, i) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-semibold"
                  >
                    🦴 {treat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <strong className="text-rose-700 block mb-1 font-semibold">Strict Allergies & Intolerances:</strong>
              {activeDog.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {activeDog.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-md text-[11px] font-semibold"
                    >
                      ⛔ {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500">No known food or environmental allergies recorded.</span>
              )}
            </div>

            {activeDog.medications && activeDog.medications.length > 0 && (
              <div>
                <strong className="text-slate-800 block mb-1 font-semibold">Medications & Supplements:</strong>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {activeDog.medications.map((med, i) => (
                    <li key={i}>{med}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 24/7 Emergency Veterinary Protocol & Spend Cap Authorization */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Vet Services, Emergency Protocol & Spend Cap</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Vet & Cap</span>
            </button>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-600">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{activeDog.emergencyVet.clinicName}</div>
              <div className="text-slate-600">Primary Vet: {activeDog.emergencyVet.vetName}</div>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                <PhoneCall className="w-3.5 h-3.5" />
                <a href={`tel:${activeDog.emergencyVet.phone}`} className="hover:underline">
                  {activeDog.emergencyVet.phone}
                </a>
              </div>
              <div className="text-[11px] text-slate-500">{activeDog.emergencyVet.address}</div>
            </div>

            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-950 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-xs font-extrabold">Owner Pre-Authorized Spend Cap:</strong>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-white font-black text-xs">
                  £{(activeDog.emergencyVet.spendCapAmount ?? 1500).toLocaleString()} Max Cap
                </span>
              </div>
              <p className="text-[11px] text-emerald-900">
                {activeDog.emergencyVet.authorizedSpendLimit}. Registered vet holds vaccination & microchip records on file.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Dog Modal */}
      {isAddingDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 my-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Add New Dog Profile & Care Passport</h2>
                <p className="text-xs text-slate-500">
                  Complete your dog’s microchip, vaccinations, vet services, spend cap, and care routine.
                </p>
              </div>
              <button onClick={() => setIsAddingDog(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewDog} className="space-y-4 text-xs">
              {/* Photo upload */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={newPhotoUrl}
                    alt="New Dog"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500 bg-white"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Dog Profile Photo</div>
                    <p className="text-[10px] text-slate-600">Upload a clear photo of your dog</p>
                  </div>
                </div>
                <label className="px-3 py-1.5 bg-[#0f5132] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDogPhotoUpload(e, 'new')}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dog’s Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Barnaby"
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Breed *</label>
                  <input
                    type="text"
                    required
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="text"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as DogProfile['gender'])}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Male (Neutered)">Male (Neutered)</option>
                    <option value="Male (Intact)">Male (Intact)</option>
                    <option value="Female (Spayed)">Female (Spayed)</option>
                    <option value="Female (Intact)">Female (Intact)</option>
                  </select>
                </div>
              </div>

              {/* Microchip & Vaccinations */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">Microchip & Vaccinations</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">15-Digit Microchip Number</label>
                    <input
                      type="text"
                      value={newMicrochip}
                      onChange={(e) => setNewMicrochip(e.target.value)}
                      placeholder="e.g. 956000010482910"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Vaccinations Had (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newVaccinations}
                      onChange={(e) => setNewVaccinations(e.target.value)}
                      placeholder="DHPPi, Leptospirosis (L4), Kennel Cough, Rabies"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Outdoor Handling, Leash Behavior & Triggers */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">Outdoor Handling, Leash Behavior & Safety Triggers</div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Outdoor Handling & Leash Behavior
                  </label>
                  <textarea
                    rows={2}
                    value={newLeash}
                    onChange={(e) => setNewLeash(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Behavioral Triggers & Safety Alerts (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newTriggers}
                      onChange={(e) => setNewTriggers(e.target.value)}
                      placeholder="e.g. Skateboards, Squirrels, Unneutered males"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Emergency Recall Cue</label>
                    <input
                      type="text"
                      value={newRecall}
                      onChange={(e) => setNewRecall(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 font-mono bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Social Group Preference</label>
                    <select
                      value={newSocialPref}
                      onChange={(e) => setNewSocialPref(e.target.value as DogProfile['socialPreference'])}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    >
                      <option value="Small Pack (Max 4)">Small Pack (Max 4)</option>
                      <option value="Solo Walks Only">Solo Walks Only</option>
                      <option value="Calm Senior Friends">Calm Senior Friends</option>
                      <option value="High Energy Playgroup">High Energy Playgroup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Temperament Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newPersonality}
                      onChange={(e) => setNewPersonality(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Nutrition, Favorite Treats & Allergies */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">Nutrition, Favorite Treats & Allergies</div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diet & Feeding Routine</label>
                  <textarea
                    rows={2}
                    value={newFeeding}
                    onChange={(e) => setNewFeeding(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Favorite Treats (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newFavoriteTreats}
                      onChange={(e) => setNewFavoriteTreats(e.target.value)}
                      placeholder="e.g. Venison bites, Salmon cubes"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Allergies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newAllergies}
                      onChange={(e) => setNewAllergies(e.target.value)}
                      placeholder="e.g. Chicken, Grain (or None)"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Medications (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newMedications}
                      onChange={(e) => setNewMedications(e.target.value)}
                      placeholder="e.g. Joint supplement daily"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Vet Services & Emergency Spend Cap */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="font-bold text-emerald-950">
                  Vet Services Used & Emergency Authorization Spend Cap
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Veterinary Clinic Name</label>
                    <input
                      type="text"
                      value={newVetClinic}
                      onChange={(e) => setNewVetClinic(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Vet Name</label>
                    <input
                      type="text"
                      value={newVetDoctor}
                      onChange={(e) => setNewVetDoctor(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Vet Emergency Phone</label>
                    <input
                      type="text"
                      value={newVetPhone}
                      onChange={(e) => setNewVetPhone(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-emerald-900 mb-1">
                      Authorized Emergency Spend Cap (£)
                    </label>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={newSpendCap}
                      onChange={(e) => setNewSpendCap(Number(e.target.value))}
                      className="w-full p-2 border border-emerald-400 rounded-lg text-slate-900 font-bold bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vet Clinic Address</label>
                  <input
                    type="text"
                    value={newVetAddress}
                    onChange={(e) => setNewVetAddress(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Access Arrangements (Only shown to booked Walker or Kennel) */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">
                    Home Collection & Access Arrangements
                  </span>
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Only visible to Walker/Kennel when booked
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Home Address</label>
                  <input
                    type="text"
                    value={newHomeAddress}
                    onChange={(e) => setNewHomeAddress(e.target.value)}
                    className="w-full p-2 border border-amber-200 rounded-lg text-slate-900 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pick-Up Access Arrangement</label>
                    <textarea
                      rows={2}
                      value={newPickupAccess}
                      onChange={(e) => setNewPickupAccess(e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Drop-Off Access Arrangement</label>
                    <textarea
                      rows={2}
                      value={newDropoffAccess}
                      onChange={(e) => setNewDropoffAccess(e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDog(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-lg shadow-sm cursor-pointer"
                >
                  Save New Dog Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dog Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 my-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Edit Full Profile & Care Guide for {activeDog.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Update vet services, outdoor handling, triggers, nutrition, treats, allergies, vaccinations, microchip, spend cap, and private access arrangements.
                </p>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.photoUrl}
                    alt={formData.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500 bg-white"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Dog Profile Picture</div>
                    <p className="text-[10px] text-slate-600">Upload a picture from your phone or gallery</p>
                  </div>
                </div>
                <label className="px-3 py-1.5 bg-[#0f5132] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDogPhotoUpload(e, 'edit')}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Breed</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Microchip Number & Vaccinations */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">Microchip Number & Vaccinations Had</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">15-Digit Microchip Number</label>
                    <input
                      type="text"
                      value={formData.microchipNumber}
                      onChange={(e) => setFormData({ ...formData, microchipNumber: e.target.value })}
                      placeholder="e.g. 956000010482910"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Vaccinations Had (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editVaccinationsText}
                      onChange={(e) => setEditVaccinationsText(e.target.value)}
                      placeholder="DHPPi (Core Booster), Leptospirosis (L4), Kennel Cough"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Outdoor Handling, Leash Behavior & Triggers */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">Outdoor Handling, Leash Behavior & Safety Triggers</div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Outdoor Handling & Leash Behavior
                  </label>
                  <textarea
                    rows={2}
                    value={formData.leashBehavior}
                    onChange={(e) => setFormData({ ...formData, leashBehavior: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Triggers & Safety Alerts (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editTriggersText}
                      onChange={(e) => setEditTriggersText(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Emergency Recall Word</label>
                    <input
                      type="text"
                      value={formData.recallCue}
                      onChange={(e) => setFormData({ ...formData, recallCue: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 font-mono bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Social Group Preference</label>
                    <select
                      value={formData.socialPreference}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialPreference: e.target.value as DogProfile['socialPreference'],
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    >
                      <option value="Loves all dogs">Loves all dogs</option>
                      <option value="Small Pack (Max 4)">Small Pack (Max 4)</option>
                      <option value="Solo Walks Only">Solo Walks Only</option>
                      <option value="Calm Senior Friends">Calm Senior Friends</option>
                      <option value="High Energy Playgroup">High Energy Playgroup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Temperament Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editPersonalityText}
                      onChange={(e) => setEditPersonalityText(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Nutrition, Favorite Treats & Allergies */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">Nutrition, Favorite Treats & Allergies</div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diet & Feeding Routine</label>
                  <textarea
                    rows={2}
                    value={formData.feedingNotes}
                    onChange={(e) => setFormData({ ...formData, feedingNotes: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Favorite Treats (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editFavoriteTreatsText}
                      onChange={(e) => setEditFavoriteTreatsText(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Strict Allergies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editAllergiesText}
                      onChange={(e) => setEditAllergiesText(e.target.value)}
                      placeholder="Leave blank if none"
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Medications (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editMedicationsText}
                      onChange={(e) => setEditMedicationsText(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Vet Services, Emergency Vet Protocol & Spend Cap */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="font-bold text-emerald-950">
                  Vet Services Used, Emergency Protocol & Authorized Spend Cap
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Veterinary Practice / Clinic</label>
                    <input
                      type="text"
                      value={formData.emergencyVet.clinicName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyVet: { ...formData.emergencyVet, clinicName: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Vet Name</label>
                    <input
                      type="text"
                      value={formData.emergencyVet.vetName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyVet: { ...formData.emergencyVet, vetName: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">24/7 Emergency Vet Phone</label>
                    <input
                      type="text"
                      value={formData.emergencyVet.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyVet: { ...formData.emergencyVet, phone: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-emerald-900 mb-1">
                      Authorized Emergency Spend Cap (£)
                    </label>
                    <input
                      type="number"
                      min={50}
                      step={50}
                      value={editSpendCapAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEditSpendCapAmount(val);
                        setFormData({
                          ...formData,
                          emergencyVet: {
                            ...formData.emergencyVet,
                            spendCapAmount: val,
                            authorizedSpendLimit: `Up to £${val.toLocaleString()} pre-authorized emergency treatment spend cap`,
                          },
                        });
                      }}
                      className="w-full p-2 border border-emerald-400 rounded-lg text-slate-900 font-bold bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinic Address</label>
                    <input
                      type="text"
                      value={formData.emergencyVet.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyVet: { ...formData.emergencyVet, address: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Emergency Authorization Instructions
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyVet.authorizedSpendLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyVet: {
                            ...formData.emergencyVet,
                            authorizedSpendLimit: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Access Arrangements (Restricted to Booked Walker/Kennel) */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-amber-950">
                    Home Collection & Pick-Up / Drop-Off Access Arrangements
                  </span>
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    🔒 Only seen by Walker or Kennel when booked
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dog Home Address</label>
                  <input
                    type="text"
                    value={formData.homeAddress || ''}
                    onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                    className="w-full p-2 border border-amber-200 rounded-lg text-slate-900 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pick-Up Access Arrangement</label>
                    <textarea
                      rows={2}
                      value={formData.pickupAccessArrangement || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, pickupAccessArrangement: e.target.value })
                      }
                      className="w-full p-2 border border-amber-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Drop-Off Access Arrangement</label>
                    <textarea
                      rows={2}
                      value={formData.dropoffAccessArrangement || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, dropoffAccessArrangement: e.target.value })
                      }
                      className="w-full p-2 border border-amber-200 rounded-lg text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-lg shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
