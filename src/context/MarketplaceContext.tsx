import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PersonaMode,
  OwnerTab,
  WalkerTab,
  KennelTab,
  AdminTab,
  ShelterTab,
  Walker,
  DogProfile,
  WalkingPack,
  Booking,
  ChatMessage,
  WalkEvent,
  VerificationDocument,
  SafetyIncident,
  FinancialLedgerEntry,
  WalkerServicePricing,
  WalkerSubscriptionPackage,
  WalkSubscription,
  LocalBusinessAd,
  SoloWalkMeetup,
  RecordedPersonalWalk,
  PetOwnerFriend,
  PupTrainingTask,
  TrainingReward,
  HouseholdMember,
  EmergencyCallContact,
  ShelterDog,
  ShelterVisitBooking,
  ShelterVolunteerWalk,
  ItemDonationRequest,
  ShelterProfile,
  ShelterStaffMember,
  UserPolicyAgreement,
  ComplaintTicket,
  KennelSuite,
  KennelHost,
  KennelBooking,
  AppPushNotification,
  ServiceReview,
  ProfessionalSubscriptionTier,
} from '../types';
import { getCoordinatesForUkAddressAndPostcode } from '../services/googleMapsConfig';
import {
  dispatchPushNotificationToCloud,
  subscribePushNotifications,
  auth,
} from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  INITIAL_DOGS,
  INITIAL_WALKERS,
  INITIAL_PACKS,
  INITIAL_BOOKINGS,
  INITIAL_WALK_EVENTS,
  INITIAL_CHAT,
  INITIAL_VERIFICATIONS,
  INITIAL_INCIDENTS,
  INITIAL_LEDGER,
  INITIAL_WALKER_SERVICES,
  INITIAL_WALKER_PACKAGES,
  INITIAL_OWNER_SUBSCRIPTIONS,
  INITIAL_LOCAL_BUSINESS_ADS,
  INITIAL_MEETUPS,
  INITIAL_RECORDED_WALKS,
  INITIAL_DOG_FRIENDS,
  INITIAL_TRAINING_TASKS,
  INITIAL_REWARDS,
  INITIAL_HOUSEHOLD_MEMBERS,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_SHELTERS,
  INITIAL_SHELTER_DOGS,
  INITIAL_SHELTER_VISITS,
  INITIAL_VOLUNTEER_WALKS,
  INITIAL_DONATION_REQUESTS,
  INITIAL_SHELTER_STAFF,
  INITIAL_POLICY_AGREEMENTS,
  INITIAL_COMPLAINTS,
  INITIAL_KENNELS,
  INITIAL_KENNEL_BOOKINGS,
  INITIAL_SERVICE_REVIEWS,
} from '../data/initialData';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

export interface WalkerAvailabilityDay {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  maxDailyDogs: number;
}

interface AppContextType {
  persona: PersonaMode;
  setPersona: (p: PersonaMode) => void;
  currentUserEmail: string | null;
  isAuthorizedAdmin: boolean;
  setAuthenticatedUserEmail: (email: string | null) => void;
  ownerTab: OwnerTab;
  setOwnerTab: (t: OwnerTab) => void;
  walkerTab: WalkerTab;
  setWalkerTab: (t: WalkerTab) => void;
  kennelTab: KennelTab;
  setKennelTab: (t: KennelTab) => void;
  adminTab: AdminTab;
  setAdminTab: (t: AdminTab) => void;
  shelterTab: ShelterTab;
  setShelterTab: (t: ShelterTab) => void;

  // Language & i18n
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  languageModalOpen: boolean;
  setLanguageModalOpen: (open: boolean) => void;

  // Global Modals
  aboutModalOpen: boolean;
  setAboutModalOpen: (open: boolean) => void;
  legalModalOpen: boolean;
  setLegalModalOpen: (open: boolean) => void;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;
  howToUseModalOpen: boolean;
  setHowToUseModalOpen: (open: boolean) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;

  // Multi-Dog Management
  dogs: DogProfile[];
  activeDogId: string;
  setActiveDogId: (id: string) => void;
  activeDog: DogProfile;
  addDog: (dog: DogProfile) => void;
  updateDog: (id: string, updates: Partial<DogProfile>) => void;

  // Multi-User Household Pet Owner Sharing
  householdMembers: HouseholdMember[];
  activeHouseholdMember: HouseholdMember;
  switchHouseholdMember: (id: string) => void;
  addHouseholdMember: (member: Omit<HouseholdMember, 'id' | 'isCurrentActive' | 'isCurrentlyWalking'>) => void;
  updateHouseholdMember: (id: string, updates: Partial<HouseholdMember>) => void;

  // Live Walk SOS Emergency Call
  emergencyContacts: EmergencyCallContact[];
  activeEmergencyContactId: string;
  setActiveEmergencyContactId: (id: string) => void;
  activeEmergencyContact: EmergencyCallContact;
  addEmergencyContact: (contact: Omit<EmergencyCallContact, 'id'>) => void;
  triggerSosEmergencyCall: (contact: EmergencyCallContact, currentCoords?: string) => void;

  // Social Media & Native Web Share API Sharing
  shareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  shareData: {
    type?: 'walk' | 'profile' | 'booking';
    title: string;
    subtitle?: string;
    badge?: string;
    distanceKm?: number;
    durationMinutes?: number;
    dogNames?: string[];
    customText?: string;
    url?: string;
  } | null;
  openShareModal: (data: {
    type?: 'walk' | 'profile' | 'booking';
    title: string;
    subtitle?: string;
    badge?: string;
    distanceKm?: number;
    durationMinutes?: number;
    dogNames?: string[];
    customText?: string;
    url?: string;
  }) => void;
  nativeShare: (payload: {
    type: 'walk' | 'profile' | 'booking';
    title: string;
    subtitle?: string;
    badge?: string;
    text: string;
    url?: string;
    dogNames?: string[];
    distanceKm?: number;
    durationMinutes?: number;
  }) => Promise<void>;

  // Shelter & Rescue Centre Ecosystem
  shelters: ShelterProfile[];
  activeShelterId: string;
  setActiveShelterId: (id: string) => void;
  activeShelter: ShelterProfile;
  updateShelterProfile: (id: string, updates: Partial<ShelterProfile>) => void;
  shelterDogs: ShelterDog[];
  selectedShelterDog: ShelterDog | null;
  setSelectedShelterDog: (dog: ShelterDog | null) => void;
  addShelterDog: (dog: Omit<ShelterDog, 'id' | 'intakeDate'>) => void;
  updateShelterDogStatus: (dogId: string, status: ShelterDog['status'], isActiveListing: boolean, adoptedByFamily?: string) => void;
  addShelterDogDailyUpdate: (dogId: string, category: 'Medical & Vet' | 'Walking & Enrichment' | 'Adoption & Meet-Greet' | 'Feeding & Care', note: string) => void;
  shelterVisits: ShelterVisitBooking[];
  bookShelterVisit: (booking: Omit<ShelterVisitBooking, 'id' | 'status' | 'bookedAt'>) => void;
  updateVisitStatus: (id: string, status: ShelterVisitBooking['status']) => void;
  volunteerWalks: ShelterVolunteerWalk[];
  bookVolunteerWalk: (walk: Omit<ShelterVolunteerWalk, 'id' | 'status' | 'isFreeOfCharge'>) => void;
  updateVolunteerWalkStatus: (id: string, status: ShelterVolunteerWalk['status']) => void;
  donationRequests: ItemDonationRequest[];
  submitItemDonation: (donation: Omit<ItemDonationRequest, 'id' | 'status' | 'dateSubmitted'>) => void;
  reviewItemDonation: (id: string, status: 'Accepted' | 'Declined', responseNote?: string) => void;

  // Walkers & Discovery
  walkers: Walker[];
  selectedWalker: Walker | null;
  setSelectedWalker: (w: Walker | null) => void;
  updateWalkerProfile: (id: string, updates: Partial<Walker>) => void;
  updateWalkerSubscription: (
    walkerId: string,
    plan: ProfessionalSubscriptionTier,
    billingCycle?: 'monthly' | 'annual',
    paymentMethod?: string
  ) => void;
  selectedPostcodeArea: string;
  setSelectedPostcodeArea: (area: string) => void;

  // Bookings & Walk Subscriptions
  bookings: Booking[];
  createBooking: (booking: Omit<Booking, 'id' | 'status' | 'paymentStatus'>) => void;
  completeWalkAndRequestEscrowRelease: (bookingId?: string, walkSummaryNote?: string) => void;
  confirmAndReleaseEscrowPayment: (bookingId: string) => void;
  bookingModalOpen: boolean;
  openBookingModal: (walker?: Walker, preselectedDogIds?: string[]) => void;
  closeBookingModal: () => void;
  ownerSubscriptions: WalkSubscription[];
  subscribeToWalk: (sub: Omit<WalkSubscription, 'id' | 'status' | 'nextRenewalDate'>) => void;
  cancelSubscription: (id: string) => void;

  // Live Walk & Chat
  walkEvents: WalkEvent[];
  addWalkEvent: (event: Omit<WalkEvent, 'id' | 'time'>) => void;
  walkerLiveGpsActive: boolean;
  setWalkerLiveGpsActive: (active: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, photoUrl?: string, recipientOwnerName?: string, dogName?: string) => void;
  walkProgress: number;

  // Walker Services & Pricing Management
  walkerServices: WalkerServicePricing[];
  updateWalkerService: (serviceId: string, updates: Partial<WalkerServicePricing>) => void;
  walkerSurcharge: number;
  setWalkerSurcharge: (v: number) => void;
  multiDogDiscountPercent: number;
  setMultiDogDiscountPercent: (v: number) => void;
  walkerPackages: WalkerSubscriptionPackage[];
  addWalkerPackage: (pkg: Omit<WalkerSubscriptionPackage, 'id' | 'enrolledCount'>) => void;
  toggleWalkerPackage: (id: string) => void;

  // Walker Availability Calendar
  walkerAvailability: WalkerAvailabilityDay[];
  updateWalkerAvailability: (day: string, updates: Partial<WalkerAvailabilityDay>) => void;
  blockedDates: string[];
  toggleBlockedDate: (dateStr: string) => void;

