import { SupportedLanguage } from '../i18n/translations';

export type PersonaMode = 'owner' | 'walker' | 'kennel' | 'shelter' | 'admin';

export type OwnerTab = 'home' | 'discover' | 'my-dogs' | 'live-walk' | 'bookings' | 'directory' | 'pawmates' | 'training' | 'training-games' | 'shelters' | 'kennels' | 'complaints';
export type WalkerTab = 'home' | 'pack-hub' | 'services-pricing' | 'calendar' | 'credentials' | 'verify-upload' | 'subscriptions';
export type KennelTab = 'home' | 'suites-pricing' | 'calendar' | 'bookings' | 'licensing' | 'night-routine' | 'overnight-routine' | 'subscriptions';
export type ShelterTab = 'home' | 'adoptable-dogs' | 'visits' | 'volunteer-walks' | 'donations' | 'shelter-profile';
export type AdminTab = 'mobile-command' | 'kpis' | 'new-businesses' | 'walkers-manage' | 'kennels-manage' | 'owners-manage' | 'revenue-ledger' | 'operations' | 'compliance' | 'incidents' | 'complaints' | 'financials' | 'advertisers';

export interface AppPushNotification {
  id: string;
  targetRole: 'owner' | 'walker' | 'kennel' | 'shelter' | 'all';
  category:
    | 'Adoption Inquiry'
    | 'New Booking'
    | 'New Message'
    | 'Kennel Stay'
    | 'Escrow Release Request'
    | 'Payment Released'
    | 'System Update';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionTab?: string;
  bookingIdForEscrowRelease?: string;
  escrowReleased?: boolean;
}

export interface WalkDurationOption {
  minutes: number;
  rate: number;
  label: string;
  popular?: boolean;
}

export interface WalkerServicePricing {
  serviceId: string;
  name: string;
  enabled: boolean;
  hourlyRate: number;
  halfHourRate: number;
  description: string;
  maxDogs: number;
  customDurations?: WalkDurationOption[];
}

export interface WalkerSubscriptionPackage {
  id: string;
  title: string;
  walksPerWeek: number;
  weeklyPrice: number;
  description: string;
  walkType: 'Group Walk' | 'Solo Sniffari' | 'Puppy Drop-in' | 'Senior Stroll';
  active: boolean;
  enrolledCount: number;
}

export type ProfessionalSubscriptionTier = 'FREE / STARTER' | 'PRO' | 'Elite Package';

export interface Walker {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  rating: number;
  reviewCount: number;
  location: string;
  postcodeArea: string;
  postcode?: string;
  regionCovered?: string;
  distanceMiles: number;
  hourlyRate: number;
  halfHourRate: number;
  bio: string;
  experienceYears: number;
  dbsVerified: boolean;
  dbsCertificateNumber: string;
  dbsIssueDate: string;
  insuranceCoverAmount: string;
  firstAidCertified: boolean;
  councilLicensed: boolean;
  maxPackSize: number;
  acceptedSizes: ('Small' | 'Medium' | 'Large' | 'Giant')[];
  services: ('Group Walk' | 'Solo Sniffari' | 'Puppy Drop-in' | 'Senior Stroll' | 'Day Care')[];
  badges: string[];
  completedWalks: number;
  repeatClientRate: number;
  isRecommended?: boolean;
  subscriptionPackages?: WalkerSubscriptionPackage[];
  subscriptionPlan?: ProfessionalSubscriptionTier;
  subscriptionPaid?: boolean;
  subscriptionBillingCycle?: 'monthly' | 'annual';
  additionalServiceAreas?: string[];
  staffMembers?: { id: string; name: string; role: string; dbsRef: string }[];
}

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: string;
  weightKg: number;
  photoUrl: string;
  gender: 'Male (Neutered)' | 'Male (Intact)' | 'Female (Spayed)' | 'Female (Intact)';
  microchipNumber: string;
  vaccinated?: boolean;
  vaccinations?: string[];
  personality: string[];
  leashBehavior: string;
  triggers: string[];
  socialPreference: 'Loves all dogs' | 'Selective' | 'Solo walks only' | 'Gentle play only';
  feedingNotes: string;
  favoriteTreats?: string[];
  allergies: string[];
  medications: string[];
  recallCue: string;
  emergencyVet: {
    clinicName: string;
    vetName: string;
    phone: string;
    address: string;
    authorizedSpendLimit: string;
    spendCapAmount?: number;
  };
  routineSchedule: string;
  specialInstructions: string;
  homeAddress?: string;
  pickupAccessArrangement?: string;
  dropoffAccessArrangement?: string;
}

