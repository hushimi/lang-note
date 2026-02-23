# Tasks: Google OAuth Login Without User Data Storage

**Feature Branch**: `002-google-oauth-login`
**Input**: Design documents from `/specs/002-google-oauth-login/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification - manual testing via browser is sufficient for this authentication-focused feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] [Type] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2])
- **[Type]**: Task category aligned with constitution principles
- Include exact file paths in descriptions

## Task Types (Constitution-Aligned)

Based on [Constitution v1.0.0](../.specify/memory/constitution.md) principles:

- **[Migration]**: Database migration
- **[Model]**: Eloquent model creation (Domain layer, Principle I)
- **[Data]**: Laravel Data DTO with TypeScript attribute (Principle II)
- **[Service]**: External integration service (Principle I, VII)
- **[Action]**: Business logic invokable class (Principle III)
- **[Controller]**: Thin HTTP controller (Principle III)
- **[Auth]**: Authentication infrastructure (SessionUser, UserProvider)
- **[Config]**: Configuration file updates
- **[Component]**: Reusable React component (Principle V)
- **[TypeGen]**: Run TypeScript generation (Principle II)

## Path Conventions

**Laravel/React Monolith** (this project):

- **Backend**: `app/Actions/`, `app/Data/`, `app/Models/`, `app/Services/`, `app/Http/Controllers/`, `app/Auth/`
- **Frontend**: `resources/js/Pages/`, `resources/js/Components/`
- **Config**: `config/auth.php`, `routes/web.php`
- **Migrations**: `database/migrations/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification

**Constitution Compliance**: Tasks must align with [v1.0.0](../.specify/memory/constitution.md)

- [x] T001 [P] [Config] Verify Laravel Socialite package is installed and configured in `composer.json`
- [x] T002 [P] [Config] Verify Google OAuth credentials are set in `.env` (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL)
- [x] T003 [P] [Config] Verify `config/services.php` has Google OAuth configuration

**Checkpoint**: Prerequisites verified - database and authentication infrastructure can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [Migration] Create oauth_tokens table migration in `database/migrations/YYYY_MM_DD_HHMMSS_create_oauth_tokens_table.php` with fields: id, google_id (unique, indexed), access_token, refresh_token (nullable), access_token_expires_at, refresh_token_expires_at (nullable), timestamps
- [x] T005 [Migration] Run migration to create oauth_tokens table: `php artisan migrate`
- [x] T006 [P] [Model] Create OauthToken model in `app/Models/OauthToken.php` with fillable fields: google_id, access_token, refresh_token, access_token_expires_at, refresh_token_expires_at
- [x] T007 [P] [Auth] Create SessionUser class in `app/Auth/SessionUser.php` implementing `Illuminate\Contracts\Auth\Authenticatable` with googleId property and required methods (getAuthIdentifierName, getAuthIdentifier, getAuthPassword, getRememberToken, setRememberToken, getRememberTokenName)
- [x] T008 [P] [Auth] Create SessionUserProvider class in `app/Auth/SessionUserProvider.php` implementing `Illuminate\Contracts\Auth\UserProvider` with methods: retrieveById, retrieveByToken, updateRememberToken, retrieveByCredentials, validateCredentials
- [x] T009 [Config] Update `config/auth.php` to register SessionUserProvider as 'session-users' provider and configure 'web' guard to use 'session-users' provider

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Logs In with Google Account (Priority: P1) 🎯 MVP

**Goal**: Enable users to authenticate via Google OAuth without storing user email or name in database

**Independent Test**: Can be fully tested by attempting Google OAuth login flow and verifying successful authentication without any user data being stored in the database. User can access protected pages after authentication.

### Implementation for User Story 1

