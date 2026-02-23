# Authentication Flow Diagram: Google OAuth Login & Logout

**Feature**: Google OAuth Login Without User Data Storage
**Date**: 2026-02-22
**Purpose**: Visual documentation of login and logout flows showing which classes are used at each step

---

## 🔐 Google OAuth Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW DIAGRAM                           │
└─────────────────────────────────────────────────────────────────┘

1. FRONTEND: User clicks "Googleで続ける" button
   └─> LoginModal.tsx
       └─> handleGoogleLogin()
           └─> window.location.href = route('auth.google')
               └─> Full page redirect (OAuth requires this)

2. ROUTE: GET /auth/google
   └─> routes/web.php
       └─> OAuthController@redirectToGoogle

3. CONTROLLER: OAuthController::redirectToGoogle()
   └─> app/Http/Controllers/Auth/OAuthController.php
       └─> Uses: Laravel\Socialite\Facades\Socialite
           └─> Socialite::driver('google')->redirect()
               └─> Redirects to Google OAuth consent screen

4. USER ACTION: User approves permissions on Google
   └─> Google redirects back with authorization code
       └─> GET /auth/google/callback?code=XXX&state=YYY

5. ROUTE: GET /auth/google/callback
   └─> routes/web.php
       └─> OAuthController@handleGoogleCallback

6. CONTROLLER: OAuthController::handleGoogleCallback()
   └─> app/Http/Controllers/Auth/OAuthController.php
       └─> Delegates to: HandleGoogleOAuthCallback Action
           └─> ($this->handleGoogleOAuthCallback)()

7. ACTION: HandleGoogleOAuthCallback::__invoke()
   └─> app/Actions/Auth/HandleGoogleOAuthCallback.php
       │
       ├─> Step 7a: Get Google user data
       │   └─> Socialite::driver('google')->user()
       │       └─> Returns: Google user object with ID, tokens, etc.
       │
       ├─> Step 7b: Extract Google ID only (NOT email/name)
       │   └─> $googleId = $googleUser->getId()
       │
       ├─> Step 7c: Store OAuth tokens in database
       │   └─> OAuthTokenService::storeOrUpdateToken()
       │       └─> app/Services/OAuthTokenService.php
       │           └─> Uses: OauthToken Model
       │               └─> app/Models/OauthToken.php
       │                   └─> OauthToken::updateOrCreate()
       │                       └─> Saves to: oauth_tokens table
       │                           └─> Fields: google_id, access_token,
       │                               refresh_token, expires_at
       │
       ├─> Step 7d: Create SessionUser instance
       │   └─> new SessionUser($googleId)
       │       └─> app/Auth/SessionUser.php
       │           └─> Implements: Authenticatable
       │               └─> Stores: Only Google ID (no email/name)
       │
       ├─> Step 7e: Store Google ID in session
       │   └─> session(['auth.google_id' => $googleId])
       │       └─> For SessionUserProvider to retrieve later
       │
       └─> Step 7f: Log in user
           └─> Auth::login($sessionUser, true)
               └─> Uses: SessionUserProvider (registered in AppServiceProvider)
                   └─> app/Auth/SessionUserProvider.php
                       └─> Implements: UserProvider
                           └─> retrieveById() reads from session

8. REDIRECT: To dashboard
   └─> redirect()->intended('/')

9. MIDDLEWARE: HandleInertiaRequests
   └─> app/Http/Middleware/HandleInertiaRequests.php
       └─> share() method
           └─> Reads: $request->user() (SessionUser instance)
           └─> Shares: auth.user data to frontend
               └─> Only Google ID (no email/name)

10. FRONTEND: Dashboard renders
    └─> resources/js/Pages/Dashboard.tsx
        └─> Receives: auth.user from Inertia props
            └─> Shows: Welcome message (no name, since SessionUser has none)
```

---

## 🚪 Logout Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOGOUT FLOW DIAGRAM                          │
└─────────────────────────────────────────────────────────────────┘

1. FRONTEND: User clicks "Logout" button
   └─> Header.tsx
       └─> handleLogout()
           └─> router.post(route('logout'))
               └─> InertiaJS POST request

2. ROUTE: POST /logout
   └─> routes/web.php
       └─> Middleware: ['auth'] (must be authenticated)
       └─> Inline closure handler

3. ROUTE HANDLER: Logout logic
   └─> routes/web.php (inline closure)
       │
       ├─> Step 3a: Logout user
       │   └─> auth()->logout()
       │       └─> Clears SessionUser from session
       │
       ├─> Step 3b: Invalidate session
       │   └─> request()->session()->invalidate()
       │       └─> Destroys entire session
       │
       ├─> Step 3c: Regenerate CSRF token
       │   └─> request()->session()->regenerateToken()
       │       └─> Prevents CSRF token reuse attacks
       │
       └─> Step 3d: Redirect to landing page
           └─> redirect('/')

4. FRONTEND: Landing page renders
   └─> User is now logged out
       └─> Header shows "Login" button instead of user info
```

---

## 📊 Class Usage Map

### Classes Used During Login