export interface PackDog {
  id: string;
  name: string;
  breed: string;
  weightKg: number;
  energyLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  compatibilityScore: number;
  socialNotes: string;
  status: 'Confirmed' | 'Checked In' | 'Completed';
  ownerName: string;
  emergencyContact: string;
  avatar: string;
  homeAddress?: string;
  pickupAccessArrangement?: string;
  dropoffAccessArrangement?: string;
}

export interface WalkingPack {
  id: string;
  packName: string;
  location: string;
  scheduledTime: string;
  maxDogs: number;
  currentDogs: PackDog[];
  walkerId: string;
  walkerName: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  routeDescription: string;
}

export interface WalkSubscription {
  id: string;
  walkerId: string;
  walkerName: string;
  walkerAvatar: string;
  packageName: string;
  walksPerWeek: number;
  weeklyPrice: number;
  dogIds: string[];
  dogNames: string[];
  preferredDays: string[];
  pickupTimeWindow: string;
  billingCadence: 'Weekly' | 'Monthly (10% Discount)';
  status: 'Active' | 'Paused' | 'Cancelled';
  nextRenewalDate: string;
}

export interface Booking {
  id: string;
  walkerId: string;
  walkerName: string;
  walkerAvatar: string;
  dogIds: string[];
  dogNames: string[];
  serviceType: 'Group Walk' | 'Solo Sniffari' | 'Puppy Drop-in' | 'Senior Stroll';
  date: string;
  timeSlot: string;
  durationMinutes: number;
  basePrice: number;
  addOns: { name: string; price: number }[];
  platformFee: number;
  totalAmount: number;
  status: 'Upcoming' | 'In Progress' | 'Awaiting Owner Release' | 'Completed' | 'Cancelled';
  paymentStatus: 'Escrow Held' | 'Pending Owner Confirmation' | 'Released' | 'Refunded';
  paymentProvider?: 'apple_pay' | 'google_pay' | 'paypal' | 'card' | 'klarna';
  homeAddress?: string;
  pickupAccessArrangement?: string;
  dropoffAccessArrangement?: string;
  notes?: string;
  gpsTracked: boolean;
  isSubscription?: boolean;
}

export interface WalkEvent {
  id: string;
  time: string;
  type: 'pickup' | 'potty' | 'water' | 'off_leash' | 'photo' | 'park_enter' | 'dropoff';
  title: string;
  description: string;
  dogName?: string;
  photoUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'owner' | 'walker' | 'system';
  senderName: string;
  recipientOwnerName?: string;
  dogName?: string;
  text: string;
  timestamp: string;
  photoUrl?: string;
  walkEventId?: string;
}

export interface VerificationDocument {
  id: string;
  walkerId: string;
  walkerName: string;
  walkerEmail: string;
  documentType: 'Enhanced DBS Check' | 'Government ID' | 'Public Liability Insurance' | 'Pet First Aid Certification' | 'Local Council License';
  documentNumber: string;
  submittedAt: string;
  expiryDate: string;
  fileUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Resubmission';
  reviewerNotes?: string;
}

export interface SafetyIncident {
  id: string;
  ticketNumber: string;
  severity: 'P1 - High' | 'P2 - Medium' | 'P3 - Low';
  status: 'Open' | 'Investigating' | 'Resolved';
  reportedAt: string;
  walkerName: string;
  dogName: string;
  ownerName: string;
  location: string;
  title: string;
  description: string;
  resolutionNotes?: string;
  insuranceClaimTriggered: boolean;
  claimAmount?: number;
}