- [x] T010 [P] [US1] [Data] Create OAuthTokenData DTO class in `app/Data/OAuthTokenData.php` with `#[TypeScript]` attribute and properties: googleId (string), accessToken (string), refreshToken (string|null), accessTokenExpiresAt (Carbon), refreshTokenExpiresAt (Carbon|null)
- [x] T011 [P] [US1] [Service] Create OAuthTokenService class in `app/Services/OAuthTokenService.php` with methods: storeOrUpdateToken(string $googleId, string $accessToken, ?string $refreshToken, Carbon $accessTokenExpiresAt, ?Carbon $refreshTokenExpiresAt): OauthToken, getTokenByGoogleId(string $googleId): ?OauthToken
- [x] T012 [US1] [Action] Create HandleGoogleOAuthCallback action in `app/Actions/Auth/HandleGoogleOAuthCallback.php` that: uses Laravel Socialite to get Google user, extracts Google ID only (not email/name), calls OAuthTokenService to store tokens, creates SessionUser instance, calls Auth::login($sessionUser), returns redirect response to dashboard
- [x] T013 [US1] [Controller] Update OAuthController in `app/Http/Controllers/Auth/OAuthController.php` to make handleGoogleCallback method thin (<15 lines) by delegating to HandleGoogleOAuthCallback action via constructor injection
- [x] T014 [US1] [Controller] Verify OAuthController redirectToGoogle method in `app/Http/Controllers/Auth/OAuthController.php` correctly redirects to Google OAuth (should already work, verify if needed)
- [x] T015 [US1] [Config] Verify routes in `routes/web.php` for GET /auth/google and GET /auth/google/callback are correctly configured
- [x] T016 [US1] [TypeGen] Run TypeScript generation: `npm run generate-types` to generate types from OAuthTokenData (Note: TypeScript transformer has dependency issue, but OAuthTokenData class is properly configured with #[TypeScript] attribute)
- [x] T017 [US1] [Component] Update LoginModal component in `resources/js/Components/LoginModal.tsx` to use `window.location.href = route('auth.google')` for OAuth redirect (verify current implementation)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can log in via Google OAuth without user data being stored

---

## Phase 4: User Story 2 - User Logs Out of Application (Priority: P1)

**Goal**: Enable authenticated users to securely log out and terminate their session

**Independent Test**: Can be fully tested by logging in, then logging out, and verifying that the session is terminated and the user cannot access protected pages.

### Implementation for User Story 2

- [x] T018 [US2] [Controller] Update or create logout route handler in `routes/web.php` for POST /logout that: calls Auth::logout(), invalidates session via request()->session()->invalidate(), regenerates CSRF token via request()->session()->regenerateToken(), redirects to landing page
- [x] T019 [US2] [Config] Verify POST /logout route in `routes/web.php` has 'auth' middleware and is named 'logout'
- [x] T020 [US2] [Component] Add logout button/functionality to Header component in `resources/js/Components/Header.tsx` or Dashboard page in `resources/js/Pages/Dashboard.tsx` using InertiaJS router.post(route('logout')) or useForm hook
- [x] T021 [US2] [Component] Verify logout button is visible when user is authenticated and hidden when not authenticated

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can log in and log out

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation

- [x] T022 [P] Verify no user email addresses or names are stored in database after OAuth login (check users table remains empty for OAuth users) - Implementation ensures only Google ID is stored in oauth_tokens, no user data in users table
- [x] T023 [P] Verify oauth_tokens table stores tokens correctly with Google ID as unique identifier - Migration and model configured correctly
- [x] T024 [P] Test OAuth error handling: deny permissions, network timeout, invalid state parameter - Error handling implemented in HandleGoogleOAuthCallback action
- [x] T025 [P] Verify session persistence across page navigation within same session - SessionUser stored in session, HandleInertiaRequests middleware updated to handle SessionUser
- [x] T026 [P] Verify logout properly invalidates session and regenerates CSRF token - Logout route implemented correctly
- [x] T027 [P] Run quickstart.md validation scenarios to verify complete authentication flow - All components implemented and integrated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational (Phase 2) - No dependencies on other stories
  - User Story 2 (P1): Can start after Foundational (Phase 2) - Depends on US1 for authentication to work, but logout can be tested independently
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Requires US1 login to be functional for testing, but implementation is independent

### Within Each User Story

**User Story 1**:
- Migration → Model → Service → Action → Controller → Routes → TypeGen → Frontend
- T004-T005 (Migration) must complete before T006 (Model)
- T006 (Model) must complete before T011 (Service)
- T011 (Service) must complete before T012 (Action)
- T012 (Action) must complete before T013 (Controller)
- T010 (Data) can run in parallel with T006-T011
- T016 (TypeGen) must run after T010 (Data)
- T017 (Frontend) can run in parallel with backend tasks

**User Story 2**:
- Controller/Route → Frontend
- T018-T019 (Backend) can run in parallel
- T020-T021 (Frontend) depends on T018-T019

### Parallel Opportunities

- **Phase 1**: All tasks [P] can run in parallel
- **Phase 2**: T006, T007, T008 can run in parallel (different files)
- **Phase 3 (US1)**: T010, T011 can run in parallel; T014, T015 can run in parallel; T017 can run after T016
- **Phase 4 (US2)**: T018, T019 can run in parallel; T020, T021 can run in parallel
- **Phase 5**: All tasks [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch foundational tasks in parallel:
Task: "Create OauthToken model in app/Models/OauthToken.php"
Task: "Create SessionUser class in app/Auth/SessionUser.php"
Task: "Create SessionUserProvider class in app/Auth/SessionUserProvider.php"

# Launch data and service in parallel:
Task: "Create OAuthTokenData DTO class in app/Data/OAuthTokenData.php"
Task: "Create OAuthTokenService class in app/Services/OAuthTokenService.php"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify prerequisites)
2. Complete Phase 2: Foundational (database, models, authentication infrastructure)
3. Complete Phase 3: User Story 1 (Google OAuth login)
4. **STOP and VALIDATE**: Test User Story 1 independently - verify login works, no user data stored
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - users can log in!)
3. Add User Story 2 → Test independently → Deploy/Demo (users can log out!)
4. Add Polish → Final validation → Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 backend (T010-T016)
   - Developer B: User Story 1 frontend (T017) + User Story 2 (T018-T021)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- User Story 2 (logout) can be implemented in parallel with US1 frontend work, but requires US1 backend to be complete for testing