  // Walker Packs & DBS Verifications
  packs: WalkingPack[];
  toggleDogAttendance: (packId: string, dogId: string) => void;
  addDogToPack: (packId: string, dogName: string, breed: string) => void;
  verifications: VerificationDocument[];
  submitVerificationDoc: (doc: { documentType: VerificationDocument['documentType']; documentNumber: string; expiryDate: string }) => void;
  reviewDocument: (docId: string, status: VerificationDocument['status'], notes?: string) => void;

  // Local Advertisers & Business Directory
  localBusinesses: LocalBusinessAd[];
  addBusinessAd: (ad: Omit<LocalBusinessAd, 'id' | 'status'>) => void;
  updateBusinessAd: (id: string, updates: Partial<LocalBusinessAd>) => void;
  reviewBusinessAd: (id: string, status: LocalBusinessAd['status']) => void;
  advertiseModalOpen: boolean;
  setAdvertiseModalOpen: (open: boolean) => void;

  // PawMates Social & Meetups
  meetups: SoloWalkMeetup[];
  toggleRsvpMeetup: (id: string) => void;
  createMeetup: (meetup: Omit<SoloWalkMeetup, 'id' | 'attendeesCount' | 'userRsvp'>) => void;
  recordedWalks: RecordedPersonalWalk[];
  saveRecordedWalk: (walk: Omit<RecordedPersonalWalk, 'id'>) => void;
  friends: PetOwnerFriend[];
  toggleFriend: (id: string) => void;
  trainingTasks: PupTrainingTask[];
  toggleTrainingTask: (id: string) => void;
  pawPoints: number;
  rewards: TrainingReward[];
  claimReward: (rewardId: string) => void;

  // Shelter Multi-User Staff
  shelterStaff: ShelterStaffMember[];
  activeShelterStaff: ShelterStaffMember;
  switchShelterStaff: (id: string) => void;
  addShelterStaff: (staff: Omit<ShelterStaffMember, 'id' | 'isCurrentActive'>) => void;

  // Mandatory Policy Agreements
  policyAgreements: UserPolicyAgreement[];
  hasUserSignedPolicies: boolean;
  policyModalOpen: boolean;
  setPolicyModalOpen: (open: boolean) => void;
  signPolicyAgreement: (agreement: Omit<UserPolicyAgreement, 'signedTimestamp' | 'ipRecord' | 'status'>) => void;

  // Complaints & Grievance Ticketing
  complaints: ComplaintTicket[];
  submitComplaint: (c: Omit<ComplaintTicket, 'id' | 'submittedAt' | 'status' | 'assignedAdmin'>) => void;
  resolveComplaint: (id: string, status: ComplaintTicket['status'], adminNotes: string) => void;
  complaintModalOpen: boolean;
  setComplaintModalOpen: (open: boolean) => void;

  // Dog Kennels & Overnight Boarding Stays
  kennels: KennelHost[];
  selectedKennel: KennelHost | null;
  setSelectedKennel: (k: KennelHost | null) => void;
  kennelBookings: KennelBooking[];
  createKennelBooking: (b: Omit<KennelBooking, 'id' | 'status' | 'bookedAt'>) => void;
  kennelBookingModalOpen: boolean;
  openKennelBookingModal: (kennel?: KennelHost, suite?: KennelSuite) => void;
  closeKennelBookingModal: () => void;
  selectedKennelSuite: KennelSuite | null;
  updateKennelSuiteAvailability: (kennelId: string, suiteId: string, available: boolean) => void;
  updateKennelSuite: (kennelId: string, suiteId: string, updates: Partial<KennelSuite>) => void;
  addKennelSuite: (kennelId: string, suite: Omit<KennelSuite, 'id'>) => void;
  updateKennelSubscription: (
    kennelId: string,
    plan: NonNullable<KennelHost['subscriptionPlan']>,
    billingCycle?: 'monthly' | 'annual',
    paymentMethod?: string
  ) => void;
  updateKennelProfile: (id: string, updates: Partial<KennelHost>) => void;

  // Push Notifications & Pinned Home Screen Features
  pushNotifications: AppPushNotification[];
  pushAlertsEnabled: Record<PersonaMode, boolean>;
  togglePushAlertsForRole: (role: PersonaMode) => void;
  sendPushAlert: (alert: Omit<AppPushNotification, 'id' | 'timestamp' | 'read'>) => void;
  markPushAlertRead: (id: string) => void;
  markAllPushAlertsRead: () => void;
  pinnedHomeTabs: Record<PersonaMode, string[]>;
  togglePinHomeTab: (role: PersonaMode, tabId: string) => void;
  profileEditorModalOpen: boolean;
  setProfileEditorModalOpen: (open: boolean) => void;

  // Admin & Financials
  incidents: SafetyIncident[];
  resolveIncident: (id: string, notes: string) => void;
  ledger: FinancialLedgerEntry[];
  commissionRate: number;
  setCommissionRate: (rate: number) => void;
  payoutWalker: (walkerName: string, amount: number) => void;

  // Star-Based Service Reviews & Aggregated Average Ratings
  serviceReviews: ServiceReview[];
  addServiceReview: (review: Omit<ServiceReview, 'id' | 'date' | 'verifiedBooking'>) => void;
  getProviderRatingStats: (targetId: string, baseRating: number, baseCount: number) => {
    averageRating: number;
    totalReviews: number;
    reviews: ServiceReview[];
    starBreakdown: { stars: number; count: number; percentage: number }[];
  };

