import React, { useState, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { PersonaMode } from '../../types';
import {
  X,
  UserCheck,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Building2,
  Compass,
  Heart,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Camera,
  Scale,
  PenTool,
  BookOpen,
  Star,
  Calendar,
  Radio,
  Sliders,
  MessageSquare,
} from 'lucide-react';
import { signInWithGoogle, auth, syncPrivateUserProfile } from '../../services/firebase';

interface AccountLoginAndSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountLoginAndSetupModal: React.FC<AccountLoginAndSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    persona,
    setPersona,
    setOwnerTab,
    setWalkerTab,
    setKennelTab,
    setShelterTab,
    setAdminTab,
    signPolicyAgreement,
    updateHouseholdMember,
    activeHouseholdMember,
    setAuthenticatedUserEmail,
    showToast,
  } = useMarketplace();

  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [selectedRole, setSelectedRole] = useState<PersonaMode>(persona === 'admin' ? 'owner' : persona);
  const [email, setEmail] = useState('oliver.harrison@londonpets.co.uk');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Oliver Harrison');
  const [businessOrDogName, setBusinessOrDogName] = useState('Buster (Golden Retriever)');
  const [postcode, setPostcode] = useState('NW3 1AA');
  const [avatarPreview, setAvatarPreview] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mandatory Policy & Procedure Checkboxes at the bottom of Sign-Up
  const [agreeAnimalWelfare, setAgreeAnimalWelfare] = useState(true);
  const [agreeUkGdpr, setAgreeUkGdpr] = useState(true);
  const [agreeEscrowTerms, setAgreeEscrowTerms] = useState(true);
  const [agreeDbsSafeguarding, setAgreeDbsSafeguarding] = useState(true);
  const [agreeEmergencyVet, setAgreeEmergencyVet] = useState(true);
  const [agreeAccountIsolation, setAgreeAccountIsolation] = useState(true);
  const [digitalSignature, setDigitalSignature] = useState('Oliver Harrison');

  // Post-Account-Creation Interactive Interface & Features Onboarding Screen
  const [showOnboardingGuideStep, setShowOnboardingGuideStep] = useState(false);

  if (!isOpen) return null;

  const allPoliciesSigned =
    agreeAnimalWelfare &&
    agreeUkGdpr &&
    agreeEscrowTerms &&
    agreeDbsSafeguarding &&
    agreeEmergencyVet &&
    agreeAccountIsolation &&
    digitalSignature.trim().length >= 2;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGoogleSignIn = async () => {
    if (mode === 'signup' && !allPoliciesSigned) {
      showToast(
        'Please sign and agree to all Policies & Procedures at the bottom of the form before creating an account.',
        'warning'
      );
      return;
    }
    const user = await signInWithGoogle();
    if (user) {
      const signedInEmail = (user.email || email || '').trim().toLowerCase();
      setAuthenticatedUserEmail(signedInEmail);
      const isSoleOwnerAdmin = signedInEmail === 'nicholaswaters1@gmail.com';
      await syncPrivateUserProfile({
        uid: user.uid,
        email: signedInEmail,
        persona: isSoleOwnerAdmin && selectedRole === 'admin' ? 'admin' : selectedRole === 'admin' ? 'owner' : selectedRole,
        postcode,
      });
      if (mode === 'signup') {
        signPolicyAgreement({
          userId: user.uid,
          userName: user.displayName || fullName,
          userRole:
            selectedRole === 'owner'
              ? 'Pet Owner'
              : selectedRole === 'walker'
                ? 'Walker'
                : selectedRole === 'kennel'
                  ? 'Kennel Host'
                  : 'Shelter Staff',
          agreedAnimalWelfareAct: true,
          agreedUkGdprPrivacy: true,
          agreedEscrowRefundTerms: true,
          agreedDbsSafeguarding: true,
          agreedEmergencyVetProtocol: true,
          signatureText: digitalSignature.trim() || user.displayName || 'Verified User',
        });
      }
      if (isSoleOwnerAdmin) {
        setPersona('admin');
        setAdminTab('mobile-command');
        showToast(
          `Welcome back, Platform Owner (${signedInEmail})! Admin & Mobile Command unlocked.`,
          'success'
        );
      } else {
        setPersona(selectedRole === 'admin' ? 'owner' : selectedRole);
        showToast(
          `Signed in with Google Cloud as ${user.displayName || user.email}! Account isolation & policies active.`,
          'success'
        );
      }
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup' && !allPoliciesSigned) {
      showToast(
        'Please tick all mandatory Policy & Procedure boxes and sign your name at the bottom of the page.',
        'warning'
      );
      return;
    }

    if (mode === 'signup') {
      signPolicyAgreement({
        userId: auth.currentUser?.uid || activeHouseholdMember.id,
        userName: fullName.trim(),
        userRole:
          selectedRole === 'owner'
            ? 'Pet Owner'
            : selectedRole === 'walker'
              ? 'Walker'
              : selectedRole === 'kennel'
                ? 'Kennel Host'
                : 'Shelter Staff',
        agreedAnimalWelfareAct: agreeAnimalWelfare,
        agreedUkGdprPrivacy: agreeUkGdpr,
        agreedEscrowRefundTerms: agreeEscrowTerms,
        agreedDbsSafeguarding: agreeDbsSafeguarding,
        agreedEmergencyVetProtocol: agreeEmergencyVet,
        signatureText: digitalSignature.trim(),
      });

      updateHouseholdMember(activeHouseholdMember.id, {
        name: fullName.trim(),
        avatar: avatarPreview,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    setAuthenticatedUserEmail(normalizedEmail);
    const isSoleOwnerAdmin = normalizedEmail === 'nicholaswaters1@gmail.com';

    if (isSoleOwnerAdmin && mode === 'login') {
      setPersona('admin');
      setAdminTab('mobile-command');
      showToast(
        'Welcome back! Sole Owner Admin & Mobile Command Center unlocked.',
        'success'
      );
      onClose();
      return;
    }

    const effectiveRole = selectedRole === 'admin' && !isSoleOwnerAdmin ? 'owner' : selectedRole;
    setPersona(effectiveRole);
    if (effectiveRole === 'owner') setOwnerTab('home');
    if (effectiveRole === 'walker') setWalkerTab('home');
    if (effectiveRole === 'kennel') setKennelTab('home');
    if (effectiveRole === 'shelter') setShelterTab('home');
    if (effectiveRole === 'admin' && isSoleOwnerAdmin) setAdminTab('mobile-command');

    if (mode === 'signup') {
      showToast(
        `Account created & all UK Policies signed by ${digitalSignature}! Here is your personal interface & feature guide.`,
        'success'
      );
      setShowOnboardingGuideStep(true);
      return;
    }

    showToast(
      `Welcome back, ${fullName}! Logged into your isolated ${effectiveRole.toUpperCase()} portal.`,
      'success'
    );
    onClose();
  };

  const roles: { id: PersonaMode; title: string; subtitle: string; icon: any }[] = [
    {
      id: 'owner',
      title: 'Pet Owner',
      subtitle: 'Book walks, kennels, GPS & dog photos',
      icon: Compass,
    },
    {
      id: 'walker',
      title: 'Dog Walker',
      subtitle: 'Custom durations, rates & pack hub',
      icon: UserCheck,
    },
    {
      id: 'kennel',
      title: 'Kennels & Stays',
      subtitle: 'Boarding suites, day care & custom rates',
      icon: Building2,
    },
    {
      id: 'shelter',
      title: 'Dog Shelter',
      subtitle: 'Multi-user staff login & post rescue dogs',
      icon: Heart,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0f5132] via-[#146c43] to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {mode === 'signup' ? 'Create New Account & Sign Policies' : 'Secure Account Sign In'}
              </h2>
              <p className="text-xs text-emerald-200">
                Strict Account Isolation · Each user manages only their own profile & dogs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Mode Switcher */}
          <div className="p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New User / Business Sign-Up
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Existing Account Login
            </button>
          </div>

          {/* 1-Tap Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Continue with Google Cloud Verified Account</span>
          </button>

          {/* Select Account Role */}
          <div className="space-y-2">
            <label className="block font-extrabold text-slate-800">
              1. Select Your Account Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const active = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                      active
                        ? 'border-emerald-600 bg-emerald-50/90 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#0f5132]' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{r.title}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{r.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Role Pricing Summary */}
            {selectedRole === 'owner' ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-[11px] text-emerald-950">
                <div>
                  <span className="font-extrabold text-emerald-800 uppercase mr-1.5">Dog Owners — FREE:</span>
                  <span>No monthly or annual subscription. Create dog profiles, search & contact professionals, and make bookings for free.</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black shrink-0">£0 / FREE</span>
              </div>
            ) : (selectedRole === 'walker' || selectedRole === 'kennel') ? (
              <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-300">Walkers, Kennels & Sitters Plans:</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">PRO – MOST POPULAR</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="font-bold text-white">FREE / STARTER</div>
                    <div className="text-emerald-300 font-black">£0/mo</div>
                    <div className="text-slate-400">5 bookings/wk · 10% comm.</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500">
                    <div className="font-bold text-amber-300">PRO (Popular)</div>
                    <div className="text-white font-black">£6.99/mo · £69.99/yr</div>
                    <div className="text-emerald-200">Unlimited · 5% comm.</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="font-bold text-white">Elite Package</div>
                    <div className="text-emerald-300 font-black">£14.99/mo · £149.99/yr</div>
                    <div className="text-slate-400">Teams · 2.5% comm.</div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Role-Specific Features & Interface Guide Preview During Account Setup */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#0f5132]" />
                  <span>
                    What to Do & How to Use Your{' '}
                    {selectedRole === 'owner'
                      ? 'Dog Owner'
                      : selectedRole === 'walker'
                      ? 'Dog Walker'
                      : selectedRole === 'kennel'
                      ? 'Kennel & Sitter'
                      : 'Shelter'}{' '}
                    Interface:
                  </span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Included in Your Account
                </span>
              </div>

              {selectedRole === 'owner' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">1. My Dogs & Home Access</strong>
                    Add your dog profiles, photos, home address, and key safe / pick-up & drop-off access notes.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">2. Availability Calendars & Booking</strong>
                    View live monthly calendars for Walkers, Kennels & Sitters and click any available date to book.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">3. Live GPS, Chat & Escrow Release</strong>
                    Watch live GPS trails (poos, water, off-leash), receive walk photos, and release escrow after the walk.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">4. Leave 1–5 Star Verified Reviews</strong>
                    Rate walkers and kennels to contribute to their aggregated average star rating score.
                  </div>
                </div>
              )}

              {selectedRole === 'walker' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">1. Set Operating Hours & Prices</strong>
                    Use "Rates & Hours" to edit your working hours (Mon–Sun), walk durations, and custom prices.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">2. View Dog Profiles & Access Notes</strong>
                    Click any dog in your walk pack to see their address, key safe code, and pick-up/drop-off instructions.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">3. Live GPS & Trail Event Recorder</strong>
                    Start/stop live GPS and use 1-tap buttons to log poos, waters, and off-the-leash runs.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">4. On-Walk Owner Chat & Escrow Payouts</strong>
                    Message/photo each dog owner live on the walk and request escrow payment release when finished.
                  </div>
                </div>
              )}

              {selectedRole === 'kennel' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">1. Suites & Custom Nightly/Day Rates</strong>
                    Add boarding suites or day-sitting pods and input your own nightly and daytime prices.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">2. Availability Calendar & Dog Profiles</strong>
                    Manage bookings on your monthly calendar and click any dog to view their full profile and access notes.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">3. Overnight Welfare & Webcam Log</strong>
                    Record suite temperatures, bedtime routines, 1080p webcam status, and Pup Academy rewards.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">4. Aggregated Star Rating & Membership</strong>
                    Showcase your aggregated star rating score and manage your Starter, PRO, or Elite plan.
                  </div>
                </div>
              )}

              {selectedRole === 'shelter' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">1. Upload Rescue Dogs for Adoption</strong>
                    Post rescue dogs with photos and toggle listings active/deactivated when adopted.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <strong className="text-slate-900 block">2. Multi-Staff Login & Volunteer Walks</strong>
                    Log daily vet/care notes and approve 100% free volunteer enrichment walks.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Picture / Logo Upload during Sign-Up */}
          {mode === 'signup' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={avatarPreview}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600 bg-white shrink-0"
                />
                <div>
                  <div className="font-extrabold text-slate-900">
                    Upload Profile Picture or Business Logo
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Personalize your account with your photo or company logo.
                  </p>
                </div>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-white hover:bg-emerald-100 text-[#0f5132] border border-emerald-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>
            </div>
          )}

          {/* Account Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name / Contact Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setDigitalSignature(e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {selectedRole === 'owner' ? 'Dog Name & Breed' : 'Business / Shelter Name'}
              </label>
              <input
                type="text"
                required
                value={businessOrDogName}
                onChange={(e) => setBusinessOrDogName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* MANDATORY POLICIES & PROCEDURES SECTION AT THE BOTTOM OF SIGN-UP */}
          {mode === 'signup' && (
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-emerald-600/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs sm:text-sm">
                  <Scale className="w-4 h-4 text-[#0f5132]" />
                  <span>Mandatory Policies, Procedures & Account Security Agreement</span>
                </div>
                <span className="text-[10px] font-black uppercase bg-amber-300 text-slate-950 px-2 py-0.5 rounded-full">
                  Required to Join
                </span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-700">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAnimalWelfare}
                    onChange={(e) => setAgreeAnimalWelfare(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span>
                    <strong>1. UK Animal Welfare Act 2006 & DEFRA Duty of Care:</strong> I agree to uphold statutory animal welfare standards, council max 4-dog pack limits, and safe lead protocols.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeUkGdpr}
                    onChange={(e) => setAgreeUkGdpr(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span>
                    <strong>2. UK GDPR & Data Protection Act 2018:</strong> I consent to encrypted storage of pet care records, microchip IDs, and live GPS walk telemetry.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeEscrowTerms}
                    onChange={(e) => setAgreeEscrowTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span>
                    <strong>3. Escrow Payment & Recurring 1-Month Cancellation Notice:</strong> I agree that booking payments are held in escrow until completion, and recurring subscriptions require a <strong>1-month (30-day) cancellation notice period</strong>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeDbsSafeguarding}
                    onChange={(e) => setAgreeDbsSafeguarding(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span>
                    <strong>4. Enhanced DBS & Identity Vetting Procedure:</strong> I confirm all identity, insurance, and licensing credentials uploaded to my profile are truthful.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeEmergencyVet}
                    onChange={(e) => setAgreeEmergencyVet(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span>
                    <strong>5. Platform Non-Liability / No-Claims Waiver & Emergency Vet Procedure:</strong> I acknowledge that <strong>My Paws Walks accepts no responsibility, liability, or claims against it</strong> for independent pet services or veterinary costs.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAccountIsolation}
                    onChange={(e) => setAgreeAccountIsolation(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span>
                    <strong>6. Strict Account Isolation Policy:</strong> I understand my login credentials protect my private account and users cannot edit or modify other users’ profiles.
                  </span>
                </label>
              </div>

              {/* Digital Signature Box at Bottom of Sign-Up */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-[#0f5132]" />
                  <span>Type Your Full Legal Name to Digitally Sign All Policies Above *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Type your full name as digital signature..."
                  value={digitalSignature}
                  onChange={(e) => setDigitalSignature(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-emerald-500 rounded-xl font-serif italic text-sm text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Submit Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ready for Google Play Store & Apple App Store</span>
            </div>

            <button
              type="submit"
              disabled={mode === 'signup' && !allPoliciesSigned}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] disabled:opacity-50 text-white font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>
                {mode === 'signup'
                  ? 'Sign Policies & Create My Account'
                  : 'Sign In to My Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Post-Account Creation Onboarding Overlay: Explains What to Do & How to Use Their Interface */}
        {showOnboardingGuideStep && (
          <div className="absolute inset-0 z-20 bg-white flex flex-col overflow-y-auto p-5 sm:p-7 space-y-5 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0f5132] via-[#146c43] to-slate-900 text-white flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>Welcome Onboarding Guide · Account Ready!</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Welcome, {fullName}! How to Use Your{' '}
                  {selectedRole === 'owner'
                    ? 'Dog Owner'
                    : selectedRole === 'walker'
                    ? 'Dog Walker'
                    : selectedRole === 'kennel'
                    ? 'Kennel & Sitting'
                    : 'Shelter'}{' '}
                  Interface
                </h3>
                <p className="text-xs text-emerald-100">
                  Here is your step-by-step checklist explaining what to do first and how to use your interface & features.
                </p>
              </div>
              <img
                src={avatarPreview}
                alt={fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shrink-0 hidden sm:block"
              />
            </div>

            {selectedRole === 'owner' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-700" />
                    <span>Step 1: Set Up "My Dogs" & Access Notes</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Open the <strong>My Dogs</strong> tab to upload your dog’s photo, vet details, home address, and key safe / pick-up & drop-off access instructions.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Step 2: Browse Availability Calendars</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Open <strong>Walkers</strong> or <strong>Kennels & Stays</strong> to view live monthly availability calendars, check aggregated star ratings, and click any green date to book.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-emerald-700" />
                    <span>Step 3: Live GPS, Chat & Escrow Release</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Use <strong>Live GPS</strong> during walks to see real-time poo, water, and off-leash logs, chat with your walker, and release escrow funds in <strong>Bookings</strong> after the walk.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Step 4: Leave 1–5 Star Verified Reviews</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    After a walk or kennel stay, leave a 1–5 star rating to update the provider’s aggregated average rating score.
                  </p>
                </div>
              </div>
            )}

            {selectedRole === 'walker' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-700" />
                    <span>Step 1: Set Operating Hours & Walk Prices</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Open <strong>Rates & Hours</strong> to edit your operating hours (Mon–Sun start & finish times), custom walk durations, and prices.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>Step 2: Click Booked Dogs for Profile & Access</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    In <strong>Pack Hub</strong> or <strong>Schedule</strong>, click any booked dog to inspect their profile, home collection address, and pick-up/drop-off access arrangements.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-emerald-700" />
                    <span>Step 3: Start/Stop Live GPS & Log Events</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Tap <strong>Start Live GPS Walk</strong> and use the 1-tap buttons to record poos, water breaks, and off-the-leash runs in real time.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                    <span>Step 4: Live Owner Chat & Escrow Release</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Send live messages and photos to each dog owner while walking, then tap <strong>Complete Walk</strong> to notify the owner to release your escrow payment.
                  </p>
                </div>
              </div>
            )}

            {(selectedRole === 'kennel' || selectedRole === 'shelter') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>Step 1: Set Up Suites & Custom Rates</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Open <strong>Suites & Custom Pricing</strong> to configure your overnight boarding suites and daytime dog sitting rates.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Step 2: Availability Calendar & Dog Profiles</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Use <strong>Availability Calendar & Dog Profiles</strong> to view daily bookings, block/unblock dates, and click any dog to view their full care profile.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Step 3: Aggregated Star Rating & Reviews</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Track your aggregated average star rating and verified dog owner reviews prominently at the top of your portal.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Step 4: Membership Plans & 1-Month Notice</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Choose Starter (£0/mo), PRO (£6.99/mo — Most Popular), or Elite (£14.99/mo), with flexible 1-month cancellation notice anytime.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Tip: You can revisit this guide anytime on your <strong>Home Screen</strong> or by tapping <strong>How to Use</strong> in the top bar.
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowOnboardingGuideStep(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Launch My {selectedRole.toUpperCase()} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
