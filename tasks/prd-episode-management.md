# Product Requirements Document: Episode Management

## 1. Introduction/Overview

This document outlines the requirements for a new "Episode Management" feature available exclusively to users with an active `curate_control` subscription plan. This feature will allow these users to generate personalized audio episodes from YouTube videos. The system will handle transcription, summarization, and text-to-speech conversion, storing the resulting audio file for the user's private consumption. This initiative aims to enhance the value of the `curate_control` plan by providing a powerful content creation tool.

## 2. Goals

*   **Goal 1:** Empower `curate_control` users to create custom audio episodes from YouTube content.
*   **Goal 2:** Provide a seamless, single-step episode generation workflow.
*   **Goal 3:** Ensure generated episodes are private and accessible only to the creator.
*   **Goal 4:** Implement a fair usage policy with a monthly creation limit tied to the user's subscription cycle.
*   **Goal 5:** Establish a clear data lifecycle for user-generated episodes, including automated cleanup.

## 3. User Stories

*   **As a `curate_control` user,** I want to provide a YouTube URL and have an audio episode generated from it so that I can listen to summarized content on the go.
*   **As a `curate_control` user,** I want to see a list of all the episodes I've created so that I can easily access and manage my content.
*   **As a `curate_control` user,** I want the system to pre-fill episode details from the YouTube video's metadata to save me time, but I want to be able to edit those details.
*   **As a `curate_control` user,** I want to know how many episodes I can still create in my current billing cycle so that I can manage my usage.
*   **As a system administrator,** I want user-generated episodes to be automatically deleted when a user's subscription ends or a new billing cycle begins to manage storage costs and data retention.

## 4. Functional Requirements

### Episode Creation
1.  A new page shall be created at `/my-episodes` for users to manage their episodes.
2.  An entry point (e.g., a button or link) to the `/my-episodes` page shall be added to the `/curation-profile-management` page, visible only to users with an active `curate_control` plan.
3.  On the `/my-episodes` page, an authenticated `curate_control` user must be able to initiate episode creation via a form.
4.  The creation form must have a required field for a YouTube URL (`source_url`).
5.  Upon entering a valid YouTube URL, the system will use the `youtube-transcript` package to fetch the video's metadata.
6.  The form shall be auto-populated with the fetched `Episode Title` and `Source Name` (channel name). The user must be able to edit these fields.
7.  The form must include the following user-editable fields:
    *   `Episode Title` (text, required)
    *   `Episode Description` (textarea, optional)
    *   `Source Name` (text, required)
    *   `Episode Category` (text, free-form input)
8.  Upon submission, the system will trigger an Inngest workflow to:
    *   Get the transcript from the YouTube video.
    *   Use Gemini to summarize the transcript into a podcast-style script.
    *   Use Google's Generative AI to convert the script into an audio file.

### Episode Storage and Data
9.  The generated audio file must be uploaded to a private Google Cloud Storage (GCS) bucket.
10. Each user's episodes must be stored in a way that they are only accessible by that user (e.g., using user-specific paths or GCS permissions).
11. A new table in the database named `UserEpisode` will be created to store episode metadata.
12. The `UserEpisode` table must include fields for: `userId`, `episodeTitle`, `episodeDescription`, `sourceName`, `sourceUrl`, `sourceEpisodePublishedAt`, `episodeCategory`, `gcsAudioUrl`, and a `createdAt` timestamp.

### Episode Access and Viewing
13. The `/my-episodes` page will display a list of all episodes created by the currently logged-in `curate_control` user.
14. Each episode in the list must be playable directly from the UI.
15. The system shall use secure, temporary URLs (e.g., GCS signed URLs) to grant access for audio playback.
16. The original YouTube `source_url` will be displayed as metadata for each episode, allowing the user to copy it.

### Usage Limits and Lifecycle
17. `curate_control` users are limited to creating 30 episodes per monthly subscription cycle.
18. A usage counter field shall be added to the user's subscription record in the database to track the number of episodes created in the current cycle.
19. The UI must display the user's remaining episode creation count for the current cycle.
20. The "Create Episode" button will be disabled when the user has reached their 30-episode limit.
21. The usage counter must reset to zero at the beginning of each new Paddle subscription cycle.
22. All `UserEpisode` records and their corresponding audio files in GCS for a user must be permanently deleted under the following conditions:
    *   When the user's `curate_control` subscription expires or is cancelled.
    *   When the user's subscription successfully renews and a new billing cycle begins.

## 5. Non-Goals (Out of Scope)

*   This feature will not be available to users on plans other than `curate_control`.
*   Users will not create or assign episodes to "Bundles" or "Podcasts."
*   Advanced features like selecting different `voice_id`s or setting up automated "weekly" schedules are future enhancements and not part of this initial implementation.
*   The `is_private` and `is_public` fields are not required for this version. All user episodes are private by default.

## 6. Design Considerations (Optional)

*   The UI for the `/my-episodes` page should be consistent with the existing application design.
*   The episode creation form should be a simple, single-step process.
*   Clear feedback should be provided to the user during the episode generation process (e.g., "Processing," "Success," "Error").

## 7. Technical Considerations

*   **Schema:** A database migration will be required to add the `UserEpisode` table and the usage counter field to the user's subscription model. Care must be taken to avoid breaking changes.
*   **Inngest:** A new Inngest workflow needs to be created, modeling the existing admin workflow but adapted for this feature.
*   **GCS Security:** GCS bucket permissions and IAM policies must be configured to ensure strict privacy for user-generated content.
*   **Dependencies:** The `youtube-transcript` package will be added to the project.

## 8. Success Metrics

*   **Adoption Rate:** Percentage of `curate_control` users who create at least one episode within their first month.
*   **Feature Engagement:** Average number of episodes created per active `curate_control` user per month.
*   **System Performance:** Average time taken from form submission to the episode being available for playback.

## 9. Open Questions

*   How should the system handle YouTube videos that have transcripts disabled? Should it inform the user with an error message?
