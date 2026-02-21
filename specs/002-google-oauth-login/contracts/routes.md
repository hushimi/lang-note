# Route Contracts: Google OAuth Login

**Feature**: Google OAuth Login Without User Data Storage
**Date**: 2026-02-21

## Route Definitions

### OAuth Login Routes

#### GET /auth/google

**Purpose**: Initiates Google OAuth authentication flow by redirecting user to Google consent screen.

**Controller**: `App\Http\Controllers\Auth\OAuthController@redirectToGoogle`

**Middleware**: None (public route)

**Request**:
- No parameters required
- State parameter generated automatically by Laravel Socialite for CSRF protection

**Response**:
- HTTP 302 Redirect to Google OAuth consent screen
- State parameter included in redirect URL for CSRF protection

**Error Handling**:
- If Google OAuth configuration is invalid: Laravel Socialite will throw exception
- Exception should be caught and user redirected with error message

**Example**:
```php
Route::get('/auth/google', [OAuthController::class, 'redirectToGoogle'])
    ->name('auth.google');
```

---

#### GET /auth/google/callback

**Purpose**: Handles OAuth callback from Google, processes authentication, and establishes session.

**Controller**: `App\Http\Controllers\Auth\OAuthController@handleGoogleCallback`

**Middleware**: None (public route, but processes authentication)

**Request**:
- Query parameters from Google:
  - `code`: Authorization code (temporary, exchanged for tokens)
  - `state`: CSRF protection state parameter

**Response**:
- **Success**: HTTP 302 Redirect to `/dashboard` (or intended URL)
- **Failure**: HTTP 302 Redirect to `/` (landing page) with error flash message

**Processing Flow**:
1. Validate state parameter (CSRF protection)
2. Exchange authorization code for access token + refresh token
3. Retrieve Google user ID from OAuth provider
4. Store/update tokens in `oauth_tokens` table
5. Create SessionUser instance with Google ID
6. Log in user via `Auth::login($sessionUser)`
7. Redirect to dashboard

**Error Handling**:
- Invalid state parameter: Redirect with error
- OAuth exchange failure: Redirect with error
- Token storage failure: Redirect with error
- All errors: User-friendly message, no technical details exposed

**Example**:
```php
Route::get('/auth/google/callback', [OAuthController::class, 'handleGoogleCallback'])
    ->name('auth.google.callback');
```

---

### Logout Route

#### POST /logout

**Purpose**: Terminates user session and logs out authenticated user.

**Controller**: `App\Http\Controllers\Auth\LogoutController@logout` (or existing logout handler)

**Middleware**: `auth` (must be authenticated to log out)

**Request**:
- Method: POST
- CSRF token required (via Laravel middleware)
- No additional parameters

**Response**:
- **Success**: HTTP 302 Redirect to `/` (landing page)
- Session invalidated
- CSRF token regenerated

**Processing Flow**:
1. Call `Auth::logout()` to clear authentication
2. Invalidate session: `request()->session()->invalidate()`
3. Regenerate CSRF token: `request()->session()->regenerateToken()`
4. Redirect to landing page

**Error Handling**:
- If user not authenticated: Middleware redirects to login (standard Laravel behavior)
- If CSRF token invalid: Laravel middleware handles (419 error)

**Example**:
```php
Route::post('/logout', [LogoutController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');
```

**Note**: If logout route already exists (as seen in routes/web.php), update it to follow this contract.

---

## Route Organization

### Public Routes (No Authentication Required)

```php
// OAuth routes
Route::prefix('auth')->group(function () {
    Route::get('google', [OAuthController::class, 'redirectToGoogle'])
        ->name('auth.google');
    Route::get('google/callback', [OAuthController::class, 'handleGoogleCallback'])
        ->name('auth.google.callback');
});
```

### Authenticated Routes

```php
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [LogoutController::class, 'logout'])
        ->name('logout');

    // Other authenticated routes...
});
```

---

## Frontend Route Usage

### Login Flow

**Component**: `LoginModal.tsx`

**Action**: User clicks "Continue with Google" button

**Implementation**:
```typescript
// OAuth redirect requires full page navigation (not SPA)
const handleGoogleLogin = () => {
    window.location.href = route('auth.google');
};
```

**Note**: OAuth redirects must use `window.location.href` (full redirect), not InertiaJS router, as Google OAuth requires full page redirect.

---

### Logout Flow

**Component**: Logout button (in Header, Dashboard, or navigation)

**Action**: User clicks logout button

**Implementation**:
```typescript
import { router } from '@inertiajs/react';

const handleLogout = () => {
    router.post(route('logout'), {}, {
        onSuccess: () => {
            // Redirect handled by server
        }
    });
};
```

**Alternative using InertiaJS form**:
```typescript
import { useForm } from '@inertiajs/react';

const { post } = useForm({});

const handleLogout = () => {
    post(route('logout'));
};
```

---

## Route Naming Conventions

- OAuth routes: `auth.google`, `auth.google.callback`
- Logout route: `logout`
- All routes use kebab-case for consistency
- Route names match controller method purposes

---

## Validation & Security

### CSRF Protection

- All POST routes require CSRF token (Laravel middleware)
- OAuth callback uses state parameter for CSRF protection
- CSRF token regenerated on logout

### Authentication Requirements

- `/auth/google`: Public (no authentication)
- `/auth/google/callback`: Public (processes authentication)
- `/logout`: Requires authentication (`auth` middleware)

### Rate Limiting

- Consider rate limiting for OAuth routes to prevent abuse
- Standard Laravel rate limiting can be applied if needed

---

## Error Response Format

### OAuth Errors

**Flash Message Format**:
```php
return redirect('/')->with('error', 'Google認証に失敗しました。もう一度お試しください。');
```

**Frontend Display**:
- Error messages displayed via InertiaJS flash messages
- User-friendly Japanese messages (per application language)

### Logout Errors

- Logout errors are rare (mostly handled by middleware)
- If user not authenticated: Redirect to login (standard behavior)
- No explicit error messages needed for logout

---

## Testing Requirements

### Route Tests

**OAuth Redirect Route**:
- Verify redirect to Google OAuth URL
- Verify state parameter is included
- Verify correct route name

**OAuth Callback Route**:
- Test successful callback processing
- Test invalid state parameter handling
- Test OAuth exchange failure handling
- Test token storage
- Test session establishment
- Test redirect to dashboard

**Logout Route**:
- Test successful logout
- Test session invalidation
- Test CSRF token regeneration
- Test redirect to landing page
- Test unauthenticated access (middleware redirect)
