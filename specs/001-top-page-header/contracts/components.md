# Component Contracts

**Feature**: Top Page and Header Component
**Date**: 2026-02-15
**Type**: React TypeScript Components

## Overview

This document defines the interface contracts (props, callbacks, state) for all React components in this feature. All components use TypeScript for type safety and follow the project constitution's component architecture principles.

---

## Page Components

### TopPage

**File**: `resources/js/Pages/TopPage.tsx`
**Category**: Page Component (top-level Inertia page)
**Purpose**: Landing page with hero section and language selection

**Props Interface**:
```typescript
interface TopPageProps extends PageProps {
    // Inherits from PageProps:
    // - auth: { user: UserData | null }
    // - errors: Record<string, string>
    // - flash: { success?: string, error?: string }
}
```

**Inertia Props** (passed from controller):
```typescript
{
    auth: {
        user: UserData | null  // From HandleInertiaRequests middleware
    }
}
```

**Component Structure**:
```tsx
export default function TopPage({ auth }: TopPageProps) {
    return (
        <>
            <Header user={auth.user} />
            <main>
                {/* Hero section */}
                {/* Language selection */}
            </main>
            <Footer />
        </>
    );
}
```

**Renders**:
- Header component (with user context)
- Hero section with background image
- Japanese text overlay
- Language selection buttons/cards
- Footer component

**SEO**:
```tsx
<Head>
    <title>LangNote - 言語学習プラットフォーム</title>
</Head>
```

---

### English

**File**: `resources/js/Pages/English.tsx`
**Category**: Page Component
**Purpose**: English language learning page (placeholder)

**Props Interface**:
```typescript
interface EnglishPageProps extends PageProps {
    language?: 'english';  // Optional: for future use
}
```

**Component Structure**:
```tsx
export default function English({ auth }: EnglishPageProps) {
    return (
        <>
            <Header user={auth.user} currentPath="/lang-note/english" />
            <main className="min-h-screen p-8">
                <h1 className="text-3xl font-bold mb-4">英語学習</h1>
                <p>英語学習コンテンツをここに追加予定</p>
            </main>
            <Footer />
        </>
    );
}
```

**Note**: Placeholder implementation. Content to be added in future features.

---

### Thai

**File**: `resources/js/Pages/Thai.tsx`
**Category**: Page Component
**Purpose**: Thai language learning page (placeholder)

**Props Interface**:
```typescript
interface ThaiPageProps extends PageProps {
    language?: 'thai';
}
```

**Component Structure**: Similar to English page

---

### Korean

**File**: `resources/js/Pages/Korean.tsx`
**Category**: Page Component
**Purpose**: Korean language learning page (placeholder)

**Props Interface**:
```typescript
interface KoreanPageProps extends PageProps {
    language?: 'korean';
}
```

**Component Structure**: Similar to English page

---

## Shared Components

### Header

**File**: `resources/js/Components/Header.tsx`
**Category**: Shared Component (layout)
**Purpose**: Global header with logo, language selector, and login/user menu

**Props Interface**:
```typescript
interface HeaderProps {
    user: App.Data.UserData | null;
    currentPath?: string;  // Optional: for active state
}
```

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| user | UserData \| null | Yes | - | Authenticated user or null |
| currentPath | string | No | undefined | Current URL for active indication |

**Component Structure**:
```tsx
export default function Header({ user, currentPath }: HeaderProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <header className="border-b border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <span className="text-primary">L</span>
                    <span className="text-secondary">n</span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <LanguageSelector currentPath={currentPath} />

                    {/* Auth Section */}
                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <Button onClick={() => setIsLoginModalOpen(true)}>
                            Login
                        </Button>
                    )}
                </div>
            </nav>

            <LoginModal 
                open={isLoginModalOpen} 
                onOpenChange={setIsLoginModalOpen} 
            />
        </header>
    );
}
```

**Internal State**:
```typescript
isLoginModalOpen: boolean  // Controls login modal visibility
```

**Child Components**:
- LanguageSelector (or inline DropdownMenu)
- UserMenu (future: authenticated user dropdown)
- LoginModal
- Button (Shadcn/ui)
- Link (InertiaJS)

**Responsive Behavior**:
- Mobile (<768px): Stack vertically or use hamburger menu
- Tablet (768px-1024px): Horizontal layout with adjusted spacing
- Desktop (>1024px): Full horizontal layout

---

### Footer

**File**: `resources/js/Components/Footer.tsx`
**Category**: Shared Component (layout)
**Purpose**: Global footer with brand name and links

**Props Interface**:
```typescript
interface FooterProps {
    // No props needed
}
```