export interface FinancialLedgerEntry {
  id: string;
  transactionRef: string;
  date: string;
  type: 'Booking Payment' | 'Walker Payout' | 'Platform Commission' | 'Subscription Fee' | 'Advertiser Subscription' | 'Dispute Refund';
  amount: number;
  commissionRate: number;
  commissionEarned: number;
  walkerPayout: number;
  walkerName: string;
  ownerName: string;
  status: 'Settled' | 'Escrow' | 'Processing';
}

export type BusinessCategory =
  | 'Dog Friendly Places to Eat'
  | 'Dog Friendly Places to Stay'
  | 'Dog Friendly Shopping'
  | 'Grooming & Spa'
  | 'Veterinary Hospital'
  | 'Pet Boutique & Food'
  | 'Training & Behavior'
  | 'Canine Therapy & Hydro';

export interface LocalBusinessAd {
  id: string;
  businessName: string;
  category: BusinessCategory;
  tagline: string;
  description: string;
  postcodeArea: string; // e.g. "NW3", "TW9", "N1", "SE10", "SW19", "EH1", "M1"
  postcode?: string;
  address: string;
  phone: string;
  website: string;
  logoUrl?: string;
  imageUrl?: string;
  galleryPhotos?: string[]; // Up to 4 business photos
  promoOffer: string;
  subscriptionTier:
    | 'Pet Business Ad (£9.99/mo)'
    | '£9.99/mo Standard'
    | 'Starter Listing'
    | 'Featured Partner'
    | 'Premier Borough Network';
  billingCadence: 'Monthly' | 'Annual (Save 20%)';
  monthlyFee: number;
  paymentReceived?: boolean;
  paymentMethod?: string;
  status: 'Active' | 'Pending Review' | 'Rejected' | 'Paused';
  rating: number;
  reviewCount: number;
  mapCoordinates?: { x: number; y: number };
  coordinates?: { lat: number; lng: number };
  dogAmenities?: string[];
  featuredBadge?: string;
  submittedDate?: string;
}

// PawMates Social & Meetups
export interface SoloWalkMeetup {
  id: string;
  ownerName: string;
  ownerAvatar: string;
  dogName: string;
  dogBreed: string;
  dogPhoto: string;
  date: string;
  time: string;
  parkLocation: string;
  postcodeArea: string;
  description: string;
  dogTemperament: string;
  attendeesCount: number;
  userRsvp: boolean;
}

export interface RecordedPersonalWalk {
  id: string;
  date: string;
  dogNames: string[];
  durationMinutes: number;
  distanceKm: number;
  pottyCount: { pee: number; poop: number };
  waterMl: number;
  routeTitle: string;
  pawPointsEarned: number;
}

export interface PetOwnerFriend {
  id: string;
  name: string;
  avatar: string;
  dogName: string;
  dogBreed: string;
  neighborhood: string;
  isFriend: boolean;
}

export interface PupTrainingTask {
  id: string;
  title: string;
  category: 'Foundation' | 'Agility' | 'Enrichment' | 'Social Cue';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  description: string;
  steps: string[];
  completed: boolean;
}

export interface TrainingReward {
  id: string;
  title: string;
  costPoints: number;
  partner: string;
  category: string;
  code: string;
  claimed: boolean;
}

// Multi-User Household Pet Owner Sharing
export interface HouseholdMember {
  id: string;
  name: string;
  role: 'Mum' | 'Dad' | 'Co-Parent' | 'Family Member' | 'Dog Sitter';
  avatar: string;
  email: string;
  phone: string;
  isCurrentActive: boolean;
  isCurrentlyWalking: boolean;
  activeWalkDetails?: {
    dogNames: string[];
    startedAt: string;
    distanceKm: number;
    location: string;
  };
}

// Live Walk SOS Emergency Contact
export interface EmergencyCallContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isDefault: boolean;
  notifyOnLiveWalk: boolean;
}

// Dog Shelter & Rescue Centre Ecosystem
export interface ShelterDogDailyUpdate {
  id: string;
  date: string;
  staffName: string;
  staffRole: string;
  category: 'Medical & Vet' | 'Walking & Enrichment' | 'Adoption & Meet-Greet' | 'Feeding & Care';
  note: string;
}

