# Data Model

**Feature**: Top Page and Header Component with Theme System
**Date**: 2026-02-15
**Status**: Complete

## Overview

This feature primarily involves UI components and static content pages. It does not introduce new database entities or complex data structures. The data model is minimal, relying on existing User authentication context passed through InertiaJS page props.

## Entities

### 1. User (Existing)

**Source**: `app/Models/User.php` (existing)
**DTO**: `app/Data/UserData.php` (existing)
**TypeScript**: Auto-generated in `resources/js/types/generated.d.ts`

**Purpose**: Represents authenticated user for header state (logged in vs logged out)

**Attributes** (existing, not modified):
- `id`: int - Primary key
- `name`: string - User display name
- `email`: string - User email address
- `google_id`: string - Google OAuth identifier
- `avatar`: string|null - User profile picture URL
- `created_at`: timestamp
- `updated_at`: timestamp

**Usage in this feature**:
- Passed via `PageProps.auth.user` to all Inertia pages
- Header component reads `auth.user` to determine:
  - Show "Login" button if user is null (unauthenticated)
  - Show user menu if user exists (authenticated)
- No modifications to User model required

---

## Component Props Interfaces

### PageProps (Base Interface)

**Source**: `resources/js/types/index.d.ts` (existing)

```typescript
export interface PageProps {
    auth: {
        user: App.Data.UserData | null;
    };
    errors: Record<string, string>;
    flash: {
        success?: string;
        error?: string;
    };
}
```

**Usage**: All new page components extend this interface

---

### TopPageProps

**Type**: TypeScript interface
**Source**: `resources/js/Pages/TopPage.tsx`

```typescript
interface TopPageProps extends PageProps {
    // No additional props - uses only base PageProps
}
```

**Rationale**: Top page is static content, only needs auth context from base props

---

### LanguagePageProps

**Type**: TypeScript interface
**Source**: `resources/js/Pages/English.tsx`, `Thai.tsx`, `Korean.tsx`

```typescript
interface LanguagePageProps extends PageProps {
    language: 'english' | 'thai' | 'korean'; // Optional: for future content filtering
}
```

**Rationale**: Language pages are placeholders initially. Language prop can help identify current page for header active state.

**Note**: Language prop is optional for initial implementation. Can be added later when content is implemented.

---

### HeaderProps

**Type**: TypeScript interface
**Source**: `resources/js/Components/Header.tsx`

```typescript
interface HeaderProps {
    user: App.Data.UserData | null;
    currentPath?: string; // Optional: for active state indication
}
```

**Attributes**:
- `user`: User data from auth context, null if unauthenticated
- `currentPath`: Current URL path for indicating active navigation item (optional)

**Validation**: None required (data comes from framework)

---

### FooterProps

**Type**: TypeScript interface
**Source**: `resources/js/Components/Footer.tsx`

```typescript
interface FooterProps {
    // No props needed - static content
}
```

**Rationale**: Footer displays static links, no dynamic content

---

### LoginModalProps

**Type**: TypeScript interface
**Source**: `resources/js/Components/LoginModal.tsx`

```typescript
interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
```

**Attributes**:
- `open`: Controls modal visibility (controlled component pattern)
- `onOpenChange`: Callback to update modal state in parent component

**Validation**: None required (boolean state)

---

## Route Parameters

### Language Page Routes

**Pattern**: `/lang-note/{language}`
**Valid Values**: `english`, `thai`, `korean`

**Route Definitions**:
```php
Route::get('/lang-note/english', [TopController::class, 'english'])->name('language.english');
Route::get('/lang-note/thai', [TopController::class, 'thai'])->name('language.thai');
Route::get('/lang-note/korean', [TopController::class, 'korean'])->name('language.korean');
```

**Validation**: Handled by explicit route definitions (invalid languages result in 404)

**Named Routes**: Allows using `route('language.english')` in code instead of hardcoded URLs

---

## Client-Side State

### Header Component State

**State Variable**: `isLoginModalOpen`
**Type**: `boolean`
**Default**: `false`
**Scope**: Local to Header component
**Persistence**: None (resets on navigation)

**Purpose**: Controls visibility of login modal

**State Transitions**:
```
closed (false) -> Login button clicked -> open (true)
open (true) -> Modal close event -> closed (false)
open (true) -> Navigation occurs -> closed (false) [automatic]
```

**Implementation**:
```typescript
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
```

---

## Configuration Data

### Color Palette

**Source**: `tailwind.config.js`
**Type**: Static configuration
**Scope**: Global (available to all components)

