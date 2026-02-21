# Route Contracts

**Feature**: Top Page and Header Component
**Date**: 2026-02-15
**Type**: InertiaJS Monolith (not REST API)

## Overview

This document defines the route contracts for the top page and language learning pages. Since this is an InertiaJS monolith application, these are server-side routes that render React pages via Inertia, not REST API endpoints.

---

## Route Definitions

### 1. Top Page (Home)

**Route**: `GET /`
**Name**: `home` (or default)
**Controller**: `TopController@top`
**Auth**: Not required (public)
**Inertia Page**: `TopPage`

**Purpose**: Render the main landing page with hero image and language selection

**Request**:
```
GET / HTTP/1.1
Host: localhost:8000
Accept: text/html
```

**Response**:
```
HTTP/1.1 200 OK
Content-Type: text/html
X-Inertia: true
X-Inertia-Version: [hash]

<div id="app" data-page="{...}"></div>
```

**Inertia Props**:
```typescript
{
  component: 'TopPage',
  props: {
    auth: {
      user: UserData | null
    },
    errors: {},
    flash: {}
  },
  url: '/',
  version: '[hash]'
}
```

**Implementation**:
```php
// routes/web.php
Route::get('/', [TopController::class, 'top'])->name('home');

// app/Http/Controllers/TopController.php
public function top()
{
    return Inertia::render('TopPage');
}
```

---

### 2. English Learning Page

**Route**: `GET /lang-note/english`
**Name**: `language.english`
**Controller**: `TopController@english`
**Auth**: Not required initially (can add auth middleware later)
**Inertia Page**: `English`

**Purpose**: Render English language learning page (placeholder initially)

**Request**:
```
GET /lang-note/english HTTP/1.1
Host: localhost:8000
Accept: text/html
X-Inertia: true
```

**Response**:
```
HTTP/1.1 200 OK
Content-Type: application/json
X-Inertia: true

{
  "component": "English",
  "props": {
    "auth": {
      "user": UserData | null
    },
    "language": "english"
  },
  "url": "/lang-note/english",
  "version": "[hash]"
}
```

**Inertia Props**:
```typescript
{
  auth: {
    user: App.Data.UserData | null
  },
  language: 'english' // Optional prop for future use
}
```

**Implementation**:
```php
// routes/web.php
Route::get('/lang-note/english', [TopController::class, 'english'])
    ->name('language.english');

// app/Http/Controllers/TopController.php
public function english()
{
    return Inertia::render('English', [
        'language' => 'english'
    ]);
}
```

---

### 3. Thai Learning Page

**Route**: `GET /lang-note/thai`
**Name**: `language.thai`
**Controller**: `TopController@thai`
**Auth**: Not required initially
**Inertia Page**: `Thai`

**Purpose**: Render Thai language learning page (placeholder initially)

**Request**:
```
GET /lang-note/thai HTTP/1.1
Host: localhost:8000
Accept: text/html
X-Inertia: true
```

**Response**: Same structure as English page with `language: 'thai'`

**Implementation**:
```php
Route::get('/lang-note/thai', [TopController::class, 'thai'])
    ->name('language.thai');

public function thai()
{
    return Inertia::render('Thai', [
        'language' => 'thai'
    ]);
}
```

---

### 4. Korean Learning Page

**Route**: `GET /lang-note/korean`
**Name**: `language.korean`
**Controller**: `TopController@korean`
**Auth**: Not required initially
**Inertia Page**: `Korean`

**Purpose**: Render Korean language learning page (placeholder initially)

**Request**:
```
GET /lang-note/korean HTTP/1.1
Host: localhost:8000
Accept: text/html
X-Inertia: true
```

**Response**: Same structure as English page with `language: 'korean'`

**Implementation**:
```php
Route::get('/lang-note/korean', [TopController::class, 'korean'])
    ->name('language.korean');

public function korean()
{
    return Inertia::render('Korean', [
        'language' => 'korean'
    ]);
}
```

---

## Existing Routes (Reused)

### Google OAuth Login

**Route**: `GET /auth/google`
**Name**: `auth.google`
**Controller**: `OAuthController@redirectToGoogle`
**Auth**: Not required (redirects to Google)
**Purpose**: Initiate Google OAuth flow

**Usage**: Triggered from Login button in modal
**Implementation**: Existing, no changes needed

---

### Google OAuth Callback

**Route**: `GET /auth/google/callback`
**Name**: `auth.google.callback`
**Controller**: `OAuthController@handleGoogleCallback`
**Auth**: Not required (handles OAuth response)
**Purpose**: Handle Google OAuth callback and create/login user

**Implementation**: Existing, no changes needed

---

### Dashboard (Existing)

**Route**: `GET /dashboard`
**Name**: `dashboard`
**Controller**: Existing controller
**Auth**: Required (middleware: auth)
**Inertia Page**: `Dashboard`

**Purpose**: User dashboard after authentication

**Note**: Not modified by this feature, but accessible after login

---

## Route Parameters

### No Dynamic Parameters

All routes are static paths. Language selection is handled by separate routes rather than route parameters.

**Rationale**:
- Spec explicitly defines separate URLs
- Simpler routing logic
- Each page can have different logic/content later
- Bookmarkable URLs without parameter parsing

**Invalid Route Handling**:
- Invalid language URLs (e.g., `/lang-note/spanish`) return 404 automatically
- No custom error handling needed initially

---

## Navigation Patterns

### InertiaJS Link Component

**Purpose**: Client-side navigation without full page reload

