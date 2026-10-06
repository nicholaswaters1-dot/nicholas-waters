# Security Specification — My Paws Walks Firestore Rules

## 1. Data Invariants
1. **Global Default-Deny**: All paths not explicitly matched (`/leaderboard/{userId}` and `/users_private/{userId}`) are strictly denied (`allow read, write: if false;`).
2. **PII Split-Collection Isolation**: PII (`email`, `postcode`) is isolated strictly in `/users_private/{userId}` where `get` and `write` require `request.auth.uid == userId && request.auth.token.email_verified == true`. `list` is completely forbidden on `/users_private`.
3. **Leaderboard Ownership & Verified Identity**: Only a verified authenticated user (`request.auth != null && request.auth.token.email_verified == true`) can create or update their own `/leaderboard/{userId}` document where `userId == request.auth.uid` and `incoming().uid == request.auth.uid`.
4. **Query Enforcer on Leaderboard List**: `allow list` on `/leaderboard/{userId}` enforces `resource.data.pupPoints >= 0` so every query must filter on `pupPoints >= 0` (e.g., `where('pupPoints', '>=', 0)`).
5. **Temporal Integrity & Immutability**: `createdAt` must equal `request.time` on `create` and remain immutable (`incoming().createdAt == existing().createdAt`) on `update`. `updatedAt` must equal `request.time` on both `create` and `update`.
6. **Privilege Escalation Prevention**: Users cannot assign `admin` persona in `/users_private/{userId}`; allowed personas are strictly `['owner', 'walker', 'kennel', 'shelter']`.

## 2. The "Dirty Dozen" Payloads (All Must Return `PERMISSION_DENIED`)
1. **Shadow Field Injection on Create**: Creating `/leaderboard/user1` with extra field `{"isAdmin": true}` -> Rejected by `.keys().hasOnly(...)`.
2. **Identity Spoofing on Create**: User `user1` creating `/leaderboard/user2` or setting `uid: "user2"` -> Rejected by `request.auth.uid == userId && data.uid == request.auth.uid`.
3. **Unverified Email Write**: Authenticated user with `email_verified: false` writing to `/leaderboard/user1` -> Rejected by `isVerifiedUser()`.
4. **Resource Exhaustion (1MB String)**: Writing a 5,000-character string into `displayName` or `dogName` -> Rejected by `.size() <= 80` and `.size() <= 60`.
5. **Path ID Poisoning**: Using invalid characters or >128 chars in `{userId}` -> Rejected by `isValidId(userId)`.
6. **Array Overflow Attack**: Passing 50 items in `badges` array -> Rejected by `data.badges.size() <= 15`.
7. **PII Cross-User Read**: User `user1` attempting `get` on `/users_private/user2` -> Rejected by `isOwner(userId)`.
8. **PII Collection Scraping**: Any user attempting `list` on `/users_private` -> Rejected (`allow list: if false`).
9. **Immutable Field Mutation**: User `user1` modifying `uid` or `createdAt` during an `update` -> Rejected by `incoming().uid == existing().uid && incoming().createdAt == existing().createdAt`.
10. **Forged Client Timestamp**: User passing a past or future timestamp for `updatedAt` instead of `serverTimestamp()` (`request.time`) -> Rejected by `incoming().updatedAt == request.time`.
11. **Self-Assigned Admin Role**: User creating `/users_private/user1` with `persona: "admin"` -> Rejected by `data.persona in ['owner', 'walker', 'kennel', 'shelter']`.
12. **Negative Points / Type Poisoning**: Updating `pupPoints` to a string `"999999"` or negative number `-500` -> Rejected by `isValidLeaderboardEntry(incoming())`.
