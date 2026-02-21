# Quickstart: Google OAuth Login Without User Data Storage

**Feature**: Google OAuth Login Without User Data Storage
**Date**: 2026-02-21

## Overview

This feature implements Google OAuth 2.0 authentication that does not store user email addresses or names in the database. Authentication uses a session-based approach with a custom `SessionUser` class, and OAuth tokens are stored in a dedicated `oauth_tokens` table.

## Prerequisites

- Laravel 12 application
- Laravel Socialite package installed
- Google OAuth 2.0 credentials configured (client ID and secret)
- Database migration system ready
- Session storage configured

## Implementation Steps

### 1. Database Setup

**Create oauth_tokens table migration**:
```bash
php artisan make:migration create_oauth_tokens_table
```

**Migration content** (see `data-model.md` for full schema):
- `id` (primary key)
- `google_id` (unique, indexed)
- `access_token` (required)
- `refresh_token` (nullable)
- `access_token_expires_at` (required)
- `refresh_token_expires_at` (nullable)
- `created_at`, `updated_at`

**Run migration**:
```bash
php artisan migrate
```

---

### 2. Create Models and Services

**Create OauthToken model**:
```bash
php artisan make:model OauthToken
```

**Create OAuthTokenService**:
```bash
# Manual creation in app/Services/OAuthTokenService.php
```

**Service responsibilities**:
- Store OAuth tokens in database
- Retrieve tokens by Google ID
- Update tokens (for refresh)
- Handle token expiration

---

### 3. Create SessionUser and Provider

**Create SessionUser class**:
- Location: `app/Auth/SessionUser.php`
- Implements `Illuminate\Contracts\Auth\Authenticatable`
- Stores only Google ID

**Create SessionUserProvider**:
- Location: `app/Auth/SessionUserProvider.php`
- Implements `Illuminate\Contracts\Auth\UserProvider`
- Retrieves SessionUser from session

**Update auth.php configuration**:
- Register `SessionUserProvider` as 'session-users' provider
- Update 'web' guard to use 'session-users' provider (or create new guard)

---

### 4. Create Action and Update Controller

**Create HandleGoogleOAuthCallback Action**:
```bash
php artisan make:action Auth/HandleGoogleOAuthCallback
```

**Action responsibilities**:
- Process OAuth callback from Google
- Exchange authorization code for tokens
- Store tokens via OAuthTokenService
- Create SessionUser instance
- Log in user via Auth::login()

**Update OAuthController**:
- Keep `redirectToGoogle()` method (unchanged)
- Update `handleGoogleCallback()` to delegate to Action
- Controller should be <15 lines

---

### 5. Create Data Class for TypeScript

**Create OAuthTokenData**:
```bash
# Manual creation in app/Data/OAuthTokenData.php
```

**Add TypeScript attribute**:
```php
#[TypeScript]
class OAuthTokenData extends Data
{
    // Properties: googleId, accessToken, refreshToken, etc.
}
```

**Generate TypeScript types**:
```bash
npm run generate-types
```

---

### 6. Update Frontend Components

**Update LoginModal.tsx**:
- Ensure OAuth redirect uses `window.location.href = route('auth.google')`
- Verify button triggers redirect correctly

**Add logout functionality**:
- Add logout button to Header or Dashboard
- Use InertiaJS `router.post()` or `useForm` hook
- Call `route('logout')` endpoint

---

### 7. Test Authentication Flow

**Test login flow**:
1. Navigate to landing page
2. Click "Continue with Google" button
3. Approve Google OAuth permissions
4. Verify redirect to dashboard
5. Verify session is established
6. Verify no user data in users table
7. Verify tokens stored in oauth_tokens table

**Test logout flow**:
1. While authenticated, click logout button
2. Verify redirect to landing page
3. Verify session is terminated
4. Attempt to access protected page
5. Verify redirect to login

---

## Integration Scenarios

### Scenario 1: First-Time User Login

**Steps**:
1. User visits landing page
2. User clicks "Continue with Google"
3. Redirected to Google OAuth consent screen
4. User approves permissions
5. Redirected back to application
6. System processes callback:
   - Retrieves Google ID from OAuth response
   - Stores OAuth tokens in `oauth_tokens` table (new record)
   - Creates SessionUser with Google ID
   - Establishes session via `Auth::login()`
7. User redirected to dashboard
8. User is authenticated and can access protected pages

**Database State**:
- `oauth_tokens` table: 1 new record with Google ID and tokens
- `users` table: No new records (no user data stored)

**Session State**:
- SessionUser instance stored in session
- Authentication state: authenticated
- Google ID available via `Auth::id()`

---

### Scenario 2: Returning User Login

