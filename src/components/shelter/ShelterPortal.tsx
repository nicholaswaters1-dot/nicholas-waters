import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  ShelterDog,
  ItemDonationRequest,
  ShelterStaffMember,
} from '../../types';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  Gift,
  Building2,
  Users,
  Compass,
  Phone,
  Search,
  Upload,
  Power,
  FileText,
  KeyRound,
  Play,
  Sliders,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { SponsoredAdBanner } from '../common/SponsoredAdBanner';
import { ShelterStaffSwitcher } from './ShelterStaffSwitcher';
import { auth, syncShelterDogToCloud } from '../../services/firebase';

const PRESET_DOG_PHOTOS = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=80',
];

export const ShelterPortal: React.FC = () => {
  const {
    shelters,
    activeShelter,
    setActiveShelterId,
    updateShelterProfile,
    shelterDogs,
    addShelterDog,
    updateShelterDogStatus,
    addShelterDogDailyUpdate,
    shelterVisits,
    bookShelterVisit,
    updateVisitStatus,
    volunteerWalks,
    bookVolunteerWalk,
    donationRequests,
    submitItemDonation,
    reviewItemDonation,
    activeHouseholdMember,
    shelterStaff,
    activeShelterStaff,
    switchShelterStaff,
    addShelterStaff,
    setHowToUseModalOpen,
    showToast,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'dogs' | 'staff-command' | 'visits' | 'walks' | 'donations' | 'all-shelters'
  >('dogs');
  const [shelterSearchQuery, setShelterSearchQuery] = useState('');
  const [shelterPostcodeFilter, setShelterPostcodeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Adoption Pending' | 'Re-homed'>('All');

  // Modals state
  const [visitModalDog, setVisitModalDog] = useState<ShelterDog | null>(null);
  const [walkModalDog, setWalkModalDog] = useState<ShelterDog | null>(null);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [detailModalDog, setDetailModalDog] = useState<ShelterDog | null>(null);
  const [uploadDogModalOpen, setUploadDogModalOpen] = useState(false);
  const [dailyUpdateModalDog, setDailyUpdateModalDog] = useState<ShelterDog | null>(null);
  const [adoptConfirmModalDog, setAdoptConfirmModalDog] = useState<ShelterDog | null>(null);

  // Upload New Dog Form State
  const [newDogName, setNewDogName] = useState('');
  const [newDogBreed, setNewDogBreed] = useState('');
  const [newDogAge, setNewDogAge] = useState('2 Years');
  const [newDogGender, setNewDogGender] = useState<ShelterDog['gender']>('Male (Neutered)');
  const [newDogSize, setNewDogSize] = useState<ShelterDog['size']>('Medium');
  const [newDogPhoto, setNewDogPhoto] = useState(PRESET_DOG_PHOTOS[0]);
  const [newDogBackground, setNewDogBackground] = useState('');
  const [newDogMedical, setNewDogMedical] = useState('Fully vaccinated, microchipped, wormed & vet-cleared.');
  const [newDogKids, setNewDogKids] = useState(true);
  const [newDogDogs, setNewDogDogs] = useState(true);
  const [newDogCats, setNewDogCats] = useState(false);
  const [newDogHouseTrained, setNewDogHouseTrained] = useState(true);

  // Daily Update Form State
  const [updateCategory, setUpdateCategory] = useState<
    'Medical & Vet' | 'Walking & Enrichment' | 'Adoption & Meet-Greet' | 'Feeding & Care'
  >('Walking & Enrichment');
  const [updateNote, setUpdateNote] = useState('');

  // Adopted / Deactivate Form State
  const [adoptedFamilyName, setAdoptedFamilyName] = useState('');

  // Multi-User Staff Creation State
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState<ShelterStaffMember['role']>('Adoption Coordinator');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('+44 20 7946 0921');
  const [staffShift, setStaffShift] = useState('08:30 - 17:00 (Day Shift)');
  const [staffPin, setStaffPin] = useState('5590');

  // Visit Booking Form state
  const [visitDate, setVisitDate] = useState('Saturday, 03 Oct 2026');
  const [visitTimeSlot, setVisitTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [visitNotes, setVisitNotes] = useState('Looking to meet this pup; we have a quiet home and secure garden.');

  // Volunteer Walk Form state
  const [volWalkDate, setVolWalkDate] = useState('Tomorrow, 04 Oct 2026');
  const [volWalkTime, setVolWalkTime] = useState('10:00 AM - 11:00 AM');
  const [volType, setVolType] = useState<'Pet Owner' | 'Professional Walker'>('Pet Owner');
  const [volWalkNotes, setVolWalkNotes] = useState('Can take on an off-lead decompression stroll in the park.');

  // Item Donation Form state
  const [donCategory, setDonCategory] = useState<ItemDonationRequest['itemCategory']>('Dry Food / Kibble');
  const [donDesc, setDonDesc] = useState('');
  const [donQty, setDonQty] = useState('2 bags (15kg each)');
  const [donDelivery, setDonDelivery] = useState<ItemDonationRequest['dropoffOrDelivery']>('In-person dropoff');

  const currentShelterDogs = shelterDogs
    .filter((d) => d.shelterId === activeShelter.id)
    .filter((d) => (statusFilter === 'All' ? true : d.status === statusFilter));

  const handleUploadNewDog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDogName.trim() || !newDogBreed.trim()) {
      showToast('Please enter the dog name and breed', 'warning');
      return;
    }

    const dogId = `sdog_${Date.now()}`;
    const bioText =
      newDogBackground.trim() ||
      `${newDogName.trim()} is an affectionate, gentle ${newDogBreed.trim()} looking for a loving forever family. Enjoys park sniffaris and cuddle time.`;

    addShelterDog({
      shelterId: activeShelter.id,
      shelterName: activeShelter.name,
      name: newDogName.trim(),
      breed: newDogBreed.trim(),
      age: newDogAge.trim(),
      gender: newDogGender,
      size: newDogSize,
      photoUrl: newDogPhoto.trim() || PRESET_DOG_PHOTOS[0],
      photoGallery: [newDogPhoto.trim() || PRESET_DOG_PHOTOS[0]],
      fullBackground: bioText,
      rescueStory: `Taken into care at ${activeShelter.name} and assessed by ${activeShelterStaff.name} (${activeShelterStaff.role}).`,
      medicalHistory: newDogMedical.trim(),
      temperament: ['Affectionate', 'Gentle', 'Lead Trained'],
      goodWithKids: newDogKids,
      goodWithDogs: newDogDogs,
      goodWithCats: newDogCats,
      houseTrained: newDogHouseTrained,
      walkingVolunteersWelcomed: true,
      status: 'Available',
      isActiveListing: true,
      microchipNumber: `98514100${Math.floor(100000 + Math.random() * 900000)}`,
    });

    if (auth.currentUser) {
      try {
        await syncShelterDogToCloud({
          dogId,
          createdByUid: auth.currentUser.uid,
          shelterId: activeShelter.id,
          shelterName: activeShelter.name,
          name: newDogName.trim(),
          breed: newDogBreed.trim(),
          age: newDogAge.trim(),
          status: 'Available',
          isActiveListing: true,
          lastDailyUpdate: `Uploaded for adoption by ${activeShelterStaff.name}`,
          updatedByStaffName: `${activeShelterStaff.name} (${activeShelterStaff.role})`,
        });
      } catch {
        // local state already updated
      }
    }

    setNewDogName('');
    setNewDogBreed('');
    setNewDogBackground('');
    setUploadDogModalOpen(false);
  };

  const handleToggleDogActivation = async (dog: ShelterDog) => {
    const currentlyActive = dog.isActiveListing !== false && dog.status !== 'Re-homed';
    if (currentlyActive) {
      // Open confirmation modal to mark as Adopted / Re-homed or Deactivate
      setAdoptConfirmModalDog(dog);
      setAdoptedFamilyName('');
    } else {
      // Reactivate listing immediately
      updateShelterDogStatus(dog.id, 'Available', true);
      if (auth.currentUser) {
        try {
          await syncShelterDogToCloud({
            dogId: dog.id,
            createdByUid: auth.currentUser.uid,
            shelterId: dog.shelterId,
            shelterName: dog.shelterName,
            name: dog.name,
            breed: dog.breed,
            age: dog.age,
            status: 'Available',
            isActiveListing: true,
            lastDailyUpdate: `Listing reactivated for adoption by ${activeShelterStaff.name}`,
            updatedByStaffName: `${activeShelterStaff.name} (${activeShelterStaff.role})`,
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleConfirmAdoptedOrDeactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adoptConfirmModalDog) return;
    updateShelterDogStatus(
      adoptConfirmModalDog.id,
      'Re-homed',
      false,
      adoptedFamilyName.trim() || 'Verified Adoptive Family'
    );
    if (auth.currentUser) {
      try {
        await syncShelterDogToCloud({
          dogId: adoptConfirmModalDog.id,
          createdByUid: auth.currentUser.uid,
          shelterId: adoptConfirmModalDog.shelterId,
          shelterName: adoptConfirmModalDog.shelterName,
          name: adoptConfirmModalDog.name,
          breed: adoptConfirmModalDog.breed,
          age: adoptConfirmModalDog.age,
          status: 'Re-homed',
          isActiveListing: false,
          lastDailyUpdate: `Adopted by ${adoptedFamilyName.trim() || 'loving family'} — listing deactivated by ${activeShelterStaff.name}`,
          updatedByStaffName: `${activeShelterStaff.name} (${activeShelterStaff.role})`,
        });
      } catch {
        // ignore
      }
    }
    setAdoptConfirmModalDog(null);
  };

  const handlePostDailyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyUpdateModalDog || !updateNote.trim()) return;
    addShelterDogDailyUpdate(dailyUpdateModalDog.id, updateCategory, updateNote.trim());
    if (auth.currentUser) {
      try {
        await syncShelterDogToCloud({
          dogId: dailyUpdateModalDog.id,
          createdByUid: auth.currentUser.uid,
          shelterId: dailyUpdateModalDog.shelterId,
          shelterName: dailyUpdateModalDog.shelterName,
          name: dailyUpdateModalDog.name,
          breed: dailyUpdateModalDog.breed,
          age: dailyUpdateModalDog.age,
          status: dailyUpdateModalDog.status,
          isActiveListing: dailyUpdateModalDog.isActiveListing !== false,
          lastDailyUpdate: `[${updateCategory}] ${updateNote.trim()}`,
          updatedByStaffName: `${activeShelterStaff.name} (${activeShelterStaff.role})`,
        });
      } catch {
        // ignore
      }
    }
    setUpdateNote('');
    setDailyUpdateModalDog(null);
  };

  const handleCreateStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) {
      showToast('Please enter staff name and login email', 'warning');
      return;
    }
    addShelterStaff({
      shelterId: activeShelter.id,
      name: staffName.trim(),
      role: staffRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      email: staffEmail.trim(),
      phone: staffPhone.trim(),
      shiftToday: staffShift.trim(),
      staffPinCode: staffPin.trim() || '1234',
      permissions: ['Upload Dogs', 'Activate / Deactivate Adoption', 'Daily Updates'],
    });
    setStaffName('');
    setStaffEmail('');
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitModalDog) return;

    bookShelterVisit({
      shelterDogId: visitModalDog.id,
      dogName: visitModalDog.name,
      shelterId: visitModalDog.shelterId,
      shelterName: visitModalDog.shelterName,
      visitorName: activeHouseholdMember.name,
      visitorEmail: activeHouseholdMember.email,
      visitorPhone: activeHouseholdMember.phone,
      date: visitDate,
      timeSlot: visitTimeSlot,
      notes: visitNotes,
    });
    setVisitModalDog(null);
  };

  const handleBookVolunteerWalk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkModalDog) return;

    bookVolunteerWalk({
      shelterDogId: walkModalDog.id,
      dogName: walkModalDog.name,
      shelterId: walkModalDog.shelterId,
      shelterName: walkModalDog.shelterName,
      volunteerName: `${activeHouseholdMember.name} (${volType})`,
      volunteerType: volType,
      volunteerPhone: activeHouseholdMember.phone,
      date: volWalkDate,
      timeSlot: volWalkTime,
      durationMinutes: 60,
      notes: volWalkNotes,
    });
    setWalkModalDog(null);
  };

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donDesc.trim()) {
      showToast('Please describe the items you wish to donate', 'warning');
      return;
    }

    submitItemDonation({
      shelterId: activeShelter.id,
      shelterName: activeShelter.name,
      donorName: activeHouseholdMember.name,
      donorEmail: activeHouseholdMember.email,
      donorPhone: activeHouseholdMember.phone,
      itemCategory: donCategory,
      description: donDesc.trim(),
      quantity: donQty.trim() || '1 box',
      dropoffOrDelivery: donDelivery,
    });

    setDonateModalOpen(false);
    setDonDesc('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner: Local Dog Shelter & Rescue Network */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0f5132] via-[#0c3e29] to-[#0a3120] text-white p-5 sm:p-8 shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300 font-semibold">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Registered UK Dog Shelters & Multi-Staff Rescue Portal</span>
              <span>·</span>
              <span>{activeShelter.charityNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {activeShelter.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {activeShelter.description}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => setUploadDogModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm transition-all min-h-[44px]"
              >
                <Upload className="w-4 h-4" />
                <span>+ Post / Upload New Dog for Adoption</span>
              </button>

              <button
                onClick={() => setActiveTab('staff-command')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all min-h-[44px]"
              >
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Multi-User Staff Logins & Daily Updates</span>
              </button>

              <button
                onClick={() => setHowToUseModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-bold text-xs flex items-center gap-1.5 border border-emerald-700 transition-all min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
                <span>Shelter Video Guide</span>
              </button>
            </div>
          </div>

          {/* Shelter Staff Multi-User Switcher & Contact Info */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Logged-In Shelter User:
              </span>
              <ShelterStaffSwitcher />
            </div>

            <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider pt-1 border-t border-white/10">
              Switch Active Shelter Branch:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {shelters.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveShelterId(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    s.id === activeShelter.id
                      ? 'bg-emerald-400 text-slate-950 shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  {s.postcodeArea} ({s.location.split(' ')[0]})
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between gap-2 text-[11px] text-emerald-200 font-bold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Shelter Postcode (Required):</span>
                </span>
                <span className="font-mono text-white bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  {activeShelter.postcode || `${activeShelter.postcodeArea} 1AA`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={activeShelter.postcode || `${activeShelter.postcodeArea} 1AA`}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    const outcode = val.trim().split(' ')[0] || activeShelter.postcodeArea;
                    updateShelterProfile(activeShelter.id, {
                      postcode: val,
                      postcodeArea: outcode,
                    });
                  }}
                  placeholder="Enter UK Postcode (e.g. SW8 4BG)"
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/15 border border-white/25 text-white placeholder-emerald-200/60 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Saved shelter postcode (${activeShelter.postcode || activeShelter.postcodeArea}) for ${activeShelter.name}!`,
                      'success'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black shrink-0 cursor-pointer"
                >
                  Save Postcode
                </button>
              </div>
            </div>

            <div className="text-[11px] text-emerald-100 flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-300" />
                <span>{activeShelter.phone}</span>
              </span>
              <button
                onClick={() => setActiveTab('all-shelters')}
                className="text-emerald-300 hover:text-white underline font-bold"
              >
                All UK Shelters →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Partner Banner */}
      <SponsoredAdBanner category="Veterinary Hospital" />

      {/* Mobile-Friendly Segmented Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs text-xs font-bold">
        <button
          onClick={() => setActiveTab('dogs')}
          className={`px-3 py-3 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[46px] ${
            activeTab === 'dogs'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Adoptable Dogs ({currentShelterDogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff-command')}
          className={`px-3 py-3 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[46px] ${
            activeTab === 'staff-command'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Staff & Daily Updates</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`px-3 py-3 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[46px] ${
            activeTab === 'visits'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Visits ({shelterVisits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('walks')}
          className={`px-3 py-3 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[46px] ${
            activeTab === 'walks'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Free Walks ({volunteerWalks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`px-3 py-3 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[46px] ${
            activeTab === 'donations'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Gift className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Donations ({donationRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all-shelters')}
          className={`px-3 py-3 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[46px] ${
            activeTab === 'all-shelters'
              ? 'bg-[#0f5132] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
          <span>All Shelters ({shelters.length})</span>
        </button>
      </div>

      {/* TAB 1: ADOPTABLE DOGS & ONE-TAP ACTIVATION / DEACTIVATION */}
      {activeTab === 'dogs' && (
        <div className="space-y-5">
          {/* Action & Status Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Adoption Listings & Status Control — {activeShelter.name}
              </h2>
              <p className="text-xs text-slate-500">
                Logged in as <strong>{activeShelterStaff.name} ({activeShelterStaff.role})</strong>. Post new dogs, log daily updates, or deactivate listings when adopted.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['All', 'Available', 'Adoption Pending', 'Re-homed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                    statusFilter === st
                      ? 'bg-[#0f5132] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {st === 'Re-homed' ? 'Adopted / Deactivated' : st}
                </button>
              ))}

              <button
                onClick={() => setUploadDogModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-2xs min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Dog</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentShelterDogs.map((dog) => {
              const isListingActive = dog.isActiveListing !== false && dog.status !== 'Re-homed';
              const latestUpdate = dog.dailyUpdates && dog.dailyUpdates[0];

              return (
                <div
                  key={dog.id}
                  className={`bg-white rounded-3xl border overflow-hidden shadow-xs transition-all flex flex-col justify-between ${
                    isListingActive
                      ? 'border-slate-200 hover:border-slate-300'
                      : 'border-slate-300 bg-slate-50/70 opacity-90'
                  }`}
                >
                  <div>
                    {/* Photo & Status Header */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                      <img
                        src={dog.photoUrl}
                        alt={dog.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${!isListingActive ? 'grayscale-[35%]' : ''}`}
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-lg shadow-xs ${
                            dog.status === 'Available'
                              ? 'bg-emerald-600 text-white'
                              : dog.status === 'Adoption Pending'
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-white'
                          }`}
                        >
                          {dog.status === 'Re-homed'
                            ? '🎉 Adopted (Listing Deactivated)'
                            : `${dog.status} · Active Listing`}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-xs bg-slate-950/75 backdrop-blur-md text-white px-2.5 py-1 rounded-lg font-medium">
                          {dog.gender} · {dog.age}
                        </span>

                        {/* Staff One-Tap Activate / Deactivate Toggle */}
                        <button
                          onClick={() => handleToggleDogActivation(dog)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all ${
                            isListingActive
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>
                            {isListingActive
                              ? 'Mark Adopted / Deactivate'
                              : 'Reactivate Adoption Listing'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-extrabold text-slate-900">{dog.name}</h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {dog.breed} · {dog.size} · Intake: {dog.intakeDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <select
                            value={dog.status}
                            onChange={(e) => {
                              const nextStatus = e.target.value as ShelterDog['status'];
                              updateShelterDogStatus(
                                dog.id,
                                nextStatus,
                                nextStatus !== 'Re-homed'
                              );
                            }}
                            aria-label={`Change adoption status for ${dog.name}`}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <option value="Available">Status: Available</option>
                            <option value="Adoption Pending">Status: Adoption Pending</option>
                            <option value="Re-homed">Status: Adopted / Re-homed</option>
                          </select>
                        </div>
                      </div>

                      {/* Clean Unboxed Compatibility Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 border-y border-slate-100 py-2">
                        <span className={dog.goodWithKids ? 'text-emerald-800 font-semibold' : 'text-slate-500'}>
                          {dog.goodWithKids ? '✓ Kids OK' : 'Adults Only'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className={dog.goodWithDogs ? 'text-emerald-800 font-semibold' : 'text-slate-500'}>
                          {dog.goodWithDogs ? '✓ Dog Friendly' : 'Solo Dog'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className={dog.goodWithCats ? 'text-emerald-800 font-semibold' : 'text-slate-500'}>
                          {dog.goodWithCats ? '✓ Cats OK' : 'No Cats'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-700 font-semibold">
                          {dog.houseTrained ? '✓ House Trained' : 'In Training'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {dog.fullBackground}
                      </p>

                      {/* Latest Staff Daily Update Log Box */}
                      {latestUpdate && (
                        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px] text-emerald-900 font-bold">
                            <span>
                              📋 Latest Update ({latestUpdate.category}) by {latestUpdate.staffName}
                            </span>
                            <span className="text-emerald-700">{latestUpdate.date}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{latestUpdate.note}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile-Friendly Card Actions */}
                  <div className="p-5 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setDetailModalDog(dog)}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors min-h-[42px]"
                    >
                      Full Story
                    </button>

                    <button
                      onClick={() => {
                        setDailyUpdateModalDog(dog);
                        setUpdateNote('');
                      }}
                      className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#0f5132] border border-emerald-200 rounded-xl text-xs font-bold transition-colors min-h-[42px]"
                    >
                      + Daily Update
                    </button>

                    <button
                      disabled={!isListingActive}
                      onClick={() => setWalkModalDog(dog)}
                      className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs min-h-[42px]"
                    >
                      Free Walk
                    </button>

                    <button
                      disabled={!isListingActive}
                      onClick={() => setVisitModalDog(dog)}
                      className="py-2.5 px-3 bg-[#0f5132] hover:bg-[#0c3e29] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs min-h-[42px]"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-USER STAFF ACCOUNTS & DAILY CARE UPDATES COMMAND DESK */}
      {activeTab === 'staff-command' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Multi-User Shelter Staff Login Roster */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <span>Multi-User Shelter Login Accounts ({shelterStaff.length} Users)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Every staff member has individual login credentials to post dogs, toggle adoption status, and record daily updates.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800">
                Active: {activeShelterStaff.name}
              </span>
            </div>

            <div className="space-y-3">
              {shelterStaff.map((staff) => {
                const isActive = staff.id === activeShelterStaff.id;
                return (
                  <div
                    key={staff.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isActive
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{staff.name}</span>
                          <span className="text-xs text-emerald-800 font-semibold">
                            · {staff.role}
                          </span>
                          {isActive && (
                            <span className="text-[11px] font-black text-[#0f5132] underline">
                              (Currently Logged In)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-mono">
                          Login ID: {staff.email} · PIN: {staff.staffPinCode || '2480'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Shift: {staff.shiftToday} · Permissions: Upload Dogs · Activate/Deactivate · Daily Updates
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => switchShelterStaff(staff.id)}
                      disabled={isActive}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 min-h-[42px] ${
                        isActive
                          ? 'bg-emerald-700 text-white cursor-default'
                          : 'bg-[#0f5132] hover:bg-[#0c3e29] text-white shadow-2xs'
                      }`}
                    >
                      {isActive ? '✓ Logged In' : 'Sign In as User'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add New Staff User Form */}
            <form
              onSubmit={handleCreateStaffMember}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
            >
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <span>Add New Shelter User Login Account</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. Samira Patel"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff Role</label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="Shelter Director">Shelter Director</option>
                    <option value="Kennel Manager">Kennel Manager</option>
                    <option value="Adoption Coordinator">Adoption Coordinator</option>
                    <option value="Vet Nurse / Medical Lead">Vet Nurse / Medical Lead</option>
                    <option value="Volunteer Lead">Volunteer Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff Login Email</label>
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="samira@battersea.org.uk"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">4-Digit Security PIN</label>
                  <input
                    type="text"
                    required
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    placeholder="5590"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-extrabold rounded-xl shadow-xs min-h-[42px]"
              >
                + Provision Staff Login Account
              </button>
            </form>
          </div>

          {/* Right 5 Cols: Live Daily Care & Adoption Activity Feed */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Daily Shelter Care & Adoption Log</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time audit trail of updates posted by shelter team members.
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {currentShelterDogs.flatMap((dog) =>
                (dog.dailyUpdates || []).map((upd) => ({
                  ...upd,
                  dogName: dog.name,
                  dogId: dog.id,
                  dogStatus: dog.status,
                }))
              ).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-slate-900">
                      🐕 {item.dogName} · <span className="text-emerald-800">{item.category}</span>
                    </span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{item.note}</p>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Logged by: {item.staffName} ({item.staffRole})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SEARCH & DISCOVER LOCAL UK SHELTERS */}
      {activeTab === 'all-shelters' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span>Search Local UK Dog Shelters & Rescues</span>
              </h2>
              <p className="text-xs text-slate-500">
                Find vetted non-profit rescue organizations, compare facilities, and book visits or volunteer walks across the UK.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search shelter name or city..."
                  value={shelterSearchQuery}
                  onChange={(e) => setShelterSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 w-56 sm:w-64"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {['All', 'NW3', 'CF10', 'M1', 'EH1'].map((pc) => (
                  <button
                    key={pc}
                    onClick={() => setShelterPostcodeFilter(pc)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      shelterPostcodeFilter === pc
                        ? 'bg-[#0f5132] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {pc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shelters
              .filter((s) => {
                const matchesSearch =
                  s.name.toLowerCase().includes(shelterSearchQuery.toLowerCase()) ||
                  s.location.toLowerCase().includes(shelterSearchQuery.toLowerCase()) ||
                  s.address.toLowerCase().includes(shelterSearchQuery.toLowerCase());
                const matchesPostcode =
                  shelterPostcodeFilter === 'All' || s.postcodeArea === shelterPostcodeFilter;
                return matchesSearch && matchesPostcode;
              })
              .map((shelter) => {
                const isSelected = shelter.id === activeShelter.id;
                const shelterDogCount = shelterDogs.filter((d) => d.shelterId === shelter.id).length;

                return (
                  <div
                    key={shelter.id}
                    className={`rounded-3xl border bg-white overflow-hidden shadow-xs transition-all ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <img
                            src={shelter.logoUrl}
                            alt={shelter.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-snug">
                              {shelter.name}
                            </h3>
                            <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{shelter.location} ({shelter.postcodeArea})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {shelter.charityNumber}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-xs font-extrabold text-emerald-800 shrink-0">
                            Active Branch
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{shelter.description}</p>

                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveShelterId(shelter.id);
                            setActiveTab('dogs');
                            showToast(`Switched active shelter to ${shelter.name}.`);
                          }}
                          className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0f5132] hover:bg-[#0c3e29] text-white transition-all flex items-center justify-center gap-2 min-h-[42px]"
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                          <span>Manage / View Dogs ({shelterDogCount})</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveShelterId(shelter.id);
                            setDonateModalOpen(true);
                          }}
                          className="w-full sm:w-auto py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 min-h-[42px]"
                        >
                          <Gift className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Donate Items</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB: VISITS */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Scheduled Shelter Meet & Greet Visits
            </h3>
            <span className="text-xs text-slate-500">
              Appointments for prospective adoptive families
            </span>
          </div>

          <div className="space-y-3">
            {shelterVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      Visit for {visit.dogName}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      · {visit.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    Visitor: <strong>{visit.visitorName}</strong> · Phone: {visit.visitorPhone}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{visit.date} · {visit.timeSlot}</span>
                    <span>·</span>
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{visit.shelterName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {visit.status === 'Confirmed' && (
                    <button
                      onClick={() => updateVisitStatus(visit.id, 'Completed')}
                      className="px-4 py-2 bg-[#0f5132] text-white font-bold text-xs rounded-xl shadow-xs min-h-[40px]"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: VOLUNTEER WALKING PROGRAM */}
      {activeTab === 'walks' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <span className="text-2xl">🐕</span>
            <div className="space-y-1">
              <span className="font-bold text-sm">
                Shelter Volunteer Walking Program (100% Free of Charge)
              </span>
              <p className="text-amber-900 leading-relaxed">
                Both registered pet owners and professional dog walkers can volunteer to walk shelter dogs free of charge.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {volunteerWalks.map((vwalk) => (
              <div
                key={vwalk.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      Walk with {vwalk.dogName}
                    </span>
                    <span className="text-xs text-emerald-800 font-bold">
                      · Free of Charge · {vwalk.volunteerType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Volunteer Handler: <strong>{vwalk.volunteerName}</strong> ({vwalk.volunteerPhone})
                  </p>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{vwalk.date} · {vwalk.timeSlot} ({vwalk.durationMinutes} mins)</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-emerald-800">
                  {vwalk.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DONATIONS */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-700" />
                  <span>{activeShelter.name} Needs Wishlist</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Current items urgently needed for our rescue pups.
                </p>
              </div>

              <button
                onClick={() => setDonateModalOpen(true)}
                className="px-5 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 self-start sm:self-auto min-h-[42px]"
              >
                <Plus className="w-4 h-4" />
                <span>Send Item Donation Request</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeShelter.wishlistNeeds.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs font-semibold text-emerald-950 flex items-center gap-2.5"
                >
                  <span className="text-lg">📦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Community Donation Pledges</h3>
            <div className="space-y-4">
              {donationRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{req.itemCategory}</span>
                      <span className="ml-2 text-emerald-800 font-bold">· {req.status}</span>
                      <div className="text-xs text-slate-500">
                        From: <strong>{req.donorName}</strong> ({req.donorEmail})
                      </div>
                    </div>
                    <div className="text-slate-700 font-semibold">
                      Qty: {req.quantity} ({req.dropoffOrDelivery})
                    </div>
                  </div>
                  <p className="text-slate-700">"{req.description}"</p>

                  {req.status === 'Pending Review' && (
                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          reviewItemDonation(
                            req.id,
                            'Declined',
                            'Thank you, we are currently at capacity for this item.'
                          )
                        }
                        className="px-3.5 py-2 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() =>
                          reviewItemDonation(
                            req.id,
                            'Accepted',
                            'Thank you! Please drop off at main reception.'
                          )
                        }
                        className="px-4 py-2 bg-[#0f5132] text-white font-bold rounded-xl"
                      >
                        Accept Donation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: POST / UPLOAD NEW DOG FOR ADOPTION */}
      {uploadDogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Upload New Dog for Adoption
                </h3>
                <p className="text-xs text-slate-500">
                  Posting to {activeShelter.name} · Staff: {activeShelterStaff.name}
                </p>
              </div>
              <button
                onClick={() => setUploadDogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadNewDog} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dog Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cooper"
                    value={newDogName}
                    onChange={(e) => setNewDogName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Breed *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Labrador Cross"
                    value={newDogBreed}
                    onChange={(e) => setNewDogBreed(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="text"
                    value={newDogAge}
                    onChange={(e) => setNewDogAge(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newDogGender}
                    onChange={(e) => setNewDogGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="Male (Neutered)">Male (Neutered)</option>
                    <option value="Female (Spayed)">Female (Spayed)</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Size</label>
                  <select
                    value={newDogSize}
                    onChange={(e) => setNewDogSize(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Giant">Giant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Dog Photo or Paste Photo URL
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2 pb-1 max-w-full">
                  {PRESET_DOG_PHOTOS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewDogPhoto(url)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                        newDogPhoto === url ? 'border-[#0f5132] scale-105' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={url} alt="Preset dog" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={newDogPhoto}
                  onChange={(e) => setNewDogPhoto(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Rescue Story & Personality Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe temperament, ideal home environment, and favorite activities..."
                  value={newDogBackground}
                  onChange={(e) => setNewDogBackground(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Veterinary & Medical Summary
                </label>
                <input
                  type="text"
                  value={newDogMedical}
                  onChange={(e) => setNewDogMedical(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDogKids}
                    onChange={(e) => setNewDogKids(e.target.checked)}
                  />
                  <span className="font-semibold">Kids OK</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDogDogs}
                    onChange={(e) => setNewDogDogs(e.target.checked)}
                  />
                  <span className="font-semibold">Dogs OK</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDogCats}
                    onChange={(e) => setNewDogCats(e.target.checked)}
                  />
                  <span className="font-semibold">Cats OK</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDogHouseTrained}
                    onChange={(e) => setNewDogHouseTrained(e.target.checked)}
                  />
                  <span className="font-semibold">House Trained</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadDogModalOpen(false)}
                  className="px-4 py-2.5 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-black rounded-xl shadow-sm min-h-[42px]"
                >
                  Publish Dog for Adoption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG DAILY CARE / MEDICAL / ENRICHMENT UPDATE */}
      {dailyUpdateModalDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Post Daily Update for {dailyUpdateModalDog.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Logged by {activeShelterStaff.name} ({activeShelterStaff.role})
                </p>
              </div>
              <button
                onClick={() => setDailyUpdateModalDog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostDailyUpdate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Category</label>
                <select
                  value={updateCategory}
                  onChange={(e) => setUpdateCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                >
                  <option value="Walking & Enrichment">Walking & Enrichment</option>
                  <option value="Medical & Vet">Medical & Vet</option>
                  <option value="Feeding & Care">Feeding & Care</option>
                  <option value="Adoption & Meet-Greet">Adoption & Meet-Greet</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Daily Progress Note</label>
                <textarea
                  rows={3}
                  required
                  placeholder={`e.g. ${dailyUpdateModalDog.name} had a wonderful 45-min walk with our volunteer today and ate all evening kibble...`}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDailyUpdateModalDog(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Daily Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MARK ADOPTED & DEACTIVATE LISTING CONFIRMATION */}
      {adoptConfirmModalDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Mark {adoptConfirmModalDog.name} as Adopted / Deactivate
                </h3>
                <p className="text-xs text-slate-500">
                  Deactivates public booking requests and records adoption completion
                </p>
              </div>
              <button
                onClick={() => setAdoptConfirmModalDog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAdoptedOrDeactivate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adoptive Family Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Davies Family (Hampstead)"
                  value={adoptedFamilyName}
                  onChange={(e) => setAdoptedFamilyName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdoptConfirmModalDog(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Adopted & Deactivate Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL BACKGROUND DOG MODAL */}
      {detailModalDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={detailModalDog.photoUrl}
                  alt={detailModalDog.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl">{detailModalDog.name}</h3>
                  <p className="text-xs text-slate-500">
                    {detailModalDog.breed} · {detailModalDog.age} · {detailModalDog.gender}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailModalDog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Full Rescue Background & Story</h4>
                <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm">
                  {detailModalDog.fullBackground}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-950 block">Rescue Narrative:</span>
                  <span className="text-emerald-900">{detailModalDog.rescueStory}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-950 block">Medical History:</span>
                  <span className="text-emerald-900">{detailModalDog.medicalHistory}</span>
                </div>
              </div>

              {/* Daily Updates History inside Modal */}
              {detailModalDog.dailyUpdates && detailModalDog.dailyUpdates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Daily Staff Care Updates ({detailModalDog.dailyUpdates.length})
                  </h4>
                  <div className="space-y-2">
                    {detailModalDog.dailyUpdates.map((u) => (
                      <div key={u.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{u.category} · {u.staffName} ({u.staffRole})</span>
                          <span className="text-slate-400">{u.date}</span>
                        </div>
                        <p className="text-slate-600 mt-1">{u.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => {
                  setWalkModalDog(detailModalDog);
                  setDetailModalDog(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl"
              >
                Volunteer to Walk (Free)
              </button>

              <button
                onClick={() => {
                  setVisitModalDog(detailModalDog);
                  setDetailModalDog(null);
                }}
                className="px-5 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Book Visit to Meet {detailModalDog.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEET & GREET VISIT BOOKING MODAL */}
      {visitModalDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Book Visit to Meet {visitModalDog.name}</h3>
                <p className="text-xs text-slate-500">{visitModalDog.shelterName}</p>
              </div>
              <button
                onClick={() => setVisitModalDog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookVisit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="text"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={visitTimeSlot}
                    onChange={(e) => setVisitTimeSlot(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="1:30 PM - 2:30 PM">1:30 PM - 2:30 PM</option>
                    <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visit Notes / Household Info</label>
                <textarea
                  rows={3}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVisitModalDog(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VOLUNTEER WALK MODAL */}
      {walkModalDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Volunteer Walk for {walkModalDog.name}</h3>
                <span className="text-xs text-emerald-800 font-bold">100% Free of Charge</span>
              </div>
              <button
                onClick={() => setWalkModalDog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookVolunteerWalk} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVolType('Pet Owner')}
                  className={`p-2.5 rounded-xl border text-center font-bold ${
                    volType === 'Pet Owner'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Pet Owner Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => setVolType('Professional Walker')}
                  className={`p-2.5 rounded-xl border text-center font-bold ${
                    volType === 'Professional Walker'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Professional Dog Walker
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={volWalkDate}
                    onChange={(e) => setVolWalkDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={volWalkTime}
                    onChange={(e) => setVolWalkTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Walking Plan / Notes</label>
                <textarea
                  rows={3}
                  value={volWalkNotes}
                  onChange={(e) => setVolWalkNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWalkModalDog(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Schedule Free Walk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLEDGE ITEM DONATION MODAL */}
      {donateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Send Item Donation Pledge</h3>
                <p className="text-xs text-slate-500">{activeShelter.name}</p>
              </div>
              <button
                onClick={() => setDonateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDonation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Category</label>
                <select
                  value={donCategory}
                  onChange={(e) => setDonCategory(e.target.value as ItemDonationRequest['itemCategory'])}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  <option value="Dry Food / Kibble">Dry Food / Kibble</option>
                  <option value="Wet Food / Cans">Wet Food / Cans</option>
                  <option value="Fleece Blankets & Bedding">Fleece Blankets & Bedding</option>
                  <option value="Chew Toys & Kongs">Chew Toys & Kongs</option>
                  <option value="Collars, Leashes & Harnesses">Collars, Leashes & Harnesses</option>
                  <option value="Towels & Cleaning Supplies">Towels & Cleaning Supplies</option>
                  <option value="Medication & Supplements">Medication & Supplements</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. 2 brand new unopened 15kg bags of Purina Pro Plan..."
                  value={donDesc}
                  onChange={(e) => setDonDesc(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    required
                    value={donQty}
                    onChange={(e) => setDonQty(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Method</label>
                  <select
                    value={donDelivery}
                    onChange={(e) => setDonDelivery(e.target.value as ItemDonationRequest['dropoffOrDelivery'])}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="In-person dropoff">In-person dropoff</option>
                    <option value="Courier delivery">Courier delivery</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDonateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl shadow-xs"
                >
                  Submit Pledge to Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
