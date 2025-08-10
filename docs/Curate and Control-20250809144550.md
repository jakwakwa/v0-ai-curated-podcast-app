# Curate and Control

You're absolutely right! Let me revise the implementation plan to focus on "Creating a Profile Feed" with active/inactive states instead of draft states.

# Profile Feed Creation Implementation Plan

## 🎯 Objective
Enable users to create and manage profile feeds with active/inactive states, providing a safe creation environment before committing to a final personalized feed.

## 📊 Revised Schema Design

```plain
/// ───────────────────────────────────
/// PROFILE FEED CREATION
/// ───────────────────────────────────
model ProfileFeedCreation {
  creation_id           String           @id @default(uuid()) @map("creation_id")
  user_id               String           @map("user_id")
  name                  String           @map("name")
  status                CreationStatus   @default(InProgress) @map("status")
  created_at            DateTime         @default(now()) @map("created_at")
  updated_at            DateTime         @updatedAt @map("updated_at")
  expires_at            DateTime?        @map("expires_at")
  is_bundle_selection   Boolean          @default(false) @map("is_bundle_selection")
  selected_bundle_id    String?          @map("selected_bundle_id")
  creation_podcast      CreationProfilePodcast[]
  selectedBundle        Bundle?          @relation(fields: [selected_bundle_id], references: [bundle_id])
  user                  User             @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@unique([user_id, status], map: "user_creation_status_unique")
  @@index([user_id])
  @@index([status])
  @@index([expires_at])
  @@map("profile_feed_creation")
}

/// Junction table: ProfileFeedCreation ↔ Podcast
model CreationProfilePodcast {
  creation_id String                    @map("creation_id")
  podcast_id  String                    @map("podcast_id")
  added_at    DateTime                  @default(now()) @map("added_at")
  podcast     Podcast                   @relation(fields: [podcast_id], references: [podcast_id], onDelete: Cascade)
  creation    ProfileFeedCreation       @relation(fields: [creation_id], references: [creation_id], onDelete: Cascade)

  @@id([creation_id, podcast_id])
  @@map("creation_profile_podcast")
}

enum CreationStatus {
  InProgress
  Ready
  Active
  Inactive
  Expired
}
```

## �� Workflow Diagram

mermaid scheme

```scheme
graph TD
    A[User Starts Creating Profile] --> B[Create Profile Feed Creation]
    B --> C[Status: InProgress]
    C --> D[User Adds Content]
    D --> E{Content Added?}
    E -->|Yes| F[Status: Ready]
    E -->|No| C
    F --> G[User Reviews Profile]
    G --> H{User Satisfied?}
    H -->|Yes| I[Convert to Active Profile]
    H -->|No| D
    I --> J[Status: Active]
    J --> K[Delete Creation Record]
    K --> L[User Has Active Feed]

    C --> M[Auto-Expire After 7 Days]
    M --> N[Status: Expired]
    N --> O[Cleanup Expired Creations]

    J --> P[User Can Deactivate]
    P --> Q[Status: Inactive]
    Q --> R[User Can Reactivate]
    R --> J

    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style N fill:#ffcdd2
    style Q fill:#fff3e0
```

## 📋 Implementation Phases
### Private ([https://app.clickup.com/t/869a1hwzc](https://app.clickup.com/t/869a1hwzc))

### Phase 1: Database Schema & Migration
**Duration: 1-2 days**

#### Tasks:
- [ ]     Add new models to `prisma/schema.prisma`
- [ ]     Create migration: `npx prisma migrate dev --name add_profile_feed_creation`
- [ ]     Update Prisma client: `npx prisma generate`
- [ ]     Add new types to `lib/types.ts`
- [ ]     Test migration rollback

#### Files to Modify:

```plain
prisma/schema.prisma
lib/types.ts
```

### Private ([https://app.clickup.com/t/869a1hx0x](https://app.clickup.com/t/869a1hx0x))

### Phase 2: Server Actions & API Routes
**Duration: 2-3 days**

#### Tasks:
- [ ]     Update `createDraftUserCurationProfile()` → `createProfileFeedCreation()` in `app/actions.ts`
- [ ]     Create new API routes:
    *   `app/api/profile-feed-creation/route.ts` (GET, POST)
    *   `app/api/profile-feed-creation/[id]/route.ts` (GET, PATCH, DELETE)
    *   `app/api/profile-feed-creation/[id]/activate/route.ts` (POST)
- [ ]     Add profile creation management functions to `app/actions.ts`
- [ ]     Implement auto-expiration cleanup job

#### New Functions:

```typescript
// app/actions.ts
export async function createProfileFeedCreation()
export async function updateProfileCreation(creationId: string, data: Partial<ProfileFeedCreation>)
export async function addPodcastToCreation(creationId: string, podcastId: string)
export async function removePodcastFromCreation(creationId: string, podcastId: string)
export async function activateProfileCreation(creationId: string)
export async function deleteProfileCreation(creationId: string)
export async function cleanupExpiredCreations()
```