export interface ShelterDog {
  id: string;
  shelterId: string;
  shelterName: string;
  name: string;
  breed: string;
  age: string;
  gender: 'Male (Neutered)' | 'Male' | 'Female (Spayed)' | 'Female';
  size: 'Small' | 'Medium' | 'Large' | 'Giant';
  photoUrl: string;
  photoGallery: string[];
  fullBackground: string;
  rescueStory: string;
  medicalHistory: string;
  temperament: string[];
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  houseTrained: boolean;
  walkingVolunteersWelcomed: boolean;
  status: 'Available' | 'Adoption Pending' | 'Re-homed';
  isActiveListing?: boolean;
  adoptedByFamily?: string;
  adoptedDate?: string;
  dailyUpdates?: ShelterDogDailyUpdate[];
  intakeDate: string;
  microchipNumber: string;
}

export interface ShelterVisitBooking {
  id: string;
  shelterDogId: string;
  dogName: string;
  shelterId: string;
  shelterName: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  bookedAt: string;
}

export interface ShelterVolunteerWalk {
  id: string;
  shelterDogId: string;
  dogName: string;
  shelterId: string;
  shelterName: string;
  volunteerName: string;
  volunteerType: 'Pet Owner' | 'Professional Walker';
  volunteerPhone: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  status: 'Approved' | 'Requested' | 'Completed';
  notes: string;
  isFreeOfCharge: true;
}

export interface ItemDonationRequest {
  id: string;
  shelterId: string;
  shelterName: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  itemCategory:
    | 'Dry Food / Kibble'
    | 'Wet Food / Cans'
    | 'Fleece Blankets & Bedding'
    | 'Chew Toys & Kongs'
    | 'Collars, Leashes & Harnesses'
    | 'Towels & Cleaning Supplies'
    | 'Medication & Supplements';
  description: string;
  quantity: string;
  dropoffOrDelivery: 'In-person dropoff' | 'Courier delivery';
  dateSubmitted: string;
  status: 'Pending Review' | 'Accepted' | 'Declined';
  shelterResponseNote?: string;
}

export interface ShelterProfile {
  id: string;
  name: string;
  location: string;
  postcodeArea: string;
  postcode?: string;
  address: string;
  phone: string;
  email: string;
  charityNumber: string;
  website: string;
  logoUrl: string;
  operatingHours: string;
  description: string;
  wishlistNeeds: string[];
}

// Multi-User Shelter Staff Accounts
export interface ShelterStaffMember {
  id: string;
  shelterId: string;
  name: string;
  role: 'Shelter Director' | 'Kennel Manager' | 'Adoption Coordinator' | 'Vet Nurse / Medical Lead' | 'Volunteer Lead';
  avatar: string;
  email: string;
  phone: string;
  shiftToday: string;
  staffPinCode?: string;
  permissions?: string[];
  lastLoginAt?: string;
  isCurrentActive: boolean;
}

// Mandatory Policy Sign-Up & Digital Agreement
export interface UserPolicyAgreement {
  userId: string;
  userName: string;
  userRole: 'Pet Owner' | 'Walker' | 'Kennel Host' | 'Shelter Staff' | 'Advertiser';
  agreedAnimalWelfareAct: boolean;
  agreedUkGdprPrivacy: boolean;
  agreedEscrowRefundTerms: boolean;
  agreedDbsSafeguarding: boolean;
  agreedEmergencyVetProtocol: boolean;
  signatureText: string;
  signedTimestamp: string;
  ipRecord: string;
  status: 'Signed & Active' | 'Pending Signature';
}

