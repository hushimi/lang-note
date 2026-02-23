# Data Model: Google OAuth Login Without User Data Storage

**Feature**: Google OAuth Login Without User Data Storage
**Date**: 2026-02-21

## Entities

### OAuthToken

**Purpose**: Stores OAuth authentication tokens for Google accounts without requiring user personal information.

**Table**: `oauth_tokens`

**Fields**:

| Field | Type | Attributes | Description |
|-------|------|------------|-------------|
| `id` | `bigint unsigned` | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the token record |
| `google_id` | `varchar(255)` | NOT NULL, UNIQUE, INDEXED | Google OAuth subject identifier (unique per Google account) |
| `access_token` | `varchar(255)` | NOT NULL | OAuth access token for API requests |
| `refresh_token` | `varchar(255)` | NULLABLE | OAuth refresh token for obtaining new access tokens |
| `access_token_expires_at` | `datetime` | NOT NULL | Expiration timestamp for access token |
| `refresh_token_expires_at` | `datetime` | NULLABLE | Expiration timestamp for refresh token (if applicable) |
| `created_at` | `timestamp` | NULLABLE | Record creation timestamp |
| `updated_at` | `timestamp` | NULLABLE | Record last update timestamp |

**Relationships**:
- None (intentionally decoupled from users table)

**Validation Rules**:
- `google_id`: Required, must be unique, format validated by Google OAuth response
- `access_token`: Required, non-empty string
- `refresh_token`: Optional, but recommended for long-lived sessions
- `access_token_expires_at`: Required, must be future datetime
- `refresh_token_expires_at`: Optional, must be future datetime if provided

**State Transitions**:
- **Created**: When user first authenticates via Google OAuth
- **Updated**: When access token is refreshed (new access_token and access_token_expires_at)
- **Deleted**: When user explicitly revokes access (optional, not required for logout)

**Business Rules**:
- One `google_id` can have only one active token record (unique constraint)
- Access tokens expire and must be refreshed using refresh_token
- Refresh tokens may expire (depending on Google OAuth configuration)
- Token records persist across sessions (not deleted on logout)

---

### SessionUser

**Purpose**: Represents an authenticated user in the application session without requiring a database record.

**Type**: PHP Class (not a database entity)

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `googleId` | `string` | Google OAuth subject identifier (used as authentication identifier) |

**Relationships**:
- None (session-only entity, not persisted)

**Validation Rules**:
- `googleId`: Required, non-empty string, must match format from Google OAuth

**State Transitions**:
- **Created**: When OAuth callback succeeds and SessionUser is instantiated
- **Authenticated**: When `Auth::login($sessionUser)` is called
- **Destroyed**: When session expires or user logs out

**Business Rules**:
- SessionUser exists only in active session
- Google ID is the sole identifier (no email, name, or other personal data)
- SessionUser implements `Illuminate\Contracts\Auth\Authenticatable`
- Authentication state is maintained via Laravel session

---

## Data Transfer Objects

### OAuthTokenData

**Purpose**: Type-safe DTO for OAuth token information, exposed to frontend via TypeScript generation.

**Class**: `App\Data\OAuthTokenData`

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `googleId` | `string` | Google OAuth subject identifier |
| `accessToken` | `string` | OAuth access token (may be hidden in some contexts) |
| `refreshToken` | `string \| null` | OAuth refresh token (nullable) |
| `accessTokenExpiresAt` | `Carbon` | Expiration timestamp for access token |
| `refreshTokenExpiresAt` | `Carbon \| null` | Expiration timestamp for refresh token (nullable) |

**TypeScript Generation**: Yes (`#[TypeScript]` attribute)

**Usage**:
- Returned from Actions when token information is needed
- Used in frontend for type-safe token handling (if exposed)
- Note: Access tokens typically not exposed to frontend for security

---

## Database Schema Changes

### New Table: oauth_tokens

```sql
CREATE TABLE oauth_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL UNIQUE,
    access_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NULL,
    access_token_expires_at DATETIME NOT NULL,
    refresh_token_expires_at DATETIME NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Optional: Remove google_id from users table

**Decision**: Keep `google_id` column in users table for now (may be used by other features). No migration needed unless explicitly cleaning up.

**Rationale**:
- Removing column requires data migration if any existing data exists
- Column doesn't interfere with new OAuth implementation
- Can be removed in future cleanup if confirmed unused

---

## Authentication Flow Data

### OAuth Callback Request

**Source**: Google OAuth provider redirect

**Data Received**:
- Authorization code (temporary, exchanged for tokens)
- State parameter (CSRF protection)

**Processing**:
1. Exchange authorization code for access token + refresh token
2. Retrieve Google user info (ID only, not email/name)
3. Store tokens in `oauth_tokens` table
4. Create SessionUser with Google ID
5. Establish session via `Auth::login()`

### Session Data

**Stored in Laravel Session**:
- SessionUser instance (serialized)
- CSRF token
- Authentication state

**Not Stored**:
- User email address
- User name
- User avatar
- Any personal information

---

## Validation & Constraints

### OAuthToken Model

**Database Constraints**:
- `google_id` must be unique (enforced by database)
- `access_token` cannot be null
- `access_token_expires_at` must be future datetime

**Application-Level Validation**:
- Google ID format validation (from OAuth response)
- Token expiration checking before use
- Refresh token validation before refresh attempts

### SessionUser

**Validation**:
- Google ID must be non-empty string
- Google ID must match pattern from Google OAuth (typically numeric string)
- SessionUser can only be created after successful OAuth callback

---

## Migration Strategy

**Fresh Migration Approach**:
- Create `oauth_tokens` table migration
- No changes to `users` table required (google_id column can remain)
- Migration is backward compatible (doesn't break existing functionality)

**Data Migration**:
- No data migration needed (new feature, no existing OAuth tokens)
- Existing users table data remains unchanged
- New OAuth flow uses separate oauth_tokens table

---

## Security Considerations

### Token Storage

- Access tokens stored in database (encrypted at rest if database encryption enabled)
- Refresh tokens stored securely (same as access tokens)
- Tokens never exposed to frontend (server-side only)
- Token expiration enforced at application level

### Session Security

- SessionUser contains only Google ID (no sensitive data)
- Session data stored in Laravel session (encrypted by default)
- CSRF protection via Laravel middleware
- Session invalidation on logout

### OAuth Security

- State parameter validation for CSRF protection
- Token refresh handled securely server-side
- No user personal data stored or transmitted unnecessarily
