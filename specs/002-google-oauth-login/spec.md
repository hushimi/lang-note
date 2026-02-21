# Feature Specification: Google OAuth Login Without User Data Storage

**Feature Branch**: `002-google-oauth-login`
**Created**: 2026-02-21
**Status**: Draft
**Input**: User description: "Implement google oauth login - Do not save user mail address - Do not save user name - refer to this web site https://qiita.com/miriwo/items/9ed45134e6f3d6b41105 - Implement logout function - Already got google client id and client secret"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Logs In with Google Account (Priority: P1)

A user wants to access the application using their Google account without creating a separate account or providing personal information.

**Why this priority**: Authentication is the foundation for all user interactions. Without login functionality, users cannot access protected features. This is the primary entry point to the application.

**Independent Test**: Can be fully tested by attempting Google OAuth login flow and verifying successful authentication without any user data being stored in the database. Delivers immediate value by enabling secure access to the application.

**Acceptance Scenarios**:

1. **Given** a user is on the login page, **When** they click "Continue with Google", **Then** they are redirected to Google's OAuth consent screen
2. **Given** a user is on Google's OAuth consent screen, **When** they approve access, **Then** they are redirected back to the application and logged in successfully
3. **Given** a user successfully authenticates with Google, **When** the system processes the OAuth callback, **Then** no user email address or name is stored in the database
4. **Given** a user successfully authenticates with Google, **When** they access protected pages, **Then** they are recognized as authenticated and can access the application
5. **Given** a user attempts to log in with Google, **When** Google authentication fails or is denied, **Then** they are redirected back to the login page with an appropriate error message

---

### User Story 2 - User Logs Out of Application (Priority: P1)

An authenticated user wants to securely log out of the application to end their session.

**Why this priority**: Logout functionality is essential for security and user control. Users must be able to end their session, especially on shared devices. This is a fundamental security requirement.

**Independent Test**: Can be fully tested by logging in, then logging out, and verifying that the session is terminated and the user cannot access protected pages. Delivers value by providing users with control over their authentication state.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and logged in, **When** they click the logout button, **Then** their session is terminated and they are redirected to the public landing page
2. **Given** a user has logged out, **When** they attempt to access protected pages, **Then** they are redirected to the login page
3. **Given** a user has logged out, **When** they attempt to log out again, **Then** the system handles the request gracefully without errors
4. **Given** a user logs out, **When** they return to the application, **Then** they must authenticate again to access protected features

---

### Edge Cases

- What happens when Google OAuth service is temporarily unavailable?
- How does the system handle expired OAuth tokens?
- What happens when a user denies Google OAuth permissions?
- How does the system handle network timeouts during OAuth callback?
- What happens when multiple users attempt to log in simultaneously with the same Google account?
- How does the system handle OAuth token refresh when access tokens expire?

## Architecture Compliance

**Constitution Reference**: [v1.0.0](../.specify/memory/constitution.md)

**Backend Requirements** (Laravel):
- Data flow MUST follow: Controller → Action → Service/Repository → Model
- All data transfer MUST use Laravel Data classes with `#[TypeScript]` attribute
- Controllers MUST be thin (<15 lines typical)
- Actions MUST be invokable, single-purpose classes
- OAuth token storage MUST use a dedicated table (not users table)
- User authentication MUST use a session-based approach without storing user personal data

**Frontend Requirements** (React/InertiaJS):
- All navigation MUST use InertiaJS router (no fetch/axios)
- Components MUST use generated TypeScript types from PHP
- All styling MUST use Tailwind utilities (no inline styles)
- UI primitives MUST use Shadcn/ui components
- Login/logout actions MUST use InertiaJS form submission or router methods

**Type Safety Requirements**:
- NO `any` type in TypeScript (document exceptions)
- NO plain arrays for DTOs (use Data classes)
- ALL PHP methods MUST declare parameter/return types

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via Google OAuth 2.0 without requiring email/password credentials
- **FR-002**: System MUST NOT store user email addresses in any database table
- **FR-003**: System MUST NOT store user names in any database table
- **FR-004**: System MUST store OAuth access tokens and refresh tokens for session management
- **FR-005**: System MUST use Google ID (OAuth subject identifier) as the unique identifier for authenticated sessions
- **FR-006**: System MUST implement a session-based authentication mechanism that does not require user data in the users table
- **FR-007**: System MUST provide a logout function that terminates the user's session
- **FR-008**: System MUST redirect users to Google OAuth consent screen when initiating login
- **FR-009**: System MUST handle OAuth callback from Google and complete authentication flow
- **FR-010**: System MUST redirect authenticated users to the dashboard after successful login
- **FR-011**: System MUST redirect unauthenticated users attempting to access protected pages to the login page
- **FR-012**: System MUST handle OAuth authentication errors gracefully and display appropriate error messages
- **FR-013**: System MUST maintain authentication state across page navigation within the same session
- **FR-014**: System MUST invalidate session and regenerate CSRF token upon logout

### Key Entities *(include if feature involves data)*

- **OAuth Token**: Represents OAuth authentication credentials for a Google account. Contains Google ID (unique identifier), access token, refresh token, and expiration timestamps. Used to maintain authenticated sessions without storing user personal information.

- **Session User**: Represents an authenticated user in the application session. Implements Laravel's Authenticatable contract but does not correspond to a database record. Contains only Google ID for identification purposes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete Google OAuth login flow in under 10 seconds from clicking login button to being authenticated (excluding Google consent screen interaction time)
- **SC-002**: 95% of OAuth login attempts result in successful authentication when user approves Google permissions
- **SC-003**: Users can log out and terminate their session in under 2 seconds
- **SC-004**: System maintains authentication state for 100% of authenticated page requests within the same session
- **SC-005**: Zero user email addresses or names are stored in the database after authentication
- **SC-006**: System handles OAuth errors gracefully with user-friendly error messages in 100% of failure cases

## Assumptions

- Google OAuth client ID and client secret are already configured in the application environment
- Users have active Google accounts and can approve OAuth permissions
- Application uses Laravel Socialite package for OAuth integration
- Session-based authentication is acceptable (no JWT or stateless authentication required)
- OAuth token refresh mechanism will be handled by Laravel Socialite or custom implementation
- Application does not require user profile information (name, email) for core functionality
- Users understand that their Google account is used for authentication only

## Dependencies

- Laravel Socialite package must be installed and configured
- Google OAuth 2.0 credentials (client ID and secret) must be available
- Database migration system must support creating/modifying oauth_tokens table
- Session storage must be configured and functional
- Existing authentication middleware and guards must support custom Authenticatable implementation

## References

- Implementation reference: [Laravel × OAuth2.0 Socialite - ユーザー情報をDBに保存しないソーシャルログイン実装](https://qiita.com/miriwo/items/9ed45134e6f3d6b41105)
- Laravel Socialite documentation
- Google OAuth 2.0 documentation