// Complaints & Grievance Ticketing
export interface ComplaintTicket {
  id: string;
  submittedBy: string;
  submitterRole: 'Pet Owner' | 'Walker' | 'Kennel Host' | 'Shelter Visitor' | 'Advertiser';
  submitterEmail: string;
  submitterPhone: string;
  category:
    | 'Walker Tardiness or Conduct'
    | 'Kennel / Boarding Hygiene'
    | 'Animal Safety Concern'
    | 'Billing or Escrow Dispute'
    | 'Misleading Local Business Ad'
    | 'Shelter Visit Incident'
    | 'App Technical Issue';
  involvedPartyName: string;
  incidentDate: string;
  bookingReference?: string;
  subject: string;
  detailedDescription: string;
  evidenceAttachmentName?: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical / Safety';
  status: 'Under Investigation' | 'Awaiting Evidence' | 'Action Taken & Refund Issued' | 'Resolved / Dismissed' | 'Formal Warning Issued';
  assignedAdmin: string;
  adminResolutionNotes?: string;
  submittedAt: string;
  resolvedAt?: string;
}

// Dog Kennels & Overnight Boarding Stays
export interface KennelSuite {
  id: string;
  name: string;
  type: 'Standard Heated Pod' | 'Luxury Executive Suite' | 'Paws Garden Cabin' | 'Quiet Puppy Nursery';
  capacityDogs: number;
  nightlyRate: number;
  dayCareRate: number;
  features: string[];
  description: string;
  photoUrl: string;
  available: boolean;
}

export interface KennelHost {
  id: string;
  businessName: string;
  contactName: string;
  avatar: string;
  dashboardPhotoUrl?: string;
  dashboardPhotos?: string[];
  location: string;
  postcodeArea: string;
  postcode?: string;
  distanceMiles: number;
  headline: string;
  rating: number;
  reviewCount: number;
  bio: string;
  councilLicenceNumber: string;
  councilLicenceRating: '5 Stars (Higher Standard)' | '4 Stars' | '3 Stars';
  issuingCouncil: string;
  licenceExpiryDate: string;
  vetPracticeAssigned: string;
  cctvMonitored: boolean;
  heatedSleepingQuarters: boolean;
  outdoorAcreage: string;
  nightlyBaseRate: number;
  suites: KennelSuite[];
  acceptedSizes: ('Small' | 'Medium' | 'Large' | 'Giant')[];
  isRecommended?: boolean;
  subscriptionPlan?: 'FREE / STARTER' | 'PRO' | 'Elite Package' | 'Starter Host' | 'Pro Kennel & Stay' | 'Commercial Retreat';
  subscriptionPaid?: boolean;
  subscriptionBillingCycle?: 'monthly' | 'annual';
  additionalServiceAreas?: string[];
  staffMembers?: { id: string; name: string; role: string; dbsRef: string }[];
}

export interface KennelBooking {
  id: string;
  kennelId: string;
  kennelName: string;
  suiteName: string;
  ownerName: string;
  ownerPhone: string;
  dogNames: string[];
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  totalPrice: number;
  feedingSchedule: string;
  medicationNotes: string;
  emergencyVetAuthorised: boolean;
  status: 'Confirmed' | 'In-Stay' | 'Completed' | 'Pending';
  bookedAt: string;
}

// Dog-Friendly Local Places & Directory (Eat, Stay, Shopping, Vets, Groomers)
export type DogFriendlyCategory =
  | 'Places to Eat'
  | 'Places to Stay'
  | 'Dog-Friendly Shopping'
  | 'Grooming & Spa'
  | 'Veterinary Hospital';

export interface DogFriendlyPlace {
  id: string;
  name: string;
  category: DogFriendlyCategory;
  tagline: string;
  description: string;
  postcodeArea: string;
  address: string;
  phone: string;
  website: string;
  photoUrl: string;
  dogPerks: string[];
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
  priceLevel: '£' | '££' | '£££';
  isOpenNow: boolean;
  openingHours: string;
  verifiedDogFriendly: boolean;
}

export interface ServiceReview {
  id: string;
  targetType: 'walker' | 'kennel';
  targetId: string;
  targetName: string;
  reviewerName: string;
  reviewerAvatar?: string;
  dogName: string;
  dogNames?: string[];
  serviceName: string;
  serviceType?: string;
  rating: number; // 1 to 5 stars
  comment: string;
  date: string;
  verifiedBooking: boolean;
}