| Class                       | Role                           | When Used                                      |
| --------------------------- | ------------------------------ | ---------------------------------------------- |
| `LoginModal.tsx`            | Frontend UI component          | User clicks login button                       |
| `OAuthController`           | HTTP request handler           | Receives OAuth redirect and callback           |
| `HandleGoogleOAuthCallback` | Business logic (Action)        | Orchestrates entire OAuth callback process     |
| `OAuthTokenService`         | Token management service       | Stores/updates OAuth tokens                    |
| `OauthToken` (Model)        | Database model                 | Accesses `oauth_tokens` table                  |
| `SessionUser`               | Authenticatable implementation | Represents authenticated user (Google ID only) |
| `SessionUserProvider`       | User provider                  | Retrieves user from session when Auth needs it |
| `HandleInertiaRequests`     | Middleware                     | Shares auth data to frontend via Inertia       |

### Classes Used During Logout

| Class            | Role                  | When Used                 |
| ---------------- | --------------------- | ------------------------- |
| `Header.tsx`     | Frontend UI component | User clicks logout button |
| `routes/web.php` | Route definition      | Logout endpoint handler   |

---

## 🔑 Key Points

### 1. SessionUser Does NOT Use Database Records

- **No database record**: SessionUser exists only in session
- **Only Google ID stored**: No email, name, or other personal data
- **Session-based**: Authentication state maintained via Laravel session

### 2. OAuthTokenService Stores Only Tokens

- **Database table**: `oauth_tokens` stores Google ID and tokens
- **No user data**: Email addresses and names are NOT stored
- **Token management**: Handles access token and refresh token storage

### 3. SessionUserProvider Retrieves from Session

- **Session lookup**: `retrieveById()` reads from `session('auth.google_id')`
- **No database queries**: Does not query users table
- **Laravel Auth integration**: Works seamlessly with Laravel's Auth facade

### 4. Logout is Simple and Secure

- **Session invalidation**: Completely destroys session
- **CSRF protection**: Regenerates CSRF token
- **Token persistence**: OAuth tokens remain in database (for future logins)

---

## 🔄 Data Flow Summary

### Login Data Flow

```
Google OAuth
    ↓
Socialite (gets user data)
    ↓
Extract Google ID only
    ↓
OAuthTokenService → OauthToken Model → oauth_tokens table
    ↓
Create SessionUser (Google ID only)
    ↓
Store Google ID in session
    ↓
Auth::login() → SessionUserProvider → Session
    ↓
HandleInertiaRequests → Frontend (auth.user)
```

### Logout Data Flow

```
Frontend (Logout button)
    ↓
POST /logout
    ↓
auth()->logout() → Clear session
    ↓
session()->invalidate() → Destroy session
    ↓
session()->regenerateToken() → New CSRF token
    ↓
Redirect to landing page
```

---

## 📁 File Locations Reference

### Backend Files

- **Controller**: `app/Http/Controllers/Auth/OAuthController.php`
- **Action**: `app/Actions/Auth/HandleGoogleOAuthCallback.php`
- **Service**: `app/Services/OAuthTokenService.php`
- **Model**: `app/Models/OauthToken.php`
- **Auth Classes**:
  - `app/Auth/SessionUser.php`
  - `app/Auth/SessionUserProvider.php`
- **Middleware**: `app/Http/Middleware/HandleInertiaRequests.php`
- **Provider**: `app/Providers/AppServiceProvider.php`
- **Routes**: `routes/web.php`
- **Config**: `config/auth.php`

### Frontend Files

- **Login Modal**: `resources/js/Components/LoginModal.tsx`
- **Header**: `resources/js/Components/Header.tsx`
- **Dashboard**: `resources/js/Pages/Dashboard.tsx`

### Database

- **Migration**: `database/migrations/2026_02_22_011637_create_oauth_tokens_table.php`
- **Table**: `oauth_tokens` (stores Google ID and tokens only)

---

## 🎯 Architecture Principles

This implementation follows clean architecture principles:

1. **Thin Controllers**: `OAuthController` delegates to Action (<15 lines)
2. **Business Logic in Actions**: `HandleGoogleOAuthCallback` contains all OAuth logic
3. **Service Layer**: `OAuthTokenService` handles token operations
4. **No User Data Storage**: Only Google ID and tokens stored (no email/name)
5. **Session-Based Auth**: Uses Laravel session, not database user records
6. **Type Safety**: `OAuthTokenData` DTO with TypeScript generation support

---

## 🔍 Debugging Tips

### Check Session Data

```php
// In any controller or action
dd(session('auth.google_id')); // Should show Google ID if logged in
```

### Check OAuth Tokens

```php
// In tinker or controller
$token = \App\Models\OauthToken::first();
dd($token->google_id, $token->access_token);
```

### Check Auth User

```php
// In any authenticated route
dd(auth()->user()); // Should return SessionUser instance
dd(auth()->id()); // Should return Google ID
```

### Check SessionUserProvider

```php
// Verify provider is registered
$provider = Auth::createUserProvider('session-users');
dd($provider); // Should be SessionUserProvider instance
```

---

## 📚 Related Documentation

- [Specification](spec.md) - Feature requirements and user stories
- [Implementation Plan](plan.md) - Technical architecture and decisions
- [Data Model](data-model.md) - Database schema and entities
- [Quickstart Guide](quickstart.md) - Step-by-step implementation guide
- [Route Contracts](contracts/routes.md) - API endpoint specifications
- [Research](research.md) - Technical decisions and rationale

---

**Last Updated**: 2026-02-22