### Private ([https://app.clickup.com/t/869a1hx15](https://app.clickup.com/t/869a1hx15))

**Phase 3: Client Side State Management**
**Duration: 2-3 days**

#### Tasks:
- [ ]     Create `lib/stores/profile-creation-store.ts`
- [ ]     Add profile creation actions to existing stores
- [ ]     Update `lib/stores/index.ts` exports
- [ ]     Add profile creation types to `lib/types.ts`

#### Store Interface:

```typescript
interface ProfileCreationStore {
  profileCreation: ProfileFeedCreation | null
  isLoading: boolean
  error: string | null

  // Actions
  createProfileCreation: (data: CreateProfileData) => Promise<void>
  updateProfileCreation: (data: UpdateProfileData) => Promise<void>
  addPodcastToCreation: (podcastId: string) => Promise<void>
  removePodcastFromCreation: (podcastId: string) => Promise<void>
  activateProfileCreation: () => Promise<void>
  deleteProfileCreation: () => Promise<void>
  loadProfileCreation: () => Promise<void>
}
```

### Private ([https://app.clickup.com/t/869a1hx3e](https://app.clickup.com/t/869a1hx3e))

### Phase 4: UI Components & Pages

**Duration: 3-4 days**

#### Tasks:
- [ ]     Create `components/features/profile-creation-wizard.tsx`
- [ ]     Create `app/(protected)/profile-creator/page.tsx`
- [ ]     Update `components/features/user-feed-selector.tsx` to support profile creation
- [ ]     Add creation status indicators to dashboard
- [ ]     Create profile creation management components

#### New Components:

```plain
components/features/
├── profile-creation-wizard.tsx
├── profile-creation-status.tsx
├── profile-content-selector.tsx
└── profile-review-panel.tsx

app/(protected)/
├── profile-creator/
│   └── page.tsx
└── profile-management/
    └── page.tsx
```

###   

### Private ([https://app.clickup.com/t/869a1hx3z](https://app.clickup.com/t/869a1hx3z))
###   

### Phase 5: Integration & Workflow
**Duration: 2-3 days**

#### Tasks:
- [ ]     Update dashboard to show profile creation status
- [ ]     Integrate profile creation workflow with existing user feed selector
- [ ]     Add creation-to-active profile conversion flow
- [ ]     Implement auto-save functionality
- [ ]     Add creation expiration notifications

#### Integration Points:
*   Dashboard shows profile creation status alongside active profile
*   User feed selector can create profiles in creation mode
*   Profile creator provides safe experimentation environment
*   Activation process validates subscription limits

### Private ([https://app.clickup.com/t/869a1hx46](https://app.clickup.com/t/869a1hx46))

### Phase 6: Testing & Polish
**Duration: 2-3 days**

#### Tasks:
- [ ]     Unit tests for new server actions
- [ ]     Integration tests for API routes
- [ ]     E2E tests for profile creation workflow
- [ ]     Performance testing for creation operations
- [ ]     UI/UX testing and refinements
- [ ]     Documentation updates

## 🔧 Technical Implementation Details

### Database Constraints:
*   One active creation per user
*   Auto-expiration after 7 days
*   Cascade deletion for related records

### API Endpoints:

```plain
GET    /api/profile-feed-creation          # Get user's creation
POST   /api/profile-feed-creation          # Create new profile
GET    /api/profile-feed-creation/[id]     # Get specific creation
PATCH  /api/profile-feed-creation/[id]     # Update creation
DELETE /api/profile-feed-creation/[id]     # Delete creation
POST   /api/profile-feed-creation/[id]/activate  # Activate profile
```

### State Management:
*   Profile creations stored separately from active profiles
*   Real-time auto-save during editing
*   Optimistic updates for better UX
*   Conflict resolution for concurrent edits

## 🚀 Private ([https://app.clickup.com/t/869a1hx51](https://app.clickup.com/t/869a1hx51))
### Phase 6: Testing & Polish

### Phase 1: Development Environment
*   Deploy schema changes to dev database
*   Test all new functionality in isolation
*   Validate migration rollback procedures

### Phase 2: Staging Environment
*   Full integration testing with existing features
*   Performance testing with realistic data volumes
*   User acceptance testing with stakeholders

### Phase 3: Production Deployment
*   Gradual rollout with feature flags
*   Monitor for any issues with existing functionality
*   Rollback plan ready if needed

## �� Success Metrics

*   **User Engagement**: Profile creation rate
*   **Activation Rate**: Creations converted to active profiles
*   **User Satisfaction**: Reduced profile abandonment
*   **Performance**: Creation operation response times
*   **Error Rate**: Failed creation operations

## 🔄 Future Enhancements

*   Private ([https://app.clickup.com/t/869a1hx61](https://app.clickup.com/t/869a1hx61))

This revised implementation plan focuses on "Creating a Profile Feed" with active/inactive states, providing a clear workflow for users to build and activate their personalized feeds.