# Research: Google OAuth Login Without User Data Storage

**Feature**: Google OAuth Login Without User Data Storage
**Date**: 2026-02-21
**Reference**: [Laravel × OAuth2.0 Socialite - ユーザー情報をDBに保存しないソーシャルログイン実装](https://qiita.com/miriwo/items/9ed45134e6f3d6b41105)

## Research Questions

### 1. How to implement authentication without storing user data in users table?

**Decision**: Use a custom `SessionUser` class that implements Laravel's `Authenticatable` contract without requiring a database record.

**Rationale**:
- Laravel's authentication system is flexible and allows custom Authenticatable implementations
- SessionUser can store only Google ID in session, not requiring database user records
- This approach maintains compatibility with Laravel's Auth facade and middleware
- Session-based authentication is acceptable per requirements (no JWT needed)

**Alternatives considered**:
- JWT tokens: Rejected - requires stateless authentication, adds complexity, not needed for session-based approach
- Custom guard with database lookup: Rejected - still requires user records, defeats the purpose
- Stateless session tokens: Rejected - adds unnecessary complexity, session-based is simpler

**Implementation approach**:
- Create `SessionUser` class implementing `Illuminate\Contracts\Auth\Authenticatable`
- Implement required methods: `getAuthIdentifierName()`, `getAuthIdentifier()`, `getAuthPassword()` (return null), `getRememberToken()` (return null), `setRememberToken()`, `getRememberTokenName()`
- Store Google ID as the authentication identifier
- Create custom `SessionUserProvider` that retrieves SessionUser instances from session

**Reference**: Qiita article shows complete SessionUser implementation pattern

---

### 2. How to store OAuth tokens without user_id foreign key?

**Decision**: Create `oauth_tokens` table with `google_id` as the primary identifier instead of `user_id`.

**Rationale**:
- Google ID is unique and stable identifier from OAuth provider
- No need for foreign key to users table since we're not storing user data
- Allows token lookup directly by Google ID
- Supports token refresh and expiration management

**Alternatives considered**:
- Store tokens in session only: Rejected - tokens would be lost on session expiration, no refresh capability
- Store tokens with user_id: Rejected - requires user records, violates requirement
- Store tokens in cache: Rejected - less persistent, harder to manage expiration

**Table structure**:
```sql
oauth_tokens:
  - id (primary key)
  - google_id (unique, indexed) - Google OAuth subject identifier
  - access_token (required)
  - refresh_token (nullable)
  - access_token_expires_at (required)
  - refresh_token_expires_at (nullable)
  - created_at, updated_at
```

**Reference**: Qiita article shows oauth_tokens table structure without user_id

---

### 3. How to configure Laravel authentication to use SessionUser?

**Decision**: Create custom UserProvider and register it in `config/auth.php`.

**Rationale**:
- Laravel's authentication system uses providers to retrieve users
- Custom provider allows returning SessionUser instances instead of Eloquent models
- Maintains compatibility with existing Auth facade and middleware
- Can reuse existing 'web' guard with custom provider

**Alternatives considered**:
- Custom guard: Rejected - adds unnecessary complexity, existing web guard works fine
- Override default provider globally: Rejected - might affect other features, too broad
- Middleware-only approach: Rejected - doesn't integrate with Auth facade properly

**Implementation approach**:
- Create `SessionUserProvider` implementing `Illuminate\Contracts\Auth\UserProvider`
- Implement `retrieveById()`, `retrieveByToken()`, `updateRememberToken()`, `retrieveByCredentials()`, `validateCredentials()`
- Register provider in `config/auth.php` as 'session-users' provider
- Update 'web' guard to use 'session-users' provider (or create new guard if needed)

**Reference**: Laravel documentation on custom user providers

---

### 4. How to handle OAuth callback and create session?

**Decision**: Use Action class `HandleGoogleOAuthCallback` that processes OAuth response, stores tokens, creates SessionUser, and logs in.

**Rationale**:
- Follows clean architecture: Controller → Action → Service
- Action contains all business logic for OAuth processing
- Service handles token storage operations
- Controller remains thin (<15 lines)

**Alternatives considered**:
- Put logic directly in controller: Rejected - violates thin controller principle
- Use repository pattern: Rejected - overkill for single table operations, Service is sufficient
- Event-driven approach: Rejected - adds complexity without clear benefit

**Implementation flow**:
1. Controller receives OAuth callback request
2. Controller calls `HandleGoogleOAuthCallback` Action
3. Action uses Laravel Socialite to get Google user data
4. Action calls `OAuthTokenService` to store/update tokens in database
5. Action creates `SessionUser` instance with Google ID
6. Action calls `Auth::login($sessionUser)` to establish session
7. Action returns redirect response to dashboard

**Reference**: Qiita article shows OAuth callback handling pattern

---

### 5. How to implement logout functionality?

**Decision**: Create logout endpoint that calls `Auth::logout()`, invalidates session, and regenerates CSRF token.

**Rationale**:
- Standard Laravel logout pattern works with SessionUser
- Session invalidation ensures complete logout
- CSRF token regeneration prevents token reuse attacks
- Simple, secure, and follows Laravel best practices

**Alternatives considered**:
- Delete OAuth tokens on logout: Rejected - tokens may be needed for future sessions, unnecessary
- Clear all session data manually: Rejected - `Auth::logout()` handles this properly
- Custom logout logic: Rejected - standard Laravel logout is sufficient

**Implementation approach**:
- Create POST route `/logout` (or use existing if present)
- Controller calls `Auth::logout()`
- Controller invalidates session: `request()->session()->invalidate()`
- Controller regenerates CSRF token: `request()->session()->regenerateToken()`
- Controller redirects to landing page

**Reference**: Laravel authentication documentation

---

### 6. How to generate TypeScript types for OAuth token data?

**Decision**: Create `OAuthTokenData` Laravel Data class with `#[TypeScript]` attribute.

**Rationale**:
- Follows project constitution requirement for type-safe DTOs
- Enables automatic TypeScript generation
- Provides type safety in frontend
- Consistent with existing patterns

**Alternatives considered**:
- Manual TypeScript interfaces: Rejected - violates constitution, prone to drift
- No types for OAuth data: Rejected - reduces type safety, violates requirements

**Data class structure**:
```php
#[TypeScript]
class OAuthTokenData extends Data
{
    public function __construct(
        public string $googleId,
        public string $accessToken,
        public ?string $refreshToken,
        public Carbon $accessTokenExpiresAt,
        public ?Carbon $refreshTokenExpiresAt,
    ) {}
}
```

**Reference**: Project constitution and existing Data class patterns

---

### 7. How to update frontend to use InertiaJS for login/logout?

**Decision**: Update LoginModal to use `router.visit()` for OAuth redirect and InertiaJS form for logout.

**Rationale**:
- Follows InertiaJS monolith pattern (no fetch/axios)
- Maintains SPA experience
- Consistent with project architecture
- Simple implementation

**Alternatives considered**:
- Use window.location.href: Rejected - causes full page reload, breaks SPA experience
- Use fetch/axios: Rejected - violates InertiaJS monolith pattern
- Use InertiaJS Link: Rejected - OAuth redirect must be full redirect, not SPA navigation

**Implementation approach**:
- Login: Use `window.location.href = '/auth/google'` (OAuth requires full redirect)
- Logout: Use InertiaJS form with `router.post('/logout')` or `useForm` hook
- Handle redirects via InertiaJS `router.visit()` after OAuth callback

**Reference**: InertiaJS documentation and project constitution

---

## Technical Decisions Summary

| Decision | Approach | Rationale |
|----------|----------|-----------|
| Authentication without user data | SessionUser class implementing Authenticatable | Maintains Laravel Auth compatibility without database user records |
| Token storage | oauth_tokens table with google_id | Persistent storage with proper expiration management |
| User provider | Custom SessionUserProvider | Enables SessionUser retrieval from session |
| OAuth callback handling | Action class with Service | Follows clean architecture principles |
| Logout | Standard Laravel logout pattern | Simple, secure, follows best practices |
| TypeScript types | OAuthTokenData with #[TypeScript] | Type safety and code generation |
| Frontend integration | InertiaJS router and forms | Maintains SPA experience, follows architecture |

## Dependencies & Prerequisites

- Laravel Socialite package: Already installed (per assumptions)
- Google OAuth credentials: Already configured (per requirements)
- Session storage: Must be configured and functional
- Database: Must support creating oauth_tokens table
- TypeScript transformer: Already installed for type generation

## Open Questions Resolved

All research questions have been resolved. No remaining clarifications needed.