**Steps**:
1. User visits landing page (previous session expired)
2. User clicks "Continue with Google"
3. Redirected to Google OAuth consent screen
4. User approves permissions (or auto-approves if previously approved)
5. Redirected back to application
6. System processes callback:
   - Retrieves Google ID from OAuth response
   - Updates existing OAuth tokens in `oauth_tokens` table (same Google ID)
   - Creates SessionUser with Google ID
   - Establishes session via `Auth::login()`
7. User redirected to dashboard

**Database State**:
- `oauth_tokens` table: Existing record updated with new tokens
- `users` table: No changes (still no user data)

**Session State**:
- New SessionUser instance in session
- Authentication state: authenticated

---

### Scenario 3: User Logout

**Steps**:
1. User is authenticated and on dashboard
2. User clicks logout button
3. System processes logout:
   - Calls `Auth::logout()`
   - Invalidates session
   - Regenerates CSRF token
4. User redirected to landing page
5. User attempts to access protected page
6. System redirects to login (not authenticated)

**Database State**:
- `oauth_tokens` table: No changes (tokens remain for future use)
- `users` table: No changes

**Session State**:
- Session invalidated
- Authentication state: unauthenticated
- CSRF token regenerated

---

### Scenario 4: OAuth Error Handling

**Steps**:
1. User clicks "Continue with Google"
2. Redirected to Google OAuth
3. User denies permissions OR OAuth service error occurs
4. Redirected back to application with error
5. System handles error:
   - Catches exception
   - Stores error message in flash
   - Redirects to landing page
6. Landing page displays error message

**Database State**:
- `oauth_tokens` table: No changes
- `users` table: No changes

**Session State**:
- No authentication established
- Error message in flash data

---

## Configuration Checklist

### Laravel Configuration

- [ ] `config/services.php`: Google OAuth credentials configured
- [ ] `config/auth.php`: SessionUserProvider registered
- [ ] `config/auth.php`: Web guard uses SessionUserProvider
- [ ] Session driver configured (file/database/redis)
- [ ] CSRF protection enabled (default)

### Environment Variables

- [ ] `GOOGLE_CLIENT_ID`: Set to Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET`: Set to Google OAuth client secret
- [ ] `GOOGLE_REDIRECT_URL`: Set to `http://localhost:8000/auth/google/callback` (or production URL)

### Database

- [ ] `oauth_tokens` table created via migration
- [ ] Migration executed successfully
- [ ] Table has correct structure (see data-model.md)

### Frontend

- [ ] LoginModal component updated for OAuth redirect
- [ ] Logout button/functionality added
- [ ] TypeScript types generated (`npm run generate-types`)
- [ ] No TypeScript errors

---

## Verification Steps

### Backend Verification

1. **Database Check**:
   ```bash
   # Verify oauth_tokens table exists
   php artisan tinker
   >>> Schema::hasTable('oauth_tokens'); // Should return true
   ```

2. **Authentication Check**:
   ```bash
   # Verify SessionUserProvider is registered
   # Check config/auth.php for 'session-users' provider
   ```

3. **Route Check**:
   ```bash
   php artisan route:list | grep auth
   # Should show: auth.google, auth.google.callback, logout
   ```

### Frontend Verification

1. **TypeScript Types**:
   ```bash
   npm run type-check
   # Should pass without errors
   ```

2. **Component Check**:
   - LoginModal renders correctly
   - Logout button visible when authenticated
   - No console errors

### Integration Verification

1. **Login Flow**:
   - Complete OAuth flow
   - Check database: `oauth_tokens` has record, `users` has no new records
   - Check session: User authenticated

2. **Logout Flow**:
   - Click logout
   - Check session: User not authenticated
   - Attempt protected page: Redirects to login

---

## Troubleshooting

### OAuth Redirect Not Working

- Check `GOOGLE_REDIRECT_URL` matches Google Cloud Console configuration
- Verify Google OAuth credentials are correct
- Check Laravel Socialite configuration

### Session Not Persisting

- Verify session driver is configured correctly
- Check session storage permissions (if file driver)
- Verify middleware order (session middleware must be active)

### TypeScript Generation Fails

- Ensure `#[TypeScript]` attribute is present on OAuthTokenData
- Check TypeScript transformer package is installed
- Verify PHP Data class syntax is correct

### Authentication Not Working

- Verify SessionUserProvider is registered in `config/auth.php`
- Check guard configuration uses correct provider
- Verify SessionUser implements all required Authenticatable methods

---

## Next Steps After Implementation

1. Test all authentication flows
2. Verify no user data is stored in database
3. Test logout functionality
4. Verify TypeScript types are generated correctly
5. Update documentation if needed
6. Consider adding token refresh logic (if needed for long sessions)