**Colors**:
```javascript
{
  primary: '#B2E09D',      // Soft green - used for logo "L", primary actions
  secondary: '#4EBDFF',    // Bright blue - used for logo "n", secondary actions
  accent: '#FF9D71',       // Warm orange - used for highlights, CTAs
  neutral: '#2F4858',      // Dark blue-gray - used for text, borders
  success: '#68EDCB',      // Teal - used for success states
  error: '#FF869A',        // Coral pink - used for error states
  'page-bg': '#F8FFF8',    // Very light green - used for page background
}
```

**Usage**: Accessed via Tailwind utility classes (`bg-primary`, `text-secondary`, etc.)

**Validation**: Must meet WCAG 2.1 AA contrast ratio (4.5:1 for normal text, 3:1 for large text)

---

## Assets

### Hero Image

**Path**: `resources/js/images/top.jpg`
**Type**: Static image asset
**Format**: JPEG
**Usage**: Background image for hero section on top page
**Imported**: Via TypeScript import in TopPage component

**Implementation**:
```typescript
import topImage from '@/images/top.jpg';
// Used in: style={{backgroundImage: `url(${topImage})`}}
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  Laravel Route  │
│   web.php       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │
│ TopController   │
│  ::top()        │
└────────┬────────┘
         │
         │ Inertia::render('TopPage')
         │ Props: { auth: { user: UserData|null } }
         │
         ▼
┌─────────────────┐
│   React Page    │
│   TopPage.tsx   │
│  Props.auth.user│
└────────┬────────┘
         │
         │ Renders with
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────┐
│ Header │ │Footer│
│ +Modal │ │      │
└────────┘ └──────┘
    │
    │ user prop
    │
    ▼
  Conditional:
  user ? UserMenu : LoginButton
```

---

## Validation Rules

### No Backend Validation Required

This feature involves:
- Static content rendering (no form submissions)
- Navigation (no input validation)
- Modal display (UI state only)

**Exception**: Google OAuth validation handled by existing `OAuthController` (no changes needed)

---

## State Management Summary

| State | Location | Type | Persistence | Purpose |
|-------|----------|------|-------------|---------|
| User Auth | Server session | UserData \| null | Session | Auth context across pages |
| Login Modal | Header component | boolean | None | Control modal visibility |
| Page Props | Inertia | PageProps | None | Pass data from server to React |

**No Global State**: Feature follows constitution by avoiding global state libraries (Redux, Zustand). All state is either:
- Server-side (auth session)
- Local component state (modal visibility)
- Props passed from parent to child

---

## Type Safety

### PHP to TypeScript Generation

**Process**:
1. PHP Data classes marked with `#[TypeScript]` attribute
2. Run `npm run generate-types` (executes `php artisan typescript:transform`)
3. Types generated in `resources/js/types/generated.d.ts`
4. Import in React components: `import { UserData } from '@/types/generated'`

**Existing Types Used**:
- `App.Data.UserData` - Already generated from `app/Data/UserData.php`

**New Types Required**: None (feature uses only existing UserData)

---

## Migration Notes

### No Database Migrations Required

This feature:
- Does not introduce new database tables
- Does not modify existing tables
- Does not add new columns to User table
- Relies entirely on existing database schema

### Asset Migration

**Action Required**: Verify `resources/js/images/top.jpg` exists
- If missing: Add appropriate hero image to this path
- Image should be optimized for web (compressed, appropriately sized)
- Recommended dimensions: 1920x1080 or larger for high-DPI displays

---

## Dependencies

### External Data Dependencies

**Google OAuth Service**:
- Used by existing `OAuthController`
- Login modal triggers existing OAuth flow
- No new OAuth configuration required
- Relies on existing GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars

**InertiaJS Page Props**:
- Automatically provided by InertiaJS middleware
- `HandleInertiaRequests` middleware shares auth data
- No modifications needed to share auth context

---

## Future Considerations

### Potential Future Entities

If language learning content is added later, potential entities:

1. **LearningPath** - Tracks user progress in each language
2. **Vocabulary** - Stores learned vocabulary items
3. **StudySession** - Records study activity

**Note**: These are NOT in scope for this feature. Listed for awareness only.

### Theme/Language Preferences

Currently not persisted. If needed in future:
- Add columns to users table: `preferred_language_page` (enum: english, thai, korean)
- Store in session or database
- Not required for MVP (users can bookmark language pages)

---

## Summary

**Complexity**: Low
**New Entities**: 0
**Modified Entities**: 0
**Client State**: Minimal (1 boolean in Header)
**Type Safety**: Leverages existing TypeScript generation
**Persistence**: None required (relies on existing session auth)

This feature is primarily presentational with minimal data modeling requirements. The architecture leverages existing auth infrastructure and InertiaJS prop passing without introducing new data structures or state management complexity.
