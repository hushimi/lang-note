# Implementation Plan: Google OAuth Login Without User Data Storage

**Branch**: `002-google-oauth-login` | **Date**: 2026-02-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-google-oauth-login/spec.md`

## Summary

Implement Google OAuth 2.0 authentication that does not store user email addresses or names in the database. The system will use a session-based authentication mechanism with a custom `SessionUser` class that implements Laravel's `Authenticatable` contract. OAuth tokens (access token, refresh token) will be stored in a dedicated `oauth_tokens` table keyed by Google ID. Users authenticate via Google OAuth flow and can log out to terminate their session. All authentication endpoints will follow clean architecture principles with Actions handling business logic and Data classes for type-safe data transfer.

## Technical Context

**Language/Version**:
- Backend: PHP 8.2+ with Laravel 12
- Frontend: TypeScript 5.9+ with React 19

**Primary Dependencies**:
- Backend: Laravel 12, InertiaJS Laravel ^2.0, Laravel Data ^4.19, TypeScript Transformer ^2.5, Laravel Socialite ^5.24, Ziggy ^2.6
- Frontend: React 19, @inertiajs/react ^2.3, TypeScript ^5.9, Tailwind CSS ^4.1, Shadcn/ui components

**Storage**: MySQL 8.0+ with table prefix `ln_` (existing configuration)
- New table: `oauth_tokens` (stores Google ID, access token, refresh token, expiration timestamps)
- Users table: Remains in schema but not used for OAuth authentication (no user data stored)

**Testing**: PHPUnit for backend (Action unit tests, Feature tests for controllers)

**Target Platform**: Web application (responsive design for desktop, tablet, mobile browsers)

**Project Type**: Web application (monolith with InertiaJS - single codebase, no separate API)

**Performance Goals**:
- OAuth login flow completion: <10 seconds (excluding Google consent screen interaction)
- Logout completion: <2 seconds
- Session state maintenance: 100% reliability within same session

**Constraints**:
- MUST NOT store user email addresses or names in any database table
- MUST use session-based authentication (no JWT or stateless auth)
- MUST use Laravel Socialite for OAuth integration
- MUST follow clean architecture: Controller → Action → Service/Repository → Model
- MUST use Laravel Data classes with TypeScript generation for all DTOs
- MUST use InertiaJS for all frontend-backend communication

**Scale/Scope**:
- 2 new endpoints (login redirect, logout)
- 1 new database table (oauth_tokens)
- 1 new Action class (HandleGoogleOAuthCallback)
- 1 new Service class (OAuthTokenService)
- 1 new Model (OauthToken)
- 1 new Authenticatable implementation (SessionUser)
- 1 new UserProvider (SessionUserProvider)
- 1 new Data class (OAuthTokenData) for TypeScript generation
- Frontend: Update LoginModal to use InertiaJS router, add logout button/functionality

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Review against [Constitution v1.0.0](../.specify/memory/constitution.md):

**Core Principles Alignment**:
- [x] **I. Clean Architecture**: Feature respects Domain/Application/Infrastructure/Presentation layers
  - Presentation: Controllers handle HTTP requests/responses only
  - Application: Actions contain business logic (HandleGoogleOAuthCallback)
  - Domain: Models represent data (OauthToken), SessionUser represents authenticated entity
  - Infrastructure: OAuthTokenService handles external OAuth integration and token storage

- [x] **II. Type Safety**: All DTOs use Laravel Data with TypeScript generation
  - OAuthTokenData class with `#[TypeScript]` attribute
  - All Actions return Data objects
  - Generated TypeScript types used in React components

- [x] **III. Thin Controllers**: Controllers only handle HTTP, Actions contain business logic
  - OAuthController delegates to HandleGoogleOAuthCallback Action
  - Controllers <15 lines, no business logic

- [x] **IV. InertiaJS Monolith**: No separate API, all data via Inertia props
  - Login/logout use InertiaJS router methods
  - No fetch/axios calls
  - All navigation via InertiaJS

- [x] **V. Component Architecture**: Components organized into Pages/UI/Shared categories
  - LoginModal in Components/ (shared component)
  - Uses Shadcn/ui Dialog component
  - Page components extend PageProps

- [x] **VI. Utility-First Styling**: Tailwind utilities only, no custom CSS
  - All styling via Tailwind utility classes
  - Use cn() utility for conditional classes

- [x] **VII. Dependency Injection**: All dependencies via constructor injection
  - Actions inject Services via constructor
  - Controllers inject Actions via constructor
  - No static methods for business logic

