import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export interface LeaderboardRecord {
  uid: string;
  displayName: string;
  dogName: string;
  dogBreed: string;
  borough: string;
  pupPoints: number;
  tricksMastered: number;
  gamesCompleted: number;
  rankTitle: string;
  badges: string[];
  createdAt?: any;
  updatedAt?: any;
}

export function computeRankTitle(points: number): string {
  if (points >= 800) return 'Grand Master Canine Champion';
  if (points >= 550) return 'Royal Parks Alpha Leader';
  if (points >= 350) return 'Gold Lead Pack Scholar';
  if (points >= 200) return 'Recall & Scent Specialist';
  return 'Rising Puppy Star';
}

export async function signInWithGooglePopup() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFirebase() {
  await signOut(auth);
}

export async function syncUserLeaderboardProgress(params: {
  uid: string;
  displayName: string;
  dogName: string;
  dogBreed: string;
  borough: string;
  pupPoints: number;
  tricksMastered: number;
  gamesCompleted: number;
  badges: string[];
}) {
  const safeUid = params.uid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const path = `leaderboard/${safeUid}`;
  const docRef = doc(db, 'leaderboard', safeUid);

  const sanitizedDisplayName = (params.displayName || 'Pet Parent').slice(0, 80);
  const sanitizedDogName = (params.dogName || 'Buster').slice(0, 60);
  const sanitizedDogBreed = (params.dogBreed || 'Golden Retriever').slice(0, 60);
  const sanitizedBorough = (params.borough || 'NW3 Hampstead').slice(0, 40);
  const safePoints = Math.max(0, Math.min(1000000, Math.round(params.pupPoints)));
  const safeTricks = Math.max(0, Math.min(500, Math.round(params.tricksMastered)));
  const safeGames = Math.max(0, Math.min(5000, Math.round(params.gamesCompleted)));
  const safeRankTitle = computeRankTitle(safePoints).slice(0, 60);
  const safeBadges = params.badges
    .slice(0, 15)
    .map((b) => String(b).slice(0, 50));

  try {
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      await setDoc(docRef, {
        uid: safeUid,
        displayName: sanitizedDisplayName,
        dogName: sanitizedDogName,
        dogBreed: sanitizedDogBreed,
        borough: sanitizedBorough,
        pupPoints: safePoints,
        tricksMastered: safeTricks,
        gamesCompleted: safeGames,
        rankTitle: safeRankTitle,
        badges: safeBadges,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        displayName: sanitizedDisplayName,
        dogName: sanitizedDogName,
        dogBreed: sanitizedDogBreed,
        borough: sanitizedBorough,
        pupPoints: safePoints,
        tricksMastered: safeTricks,
        gamesCompleted: safeGames,
        rankTitle: safeRankTitle,
        badges: safeBadges,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncPrivateUserProfile(params: {
  uid: string;
  email: string;
  persona: 'owner' | 'walker' | 'kennel' | 'shelter';
  postcode: string;
}) {
  const safeUid = params.uid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const path = `users_private/${safeUid}`;
  const docRef = doc(db, 'users_private', safeUid);

  const safeEmail = (params.email || 'user@mypawswalks.co.uk').slice(0, 120);
  const safePostcode = (params.postcode || 'NW3 1AA').slice(0, 20);
  const safePersona = ['owner', 'walker', 'kennel', 'shelter'].includes(params.persona)
    ? params.persona
    : 'owner';

  try {
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      await setDoc(docRef, {
        uid: safeUid,
        email: safeEmail,
        persona: safePersona,
        postcode: safePostcode,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        email: safeEmail,
        persona: safePersona,
        postcode: safePostcode,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export const signInWithGoogle = signInWithGooglePopup;

export interface LeaderboardDoc {
  uid: string;
  ownerName: string;
  dogName: string;
  dogBreed: string;
  points: number;
  rankTitle: string;
  masteredTricksCount: number;
  gamesCompletedCount: number;
  badges: string[];
  updatedAt?: string;
}

export async function syncLeaderboardScore(
  user: { uid: string; displayName?: string | null },
  data: {
    dogName: string;
    dogBreed: string;
    points: number;
    rankTitle: string;
    masteredTricksCount: number;
    gamesCompletedCount: number;
    badges: string[];
  }
) {
  return syncUserLeaderboardProgress({
    uid: user.uid,
    displayName: user.displayName || 'Pet Parent',
    dogName: data.dogName,
    dogBreed: data.dogBreed,
    borough: 'NW3 Hampstead',
    pupPoints: data.points,
    tricksMastered: data.masteredTricksCount,
    gamesCompleted: data.gamesCompletedCount,
    badges: data.badges,
  });
}

export async function syncShelterDogToCloud(params: {
  dogId: string;
  createdByUid: string;
  shelterId: string;
  shelterName: string;
  name: string;
  breed: string;
  age: string;
  status: 'Available' | 'Adoption Pending' | 'Re-homed';
  isActiveListing: boolean;
  lastDailyUpdate: string;
  updatedByStaffName: string;
}) {
  const safeDogId = params.dogId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const safeUid = params.createdByUid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const path = `shelter_dogs/${safeDogId}`;
  const docRef = doc(db, 'shelter_dogs', safeDogId);

  try {
    const existingSnap = await getDoc(docRef);
    const payload = {
      dogId: safeDogId,
      createdByUid: safeUid,
      shelterId: (params.shelterId || 'shelter_1').slice(0, 64),
      shelterName: (params.shelterName || 'Battersea Dogs & Cats Home').slice(0, 100),
      name: (params.name || 'Rescue Dog').slice(0, 60),
      breed: (params.breed || 'Crossbreed').slice(0, 60),
      age: (params.age || '2 Years').slice(0, 30),
      status: ['Available', 'Adoption Pending', 'Re-homed'].includes(params.status)
        ? params.status
        : 'Available',
      isActiveListing: Boolean(params.isActiveListing),
      lastDailyUpdate: (params.lastDailyUpdate || 'Settling in well at the shelter.').slice(0, 500),
      updatedByStaffName: (params.updatedByStaffName || 'Shelter Staff').slice(0, 80),
    };

    if (!existingSnap.exists()) {
      await setDoc(docRef, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        name: payload.name,
        breed: payload.breed,
        age: payload.age,
        status: payload.status,
        isActiveListing: payload.isActiveListing,
        lastDailyUpdate: payload.lastDailyUpdate,
        updatedByStaffName: payload.updatedByStaffName,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export interface PushNotificationDoc {
  notifId: string;
  senderUid: string;
  targetRole: 'owner' | 'walker' | 'kennel' | 'shelter' | 'all';
  category: 'Adoption Inquiry' | 'New Booking' | 'New Message' | 'Kennel Stay' | 'System Update';
  title: string;
  body: string;
  read: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export async function dispatchPushNotificationToCloud(params: {
  notifId: string;
  targetRole: 'owner' | 'walker' | 'kennel' | 'shelter' | 'all';
  category: 'Adoption Inquiry' | 'New Booking' | 'New Message' | 'Kennel Stay' | 'System Update';
  title: string;
  body: string;
}) {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const safeId = params.notifId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const path = `push_notifications/${safeId}`;
  const docRef = doc(db, 'push_notifications', safeId);

  try {
    await setDoc(docRef, {
      notifId: safeId,
      senderUid: currentUser.uid,
      targetRole: params.targetRole,
      category: params.category,
      title: (params.title || 'My Paws Walks Alert').slice(0, 120),
      body: (params.body || 'New activity update in your portal.').slice(0, 400),
      read: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribePushNotifications(
  onUpdate: (notifications: PushNotificationDoc[]) => void
) {
  const path = 'push_notifications';
  let unsubscribeSnapshot: (() => void) | null = null;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }

    if (!user) {
      return;
    }

    const q = query(
      collection(db, 'push_notifications'),
      where('senderUid', '==', user.uid),
      limit(25)
    );

    unsubscribeSnapshot = onSnapshot(
      q,
      (snapshot) => {
        const list: PushNotificationDoc[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            notifId: data.notifId || d.id,
            senderUid: data.senderUid || '',
            targetRole: data.targetRole || 'all',
            category: data.category || 'System Update',
            title: data.title || '',
            body: data.body || '',
            read: Boolean(data.read),
          };
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  });

  return () => {
    unsubscribeAuth();
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
    }
  };
}