  // Notifications
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_AVAILABILITY: WalkerAvailabilityDay[] = [
  { day: 'Monday', enabled: true, startTime: '08:30', endTime: '17:30', maxDailyDogs: 8 },
  { day: 'Tuesday', enabled: true, startTime: '08:30', endTime: '17:30', maxDailyDogs: 8 },
  { day: 'Wednesday', enabled: true, startTime: '08:30', endTime: '17:30', maxDailyDogs: 8 },
  { day: 'Thursday', enabled: true, startTime: '08:30', endTime: '17:30', maxDailyDogs: 8 },
  { day: 'Friday', enabled: true, startTime: '08:30', endTime: '16:00', maxDailyDogs: 6 },
  { day: 'Saturday', enabled: true, startTime: '09:00', endTime: '14:00', maxDailyDogs: 4 },
  { day: 'Sunday', enabled: false, startTime: '10:00', endTime: '13:00', maxDailyDogs: 0 },
];

const ADMIN_MASTER_EMAIL = 'nicholaswaters1@gmail.com';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persona, setPersonaState] = useState<PersonaMode>('owner');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mpw_authenticated_email') || auth.currentUser?.email || null;
    } catch {
      return auth.currentUser?.email || null;
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const normalized = user.email.trim().toLowerCase();
        setCurrentUserEmail(normalized);
        try {
          localStorage.setItem('mpw_authenticated_email', normalized);
        } catch {
          // ignore
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const setAuthenticatedUserEmail = (email: string | null) => {
    const normalized = email ? email.trim().toLowerCase() : null;
    setCurrentUserEmail(normalized);
    try {
      if (normalized) {
        localStorage.setItem('mpw_authenticated_email', normalized);
      } else {
        localStorage.removeItem('mpw_authenticated_email');
      }
    } catch {
      // ignore
    }
    if (normalized !== ADMIN_MASTER_EMAIL && persona === 'admin') {
      setPersonaState('owner');
    }
  };

  const isAuthorizedAdmin =
    (currentUserEmail || '').trim().toLowerCase() === ADMIN_MASTER_EMAIL ||
    (auth.currentUser?.email || '').trim().toLowerCase() === ADMIN_MASTER_EMAIL;

  const setPersona = (p: PersonaMode) => {
    if (p === 'admin' && !isAuthorizedAdmin) {
      setPersonaState('owner');
      showToast(
        'Access Restricted: Only the platform owner (nicholaswaters1@gmail.com) can access Admin & Mobile Command.',
        'warning'
      );
      return;
    }
    setPersonaState(p);
  };

  const [ownerTab, setOwnerTab] = useState<OwnerTab>('discover');
  const [walkerTab, setWalkerTab] = useState<WalkerTab>('pack-hub');
  const [kennelTab, setKennelTab] = useState<KennelTab>('suites-pricing');
  const [adminTab, setAdminTab] = useState<AdminTab>('kpis');
  const [shelterTab, setShelterTab] = useState<ShelterTab>('adoptable-dogs');

  // Language & i18n
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  // Modals
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [howToUseModalOpen, setHowToUseModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Social Share Modal & Web Share API
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    type?: 'walk' | 'profile' | 'booking';
    title: string;
    subtitle?: string;
    badge?: string;
    distanceKm?: number;
    durationMinutes?: number;
    dogNames?: string[];
    customText?: string;
    url?: string;
  } | null>(null);

  const openShareModal = (data: {
    type?: 'walk' | 'profile' | 'booking';
    title: string;
    subtitle?: string;
    badge?: string;
    distanceKm?: number;
    durationMinutes?: number;
    dogNames?: string[];
    customText?: string;
    url?: string;
  }) => {
    setShareData(data);
    setShareModalOpen(true);
  };

  const nativeShare = async (payload: {
    type: 'walk' | 'profile' | 'booking';
    title: string;
    subtitle?: string;
    badge?: string;
    text: string;
    url?: string;
    dogNames?: string[];
    distanceKm?: number;
    durationMinutes?: number;
  }) => {
    const shareUrl =
      payload.url ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://mypawswalks.co.uk');

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: shareUrl,
        });
        showToast('Shared via native Web Share API!', 'success');
        return;
      } catch (err: any) {
        if (err && err.name === 'AbortError') {
          return;
        }
        // If blocked by iframe permissions or desktop browser, open the rich social share modal
      }
    }

    openShareModal({
      type: payload.type,
      title: payload.title,
      subtitle: payload.subtitle,
      badge: payload.badge,
      customText: payload.text,
      url: shareUrl,
      dogNames: payload.dogNames,
      distanceKm: payload.distanceKm,
      durationMinutes: payload.durationMinutes,
    });
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Multi-Dog State
  const [dogs, setDogs] = useState<DogProfile[]>(INITIAL_DOGS);
  const [activeDogId, setActiveDogId] = useState<string>(INITIAL_DOGS[0].id);
  const activeDog = dogs.find((d) => d.id === activeDogId) || dogs[0];

  // Multi-User Household Family Members
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>(INITIAL_HOUSEHOLD_MEMBERS);
  const activeHouseholdMember = householdMembers.find((m) => m.isCurrentActive) || householdMembers[0];

  const switchHouseholdMember = (id: string) => {
    setHouseholdMembers((prev) =>
      prev.map((m) => ({ ...m, isCurrentActive: m.id === id }))
    );
    const member = householdMembers.find((m) => m.id === id);
    if (member) {
      showToast(`Logged in as ${member.name} (${member.role}). Shared live pet tracking synced!`);
    }
  };

  const addHouseholdMember = (newMem: Omit<HouseholdMember, 'id' | 'isCurrentActive' | 'isCurrentlyWalking'>) => {
    const mem: HouseholdMember = {
      ...newMem,
      id: `mem_${Date.now()}`,
      isCurrentActive: false,
      isCurrentlyWalking: false,
    };
    setHouseholdMembers((prev) => [...prev, mem]);
    showToast(`Added ${mem.name} (${mem.role}) to family pet account!`);
  };

  const updateHouseholdMember = (id: string, updates: Partial<HouseholdMember>) => {
    setHouseholdMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    showToast(`Updated pet owner profile & photo for ${updates.name || 'member'}!`);
  };

  // SOS Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyCallContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [activeEmergencyContactId, setActiveEmergencyContactId] = useState<string>(INITIAL_EMERGENCY_CONTACTS[0].id);
  const activeEmergencyContact = emergencyContacts.find((c) => c.id === activeEmergencyContactId) || emergencyContacts[0];

  const addEmergencyContact = (contact: Omit<EmergencyCallContact, 'id'>) => {
    const newContact: EmergencyCallContact = {
      ...contact,
      id: `em_${Date.now()}`,
    };
    setEmergencyContacts((prev) => [...prev, newContact]);
    showToast(`Added ${newContact.name} as an emergency contact.`);
  };

  const triggerSosEmergencyCall = (contact: EmergencyCallContact, currentCoords?: string) => {
    showToast(`🚨 SOS TRIGGERED! Calling ${contact.name} (${contact.phone}). Sent live GPS location: ${currentCoords || 'Hampstead Heath West Woods (51.5606° N, 0.1631° W)'}`, 'warning');
  };

  // Shelter & Rescue Centre Ecosystem
  const [shelters, setShelters] = useState<ShelterProfile[]>(INITIAL_SHELTERS);
  const [activeShelterId, setActiveShelterId] = useState<string>(INITIAL_SHELTERS[0].id);
  const activeShelter = shelters.find((s) => s.id === activeShelterId) || shelters[0];

  const updateShelterProfile = (id: string, updates: Partial<ShelterProfile>) => {
    setShelters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast(`Updated shelter profile & logo for ${updates.name || activeShelter.name}!`);
  };

  const [shelterDogs, setShelterDogs] = useState<ShelterDog[]>(() => {
    try {
      const cached = localStorage.getItem('mpw_shelter_dogs_v2');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return INITIAL_SHELTER_DOGS.map((d) => ({
      ...d,
      isActiveListing: d.status !== 'Re-homed',
      dailyUpdates: [
        {
          id: `upd_init_${d.id}`,
          date: 'Today, 09:15 AM',
          staffName: 'Dr. Hannah Abbott',
          staffRole: 'Vet Nurse / Medical Lead',
          category: 'Medical & Vet',
          note: 'Completed morning wellness check, heartworm prevention up to date, and enjoyed 30-min enrichment sniffari walk.',
        },
      ],
    }));
  });
  const [selectedShelterDog, setSelectedShelterDog] = useState<ShelterDog | null>(INITIAL_SHELTER_DOGS[0]);

  useEffect(() => {
    try {
      localStorage.setItem('mpw_shelter_dogs_v2', JSON.stringify(shelterDogs));
    } catch {
      // ignore
    }
  }, [shelterDogs]);

  const addShelterDog = (dogData: Omit<ShelterDog, 'id' | 'intakeDate'>) => {
    const newId = `sdog_${Date.now()}`;
    const staffMember = shelterStaff.find((s) => s.isCurrentActive) || shelterStaff[0];
    const newDog: ShelterDog = {
      ...dogData,
      id: newId,
      intakeDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      isActiveListing: dogData.status !== 'Re-homed',
      dailyUpdates: [
        {
          id: `upd_${Date.now()}`,
          date: 'Just now',
          staffName: staffMember.name,
          staffRole: staffMember.role,
          category: 'Adoption & Meet-Greet',
          note: `Uploaded new adoption profile for ${dogData.name}. Open for meet & greets and free volunteer walks.`,
        },
      ],
    };
    setShelterDogs((prev) => [newDog, ...prev]);
    showToast(`Uploaded ${newDog.name} (${newDog.breed}) for adoption at ${newDog.shelterName} by ${staffMember.name}!`);
  };

  const updateShelterDogStatus = (
    dogId: string,
    status: ShelterDog['status'],
    isActiveListing: boolean,
    adoptedByFamily?: string
  ) => {
    const staffMember = shelterStaff.find((s) => s.isCurrentActive) || shelterStaff[0];
    setShelterDogs((prev) =>
      prev.map((d) => {
        if (d.id !== dogId) return d;
        const statusNote =
          status === 'Re-homed'
            ? `Marked as Adopted / Re-homed${adoptedByFamily ? ` to ${adoptedByFamily}` : ''} and deactivated public adoption listing.`
            : isActiveListing
              ? `Activated adoption listing with status: ${status}.`
              : `Temporarily deactivated adoption listing (${status}).`;
        return {
          ...d,
          status,
          isActiveListing,
          adoptedByFamily: adoptedByFamily || d.adoptedByFamily,
          adoptedDate: status === 'Re-homed' ? 'Today' : d.adoptedDate,
          dailyUpdates: [
            {
              id: `upd_${Date.now()}`,
              date: 'Just now',
              staffName: staffMember.name,
              staffRole: staffMember.role,
              category: 'Adoption & Meet-Greet',
              note: statusNote,
            },
            ...(d.dailyUpdates || []),
          ],
        };
      })
    );
    showToast(
      status === 'Re-homed'
        ? `🎉 Congratulations! Dog marked as Adopted / Re-homed & listing deactivated by ${staffMember.name}!`
        : `Listing status updated to "${status}" (${isActiveListing ? 'Active' : 'Deactivated'}) by ${staffMember.name}.`
    );
  };

  const addShelterDogDailyUpdate = (
    dogId: string,
    category: 'Medical & Vet' | 'Walking & Enrichment' | 'Adoption & Meet-Greet' | 'Feeding & Care',
    note: string
  ) => {
    const staffMember = shelterStaff.find((s) => s.isCurrentActive) || shelterStaff[0];
    setShelterDogs((prev) =>
      prev.map((d) => {
        if (d.id !== dogId) return d;
        return {
          ...d,
          dailyUpdates: [
            {
              id: `upd_${Date.now()}`,
              date: 'Today, Just Now',
              staffName: staffMember.name,
              staffRole: staffMember.role,
              category,
              note,
            },
            ...(d.dailyUpdates || []),
          ],
        };
      })
    );
    showToast(`Daily update logged by ${staffMember.name} (${staffMember.role})!`);
  };

  const [shelterVisits, setShelterVisits] = useState<ShelterVisitBooking[]>(INITIAL_SHELTER_VISITS);
  const [volunteerWalks, setVolunteerWalks] = useState<ShelterVolunteerWalk[]>(INITIAL_VOLUNTEER_WALKS);
  const [donationRequests, setDonationRequests] = useState<ItemDonationRequest[]>(INITIAL_DONATION_REQUESTS);

  const bookShelterVisit = (bookingData: Omit<ShelterVisitBooking, 'id' | 'status' | 'bookedAt'>) => {
    const newVisit: ShelterVisitBooking = {
      ...bookingData,
      id: `vis_${Date.now()}`,
      status: 'Confirmed',
      bookedAt: 'Just now',
    };
    setShelterVisits((prev) => [newVisit, ...prev]);
    sendPushAlert({
      targetRole: 'shelter',
      category: 'Adoption Inquiry',
      title: `🐾 New Adoption Inquiry: ${newVisit.dogName}`,
      body: `${newVisit.visitorName} requested a ${newVisit.visitPurpose} appointment at ${newVisit.shelterName} on ${newVisit.date} (${newVisit.timeSlot}).`,
      actionTab: 'visits',
    });
    showToast(`Visit booked to meet ${newVisit.dogName} at ${newVisit.shelterName}! Shelter staff alerted via Push Notification.`);
  };

  const updateVisitStatus = (id: string, status: ShelterVisitBooking['status']) => {
    setShelterVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
    showToast(`Shelter visit status updated to ${status}.`);
  };

  const bookVolunteerWalk = (walkData: Omit<ShelterVolunteerWalk, 'id' | 'status' | 'isFreeOfCharge'>) => {
    const newWalk: ShelterVolunteerWalk = {
      ...walkData,
      id: `vwalk_${Date.now()}`,
      status: 'Approved',
      isFreeOfCharge: true,
    };
    setVolunteerWalks((prev) => [newWalk, ...prev]);
    showToast(`Volunteer walk confirmed for ${newWalk.dogName}! Free of charge service granted.`);
  };

  const updateVolunteerWalkStatus = (id: string, status: ShelterVolunteerWalk['status']) => {
    setVolunteerWalks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status } : w))
    );
    showToast(`Volunteer walk status updated to ${status}.`);
  };

  const submitItemDonation = (donationData: Omit<ItemDonationRequest, 'id' | 'status' | 'dateSubmitted'>) => {
    const newDonation: ItemDonationRequest = {
      ...donationData,
      id: `don_${Date.now()}`,
      dateSubmitted: 'Just now',
      status: 'Pending Review',
    };
    setDonationRequests((prev) => [newDonation, ...prev]);
    showToast(`Thank you! Item donation request submitted to ${newDonation.shelterName}. The shelter team will review and accept.`);
  };

  const reviewItemDonation = (id: string, status: 'Accepted' | 'Declined', responseNote?: string) => {
    setDonationRequests((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, shelterResponseNote: responseNote } : d))
    );
    showToast(`Donation request marked as ${status}.`);
  };

  // Shelter Multi-User Staff
  const [shelterStaff, setShelterStaff] = useState<ShelterStaffMember[]>(INITIAL_SHELTER_STAFF);
  const activeShelterStaff = shelterStaff.find((s) => s.isCurrentActive) || shelterStaff[0];

  const switchShelterStaff = (id: string) => {
    setShelterStaff((prev) =>
      prev.map((s) => ({ ...s, isCurrentActive: s.id === id }))
    );
    const staff = shelterStaff.find((s) => s.id === id);
    if (staff) {
      showToast(`Logged in as ${staff.name} (${staff.role}). Shelter management permissions active.`);
    }
  };

  const addShelterStaff = (newStaffData: Omit<ShelterStaffMember, 'id' | 'isCurrentActive'>) => {
    const newStaff: ShelterStaffMember = {
      ...newStaffData,
      id: `staff_${Date.now()}`,
      isCurrentActive: false,
    };
    setShelterStaff((prev) => [...prev, newStaff]);
    showToast(`Added ${newStaff.name} as ${newStaff.role} to shelter staff roster.`);
  };

  // Mandatory Policy Agreements
  const [policyAgreements, setPolicyAgreements] = useState<UserPolicyAgreement[]>(INITIAL_POLICY_AGREEMENTS);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const hasUserSignedPolicies = policyAgreements.some(
    (a) => a.userId === activeHouseholdMember.id && a.status === 'Signed & Active'
  );

  const signPolicyAgreement = (agreementData: Omit<UserPolicyAgreement, 'signedTimestamp' | 'ipRecord' | 'status'>) => {
    const newAgreement: UserPolicyAgreement = {
      ...agreementData,
      signedTimestamp: 'Just now',
      ipRecord: '82.165.197.42 (London, UK)',
      status: 'Signed & Active',
    };
    setPolicyAgreements((prev) => [newAgreement, ...prev]);
    showToast(`All platform policies & legal procedures signed by ${newAgreement.userName}! Registration verified.`);
  };

  // Complaints & Grievance Tickets
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(INITIAL_COMPLAINTS);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);

  const submitComplaint = (compData: Omit<ComplaintTicket, 'id' | 'submittedAt' | 'status' | 'assignedAdmin'>) => {
    const newComp: ComplaintTicket = {
      ...compData,
      id: `comp_${Date.now()}`,
      submittedAt: 'Just now',
      status: 'Under Investigation',
      assignedAdmin: 'Compliance Officer (Lead Triage)',
    };
    setComplaints((prev) => [newComp, ...prev]);
    showToast(`Complaint reference ${newComp.id} submitted. Our compliance team has opened an investigation.`);
  };

  const resolveComplaint = (id: string, status: ComplaintTicket['status'], adminNotes: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              adminResolutionNotes: adminNotes,
              resolvedAt: 'Just now',
            }
          : c
      )
    );
    showToast(`Complaint ${id} resolution updated to: ${status}.`);
  };

  // Dog Kennels & Overnight Boarding Stays
  const [kennels, setKennels] = useState<KennelHost[]>(INITIAL_KENNELS);
  const [selectedKennel, setSelectedKennel] = useState<KennelHost | null>(INITIAL_KENNELS[0]);
  const [kennelBookings, setKennelBookings] = useState<KennelBooking[]>(INITIAL_KENNEL_BOOKINGS);
  const [kennelBookingModalOpen, setKennelBookingModalOpen] = useState(false);
  const [selectedKennelSuite, setSelectedKennelSuite] = useState<KennelSuite | null>(null);

  const openKennelBookingModal = (kennel?: KennelHost, suite?: KennelSuite) => {
    if (kennel) setSelectedKennel(kennel);
    if (suite) setSelectedKennelSuite(suite);
    setKennelBookingModalOpen(true);
  };

  const closeKennelBookingModal = () => {
    setKennelBookingModalOpen(false);
  };

  const createKennelBooking = (bookingData: Omit<KennelBooking, 'id' | 'status' | 'bookedAt'>) => {
    const targetKennel = kennels.find((k) => k.id === bookingData.kennelId) || kennels[0];
    const kennelPlan = targetKennel?.subscriptionPlan || 'PRO';
    const existingWeeklyKennelBookings = kennelBookings.filter(
      (b) => b.kennelId === bookingData.kennelId && b.status !== 'Pending'
    ).length;

    if (kennelPlan === 'FREE / STARTER' && existingWeeklyKennelBookings >= 5) {
      showToast(
        `⚠️ ${targetKennel.businessName} is on the FREE / STARTER plan (limited to 5 bookings per week). Host must upgrade to PRO (£6.99/mo) or Elite (£14.99/mo) for unlimited bookings.`,
        'warning'
      );
      return;
    }

    const tierCommRate =
      kennelPlan === 'Elite Package' ? 2.5 : kennelPlan === 'PRO' ? 5 : 10;

    const newBooking: KennelBooking = {
      ...bookingData,
      id: `kb_${Date.now()}`,
      status: 'Confirmed',
      bookedAt: 'Just now',
    };
    setKennelBookings((prev) => [newBooking, ...prev]);

    // Ledger escrow entry using tier-aligned commission rate
    const newLedgerEntry: FinancialLedgerEntry = {
      id: `led_kn_${Date.now()}`,
      transactionRef: `KENNEL-${newBooking.id.toUpperCase()}`,
      date: 'Today, Just Now',
      type: 'Booking Payment',
      amount: newBooking.totalPrice,
      commissionRate: tierCommRate,
      commissionEarned: Math.round(newBooking.totalPrice * (tierCommRate / 100) * 100) / 100,
      walkerPayout: Math.round(newBooking.totalPrice * (1 - tierCommRate / 100) * 100) / 100,
      walkerName: newBooking.kennelName,
      ownerName: newBooking.ownerName,
      status: 'Escrow',
    };
    setLedger((prev) => [newLedgerEntry, ...prev]);

    showToast(`Overnight stay at ${newBooking.kennelName} (${newBooking.suiteName}) confirmed and held safely in escrow!`);
    sendPushAlert({
      targetRole: 'kennel',
      category: 'Kennel Stay',
      title: `🏨 New Kennel Stay Booking: ${newBooking.dogNames.join(', ')}`,
      body: `${newBooking.ownerName} booked ${newBooking.suiteName} (${newBooking.totalNights} nights, £${newBooking.totalPrice.toFixed(2)}) from ${newBooking.checkInDate}.`,
      actionTab: 'calendar',
    });
    closeKennelBookingModal();
  };

  const updateKennelSuiteAvailability = (kennelId: string, suiteId: string, available: boolean) => {
    setKennels((prev) =>
      prev.map((k) => {
        if (k.id !== kennelId) return k;
        return {
          ...k,
          suites: k.suites.map((s) => (s.id === suiteId ? { ...s, available } : s)),
        };
      })
    );
    showToast(`Kennel suite availability updated.`);
  };

  const updateKennelSuite = (kennelId: string, suiteId: string, updates: Partial<KennelSuite>) => {
    setKennels((prev) =>
      prev.map((k) => {
        if (k.id !== kennelId) return k;
        return {
          ...k,
          suites: k.suites.map((s) => (s.id === suiteId ? { ...s, ...updates } : s)),
        };
      })
    );
    showToast(`Boarding suite details and tariffs updated.`);
  };

  const addKennelSuite = (kennelId: string, suiteData: Omit<KennelSuite, 'id'>) => {
    const newSuite: KennelSuite = {
      ...suiteData,
      id: `suite_${Date.now()}`,
    };
    setKennels((prev) =>
      prev.map((k) => {
        if (k.id !== kennelId) return k;
        return {
          ...k,
          suites: [...k.suites, newSuite],
        };
      })
    );
    showToast(`Added new custom suite "${newSuite.name}" with rate £${newSuite.nightlyRate}/night!`);
  };

  const updateKennelSubscription = (
    kennelId: string,
    plan: NonNullable<KennelHost['subscriptionPlan']>,
    billingCycle: 'monthly' | 'annual' = 'annual',
    paymentMethod: string = 'Apple Pay'
  ) => {
    const isPaid = plan === 'PRO' || plan === 'Elite Package';
    setKennels((prev) =>
      prev.map((k) =>
        k.id === kennelId
          ? {
              ...k,
              subscriptionPlan: plan,
              subscriptionPaid: isPaid,
              subscriptionBillingCycle: billingCycle,
            }
          : k
      )
    );
    const newComm = plan === 'Elite Package' ? 2.5 : plan === 'PRO' ? 5 : 10;
    setCommissionRate(newComm);

    if (isPaid) {
      const feeAmount =
        plan === 'PRO'
          ? billingCycle === 'annual'
            ? 69.99
            : 6.99
          : billingCycle === 'annual'
          ? 149.99
          : 14.99;
      const targetKennel = kennels.find((k) => k.id === kennelId) || kennels[0];
      const subLedger: FinancialLedgerEntry = {
        id: `led_ksub_${Date.now()}`,
        transactionRef: `KSUB-${Math.floor(10000 + Math.random() * 90000)}`,
        date: 'Today, Just Now',
        type: 'Subscription Fee',
        amount: feeAmount,
        commissionRate: 100,
        commissionEarned: feeAmount,
        walkerPayout: 0,
        walkerName: 'My Paws Walks Treasury',
        ownerName: `${targetKennel.businessName} (${plan} · ${paymentMethod})`,
        status: 'Settled',
      };
      setLedger((prev) => [subLedger, ...prev]);
      showToast(
        `✅ Payment of £${feeAmount.toFixed(2)} processed via ${paymentMethod}! ${plan} unlocked (${newComm}% commission).`
      );
    } else {
      showToast(
        `Switched Kennel & Sitter plan to FREE / STARTER (£0/mo · 10% commission · max 5 bookings/week).`,
        'info'
      );
    }
  };

  const updateKennelProfile = (id: string, updates: Partial<KennelHost>) => {
    setKennels((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...updates } : k))
    );
    showToast(`Updated kennel & stay profile and logo!`);
  };

  // Walkers & Locations
  const [walkers, setWalkers] = useState<Walker[]>(INITIAL_WALKERS);
  const [selectedWalker, setSelectedWalker] = useState<Walker | null>(INITIAL_WALKERS[0]);
  const [selectedPostcodeArea, setSelectedPostcodeArea] = useState<string>('All');

  const updateWalkerProfile = (id: string, updates: Partial<Walker>) => {
    setWalkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
    showToast(`Updated dog walker profile & photo!`);
  };

  const updateWalkerSubscription = (
    walkerId: string,
    plan: ProfessionalSubscriptionTier,
    billingCycle: 'monthly' | 'annual' = 'annual',
    paymentMethod: string = 'Apple Pay'
  ) => {
    const isPaid = plan === 'PRO' || plan === 'Elite Package';
    setWalkers((prev) =>
      prev.map((w) =>
        w.id === walkerId
          ? {
              ...w,
              subscriptionPlan: plan,
              subscriptionPaid: isPaid,
              subscriptionBillingCycle: billingCycle,
              isRecommended: isPaid,
            }
          : w
      )
    );
    const newComm = plan === 'Elite Package' ? 2.5 : plan === 'PRO' ? 5 : 10;
    setCommissionRate(newComm);

    if (isPaid) {
      const feeAmount =
        plan === 'PRO'
          ? billingCycle === 'annual'
            ? 69.99
            : 6.99
          : billingCycle === 'annual'
          ? 149.99
          : 14.99;
      const targetWalker = walkers.find((w) => w.id === walkerId) || walkers[0];
      const subLedger: FinancialLedgerEntry = {
        id: `led_wsub_${Date.now()}`,
        transactionRef: `WSUB-${Math.floor(10000 + Math.random() * 90000)}`,
        date: 'Today, Just Now',
        type: 'Subscription Fee',
        amount: feeAmount,
        commissionRate: 100,
        commissionEarned: feeAmount,
        walkerPayout: 0,
        walkerName: 'My Paws Walks Treasury',
        ownerName: `${targetWalker.name} (${plan} · ${paymentMethod})`,
        status: 'Settled',
      };
      setLedger((prev) => [subLedger, ...prev]);
      showToast(
        `✅ Payment of £${feeAmount.toFixed(2)} processed via ${paymentMethod}! ${plan} features unlocked (${newComm}% commission).`
      );
    } else {
      showToast(
        `Switched Walker plan to FREE / STARTER (£0/mo · 10% commission · max 5 bookings/week). PRO & Elite features are now restricted until paid.`,
        'info'
      );
    }
  };

  // Bookings & Walk Subscriptions
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [ownerSubscriptions, setOwnerSubscriptions] = useState<WalkSubscription[]>(INITIAL_OWNER_SUBSCRIPTIONS);

  // Live Walk & Chat
  const [walkEvents, setWalkEvents] = useState<WalkEvent[]>(INITIAL_WALK_EVENTS);
  const [walkerLiveGpsActive, setWalkerLiveGpsActive] = useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [walkProgress] = useState(65);

  const addWalkEvent = (eventData: Omit<WalkEvent, 'id' | 'time'>) => {
    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const newEvt: WalkEvent = {
      ...eventData,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      time: nowStr,
    };
    setWalkEvents((prev) => [newEvt, ...prev]);
  };

  // Walker Service Pricing & Subscription Packages (for Sarah)
  const [walkerServices, setWalkerServices] = useState<WalkerServicePricing[]>(INITIAL_WALKER_SERVICES);
  const [walkerSurcharge, setWalkerSurcharge] = useState<number>(8);
  const [multiDogDiscountPercent, setMultiDogDiscountPercent] = useState<number>(50);
  const [walkerPackages, setWalkerPackages] = useState<WalkerSubscriptionPackage[]>(INITIAL_WALKER_PACKAGES);

  // Walker Availability Schedule
  const [walkerAvailability, setWalkerAvailability] = useState<WalkerAvailabilityDay[]>(DEFAULT_AVAILABILITY);
  const [blockedDates, setBlockedDates] = useState<string[]>(['2026-10-15', '2026-10-16']);

  // Walker Packs & Verifications
  const [packs, setPacks] = useState<WalkingPack[]>(INITIAL_PACKS);
  const [verifications, setVerifications] = useState<VerificationDocument[]>(INITIAL_VERIFICATIONS);

  // Local Advertisers & Business Directory
  const [localBusinesses, setLocalBusinesses] = useState<LocalBusinessAd[]>(INITIAL_LOCAL_BUSINESS_ADS);
  const [advertiseModalOpen, setAdvertiseModalOpen] = useState(false);

  // PawMates Social, Recorded Walks, Friends, Training & Rewards
  const [meetups, setMeetups] = useState<SoloWalkMeetup[]>(INITIAL_MEETUPS);
  const [recordedWalks, setRecordedWalks] = useState<RecordedPersonalWalk[]>(INITIAL_RECORDED_WALKS);
  const [friends, setFriends] = useState<PetOwnerFriend[]>(INITIAL_DOG_FRIENDS);
  const [trainingTasks, setTrainingTasks] = useState<PupTrainingTask[]>(INITIAL_TRAINING_TASKS);
  const [rewards, setRewards] = useState<TrainingReward[]>(INITIAL_REWARDS);
  const [pawPoints, setPawPoints] = useState<number>(430);

  // Incidents & Ledger
  const [incidents, setIncidents] = useState<SafetyIncident[]>(INITIAL_INCIDENTS);
  const [ledger, setLedger] = useState<FinancialLedgerEntry[]>(INITIAL_LEDGER);
  const [commissionRate, setCommissionRate] = useState<number>(5);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Profile Editor Modal
  const [profileEditorModalOpen, setProfileEditorModalOpen] = useState(false);

  // Push Notifications State (Persisted + Firebase Cloud Synced)
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState<Record<PersonaMode, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mpw_push_enabled_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      owner: true,
      walker: true,
      kennel: true,
      shelter: true,
      admin: true,
    };
  });

  const [pushNotifications, setPushNotifications] = useState<AppPushNotification[]>(() => {
    try {
      const saved = localStorage.getItem('mpw_push_notifs_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'notif_init_1',
        targetRole: 'shelter',
        category: 'Adoption Inquiry',
        title: '🐾 New Adoption Inquiry for Barnaby (Golden Retriever)',
        body: 'The Thompson Family submitted a formal Meet & Greet and home-check inquiry via Battersea Portal.',
        timestamp: '10 mins ago',
        read: false,
        actionTab: 'visits',
      },
      {
        id: 'notif_init_2',
        targetRole: 'walker',
        category: 'New Booking',
        title: '🦮 New 60-Min Group Pack Walk Booking',
        body: 'Oliver Harrison booked Buster & Daisy for Tomorrow 09:30 AM (£27.00 held in Escrow).',
        timestamp: '25 mins ago',
        read: false,
        actionTab: 'pack-hub',
      },
      {
        id: 'notif_init_3',
        targetRole: 'kennel',
        category: 'Kennel Stay',
        title: '🏨 New Luxury Suite Overnight Stay Request',
        body: '2-Night Executive Woodland Suite booking confirmed for Buster (£130.00 Escrow).',
        timestamp: '1 hour ago',
        read: false,
        actionTab: 'calendar',
      },
      {
        id: 'notif_init_4',
        targetRole: 'owner',
        category: 'New Message',
        title: '📍 Live Walk GPS & Photo Update from Sarah',
        body: 'Sarah Jenkins: "Buster and Bella just splashed in the Hampstead Heath pond and earned +25 Pup Points!"',
        timestamp: 'Just now',
        read: false,
        actionTab: 'live-walk',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('mpw_push_notifs_v1', JSON.stringify(pushNotifications));
    } catch {
      // ignore
    }
  }, [pushNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem('mpw_push_enabled_v1', JSON.stringify(pushAlertsEnabled));
    } catch {
      // ignore
    }
  }, [pushAlertsEnabled]);

  // Subscribe to Firebase Firestore push_notifications collection
  useEffect(() => {
    const unsub = subscribePushNotifications((cloudDocs) => {
      if (cloudDocs.length === 0) return;
      setPushNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const newFromCloud: AppPushNotification[] = cloudDocs
          .filter((cd) => !existingIds.has(cd.notifId))
          .map((cd) => ({
            id: cd.notifId,
            targetRole: cd.targetRole,
            category: cd.category,
            title: cd.title,
            body: cd.body,
            timestamp: 'Live Cloud Push',
            read: cd.read,
          }));
        return newFromCloud.length > 0 ? [...newFromCloud, ...prev] : prev;
      });
    });
    return () => unsub();
  }, []);

  const togglePushAlertsForRole = (role: PersonaMode) => {
    setPushAlertsEnabled((prev) => {
      const next = { ...prev, [role]: !prev[role] };
      showToast(
        next[role]
          ? `🔔 Push notifications enabled for ${role.toUpperCase()} portal!`
          : `🔕 Push notifications muted for ${role.toUpperCase()} portal.`,
        'info'
      );
      return next;
    });
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  };

  const sendPushAlert = (alertData: Omit<AppPushNotification, 'id' | 'timestamp' | 'read'>) => {
    const newId = `notif_${Date.now()}`;
    const newAlert: AppPushNotification = {
      ...alertData,
      id: newId,
      timestamp: 'Just now',
      read: false,
    };
    setPushNotifications((prev) => [newAlert, ...prev]);

    // Sync to Firebase Firestore
    dispatchPushNotificationToCloud({
      notifId: newId,
      targetRole: alertData.targetRole,
      category: alertData.category,
      title: alertData.title,
      body: alertData.body,
    });

    // Browser Web Push Notification if supported & permitted
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(alertData.title, {
          body: alertData.body,
          icon: '/pwa-192x192.svg',
        });
      } catch {
        // ignore in iframe
      }
    }
  };

  const markPushAlertRead = (id: string) => {
    setPushNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllPushAlertsRead = () => {
    setPushNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All push notifications marked as read.');
  };

  // Customizable Pinned Home Screen Features per Persona
  const [pinnedHomeTabs, setPinnedHomeTabs] = useState<Record<PersonaMode, string[]>>(() => {
    try {
      const saved = localStorage.getItem('mpw_pinned_home_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      owner: ['discover', 'kennels', 'live-walk', 'my-dogs', 'training-games', 'directory', 'shelters', 'bookings'],
      walker: ['pack-hub', 'services-pricing', 'calendar', 'subscriptions', 'credentials'],
      kennel: ['suites-pricing', 'overnight-routine', 'calendar', 'subscriptions', 'licensing'],
      shelter: ['adoptable-dogs', 'visits', 'volunteer-walks', 'donations'],
      admin: ['mobile-command', 'new-businesses', 'kpis', 'revenue-ledger', 'complaints'],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('mpw_pinned_home_v1', JSON.stringify(pinnedHomeTabs));
    } catch {
      // ignore
    }
  }, [pinnedHomeTabs]);

  const togglePinHomeTab = (role: PersonaMode, tabId: string) => {
    setPinnedHomeTabs((prev) => {
      const current = prev[role] || [];
      const exists = current.includes(tabId);
      const nextList = exists ? current.filter((id) => id !== tabId) : [...current, tabId];
      return { ...prev, [role]: nextList };
    });
    showToast('Updated your custom Home Screen shortcuts!');
  };

  // Multi-Dog Handlers
  const addDog = (newDog: DogProfile) => {
    setDogs((prev) => [...prev, newDog]);
    setActiveDogId(newDog.id);
    showToast(`Added ${newDog.name} to your dog family profile!`);
  };

  const updateDog = (id: string, updates: Partial<DogProfile>) => {
    setDogs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast(`Updated care guide details for ${updates.name || 'dog'}.`);
  };

  const openBookingModal = (walker?: Walker) => {
    if (walker) {
      setSelectedWalker(walker);
    }
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'paymentStatus'>) => {
    const targetWalker = walkers.find((w) => w.id === bookingData.walkerId) || walkers[0];
    const walkerPlan = targetWalker?.subscriptionPlan || 'PRO';
    const existingWeeklyBookings = bookings.filter(
      (b) => b.walkerId === bookingData.walkerId && b.status !== 'Cancelled'
    ).length;

    // Enforce 5 bookings per week cap for FREE / STARTER professionals
    if (walkerPlan === 'FREE / STARTER' && existingWeeklyBookings >= 5) {
      showToast(
        `⚠️ ${targetWalker.name} has reached their 5 bookings/week limit on the FREE / STARTER plan. They must upgrade to PRO (£6.99/mo) or Elite (£14.99/mo) for unlimited bookings.`,
        'warning'
      );
      return;
    }

    const tierCommRate =
      walkerPlan === 'Elite Package' ? 2.5 : walkerPlan === 'PRO' ? 5 : 10;

    const newId = `MPW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      status: 'Upcoming',
      paymentStatus: 'Escrow Held',
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Sync homeAddress, pickupAccessArrangement, and dropoffAccessArrangement onto booked dogs and pack roster so Walker sees them in Dog Profiles
    if (
      bookingData.homeAddress ||
      bookingData.pickupAccessArrangement ||
      bookingData.dropoffAccessArrangement
    ) {
      setDogs((prev) =>
        prev.map((d) =>
          bookingData.dogIds.includes(d.id)
            ? {
                ...d,
                homeAddress: bookingData.homeAddress || d.homeAddress,
                pickupAccessArrangement:
                  bookingData.pickupAccessArrangement || d.pickupAccessArrangement,
                dropoffAccessArrangement:
                  bookingData.dropoffAccessArrangement || d.dropoffAccessArrangement,
              }
            : d
        )
      );
      setPacks((prev) =>
        prev.map((pk) => ({
          ...pk,
          currentDogs: pk.currentDogs.map((pd) =>
            bookingData.dogNames.some((n) => n.toLowerCase() === pd.name.toLowerCase())
              ? {
                  ...pd,
                  homeAddress: bookingData.homeAddress || pd.homeAddress,
                  pickupAccessArrangement:
                    bookingData.pickupAccessArrangement || pd.pickupAccessArrangement,
                  dropoffAccessArrangement:
                    bookingData.dropoffAccessArrangement || pd.dropoffAccessArrangement,
                }
              : pd
          ),
        }))
      );
    }

    // Ledger entry for escrow holding using Walker's subscription tier commission (10%, 5%, or 2.5%)
    const newLedgerEntry: FinancialLedgerEntry = {
      id: `led_${Date.now()}`,
      transactionRef: `TX-${newId}`,
      date: 'Today, Just Now',
      type: 'Booking Payment',
      amount: newBooking.totalAmount,
      commissionRate: tierCommRate,
      commissionEarned: Math.round(newBooking.totalAmount * (tierCommRate / 100) * 100) / 100,
      walkerPayout: Math.round(newBooking.totalAmount * (1 - tierCommRate / 100) * 100) / 100,
      walkerName: newBooking.walkerName,
      ownerName: activeHouseholdMember.name,
      status: 'Escrow',
    };
    setLedger((prev) => [newLedgerEntry, ...prev]);

    showToast(`Booking ${newId} confirmed with Pickup & Drop-Off Access Arrangements and held securely in escrow!`);
    sendPushAlert({
      targetRole: 'walker',
      category: 'New Booking',
      title: `🦮 New Walk Booking (${newId}) + Access Instructions`,
      body: `${activeHouseholdMember.name} booked ${newBooking.serviceType} (${newBooking.durationMinutes || 60} mins) on ${newBooking.date} at ${newBooking.timeSlot}. Address: ${newBooking.homeAddress || '18 Downshire Hill, NW3'} · Pickup: ${newBooking.pickupAccessArrangement || 'Key Safe #4829'}.`,
      actionTab: 'pack-hub',
    });
    closeBookingModal();
  };

  // Walker completes walk -> requests owner to confirm & release escrow money via Push Notification
  const completeWalkAndRequestEscrowRelease = (bookingId?: string, walkSummaryNote?: string) => {
    const targetBooking =
      bookings.find((b) => (bookingId ? b.id === bookingId : b.status === 'In Progress' || b.status === 'Upcoming')) ||
      bookings[0];

    if (!targetBooking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === targetBooking.id
          ? {
              ...b,
              status: 'Awaiting Owner Release',
              paymentStatus: 'Pending Owner Confirmation',
            }
          : b
      )
    );

    sendPushAlert({
      targetRole: 'owner',
      category: 'Escrow Release Request',
      title: `💷 Walk Completed (${targetBooking.dogNames.join(', ')}) — Confirm Payment Release`,
      body: `${targetBooking.walkerName} completed your ${targetBooking.serviceType} (${walkSummaryNote || 'GPS trail, potty & water breaks logged, safe drop-off'}). Tap Confirm & Release £${targetBooking.totalAmount.toFixed(2)} from Escrow to ${targetBooking.walkerName}.`,
      actionTab: 'bookings',
      bookingIdForEscrowRelease: targetBooking.id,
      escrowReleased: false,
    });

    showToast(
      `Walk marked completed! Push Notification sent to dog owner to confirm & release £${targetBooking.totalAmount.toFixed(2)} from Escrow.`
    );
  };

  // Dog Owner confirms release of escrow money to Walker after walk notification
  const confirmAndReleaseEscrowPayment = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    if (targetBooking.paymentStatus === 'Released') {
      showToast(`Escrow payment for booking ${bookingId} has already been released.`, 'info');
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Completed',
              paymentStatus: 'Released',
            }
          : b
      )
    );

    // Mark any matching push notification as escrowReleased: true and read: true
    setPushNotifications((prev) =>
      prev.map((n) =>
        n.bookingIdForEscrowRelease === bookingId
          ? { ...n, escrowReleased: true, read: true }
          : n
      )
    );

    // Settle ledger entry and add Walker Payout using walker's tier commission
    const targetWalker = walkers.find((w) => w.id === targetBooking.walkerId) || walkers[0];
    const walkerPlan = targetWalker?.subscriptionPlan || 'PRO';
    const tierCommRate =
      walkerPlan === 'Elite Package' ? 2.5 : walkerPlan === 'PRO' ? 5 : 10;
    const payoutAmt = Math.round(targetBooking.totalAmount * (1 - tierCommRate / 100) * 100) / 100;
    const settledEntry: FinancialLedgerEntry = {
      id: `led_rel_${Date.now()}`,
      transactionRef: `REL-${bookingId}`,
      date: 'Today, Just Now',
      type: 'Walker Payout',
      amount: targetBooking.totalAmount,
      commissionRate: tierCommRate,
      commissionEarned: Math.round(targetBooking.totalAmount * (tierCommRate / 100) * 100) / 100,
      walkerPayout: payoutAmt,
      walkerName: targetBooking.walkerName,
      ownerName: activeHouseholdMember.name,
      status: 'Settled',
    };
    setLedger((prev) => [settledEntry, ...prev]);

    sendPushAlert({
      targetRole: 'walker',
      category: 'Payment Released',
      title: `✅ £${targetBooking.totalAmount.toFixed(2)} Escrow Released by ${activeHouseholdMember.name}!`,
      body: `Owner confirmed walk completion for ${targetBooking.dogNames.join(', ')} (${bookingId}). Net payout of £${payoutAmt.toFixed(2)} has been released to your connected bank account.`,
      actionTab: 'pack-hub',
    });

    showToast(
      `✅ Confirmed! £${targetBooking.totalAmount.toFixed(2)} released from Escrow to ${targetBooking.walkerName}!`
    );
  };

  const subscribeToWalk = (subData: Omit<WalkSubscription, 'id' | 'status' | 'nextRenewalDate'>) => {
    const newSub: WalkSubscription = {
      ...subData,
      id: `sub_${Date.now()}`,
      status: 'Active',
      nextRenewalDate: '08 Oct 2026',
    };
    setOwnerSubscriptions((prev) => [newSub, ...prev]);

    // Add ledger entry
    const newLedgerEntry: FinancialLedgerEntry = {
      id: `led_${Date.now()}`,
      transactionRef: `SUB-${newSub.id.toUpperCase()}`,
      date: 'Today, Just Now',
      type: 'Subscription Fee',
      amount: newSub.weeklyPrice,
      commissionRate,
      commissionEarned: Math.round(newSub.weeklyPrice * (commissionRate / 100) * 100) / 100,
      walkerPayout: Math.round(newSub.weeklyPrice * (1 - commissionRate / 100) * 100) / 100,
      walkerName: newSub.walkerName,
      ownerName: activeHouseholdMember.name,
      status: 'Settled',
    };
    setLedger((prev) => [newLedgerEntry, ...prev]);

    showToast(`Subscribed to recurring ${newSub.packageName} with ${newSub.walkerName}!`);
    closeBookingModal();
  };

  const cancelSubscription = (id: string) => {
    setOwnerSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Cancelled' } : s))
    );
    showToast('1-Month Cancellation Notice registered. Your recurring subscription will end after the 30-day notice period.', 'info');
  };

  const sendChatMessage = (
    text: string,
    photoUrl?: string,
    recipientOwnerName?: string,
    dogName?: string
  ) => {
    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      sender: persona === 'owner' ? 'owner' : 'walker',
      senderName:
        persona === 'owner'
          ? `${activeHouseholdMember.name} (${activeHouseholdMember.role})`
          : 'Sarah Jenkins (Verified Walker)',
      recipientOwnerName,
      dogName,
      text,
      timestamp: `Today, ${nowStr}`,
      photoUrl,
    };
    setChatMessages((prev) => [...prev, newMsg]);
    sendPushAlert({
      targetRole: persona === 'owner' ? 'walker' : 'owner',
      category: 'New Message',
      title: dogName
        ? `🐾 Live Walk Update for ${dogName} (${recipientOwnerName || 'Owner'})`
        : `💬 New Message from ${newMsg.senderName}`,
      body: text,
      actionTab: persona === 'owner' ? 'pack-hub' : 'live-walk',
    });
  };

  // Walker Pricing & Services
  const updateWalkerService = (serviceId: string, updates: Partial<WalkerServicePricing>) => {
    setWalkerServices((prev) =>
      prev.map((s) => (s.serviceId === serviceId ? { ...s, ...updates } : s))
    );
    showToast('Walker service rates updated successfully.');
  };

  const addWalkerPackage = (pkg: Omit<WalkerSubscriptionPackage, 'id' | 'enrolledCount'>) => {
    const newPkg: WalkerSubscriptionPackage = {
      ...pkg,
      id: `pkg_${Date.now()}`,
      enrolledCount: 0,
    };
    setWalkerPackages((prev) => [...prev, newPkg]);
    showToast(`Created new subscription package: ${pkg.title}`);
  };

  const toggleWalkerPackage = (id: string) => {
    setWalkerPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  // Walker Availability Calendar
  const updateWalkerAvailability = (day: string, updates: Partial<WalkerAvailabilityDay>) => {
    setWalkerAvailability((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...updates } : d))
    );
    showToast(`Updated availability for ${day}.`);
  };

  const toggleBlockedDate = (dateStr: string) => {
    setBlockedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
    showToast(`Calendar schedule updated.`);
  };

  // Walker Pack Attendance
  const toggleDogAttendance = (packId: string, dogId: string) => {
    setPacks((prev) =>
      prev.map((pack) => {
        if (pack.id !== packId) return pack;
        return {
          ...pack,
          currentDogs: pack.currentDogs.map((d) => {
            if (d.id !== dogId) return d;
            const nextStatus = d.status === 'Confirmed' ? 'Checked In' : d.status === 'Checked In' ? 'Completed' : 'Confirmed';
            return { ...d, status: nextStatus };
          }),
        };
      })
    );
    showToast('Pack roll-call attendance updated.');
  };

  const addDogToPack = (packId: string, dogName: string, breed: string) => {
    setPacks((prev) =>
      prev.map((pack) => {
        if (pack.id !== packId) return pack;
        if (pack.currentDogs.length >= pack.maxDogs) {
          showToast('Cannot add dog: Pack is at full safety capacity (max 4 dogs)!', 'warning');
          return pack;
        }
        const newPackDog = {
          id: `dog_pack_${Date.now()}`,
          name: dogName,
          breed,
          weightKg: 18,
          energyLevel: 'Moderate' as const,
          compatibilityScore: 95,
          socialNotes: 'Approved for group walk temperament.',
          status: 'Confirmed' as const,
          ownerName: 'Local Pet Parent',
          emergencyContact: '+44 7700 900123',
          avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
        };
        return { ...pack, currentDogs: [...pack.currentDogs, newPackDog] };
      })
    );
    showToast(`Added ${dogName} to pack walk.`);
  };

  // Document Verification
  const submitVerificationDoc = (doc: { documentType: VerificationDocument['documentType']; documentNumber: string; expiryDate: string }) => {
    const newDoc: VerificationDocument = {
      id: `doc_${Date.now()}`,
      walkerId: 'walker_sarah_01',
      walkerName: 'Sarah Jenkins',
      walkerEmail: 'sarah.jenkins@mypawswalks.co.uk',
      documentType: doc.documentType,
      documentNumber: doc.documentNumber,
      submittedAt: 'Just now',
      expiryDate: doc.expiryDate,
      fileUrl: '/uploads/doc_preview.pdf',
      status: 'Pending',
    };
    setVerifications((prev) => [newDoc, ...prev]);
    showToast('Document uploaded successfully. Sent to Compliance Review Queue.');
  };

  const reviewDocument = (docId: string, status: VerificationDocument['status'], notes?: string) => {
    setVerifications((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status, reviewerNotes: notes } : d))
    );
    showToast(`Document ${docId} marked as ${status}.`);
  };

  // Local Advertisers & Sponsors
  const addBusinessAd = (ad: Omit<LocalBusinessAd, 'id' | 'status'>) => {
    if (!ad.paymentReceived) {
      showToast('Payment of £9.99/month is required before your pet business advertisement can be published.', 'warning');
      return;
    }

    const feeAmount = ad.monthlyFee && ad.monthlyFee > 0 ? ad.monthlyFee : 9.99;
    const resolvedCoords =
      ad.coordinates ||
      ad.mapCoordinates ||
      getCoordinatesForUkAddressAndPostcode(
        ad.address || '',
        ad.postcode || ad.postcodeArea || 'NW3',
        ad.businessName
      );

    const newAd: LocalBusinessAd = {
      ...ad,
      id: `biz_${Date.now()}`,
      monthlyFee: feeAmount,
      paymentReceived: true,
      status: 'Active',
      rating: 5.0,
      reviewCount: 1,
      submittedDate: 'Today',
      coordinates: resolvedCoords,
      mapCoordinates: resolvedCoords,
    };
    setLocalBusinesses((prev) => [newAd, ...prev]);

    // Ledger entry for Advertiser Subscription Fee (£9.99/mo recurring)
    const newLedgerEntry: FinancialLedgerEntry = {
      id: `led_${Date.now()}`,
      transactionRef: `ADV-${newAd.id.toUpperCase()}`,
      date: 'Today, Just Now',
      type: 'Advertiser Subscription',
      amount: feeAmount,
      commissionRate: 100,
      commissionEarned: feeAmount,
      walkerPayout: 0,
      walkerName: 'My Paws Walks Treasury',
      ownerName: `${newAd.businessName} (£9.99/mo Recurring · ${ad.paymentMethod || 'Card'})`,
      status: 'Settled',
    };
    setLedger((prev) => [newLedgerEntry, ...prev]);

    showToast(
      `✅ £${feeAmount.toFixed(2)}/month recurring payment received! "${newAd.businessName}" is now live in the directory with your logo and photos.`,
      'success'
    );
    setAdvertiseModalOpen(false);
  };

  const updateBusinessAd = (id: string, updates: Partial<LocalBusinessAd>) => {
    setLocalBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const merged = { ...b, ...updates };
        if (updates.address || updates.postcode || updates.postcodeArea || !merged.coordinates) {
          const nextCoords = getCoordinatesForUkAddressAndPostcode(
            merged.address || '',
            merged.postcode || merged.postcodeArea || 'NW3',
            merged.businessName
          );
          merged.coordinates = nextCoords;
          merged.mapCoordinates = nextCoords;
        }
        return merged;
      })
    );
    showToast(`Updated business profile & map position!`);
  };

  const reviewBusinessAd = (id: string, status: LocalBusinessAd['status']) => {
    setLocalBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Advertiser listing ${status === 'Active' ? 'approved and now live on map & directory!' : 'rejected.'}`);
  };

  // PawMates Social & Meetups
  const toggleRsvpMeetup = (id: string) => {
    setMeetups((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newRsvp = !m.userRsvp;
        return {
          ...m,
          userRsvp: newRsvp,
          attendeesCount: newRsvp ? m.attendeesCount + 1 : Math.max(1, m.attendeesCount - 1),
        };
      })
    );
    showToast('Meetup RSVP updated!');
  };

  const createMeetup = (meetupData: Omit<SoloWalkMeetup, 'id' | 'attendeesCount' | 'userRsvp'>) => {
    const newMeetup: SoloWalkMeetup = {
      ...meetupData,
      id: `meet_${Date.now()}`,
      attendeesCount: 1,
      userRsvp: true,
    };
    setMeetups((prev) => [newMeetup, ...prev]);
    showToast(`Hosted your Solo Walk Link-Up at ${newMeetup.parkLocation}! Other dog parents can now join.`);
  };

  const saveRecordedWalk = (walkData: Omit<RecordedPersonalWalk, 'id'>) => {
    const newWalk: RecordedPersonalWalk = {
      ...walkData,
      id: `rec_${Date.now()}`,
    };
    setRecordedWalks((prev) => [newWalk, ...prev]);
    setPawPoints((prev) => prev + newWalk.pawPointsEarned);
    showToast(`Walk logged! Earned +${newWalk.pawPointsEarned} Paw Points!`);
  };

  const toggleFriend = (id: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFriend: !f.isFriend } : f))
    );
    showToast('Updated friend connection.');
  };

  const toggleTrainingTask = (id: string) => {
    setTrainingTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const willComplete = !t.completed;
        if (willComplete) {
          setPawPoints((pts) => pts + t.points);
          showToast(`Task Complete! Earned +${t.points} Paw Points!`);
        }
        return { ...t, completed: willComplete };
      })
    );
  };

  const claimReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;
    if (pawPoints < reward.costPoints) {
      showToast(`Not enough Paw Points. You need ${reward.costPoints - pawPoints} more points.`, 'warning');
      return;
    }
    setPawPoints((pts) => pts - reward.costPoints);
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, claimed: true } : r))
    );
    showToast(`Reward unlocked! Code: ${reward.code}`);
  };

  // Incidents
  const resolveIncident = (id: string, notes: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'Resolved', resolutionNotes: notes } : inc))
    );
    showToast(`Safety incident ticket ${id} marked as resolved.`);
  };

  // Walker Payout
  const payoutWalker = (walkerName: string, amount: number) => {
    const payoutEntry: FinancialLedgerEntry = {
      id: `payout_${Date.now()}`,
      transactionRef: `BACS-${Math.floor(100000 + Math.random() * 900000)}`,
      date: 'Today, Just Now',
      type: 'Walker Payout',
      amount,
      commissionRate: 0,
      commissionEarned: 0,
      walkerPayout: amount,
      walkerName,
      ownerName: 'Platform Escrow Treasury',
      status: 'Settled',
    };
    setLedger((prev) => [payoutEntry, ...prev]);
    showToast(`Dispatched BACS payout of £${amount.toFixed(2)} to ${walkerName}.`);
  };

  // Star-Based Service Reviews & Real-Time Aggregated Rating Calculation
  const [serviceReviews, setServiceReviews] = useState<ServiceReview[]>(INITIAL_SERVICE_REVIEWS);

  const getProviderRatingStats = (targetId: string, baseRating: number, baseCount: number) => {
    const providerReviews = serviceReviews
      .filter((r) => r.targetId === targetId)
      .map((r) => ({
        ...r,
        dogNames: Array.isArray(r.dogNames) && r.dogNames.length > 0 ? r.dogNames : [r.dogName || 'Buster'],
        serviceType: r.serviceType || r.serviceName || 'Verified Service',
      }));
    const seedCount = Math.max(0, baseCount - providerReviews.length);
    const sumFromReviews = providerReviews.reduce((acc, r) => acc + r.rating, 0);
    const totalReviews = seedCount + providerReviews.length;
    const weightedSum = seedCount * baseRating + sumFromReviews;
    const averageRating =
      totalReviews > 0 ? Number((weightedSum / totalReviews).toFixed(2)) : Number(baseRating.toFixed(2));

    const starBreakdown = [5, 4, 3, 2, 1].map((stars) => {
      const explicitCount = providerReviews.filter((r) => Math.round(r.rating) === stars).length;
      const estimatedSeed =
        stars === 5
          ? Math.round(seedCount * 0.88)
          : stars === 4
          ? Math.max(0, seedCount - Math.round(seedCount * 0.88))
          : 0;
      const count = explicitCount + estimatedSeed;
      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return { stars, count, percentage };
    });

    return {
      averageRating,
      totalReviews,
      reviews: providerReviews,
      starBreakdown,
    };
  };

  const addServiceReview = (
    reviewData: Omit<ServiceReview, 'id' | 'date' | 'verifiedBooking'>
  ) => {
    const normalizedDogNames =
      Array.isArray(reviewData.dogNames) && reviewData.dogNames.length > 0
        ? reviewData.dogNames
        : [reviewData.dogName || 'Buster'];
    const newReview: ServiceReview = {
      ...reviewData,
      dogName: reviewData.dogName || normalizedDogNames.join(', '),
      dogNames: normalizedDogNames,
      serviceName: reviewData.serviceName || reviewData.serviceType || 'Verified Service',
      serviceType: reviewData.serviceType || reviewData.serviceName || 'Verified Service',
      id: `rev_${Date.now()}`,
      date: 'Just now · Oct 2026',
      verifiedBooking: true,
    };

    const updatedReviews = [newReview, ...serviceReviews];
    setServiceReviews(updatedReviews);

    if (reviewData.targetType === 'walker') {
      setWalkers((prev) =>
        prev.map((w) => {
          if (w.id !== reviewData.targetId) return w;
          const newCount = w.reviewCount + 1;
          const newAvg = Number(
            ((w.rating * w.reviewCount + reviewData.rating) / newCount).toFixed(2)
          );
          return { ...w, rating: newAvg, reviewCount: newCount };
        })
      );
    } else if (reviewData.targetType === 'kennel') {
      setKennels((prev) =>
        prev.map((k) => {
          if (k.id !== reviewData.targetId) return k;
          const newCount = k.reviewCount + 1;
          const newAvg = Number(
            ((k.rating * k.reviewCount + reviewData.rating) / newCount).toFixed(2)
          );
          return { ...k, rating: newAvg, reviewCount: newCount };
        })
      );
    }

    showToast(
      `⭐ Thank you! Your ${reviewData.rating}-star verified review for ${reviewData.targetName} has been published and aggregated into their profile score.`,
      'success'
    );
  };

  return (
    <AppContext.Provider
      value={{
        persona,
        setPersona,
        currentUserEmail,
        isAuthorizedAdmin,
        setAuthenticatedUserEmail,
        ownerTab,
        setOwnerTab,
        walkerTab,
        setWalkerTab,
        adminTab,
        setAdminTab,
        shelterTab,
        setShelterTab,
        language,
        setLanguage,
        t,
        languageModalOpen,
        setLanguageModalOpen,
        aboutModalOpen,
        setAboutModalOpen,
        legalModalOpen,
        setLegalModalOpen,
        aiAssistantOpen,
        setAiAssistantOpen,
        howToUseModalOpen,
        setHowToUseModalOpen,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        dogs,
        activeDogId,
        setActiveDogId,
        activeDog,
        addDog,
        updateDog,
        householdMembers,
        activeHouseholdMember,
        switchHouseholdMember,
        addHouseholdMember,
        emergencyContacts,
        activeEmergencyContactId,
        setActiveEmergencyContactId,
        activeEmergencyContact,
        addEmergencyContact,
        triggerSosEmergencyCall,
        shareModalOpen,
        setShareModalOpen,
        shareData,
        openShareModal,
        nativeShare,
        shelters,
        activeShelterId,
        setActiveShelterId,
        activeShelter,
        shelterDogs,
        selectedShelterDog,
        setSelectedShelterDog,
        addShelterDog,
        updateShelterDogStatus,
        addShelterDogDailyUpdate,
        shelterVisits,
        bookShelterVisit,
        updateVisitStatus,
        volunteerWalks,
        bookVolunteerWalk,
        updateVolunteerWalkStatus,
        donationRequests,
        submitItemDonation,
        reviewItemDonation,
        walkers,
        selectedWalker,
        setSelectedWalker,
        selectedPostcodeArea,
        setSelectedPostcodeArea,
        bookings,
        createBooking,
        completeWalkAndRequestEscrowRelease,
        confirmAndReleaseEscrowPayment,
        bookingModalOpen,
        openBookingModal,
        closeBookingModal,
        ownerSubscriptions,
        subscribeToWalk,
        cancelSubscription,
        walkEvents,
        addWalkEvent,
        walkerLiveGpsActive,
        setWalkerLiveGpsActive,
        chatMessages,
        sendChatMessage,
        walkProgress,
        walkerServices,
        updateWalkerService,
        walkerSurcharge,
        setWalkerSurcharge,
        multiDogDiscountPercent,
        setMultiDogDiscountPercent,
        walkerPackages,
        addWalkerPackage,
        toggleWalkerPackage,
        walkerAvailability,
        updateWalkerAvailability,
        blockedDates,
        toggleBlockedDate,
        packs,
        toggleDogAttendance,
        addDogToPack,
        verifications,
        submitVerificationDoc,
        reviewDocument,
        localBusinesses,
        addBusinessAd,
        reviewBusinessAd,
        advertiseModalOpen,
        setAdvertiseModalOpen,
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
        kennelTab,
        setKennelTab,
        shelterStaff,
        activeShelterStaff,
        switchShelterStaff,
        addShelterStaff,
        policyAgreements,
        hasUserSignedPolicies,
        policyModalOpen,
        setPolicyModalOpen,
        signPolicyAgreement,
        complaints,
        submitComplaint,
        resolveComplaint,
        complaintModalOpen,
        setComplaintModalOpen,
        kennels,
        selectedKennel,
        setSelectedKennel,
        kennelBookings,
        createKennelBooking,
        kennelBookingModalOpen,
        openKennelBookingModal,
        closeKennelBookingModal,
        selectedKennelSuite,
        updateKennelSuiteAvailability,
        updateKennelSuite,
        addKennelSuite,
        updateKennelSubscription,
        incidents,
        resolveIncident,
        ledger,
        commissionRate,
        setCommissionRate,
        payoutWalker,
        updateHouseholdMember,
        updateShelterProfile,
        updateWalkerProfile,
        updateWalkerSubscription,
        updateBusinessAd,
        updateKennelProfile,
        pushNotifications,
        pushAlertsEnabled,
        togglePushAlertsForRole,
        sendPushAlert,
        markPushAlertRead,
        markAllPushAlertsRead,
        pinnedHomeTabs,
        togglePinHomeTab,
        profileEditorModalOpen,
        setProfileEditorModalOpen,
        serviceReviews,
        addServiceReview,
        getProviderRatingStats,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