**Technology Stack Compliance**:
- [x] Using required packages (Laravel Data, InertiaJS, TypeScript, Tailwind v4)
- [x] Following file organization structure (Actions/, Data/, Pages/, Components/)
- [x] No forbidden patterns (API routes, inline styles, fetch/axios in components)

## Project Structure

### Documentation (this feature)

```text
specs/002-google-oauth-login/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── Actions/
│   └── Auth/
│       └── HandleGoogleOAuthCallback.php    # Business logic for OAuth callback
├── Auth/
│   ├── SessionUser.php                     # Custom Authenticatable implementation
│   └── SessionUserProvider.php              # Custom UserProvider for SessionUser
├── Data/
│   └── OAuthTokenData.php                  # DTO with #[TypeScript] attribute
├── Http/
│   └── Controllers/
│       └── Auth/
│           └── OAuthController.php         # Updated: thin controller, delegates to Action
├── Models/
│   └── OauthToken.php                      # Eloquent model for oauth_tokens table
└── Services/
    └── OAuthTokenService.php               # Service for OAuth token operations

database/
└── migrations/
    ├── YYYY_MM_DD_HHMMSS_create_oauth_tokens_table.php
    └── YYYY_MM_DD_HHMMSS_remove_google_id_from_users_table.php (optional cleanup)

resources/js/
├── Components/
│   └── LoginModal.tsx                      # Updated: use InertiaJS router for login
└── Pages/
    └── Dashboard.tsx                       # Updated: add logout button/functionality

config/
└── auth.php                                # Updated: add SessionUserProvider configuration
```

**Structure Decision**: Single Laravel monolith with InertiaJS. Authentication uses custom SessionUser class that doesn't require database user records. OAuth tokens stored separately in dedicated table.

## Complexity Tracking

> **No violations - all principles followed**

---

## Phase 0: Research Complete

**Status**: ✅ Complete

All research questions resolved. See [research.md](research.md) for detailed technical decisions.

**Key Decisions**:
- Use SessionUser class implementing Authenticatable (no database user records)
- Store OAuth tokens in dedicated oauth_tokens table with google_id
- Create custom SessionUserProvider for authentication
- Use Action class for OAuth callback business logic
- Standard Laravel logout pattern
- OAuthTokenData class for TypeScript generation
- InertiaJS for frontend integration (OAuth redirect uses window.location.href)

---

## Phase 1: Design & Contracts Complete

**Status**: ✅ Complete

### Data Model

See [data-model.md](data-model.md) for:
- OAuthToken entity (database table structure)
- SessionUser entity (session-only, no database)
- OAuthTokenData DTO (with TypeScript generation)
- Database schema and migration strategy

### Contracts

See [contracts/routes.md](contracts/routes.md) for:
- GET /auth/google (OAuth redirect)
- GET /auth/google/callback (OAuth callback handler)
- POST /logout (logout endpoint)
- Frontend integration patterns

### Quickstart Guide

See [quickstart.md](quickstart.md) for:
- Step-by-step implementation guide
- Integration scenarios
- Configuration checklist
- Verification steps
- Troubleshooting guide

---

## Implementation Summary

### Backend Components

1. **Database**:
   - New table: `oauth_tokens` (stores Google ID, access token, refresh token, expiration dates)
   - No changes to `users` table required

2. **Models**:
   - `OauthToken` (Eloquent model)
   - `SessionUser` (Authenticatable implementation, not a model)

3. **Services**:
   - `OAuthTokenService` (token storage/retrieval operations)

4. **Actions**:
   - `HandleGoogleOAuthCallback` (OAuth callback business logic)

5. **Controllers**:
   - `OAuthController` (updated: thin controller, delegates to Action)

6. **Authentication**:
   - `SessionUserProvider` (custom UserProvider)
   - `config/auth.php` updates (register provider)

7. **Data Classes**:
   - `OAuthTokenData` (with `#[TypeScript]` attribute)

### Frontend Components

1. **Components**:
   - `LoginModal.tsx` (updated: OAuth redirect via window.location.href)
   - Logout button/functionality (new or updated)

2. **TypeScript**:
   - Generated types from OAuthTokenData
   - Updated PageProps if needed

### Routes

- `GET /auth/google` (OAuth redirect)
- `GET /auth/google/callback` (OAuth callback)
- `POST /logout` (logout)

---

## Next Steps

**Ready for**: `/speckit.tasks` - Create task breakdown for implementation

**Prerequisites Met**:
- ✅ Research complete (all questions resolved)
- ✅ Data model defined
- ✅ Contracts defined
- ✅ Quickstart guide created
- ✅ Constitution compliance verified
- ✅ Agent context updated
