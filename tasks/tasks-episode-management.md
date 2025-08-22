## Relevant Files

- `prisma/schema.prisma` - To add the new `UserEpisode` model and the usage counter field to the `Subscription` model.
- `package.json` - To add the `youtube-transcript` dependency.
- `lib/inngest/user-episode-generator.ts` - New Inngest workflow for the multi-step process of transcription, summarization, and audio generation.
- `app/api/user-episodes/create/route.ts` - New API route to handle form submission, trigger the Inngest workflow, and create the initial database record.
- `app/api/user-episodes/list/route.ts` - New API route to fetch a user's episodes and provide secure, temporary URLs for audio playback.
- `app/api/youtube-metadata/route.ts` - New API route to fetch YouTube video metadata to pre-fill the creation form.
- `app/(protected)/my-episodes/page.tsx` - New page for users to create and manage their episodes.
- `app/(protected)/my-episodes/_components/episode-creator.tsx` - New Client Component containing the episode creation form.
- `app/(protected)/my-episodes/_components/episode-list.tsx` - New Client Component to display the list of user-generated episodes.
- `app/(protected)/curation-profile-management/page.tsx` - To be modified to include a conditionally rendered link to the new `/my-episodes` page.
- `app/api/paddle-webhook/route.ts` - To be modified to handle subscription lifecycle events for resetting usage counters and deleting episodes.
- `tests/user-episodes.test.ts` - New test file for the episode management feature.

### Notes

- Unit tests should be co-located with the files they are testing.
- Use `pnpm test` to run all tests.

## Tasks

- [x] 1.0 Backend Setup: Database and Schema Changes
  - [x] 1.1 Modify `prisma/schema.prisma` to add a new `UserEpisode` model with all required fields (`userId`, `episodeTitle`, `gcsAudioUrl`, etc.).
  - [x] 1.2 Add an `episodeCreationCount` field to the `Subscription` model in `prisma/schema.prisma`.
  - [x] 1.3 Generate a new Prisma migration for the schema changes.
  - [x] 1.4 Apply the migration to the development database.
- [x] 2.0 Core Backend Logic: Episode Generation Workflow
  - [x] 2.1 Create a new Ingest function in `lib/inngest/user-episode-generator.ts` for the episode creation pipeline.
  - [x] 2.2 Add the `youtube-transcript` package as a dependency.
  - [x] 2.3 Implement the first step in the workflow to fetch the transcript from a YouTube URL.
  - [x] 2.4 Implement the second step to summarize the transcript into a script using Gemini.
  - [x] 2.5 Implement the third step to convert the script into an audio file using Google's TTS service.
  - [x] 2.6 Implement the fourth step to upload the generated audio file to a private GCS bucket.
  - [x] 2.7 Implement the final step to update the `UserEpisode` record with the final `gcsAudioUrl`.
  - [x] 2.8 Add robust error handling for each step of the Inngest workflow.
- [x] 3.0 API Development: Endpoints for Episode Management
  - [x] 3.1 Create the API route `app/api/user-episodes/create/route.ts` to trigger the Inngest workflow.
  - [x] 3.2 Create the API route `app/api/user-episodes/list/route.ts` to fetch user episodes and provide GCS signed URLs.
  - [x] 3.3 Create the API route `app/api/youtube-metadata/route.ts` to fetch video details.
  - [x] 3.4 Secure all new API routes to ensure they are only accessible by authenticated users.
- [ ] 4.0 Frontend Development: UI for Episode Management Page
  - [ ] 4.1 Create the new page file at `app/(protected)/my-episodes/page.tsx`.
  - [ ] 4.2 Develop the `episode-creator.tsx` Client Component with a form for submitting a YouTube URL and editing metadata.
  - [ ] 4.3 Develop the `episode-list.tsx` Client Component to display episodes with an audio player for each.
  - [ ] 4.4 Implement UI feedback mechanisms for loading, success, and error states during episode creation.
- [ ] 5.0 Integration, Plan Gating and Lifecycle Management
  - [ ] 5.1 Add a conditionally rendered link to `/my-episodes` from the `/curation-profile-management` page, visible only to `curate_control` users.
  - [ ] 5.2 Display the user's remaining episode creation count on the `/my-episodes` page.
  - [ ] 5.3 Disable the episode creation form when the user has reached their monthly limit.
  - [ ] 5.4 Modify the Paddle webhook handler to reset the usage counter upon subscription renewal.
  - [ ] 5.5 Modify the Paddle webhook handler to delete a user's episodes and GCS files when their subscription is cancelled or renews.
