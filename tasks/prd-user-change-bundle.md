# PRD: Allow Users to Change Selected Bundle

## 1. Introduction/Overview

This document outlines the requirements for a new feature enabling users to change the selected content bundle for their Personalized Feed. Currently, users can create a feed from a pre-defined bundle but lack the ability to modify this selection after the initial setup. This feature will introduce a dropdown menu within the "Edit Personalized Feed" modal, allowing users to seamlessly switch between different bundles that are available for their subscription tier.

## 2. Goals

-   **Empower User Choice:** Allow users with existing bundle-based feeds to change their selected bundle, providing more control over their content.
-   **Enforce Plan Tiers:** Ensure that users can only view and select bundles that are permitted for their `PlanGate` access level (e.g., `NONE`, `CASUAL_LISTENER`, `CURATE_CONTROL`).
-   **Seamless Integration:** Integrate this functionality smoothly into the existing `EditUserFeedModal` without disrupting the current user experience.

## 3. User Stories

-   **As a user on the "Casual Listener" plan,** I want to be able to switch my Personalized Feed's bundle to another "Casual Listener" or "Free" bundle so that I can explore different curated content.
-   **As a user on the "Free" plan,** I want to see the list of available bundles for my tier and change my selection if I find one that better suits my interests.
-   **As an administrator,** I want to be confident that the system only allows users to select bundles corresponding to their subscription level, thereby maintaining the integrity of our plan structure.

## 4. Functional Requirements

1.  **Conditional Dropdown:** The `EditUserFeedModal` component must be updated to conditionally render a "Change Bundle" dropdown menu.
2.  **Visibility Rule:** The dropdown shall **only** be visible if the user's `UserCurationProfile` has the `is_bundle_selection` flag set to `true`. Profiles based on custom podcast selections will not see this option.
3.  **UI Placement:** The "Change Bundle" dropdown and its corresponding label will be placed below the "Status" input field within the modal.
4.  **Data Fetching:** The list of available bundles for the dropdown will be populated by making a `GET` request to the existing `/api/curated-bundles` endpoint, which already filters bundles based on the authenticated user's plan.
5.  **Handling No Bundles:** If the API returns an empty list of bundles for the user's plan, the dropdown will be disabled and display a message: "No bundles available for your plan."
6.  **Pre-selection:** The dropdown should be pre-populated with the user's currently selected bundle.
7.  **Saving Changes:** When the user selects a new bundle and clicks "Save Changes," the application must:
    -   Update the `selected_bundle_id` field on the user's `UserCurationProfile`.
    -   Ensure the `is_bundle_selection` flag is set to `true` to maintain data consistency.

## 5. Non-Goals (Out of Scope)

-   **No Conversion of Custom Feeds:** This feature will not provide a mechanism for users with custom-selected podcast feeds (`is_bundle_selection: false`) to convert their feed into a bundle-based one via this modal.
-   **No Bundle Management:** Creation, modification, or deletion of bundles remains an admin-only function and is not part of this user-facing feature.
-   **No Subscription Changes:** The feature will not alter the user's subscription plan or billing status.

## 6. Design Considerations

-   The dropdown will be implemented using the project's standard `Select` component from the `shadcn/ui` library to ensure visual consistency.
-   A `Label` with the text "Change Bundle" will be associated with the dropdown.
-   All new UI elements must adhere to the existing styling and layout of the `EditUserFeedModal`.

## 7. Technical Considerations

-   The `EditUserFeedModal` component will require state management for the list of available bundles and the user's new selection.
-   A `useEffect` hook will be used to fetch the available bundles from `/api/curated-bundles` when the modal is opened for a bundle-based profile.
-   The `onSave` handler within `EditUserFeedModal` will be modified to include the `selected_bundle_id` in the payload sent for updating the user profile.
-   The backend API endpoint responsible for updating the `UserCurationProfile` (`PATCH /api/user-curation-profiles/[id]`) must be capable of handling the `selected_bundle_id` field in the request body.

## 8. Success Metrics

-   The primary success metric is the successful, error-free ability for users to change their selected bundle.
-   A potential secondary metric could be an increase in user engagement, measured by the frequency of bundle changes, indicating that users are actively exploring the available content.

## 9. Open Questions

-   None at this time.