**Component Structure**:
```tsx
export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="mb-4">
                    <span className="text-lg font-semibold">LangNote</span>
                </div>
                <nav className="flex gap-4 text-sm text-neutral">
                    <Link href="/" className="hover:text-primary">
                        Home
                    </Link>
                    <Link href="/privacy-policy" className="hover:text-primary">
                        Privacy Policy
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
```

**Note**: Privacy Policy link target (`/privacy-policy`) not implemented yet. Can be placeholder or removed until policy page exists.

---

### LoginModal

**File**: `resources/js/Components/LoginModal.tsx`
**Category**: Shared Component (modal)
**Purpose**: Display login options in modal dialog

**Props Interface**:
```typescript
interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
```

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| open | boolean | Yes | - | Controls modal visibility |
| onOpenChange | function | Yes | - | Callback when modal state changes |

**Callback Signature**:
```typescript
onOpenChange: (open: boolean) => void
// Called with `false` when modal should close (ESC, backdrop click, etc.)
// Called with `true` when modal should open (not typical, controlled externally)
```

**Component Structure**:
```tsx
export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                        Lang Noteへようこそ
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-neutral text-center mb-6">
                        ログインすることでプライバシーポリシーに同意したことになります
                    </p>

                    <Link
                        href="/auth/google"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition"
                    >
                        {/* Google Icon */}
                        <span>Googleで続ける</span>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
```

**Accessibility**:
- Focus trapped within modal when open
- ESC key closes modal
- Click outside (backdrop) closes modal
- Focus returns to trigger button when closed
- Aria labels on all interactive elements

**UI Components Used**:
- Dialog (Shadcn/ui)
- DialogContent (Shadcn/ui)
- DialogHeader (Shadcn/ui)
- DialogTitle (Shadcn/ui)
- Link (InertiaJS)

---

## Sub-Components (Optional)

### LanguageSelector

**File**: `resources/js/Components/LanguageSelector.tsx` (optional - can be inline in Header)
**Category**: Shared Component
**Purpose**: Dropdown menu for language selection

**Props Interface**:
```typescript
interface LanguageSelectorProps {
    currentPath?: string;  // For active language indication
}
```

**Component Structure**:
```tsx
export default function LanguageSelector({ currentPath }: LanguageSelectorProps) {
    const handleLanguageSelect = (language: string) => {
        router.visit(`/lang-note/${language}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Language
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleLanguageSelect('english')}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleLanguageSelect('thai')}>
                    Thai
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleLanguageSelect('korean')}>
                    Korean
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
```

**Alternative**: Can be implemented inline in Header component without separate file

---

## UI Primitives (Shadcn/ui)

### Required Shadcn/ui Components

| Component | Import | Purpose | Installation |
|-----------|--------|---------|--------------|
| Button | `@/Components/ui/button` | Login button, CTAs | Already installed |
| Card | `@/Components/ui/card` | Content sections | Already installed |
| Dialog | `@/Components/ui/dialog` | Login modal | `npx shadcn@latest add dialog` |
| DropdownMenu | `@/Components/ui/dropdown-menu` | Language selector | `npx shadcn@latest add dropdown-menu` |

**Installation Commands**:
```bash
# If not already installed
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

---

## Type Definitions

### Shared Types

**File**: `resources/js/types/index.d.ts`

```typescript
// Base PageProps (already exists)
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

// Language type (new)
export type Language = 'english' | 'thai' | 'korean';
```

### Generated Types

**File**: `resources/js/types/generated.d.ts` (auto-generated)

```typescript
declare namespace App.Data {
    export interface UserData {
        id: number;
        name: string;
        email: string;
        google_id: string;
        avatar: string | null;
        created_at: string;
        updated_at: string;
    }
}
```

**Note**: UserData already generated from existing `app/Data/UserData.php`

---

## Component Composition

### Page Composition Pattern

All pages follow this structure:

```tsx
export default function PageName({ auth }: PageProps) {
    return (
        <>
            <Header user={auth.user} currentPath={currentPath} />
            
            <main className="min-h-screen">
                {/* Page-specific content */}
            </main>
            
            <Footer />
        </>
    );
}
```

**Layout**:
- Header: Fixed at top (or static)
- Main: Flexible height, fills viewport
- Footer: At bottom (or pushed down by content)

**Responsive**:
```tsx
<main className="min-h-screen px-4 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16">
```

---

## Event Handlers

### Login Modal Events

```typescript
// Open modal
<Button onClick={() => setIsLoginModalOpen(true)}>

// Close modal (handled by Dialog component)
<Dialog onOpenChange={setIsLoginModalOpen}>

// Trigger OAuth (InertiaJS Link handles navigation)
<Link href="/auth/google">
```

