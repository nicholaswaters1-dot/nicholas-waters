/**
 * Firestore Security Rules Test Suite — My Paws Walks
 * Verifies that all 12 "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'create' | 'update' | 'get' | 'list' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_SECURITY_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Create (isAdmin ghost field)',
    collection: 'leaderboard',
    docId: 'user1',
    operation: 'create',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      uid: 'user1',
      displayName: 'Oliver',
      dogName: 'Buster',
      dogBreed: 'Golden Retriever',
      borough: 'NW3',
      pupPoints: 100,
      tricksMastered: 2,
      gamesCompleted: 1,
      rankTitle: 'Pack Scholar',
      badges: ['first_recall'],
      isAdmin: true,
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Identity Spoofing on Create (writing to another userId)',
    collection: 'leaderboard',
    docId: 'user2',
    operation: 'create',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      uid: 'user2',
      displayName: 'Spoofed',
      dogName: 'Rex',
      dogBreed: 'Pug',
      borough: 'NW3',
      pupPoints: 100,
      tricksMastered: 1,
      gamesCompleted: 1,
      rankTitle: 'Novice Pup',
      badges: [],
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified Email Write Attempt',
    collection: 'leaderboard',
    docId: 'user1',
    operation: 'create',
    auth: { uid: 'user1', email: 'nicholaswaters1@gmail.com', email_verified: false },
    payload: {
      uid: 'user1',
      displayName: 'Unverified Spoof',
      dogName: 'Buster',
      dogBreed: 'Mixed',
      borough: 'NW3',
      pupPoints: 500,
      tricksMastered: 5,
      gamesCompleted: 4,
      rankTitle: 'Alpha Champion',
      badges: [],
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Resource Exhaustion Attack (Oversized displayName > 80 chars)',
    collection: 'leaderboard',
    docId: 'user1',
    operation: 'create',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      uid: 'user1',
      displayName: 'A'.repeat(500),
      dogName: 'Buster',
      dogBreed: 'Golden Retriever',
      borough: 'NW3',
      pupPoints: 100,
      tricksMastered: 1,
      gamesCompleted: 1,
      rankTitle: 'Novice',
      badges: [],
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Path ID Poisoning (Invalid characters in userId)',
    collection: 'leaderboard',
    docId: 'user$1!@#invalid',
    operation: 'create',
    auth: { uid: 'user$1!@#invalid', email: 'user1@example.com', email_verified: true },
    payload: {},
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Array Overflow Attack (>15 badges)',
    collection: 'leaderboard',
    docId: 'user1',
    operation: 'update',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      badges: new Array(25).fill('badge_id'),
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'PII Cross-User Read on users_private',
    collection: 'users_private',
    docId: 'user2',
    operation: 'get',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'PII Collection Scraping via list on users_private',
    collection: 'users_private',
    docId: '*',
    operation: 'list',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Immutable Field Mutation (changing createdAt or uid on update)',
    collection: 'leaderboard',
    docId: 'user1',
    operation: 'update',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      uid: 'different_uid',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Forged Client Timestamp on Update',
    collection: 'leaderboard',
    docId: 'user1',
    operation: 'update',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      updatedAt: '2020-01-01T00:00:00Z',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Self-Assigned Admin Role in users_private',
    collection: 'users_private',
    docId: 'user1',
    operation: 'create',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      uid: 'user1',
      email: 'user1@example.com',
      persona: 'admin',
      postcode: 'NW3 1AA',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Value Type Poisoning (negative pupPoints)',
    collection: 'leaderboard',
    docId: 'user1',
    operation: 'update',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      pupPoints: -999,
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
