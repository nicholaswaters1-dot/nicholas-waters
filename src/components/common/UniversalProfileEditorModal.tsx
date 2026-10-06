import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Lock,
  UserCheck,
  Building2,
  Heart,
  Compass,
  Store,
} from 'lucide-react';
import { auth } from '../../services/firebase';

export const UniversalProfileEditorModal: React.FC = () => {
  const {
    profileEditorModalOpen,
    setProfileEditorModalOpen,
    persona,
    activeHouseholdMember,
    updateHouseholdMember,
    activeDog,
    updateDog,
    walkers,
    updateWalkerProfile,
    kennels,
    updateKennelProfile,
    activeShelter,
    updateShelterProfile,
    localBusinesses,
    updateBusinessAd,
  } = useMarketplace();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dogPhotoInputRef = useRef<HTMLInputElement>(null);

  const [roleTab, setRoleTab] = useState<'owner' | 'walker' | 'kennel' | 'shelter' | 'business'>(
    persona === 'admin' ? 'business' : persona
  );

  useEffect(() => {
    if (profileEditorModalOpen) {
      setRoleTab(persona === 'admin' ? 'business' : persona);
    }
  }, [profileEditorModalOpen, persona]);

  // Owner state
  const [ownerName, setOwnerName] = useState(activeHouseholdMember.name);
  const [ownerRole, setOwnerRole] = useState(activeHouseholdMember.role);
  const [ownerPhone, setOwnerPhone] = useState(activeHouseholdMember.phone);
  const [ownerAvatar, setOwnerAvatar] = useState(activeHouseholdMember.avatar);
  const [dogName, setDogName] = useState(activeDog.name);
  const [dogBreed, setDogBreed] = useState(activeDog.breed);
  const [dogPhoto, setDogPhoto] = useState(activeDog.photoUrl);

  // Walker state
  const walker = walkers[0];
  const walkerPlan = walker.subscriptionPlan || 'PRO';
  const walkerPaid = walker.subscriptionPaid !== false;
  const walkerHasPro = (walkerPlan === 'PRO' || walkerPlan === 'Elite Package') && walkerPaid;
  const walkerHasElite = walkerPlan === 'Elite Package' && walkerPaid;

  const [walkerName, setWalkerName] = useState(walker.name);
  const [walkerHeadline, setWalkerHeadline] = useState(walker.headline);
  const [walkerLocation, setWalkerLocation] = useState(walker.location);
  const [walkerBio, setWalkerBio] = useState(walker.bio);
  const [walkerHourlyRate, setWalkerHourlyRate] = useState(walker.hourlyRate);
  const [walkerAvatar, setWalkerAvatar] = useState(walker.avatar);
  const [walkerDbs, setWalkerDbs] = useState(walker.dbsCertificateNumber);
  const [walkerExtraAreas, setWalkerExtraAreas] = useState(
    (walker.additionalServiceAreas || ['Highgate (N6)', 'Primrose Hill (NW1)']).join(', ')
  );

  // Kennel state
  const kennel = kennels[0];
  const kennelPlan = kennel.subscriptionPlan || 'PRO';
  const kennelPaid = kennel.subscriptionPaid !== false;
  const kennelHasPro = (kennelPlan === 'PRO' || kennelPlan === 'Elite Package') && kennelPaid;
  const kennelHasElite = kennelPlan === 'Elite Package' && kennelPaid;

  const [kennelName, setKennelName] = useState(kennel.businessName);
  const [kennelContact, setKennelContact] = useState(kennel.contactName);
  const [kennelHeadline, setKennelHeadline] = useState(kennel.headline);
  const [kennelLocation, setKennelLocation] = useState(kennel.location);
  const [kennelLicence, setKennelLicence] = useState(kennel.councilLicenceNumber);
  const [kennelBio, setKennelBio] = useState(kennel.bio);
  const [kennelLogo, setKennelLogo] = useState(kennel.avatar);
  const [kennelExtraAreas, setKennelExtraAreas] = useState(
    (kennel.additionalServiceAreas || ['Richmond (TW9)', 'Kew (TW9)']).join(', ')
  );

  // Shelter state
  const [shelterName, setShelterName] = useState(activeShelter.name);
  const [shelterLocation, setShelterLocation] = useState(activeShelter.location);
  const [shelterPhone, setShelterPhone] = useState(activeShelter.phone);
  const [shelterEmail, setShelterEmail] = useState(activeShelter.email);
  const [shelterCharityNo, setShelterCharityNo] = useState(activeShelter.charityNumber);
  const [shelterMission, setShelterMission] = useState(activeShelter.missionStatement);
  const [shelterLogo, setShelterLogo] = useState(activeShelter.logoUrl);

  // Business state
  const biz = localBusinesses[0];
  const [bizName, setBizName] = useState(biz.businessName);
  const [bizTagline, setBizTagline] = useState(biz.tagline);
  const [bizAddress, setBizAddress] = useState(biz.address);
  const [bizPhone, setBizPhone] = useState(biz.phone);
  const [bizPromo, setBizPromo] = useState(biz.promoOffer);
  const [bizWebsite, setBizWebsite] = useState(biz.website);
  const [bizLogo, setBizLogo] = useState(biz.logoUrl || '');
  const [bizPhotos, setBizPhotos] = useState<string[]>(biz.galleryPhotos || (biz.imageUrl ? [biz.imageUrl] : []));

  if (!profileEditorModalOpen) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBizGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 4 - bizPhotos.length;
    if (remaining <= 0) return;
    files.slice(0, remaining).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBizPhotos((prev) => (prev.length < 4 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleTab === 'owner') {
      updateHouseholdMember(activeHouseholdMember.id, {
        name: ownerName,
        role: ownerRole,
        phone: ownerPhone,
        avatar: ownerAvatar,
      });
      updateDog(activeDog.id, {
        name: dogName,
        breed: dogBreed,
        photoUrl: dogPhoto,
      });
    } else if (roleTab === 'walker') {
      updateWalkerProfile(walker.id, {
        name: walkerName,
        headline: walkerHeadline,
        location: walkerLocation,
        bio: walkerBio,
        hourlyRate: Number(walkerHourlyRate) || 18,
        avatar: walkerAvatar,
        dbsCertificateNumber: walkerDbs,
      });
    } else if (roleTab === 'kennel') {
      updateKennelProfile(kennel.id, {
        businessName: kennelName,
        contactName: kennelContact,
        headline: kennelHeadline,
        location: kennelLocation,
        councilLicenceNumber: kennelLicence,
        bio: kennelBio,
        avatar: kennelLogo,
      });
    } else if (roleTab === 'shelter') {
      updateShelterProfile(activeShelter.id, {
        name: shelterName,
        location: shelterLocation,
        phone: shelterPhone,
        email: shelterEmail,
        charityNumber: shelterCharityNo,
        missionStatement: shelterMission,
        logoUrl: shelterLogo,
      });
    } else if (roleTab === 'business') {
      updateBusinessAd(biz.id, {
        businessName: bizName,
        tagline: bizTagline,
        address: bizAddress,
        phone: bizPhone,
        promoOffer: bizPromo,
        website: bizWebsite,
        logoUrl: bizLogo,
        imageUrl: bizPhotos[0] || biz.imageUrl,
        galleryPhotos: bizPhotos.slice(0, 4),
      });
    }
    setProfileEditorModalOpen(false);
  };

  const currentAvatarUrl =
    roleTab === 'owner'
      ? ownerAvatar
      : roleTab === 'walker'
        ? walkerAvatar
        : roleTab === 'kennel'
          ? kennelLogo
          : roleTab === 'shelter'
            ? shelterLogo
            : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80';

  const setCurrentAvatarUrl = (url: string) => {
    if (roleTab === 'owner') setOwnerAvatar(url);
    if (roleTab === 'walker') setWalkerAvatar(url);
    if (roleTab === 'kennel') setKennelLogo(url);
    if (roleTab === 'shelter') setShelterLogo(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0f5132] to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Complete My Profile, Photo & Business Logo
              </h3>
              <p className="text-xs text-emerald-200 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>
                  Account Isolation Active: Only you ({auth.currentUser?.email || 'Verified Owner'}) can edit your own profile
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setProfileEditorModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'owner', label: 'Pet Owner & Dog Photo', icon: UserCheck },
            { id: 'walker', label: 'Dog Walker Profile', icon: Compass },
            { id: 'kennel', label: 'Kennels & Stays Logo', icon: Building2 },
            { id: 'shelter', label: 'Rescue Shelter Logo', icon: Heart },
            { id: 'business', label: 'Local Business Profile', icon: Store },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = roleTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#0f5132] text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Profile Picture / Logo Upload Zone */}
          {roleTab !== 'business' && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={currentAvatarUrl}
                  alt="Profile or Logo"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 bg-white shadow-xs shrink-0"
                />
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {roleTab === 'kennel' || roleTab === 'shelter'
                      ? 'Official Business / Shelter Logo'
                      : 'Personal Profile Picture'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Upload a photo from your mobile camera or photo library (JPG, PNG, WebP).
                  </p>
                </div>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setCurrentAvatarUrl)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo / Logo</span>
                </button>
              </div>
            </div>
          )}

          {/* OWNER FIELDS + DOG PROFILE PHOTO */}
          {roleTab === 'owner' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Dog Profile Picture Upload */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={dogPhoto}
                      alt={dogName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 bg-white shrink-0"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        Dog Profile Picture: {dogName}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Upload your own photo of {dogName} from your phone camera or gallery.
                      </p>
                    </div>
                  </div>
                  <div>
                    <input
                      ref={dogPhotoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setDogPhoto)}
                    />
                    <button
                      type="button"
                      onClick={() => dogPhotoInputRef.current?.click()}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Dog Picture</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dog Name</label>
                    <input
                      type="text"
                      value={dogName}
                      onChange={(e) => setDogName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dog Breed</label>
                    <input
                      type="text"
                      value={dogBreed}
                      onChange={(e) => setDogBreed(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WALKER FIELDS */}
          {roleTab === 'walker' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Walker / Business Name</label>
                  <input
                    type="text"
                    value={walkerName}
                    onChange={(e) => setWalkerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Hourly Walk Rate (£)</label>
                  <input
                    type="number"
                    value={walkerHourlyRate}
                    onChange={(e) => setWalkerHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Borough / Location</label>
                  <input
                    type="text"
                    value={walkerLocation}
                    onChange={(e) => setWalkerLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enhanced DBS Certificate No.</label>
                  <input
                    type="text"
                    value={walkerDbs}
                    onChange={(e) => setWalkerDbs(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Enhanced Profile Headline (PRO / Elite)
                  </label>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      walkerHasPro
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {walkerHasPro ? `Unlocked (${walkerPlan})` : 'Locked · PRO Required'}
                  </span>
                </div>
                <input
                  type="text"
                  disabled={!walkerHasPro}
                  value={walkerHeadline}
                  onChange={(e) => setWalkerHeadline(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl ${
                    walkerHasPro
                      ? 'bg-slate-50 border-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Biography & Qualifications</label>
                <textarea
                  rows={3}
                  value={walkerBio}
                  onChange={(e) => setWalkerBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800">
                    Multiple Service Areas & Additional Boroughs (Elite Package)
                  </label>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      walkerHasElite
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {walkerHasElite ? 'Elite Unlocked' : 'Locked · Elite (£14.99/mo)'}
                  </span>
                </div>
                <input
                  type="text"
                  disabled={!walkerHasElite}
                  value={walkerExtraAreas}
                  onChange={(e) => setWalkerExtraAreas(e.target.value)}
                  placeholder="e.g. Highgate (N6), Primrose Hill (NW1), St John's Wood (NW8)"
                  className={`w-full px-3 py-2 border rounded-xl ${
                    walkerHasElite
                      ? 'bg-white border-emerald-300 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                />
                {!walkerHasElite && (
                  <p className="text-[11px] text-slate-500">
                    Upgrade to the paid <strong>Elite Package (£14.99/mo or £149.99/yr)</strong> to advertise across multiple service areas and add staff walkers.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* KENNEL & STAYS FIELDS */}
          {roleTab === 'kennel' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kennel / Boarding Business Name</label>
                  <input
                    type="text"
                    value={kennelName}
                    onChange={(e) => setKennelName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lead Host Contact Name</label>
                  <input
                    type="text"
                    value={kennelContact}
                    onChange={(e) => setKennelContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location & Postcode</label>
                  <input
                    type="text"
                    value={kennelLocation}
                    onChange={(e) => setKennelLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">DEFRA Council Licence Number</label>
                  <input
                    type="text"
                    value={kennelLicence}
                    onChange={(e) => setKennelLicence(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Enhanced Establishment Headline (PRO / Elite)
                  </label>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      kennelHasPro
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {kennelHasPro ? `Unlocked (${kennelPlan})` : 'Locked · PRO Required'}
                  </span>
                </div>
                <input
                  type="text"
                  disabled={!kennelHasPro}
                  value={kennelHeadline}
                  onChange={(e) => setKennelHeadline(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl ${
                    kennelHasPro
                      ? 'bg-slate-50 border-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Facility Overview & Care Standards</label>
                <textarea
                  rows={3}
                  value={kennelBio}
                  onChange={(e) => setKennelBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800">
                    Multiple Service Areas & Catchments (Elite Package)
                  </label>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      kennelHasElite
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {kennelHasElite ? 'Elite Unlocked' : 'Locked · Elite (£14.99/mo)'}
                  </span>
                </div>
                <input
                  type="text"
                  disabled={!kennelHasElite}
                  value={kennelExtraAreas}
                  onChange={(e) => setKennelExtraAreas(e.target.value)}
                  placeholder="e.g. Richmond (TW9), Kew (TW9), Kingston (KT1)"
                  className={`w-full px-3 py-2 border rounded-xl ${
                    kennelHasElite
                      ? 'bg-white border-emerald-300 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          )}

          {/* SHELTER FIELDS */}
          {roleTab === 'shelter' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rescue Shelter Name</label>
                  <input
                    type="text"
                    value={shelterName}
                    onChange={(e) => setShelterName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registered Charity Number</label>
                  <input
                    type="text"
                    value={shelterCharityNo}
                    onChange={(e) => setShelterCharityNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={shelterPhone}
                    onChange={(e) => setShelterPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Public Inquiries Email</label>
                  <input
                    type="email"
                    value={shelterEmail}
                    onChange={(e) => setShelterEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shelter Address & Borough</label>
                <input
                  type="text"
                  value={shelterLocation}
                  onChange={(e) => setShelterLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mission Statement & Adoption Policy</label>
                <textarea
                  rows={3}
                  value={shelterMission}
                  onChange={(e) => setShelterMission(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* BUSINESS DIRECTORY FIELDS */}
          {roleTab === 'business' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950 text-white flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                    Pet Business Advertising Plan
                  </span>
                  <div className="font-extrabold text-sm mt-1">
                    £9.99 / Month Recurring Subscription (Active & Paid)
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    Includes official Business Logo, up to 4 Business Pictures, and live GPS Map Pin.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold text-xs">
                  ✓ £9.99/mo Paid
                </span>
              </div>

              {/* Business Logo & Up to 4 Pictures Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        bizLogo ||
                        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={bizName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 bg-white shrink-0"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        Business Logo
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Upload your official pet business logo.
                      </p>
                    </div>
                  </div>
                  <label className="px-3.5 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Business Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setBizLogo)}
                    />
                  </label>
                </div>

                {/* Max 4 Pictures */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        Business Pictures ({bizPhotos.length}/4 Maximum)
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Upload up to 4 pictures showcasing your pet business.
                      </p>
                    </div>
                    {bizPhotos.length < 4 && (
                      <label className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Add Picture ({4 - bizPhotos.length} left)</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleBizGalleryUpload}
                        />
                      </label>
                    )}
                  </div>

                  {bizPhotos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {bizPhotos.map((ph, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-300 h-20 bg-white">
                          <img src={ph} alt={`Business ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setBizPhotos((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 shadow cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business / Venue Name</label>
                  <input
                    type="text"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={bizPhone}
                    onChange={(e) => setBizPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue Address</label>
                <input
                  type="text"
                  value={bizAddress}
                  onChange={(e) => setBizAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={bizTagline}
                  onChange={(e) => setBizTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Member Reward / Promo Offer</label>
                <input
                  type="text"
                  value={bizPromo}
                  onChange={(e) => setBizPromo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Strict Account Ownership Lock: Other users cannot edit or overwrite your profile.</span>
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setProfileEditorModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile & Photo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