### Language Selection Events

```typescript
// Option 1: Using router.visit()
<DropdownMenuItem onSelect={() => router.visit('/lang-note/english')}>

// Option 2: Using Link (if dropdown supports it)
<Link href="/lang-note/english" className="...">
```

### Navigation Events

All navigation uses InertiaJS Link or router:

```typescript
// Link component
<Link href="/" className="...">Home</Link>

// Programmatic navigation
router.visit('/lang-note/english')

// With options
router.visit('/lang-note/english', {
    preserveScroll: true,
    onSuccess: () => console.log('Navigated')
})
```

---

## Styling Contracts

### Color Usage

All components MUST use Tailwind color utilities:

```tsx
// Primary color (soft green #B2E09D)
className="bg-primary text-primary border-primary"

// Secondary color (bright blue #4EBDFF)
className="bg-secondary text-secondary"

// Accent color (warm orange #FF9D71)
className="bg-accent text-accent"

// Neutral color (dark blue-gray #2F4858)
className="text-neutral border-neutral"

// Page background (very light green #F8FFF8)
className="bg-page-bg"

// Success/Error
className="text-success border-success"
className="text-error border-error"
```

### Logo Color Styling

```tsx
// Logo "L" in primary (soft green)
<span className="text-primary font-bold text-2xl">L</span>

// Logo "n" in secondary (bright blue)
<span className="text-secondary font-bold text-2xl">n</span>
```

### No Inline Styles (Exception)

**Rule**: No inline styles except for dynamic background image

**Allowed**:
```tsx
style={{backgroundImage: `url(${topImage})`}}
```

**Forbidden**:
```tsx
style={{color: '#B2E09D'}}  // Use className="text-primary" instead
style={{display: 'flex'}}    // Use className="flex" instead
```

---

## Accessibility Requirements

### ARIA Labels

```tsx
// Login button
<Button aria-label="ログイン">Login</Button>

// Language selector
<DropdownMenuTrigger aria-label="言語を選択">
    Language
</DropdownMenuTrigger>

// Logo link
<Link href="/" aria-label="ホームに戻る">
    <span className="sr-only">LangNote</span>
    {/* Logo */}
</Link>
```

### Keyboard Navigation

- Header: Tab order: Logo → Language selector → Login/User menu
- Footer: Tab order: Home → Privacy Policy
- Modal: Focus trapped, ESC closes
- Dropdown: Arrow keys navigate, Enter selects

### Screen Reader Support

```tsx
// Hidden text for screen readers
<span className="sr-only">追加情報</span>

// Dialog title announced
<DialogTitle>Lang Noteへようこそ</DialogTitle>

// Current page indication
<Link href="/lang-note/english" aria-current={currentPath === '/lang-note/english' ? 'page' : undefined}>
```

---

## Performance Considerations

### Code Splitting

InertiaJS automatically code-splits pages:

```tsx
// Each page component is lazy-loaded
// No manual React.lazy() needed
```

### Image Optimization

```tsx
// Import images (handled by Vite)
import topImage from '@/images/top.jpg';

// Background image with object-cover for responsive scaling
<div 
    style={{backgroundImage: `url(${topImage})`}}
    className="bg-cover bg-center"
>
```

### Component Memoization

**Not required initially** - Only optimize if performance issues arise

```tsx
// Future optimization if needed
const Header = memo(function Header({ user, currentPath }: HeaderProps) {
    // ...
});
```

---

## Testing Contracts

### Component Tests (Future)

```typescript
// Header.test.tsx
describe('Header', () => {
    it('shows login button when user is null', () => {
        render(<Header user={null} />);
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('opens login modal on button click', async () => {
        render(<Header user={null} />);
        await userEvent.click(screen.getByText('Login'));
        expect(screen.getByText('Lang Noteへようこそ')).toBeInTheDocument();
    });
});
```

**Note**: Component tests not priority for Phase 1. Can be added later.

---

## Summary

**Total Components**: 8
- Pages: 4 (TopPage, English, Thai, Korean)
- Shared: 3 (Header, Footer, LoginModal)
- Sub-components: 1 (LanguageSelector - optional)

**Props Complexity**: Low (minimal props, mostly composition)
**State Complexity**: Low (single boolean for modal)
**Type Safety**: Full TypeScript coverage
**Accessibility**: WCAG 2.1 AA compliant
**Performance**: Automatic code-splitting via InertiaJS

All components follow React functional component pattern with TypeScript, use Shadcn/ui primitives, and adhere to project constitution principles.
