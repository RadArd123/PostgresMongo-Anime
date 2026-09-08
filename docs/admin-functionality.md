# Admin functionality changes

The existing visual design was retained. New controls use the existing action cards, dialogs and dark panels.

## Completed

- Anime and episodes: create/read/update/delete validation, episode directory, image replacement, duplicate episode-number protection, missing-record responses and deletion of dependent content in a transaction.
- Hero banners and suggestions: existing create/edit forms plus visible delete controls, image replacement and record listings.
- News: fixed the edit payload for ratings and view counts; optional metadata can be cleared; images can be replaced.
- Users: create and edit forms, existing role and delete controls; self-demotion/self-deletion protection; serialized role/deletion checks preserve an administrator. Account deletion retains donation records with the user detached.
- Badges: editing and assignment viewing/revocation in addition to existing create/award/delete actions.
- Failed admin mutations now reject and show feedback, leaving existing forms open.
- The shared action-card trigger forwards dialog props and refs.
- Protected routes wait for the initial authentication check before redirecting.
- Favorites and watchlist additions refresh joined anime data instead of inserting incompatible response records.
- Episode-list requests ignore stale responses; an empty list returns HTTP 200.
- Removed simulated playback progress. Direct MP4/WebM/Ogg playback saves actual position and supports resume and next episode on completion. External embeds retain provider controls and manual completion.
- Added the missing notification-settings route and wired it to persisted preferences. Notification delivery respects those preferences.

## Verification

- Frontend production build passed; frontend and backend TypeScript checks passed.
- Three security tests passed.
- Nine HTTP/PostgreSQL integration scenarios passed, covering CRUD, authorization, live role revocation, dependent deletion, invalid image input, duplicate episodes, progress ownership, notification preferences and concurrent admin changes.
- Integration tests create and drop a uniquely named isolated schema. Existing application records are not used as test fixtures.
- Cloudinary uploads and socket delivery are mocked in integration tests; these external services still require a live environment check.
- Browser verification reached the login form and attempted fixture login, but the local preview session stopped before a complete admin UI pass. Full visual/end-to-end browser verification remains outstanding.
- External embedded players cannot report actual playback time without a supported provider API. Automatic resume/progress is supported for direct video files only.
- Repository-wide whitespace checking reports existing trailing whitespace in `backend/src/model/reviews.model.ts`.

## Run checks

From `backend`: `npm run check` and `npm run test:integration`.

From `frontend`: `npm run build`.

Integration tests use the configured PostgreSQL connection and require permission to create/drop their isolated test schema. They do not require working Cloudinary credentials.