**Usage Pattern**:
```typescript
import { Link } from '@inertiajs/react';

// Footer navigation
<Link href="/" className="...">Home</Link>
<Link href="/privacy-policy" className="...">Privacy Policy</Link>

// Login (existing OAuth flow)
<Link href="/auth/google" className="...">
  Googleで続ける
</Link>
```

---

### InertiaJS router.visit()

**Purpose**: Programmatic navigation from event handlers

**Usage Pattern**:
```typescript
import { router } from '@inertiajs/react';

// Language selector dropdown
<DropdownMenuItem onSelect={() => router.visit('/lang-note/english')}>
  English
</DropdownMenuItem>
```

**Options**:
```typescript
router.visit(url, {
  method: 'get',              // HTTP method
  data: {},                   // Data to send
  replace: false,             // Replace history vs push
  preserveScroll: false,      // Keep scroll position
  preserveState: false,       // Keep component state
  only: [],                   // Partial reloads
  headers: {},                // Custom headers
  onSuccess: () => {},        // Success callback
  onError: () => {},          // Error callback
});
```

**For this feature**: Use defaults (GET request, no special options)

---

## Middleware

### Global Middleware

Applied to all routes via `app/Http/Kernel.php`:
- `HandleInertiaRequests` - Shares auth data with all pages
- `EncryptCookies`, `VerifyCsrfToken`, etc. (Laravel defaults)

### Route-Specific Middleware

**Current Routes**: No auth middleware (public pages)

**Future Consideration**: May add `auth` middleware to language pages if learning content requires authentication

```php
// Future: protect language pages
Route::middleware(['auth'])->group(function () {
    Route::get('/lang-note/english', [TopController::class, 'english']);
    Route::get('/lang-note/thai', [TopController::class, 'thai']);
    Route::get('/lang-note/korean', [TopController::class, 'korean']);
});
```

---

## Error Responses

### 404 Not Found

**Trigger**: Invalid route accessed
**Response**: Laravel 404 page (can customize later)

**Example**:
```
GET /lang-note/spanish HTTP/1.1
-> HTTP 404 Not Found
```

---

### 419 Page Expired

**Trigger**: CSRF token expired (for POST requests)
**Mitigation**: Not applicable (no POST routes in this feature)

---

### 500 Server Error

**Trigger**: Controller error, unhandled exception
**Response**: Laravel error page (debug mode shows stack trace)

---

## Named Routes

### Using Named Routes

**Benefit**: Avoid hardcoded URLs, automatically generates correct URLs

**Usage**:
```php
// In PHP/Blade
route('home')               // -> '/'
route('language.english')   // -> '/lang-note/english'
route('auth.google')        // -> '/auth/google'
```

**With Ziggy (JavaScript)**:
```typescript
import { route } from 'ziggy-js';

// In React components
<Link href={route('home')}>Home</Link>
<Link href={route('language.english')}>English</Link>
```

**Note**: Direct URLs (`href="/lang-note/english"`) are acceptable for this feature since URLs are stable. Named routes provide better maintainability if URLs change later.

---

## URL Structure Summary

| Page | URL | Route Name | Auth | Purpose |
|------|-----|------------|------|---------|
| Top Page | `/` | `home` | No | Landing page |
| English Learning | `/lang-note/english` | `language.english` | No* | English content |
| Thai Learning | `/lang-note/thai` | `language.thai` | No* | Thai content |
| Korean Learning | `/lang-note/korean` | `language.korean` | No* | Korean content |
| Google Login | `/auth/google` | `auth.google` | No | OAuth redirect |
| OAuth Callback | `/auth/google/callback` | `auth.google.callback` | No | OAuth return |
| Dashboard | `/dashboard` | `dashboard` | Yes | User dashboard |

*May require auth in future when learning content is implemented

---

## SEO Considerations

### Meta Tags

Each page should include appropriate meta tags (can be added to page components):

```tsx
<Head>
  <title>LangNote - 英語、タイ語、韓国語を学ぼう</title>
  <meta name="description" content="学んだ表現を保存。いつでも見返せる。" />
  <meta property="og:title" content="LangNote" />
  <meta property="og:type" content="website" />
</Head>
```

**Note**: Use Inertia's `<Head>` component from `@inertiajs/react`

---

## Testing Routes

### Feature Tests

**Purpose**: Verify routes render correct Inertia pages

**Example**:
```php
// tests/Feature/TopControllerTest.php
public function test_top_page_renders()
{
    $response = $this->get('/');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('TopPage')
    );
}

public function test_english_page_renders()
{
    $response = $this->get('/lang-note/english');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('English')
            ->has('language')
    );
}
```

---

## Future Extensions

### Potential Additional Routes

Not in current scope, but may be added later:

1. **Privacy Policy**: `GET /privacy-policy` (footer link target)
2. **Terms of Service**: `GET /terms` (if needed)
3. **About Page**: `GET /about` (if needed)
4. **User Profile**: `GET /profile` (authenticated)
5. **Settings**: `GET /settings` (authenticated)

### Content API

If language pages need dynamic content:
- Could add InertiaJS partial reloads for content sections
- Still no REST API needed (keep InertiaJS monolith pattern)
- Pass content via Inertia props from controller

---

## Summary

**Total New Routes**: 4 (home, english, thai, korean)
**HTTP Method**: GET only (no POST/PUT/DELETE in this feature)
**Authentication**: Public routes (no auth middleware)
**Response Format**: InertiaJS page renders (not JSON API)
**Navigation**: InertiaJS Link and router.visit() (SPA experience)

**Architecture**: Follows InertiaJS monolith pattern per project constitution - no separate API layer, all data via server-rendered props.
