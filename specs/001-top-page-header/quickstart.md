# Quickstart: Top Page Implementation

**Feature**: Top Page and Header Component with Theme System
**Estimated Time**: 3-4 hours
**Difficulty**: Intermediate

## Prerequisites

- Laravel development environment running
- Node.js and npm installed
- Vite dev server capability
- Existing Lang Note codebase with InertiaJS setup

---

## Implementation Checklist

- [ ] Step 1: Configure Tailwind color palette (5 min)
- [ ] Step 2: Install Shadcn/ui components (5 min)
- [ ] Step 3: Create TopController (10 min)
- [ ] Step 4: Configure routes (5 min)
- [ ] Step 5: Create Header component (30 min)
- [ ] Step 6: Create Footer component (15 min)
- [ ] Step 7: Create LoginModal component (20 min)
- [ ] Step 8: Create TopPage component (40 min)
- [ ] Step 9: Create language page components (20 min)
- [ ] Step 10: Delete Welcome.tsx (2 min)
- [ ] Step 11: Test all pages (30 min)
- [ ] Step 12: Verify responsive design (20 min)
- [ ] Step 13: Accessibility audit (15 min)

**Total**: ~3.5 hours

---

## Step 1: Configure Tailwind Color Palette

### 1.1. Update tailwind.config.js

**File**: `tailwind.config.js`

```javascript
import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#B2E09D',      // Soft green - logo "L"
                secondary: '#4EBDFF',    // Bright blue - logo "n"
                accent: '#FF9D71',       // Warm orange - highlights
                neutral: '#2F4858',      // Dark blue-gray - text
                success: '#68EDCB',      // Teal - success states
                error: '#FF869A',        // Coral pink - error states
                'page-bg': '#F8FFF8',    // Very light green - backgrounds
            },
        },
    },

    plugins: [forms],
};
```

**Verify**: Colors should now be available as `bg-primary`, `text-secondary`, etc.

---

## Step 2: Install Shadcn/ui Components

### 2.1. Install Dialog Component

```bash
npx shadcn@latest add dialog
```

**Output**: Creates/updates:
- `resources/js/Components/ui/dialog.tsx`
- May update `resources/js/lib/utils.ts`

### 2.2. Install DropdownMenu Component

```bash
npx shadcn@latest add dropdown-menu
```

**Output**: Creates/updates:
- `resources/js/Components/ui/dropdown-menu.tsx`

### 2.3. Verify Installation

Check that files exist:
```bash
ls resources/js/Components/ui/
# Should see: button.tsx, card.tsx, dialog.tsx, dropdown-menu.tsx, etc.
```

---

## Step 3: Create TopController

### 3.1. Generate Controller

```bash
php artisan make:controller TopController
```

### 3.2. Implement Controller Methods

**File**: `app/Http/Controllers/TopController.php`

```php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class TopController extends Controller
{
    /**
     * Display the top (landing) page
     */
    public function top(): Response
    {
        return Inertia::render('TopPage');
    }

    /**
     * Display the English learning page
     */
    public function english(): Response
    {
        return Inertia::render('English', [
            'language' => 'english'
        ]);
    }

    /**
     * Display the Thai learning page
     */
    public function thai(): Response
    {
        return Inertia::render('Thai', [
            'language' => 'thai'
        ]);
    }

    /**
     * Display the Korean learning page
     */
    public function korean(): Response
    {
        return Inertia::render('Korean', [
            'language' => 'korean'
        ]);
    }
}
```

**Note**: Controllers are intentionally thin - just rendering pages with minimal props.

---

## Step 4: Configure Routes

### 4.1. Update Web Routes

**File**: `routes/web.php`

Find the existing Welcome route and replace with top page route:

```php
<?php

use App\Http\Controllers\TopController;
use App\Http\Controllers\Auth\OAuthController;
use Illuminate\Support\Facades\Route;

// Replace the existing welcome route
Route::get('/', [TopController::class, 'top'])->name('home');

// Add language learning page routes
Route::get('/lang-note/english', [TopController::class, 'english'])->name('language.english');
Route::get('/lang-note/thai', [TopController::class, 'thai'])->name('language.thai');
Route::get('/lang-note/korean', [TopController::class, 'korean'])->name('language.korean');

// Existing OAuth routes (keep as-is)
Route::get('/auth/google', [OAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [OAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');

// Existing dashboard route (keep as-is)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::post('/logout', [OAuthController::class, 'logout'])->name('logout');
});
```

### 4.2. Verify Routes

```bash
php artisan route:list --path=lang-note
```

**Expected Output**:
```
GET|HEAD  lang-note/english ... TopController@english
GET|HEAD  lang-note/thai    ... TopController@thai
GET|HEAD  lang-note/korean  ... TopController@korean
```

---

## Step 5: Create Header Component

### 5.1. Create Header File

**File**: `resources/js/Components/Header.tsx`

```tsx
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import LoginModal from '@/Components/LoginModal';
import { router } from '@inertiajs/react';

interface HeaderProps {
    user: App.Data.UserData | null;
    currentPath?: string;
}

export default function Header({ user, currentPath }: HeaderProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLanguageSelect = (language: string) => {
        router.visit(`/lang-note/${language}`);
    };

    return (
        <>
            <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-0 text-2xl font-bold hover:opacity-80 transition">
                        <span className="text-primary">L</span>
                        <span className="text-secondary">n</span>
                    </Link>

                    {/* Right side: Language selector + Auth */}
                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="min-w-[100px]">
                                    Language
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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

                        {/* Auth Section */}
                        {user ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-neutral">
                                    {user.name}
                                </span>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-sm text-neutral hover:text-primary"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <Button 
                                onClick={() => setIsLoginModalOpen(true)}
                                className="bg-primary hover:bg-primary/90 text-neutral"
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </nav>
            </header>

            <LoginModal 
                open={isLoginModalOpen} 
                onOpenChange={setIsLoginModalOpen} 
            />
        </>
    );
}
```

**Key Features**:
- Sticky header (stays at top on scroll)
- Logo with colored "L" and "n"
- Language dropdown with three options
- Conditional auth UI (login button vs user info)
- Login modal integration

---

## Step 6: Create Footer Component

### 6.1. Create Footer File

**File**: `resources/js/Components/Footer.tsx`

```tsx
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="mb-4">
                    <span className="text-lg font-semibold text-neutral">LangNote</span>
                </div>
                <nav className="flex gap-4 text-sm text-neutral">
                    <Link 
                        href="/" 
                        className="hover:text-primary transition"
                    >
                        Home
                    </Link>
                    <Link 
                        href="/privacy-policy" 
                        className="hover:text-primary transition"
                    >
                        Privacy Policy
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
```

**Note**: Privacy Policy link points to `/privacy-policy` (not implemented yet). Can be removed or left as placeholder.

---

## Step 7: Create LoginModal Component

### 7.1. Create LoginModal File

**File**: `resources/js/Components/LoginModal.tsx`

```tsx
import { Link } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold mb-2">
                        Lang Noteへようこそ
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-neutral text-center mb-6">
                        ログインすることでプライバシーポリシーに同意したことになります
                    </p>

                    <Link
                        href="/auth/google"
                        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-primary transition font-medium"
                    >
                        {/* Google Icon (optional - can add FontAwesome or SVG) */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span>Googleで続ける</span>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
```

**Key Features**:
- Japanese welcome message
- Privacy policy acknowledgment
- Google OAuth button with icon
- Accessible dialog (focus trap, ESC closes)

---

## Step 8: Create TopPage Component

### 8.1. Create TopPage File

**File**: `resources/js/Pages/TopPage.tsx`

```tsx
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { Button } from '@/Components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { router } from '@inertiajs/react';
import topImage from '@/images/top.jpg';

interface TopPageProps extends PageProps {}

export default function TopPage({ auth }: TopPageProps) {
    const handleLanguageClick = (language: string) => {
        router.visit(`/lang-note/${language}`);
    };

    return (
        <>
            <Head>
                <title>LangNote - 言語学習プラットフォーム</title>
                <meta name="description" content="学んだ表現を保存。いつでも見返せる。" />
            </Head>

            <div className="min-h-screen flex flex-col bg-page-bg">
                <Header user={auth.user} currentPath="/" />

                <main className="flex-1">
                    {/* Hero Section */}
                    <div
                        className="relative h-[60vh] min-h-[400px] bg-cover bg-center flex items-center justify-center"
                        style={{ backgroundImage: `url(${topImage})` }}
                    >
                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/30"></div>

                        {/* Hero Text */}
                        <div className="relative z-10 text-center px-4 max-w-3xl">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                学んだ表現を保存。
                                <br />
                                いつでも見返せる。
                                <br />
                                何度も復習して自分のものにしよう。
                            </h1>
                        </div>
                    </div>

                    {/* Language Selection Section */}
                    <div className="container mx-auto px-4 py-16">
                        <h2 className="text-3xl font-bold text-neutral text-center mb-12">
                            学びたい言語を選択
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {/* English Card */}
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition hover:border-primary"
                                onClick={() => handleLanguageClick('english')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-2xl text-center">English</CardTitle>
                                    <CardDescription className="text-center">
                                        英語を学ぶ
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Thai Card */}
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition hover:border-secondary"
                                onClick={() => handleLanguageClick('thai')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-2xl text-center">Thai</CardTitle>
                                    <CardDescription className="text-center">
                                        タイ語を学ぶ
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Korean Card */}
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition hover:border-accent"
                                onClick={() => handleLanguageClick('korean')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-2xl text-center">Korean</CardTitle>
                                    <CardDescription className="text-center">
                                        韓国語を学ぶ
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
```

**Key Features**:
- Hero section with background image
- Japanese motivational text with overlay for readability
- Three language selection cards
- Responsive grid layout
- Hover effects on cards

---

## Step 9: Create Language Page Components

### 9.1. Create English Page

**File**: `resources/js/Pages/English.tsx`

```tsx
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

interface EnglishPageProps extends PageProps {
    language?: string;
}

export default function English({ auth }: EnglishPageProps) {
    return (
        <>
            <Head>
                <title>English Learning - LangNote</title>
            </Head>

            <div className="min-h-screen flex flex-col bg-page-bg">
                <Header user={auth.user} currentPath="/lang-note/english" />

                <main className="flex-1 container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-neutral mb-6">
                        英語学習
                    </h1>
                    <p className="text-lg text-neutral/80 mb-8">
                        英語学習コンテンツをここに追加予定です。
                    </p>

                    {/* Placeholder content */}
                    <div className="bg-white rounded-lg p-8 border border-gray-200">
                        <p className="text-neutral/60">
                            Coming soon: Vocabulary lists, practice exercises, and learning materials.
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
```

### 9.2. Create Thai Page

**File**: `resources/js/Pages/Thai.tsx`

```tsx
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

interface ThaiPageProps extends PageProps {
    language?: string;
}

export default function Thai({ auth }: ThaiPageProps) {
    return (
        <>
            <Head>
                <title>Thai Learning - LangNote</title>
            </Head>

            <div className="min-h-screen flex flex-col bg-page-bg">
                <Header user={auth.user} currentPath="/lang-note/thai" />

                <main className="flex-1 container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-neutral mb-6">
                        タイ語学習
                    </h1>
                    <p className="text-lg text-neutral/80 mb-8">
                        タイ語学習コンテンツをここに追加予定です。
                    </p>

                    <div className="bg-white rounded-lg p-8 border border-gray-200">
                        <p className="text-neutral/60">
                            Coming soon: Vocabulary lists, practice exercises, and learning materials.
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
```

### 9.3. Create Korean Page

**File**: `resources/js/Pages/Korean.tsx`

```tsx
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

interface KoreanPageProps extends PageProps {
    language?: string;
}

export default function Korean({ auth }: ThaiPageProps) {
    return (
        <>
            <Head>
                <title>Korean Learning - LangNote</title>
            </Head>

            <div className="min-h-screen flex flex-col bg-page-bg">
                <Header user={auth.user} currentPath="/lang-note/korean" />

                <main className="flex-1 container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-neutral mb-6">
                        韓国語学習
                    </h1>
                    <p className="text-lg text-neutral/80 mb-8">
                        韓国語学習コンテンツをここに追加予定です。
                    </p>

                    <div className="bg-white rounded-lg p-8 border border-gray-200">
                        <p className="text-neutral/60">
                            Coming soon: Vocabulary lists, practice exercises, and learning materials.
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
```

---

## Step 10: Delete Welcome.tsx

### 10.1. Remove Old Welcome Page

```bash
rm resources/js/Pages/Welcome.tsx
```

**Reason**: TopPage.tsx replaces Welcome.tsx as the new landing page

**Verify**: Check that no imports reference Welcome.tsx

---

## Step 11: Test All Pages

### 11.1. Start Development Servers

**Terminal 1 - Laravel (inside Docker)**:
```bash
docker exec -it laravel-apache-myapp-1 bash
cd /var/www/html/lang-note
php artisan serve --host=0.0.0.0 --port=8000
```

**Terminal 2 - Vite (host machine)**:
```bash
npm run dev
```

### 11.2. Test Scenarios

**Test 1: Top Page**
- Navigate to `http://localhost:8000/`
- ✓ Hero image displays
- ✓ Japanese text visible over image
- ✓ Three language cards visible
- ✓ Header shows logo and language selector
- ✓ Footer shows brand name and links

**Test 2: Navigation**
- Click "English" card → navigates to `/lang-note/english`
- Click "Thai" card → navigates to `/lang-note/thai`
- Click "Korean" card → navigates to `/lang-note/korean`
- Click logo → returns to `/`

**Test 3: Language Selector**
- Click "Language" dropdown
- ✓ Shows English, Thai, Korean options
- Select "English" → navigates to English page
- Repeat for Thai and Korean

**Test 4: Login Modal**
- Click "Login" button (when logged out)
- ✓ Modal opens with Japanese text
- ✓ "Googleで続ける" button visible
- Click outside modal → closes
- Press ESC → closes
- Click Google button → redirects to OAuth

**Test 5: Authenticated State**
- Complete Google login
- ✓ Header shows user name instead of login button
- ✓ Logout link visible
- Navigate between pages → header persists

---

## Step 12: Verify Responsive Design

### 12.1. Mobile (320px - 480px)

**Browser DevTools**: Set viewport to 375px width

✓ Header stacks or uses hamburger (if implemented)
✓ Hero text readable at small size
✓ Language cards stack vertically
✓ Footer links visible
✓ Touch targets ≥44px

### 12.2. Tablet (481px - 1024px)

**Browser DevTools**: Set viewport to 768px width

✓ Header horizontal layout
✓ Hero text properly sized
✓ Language cards in 2-column or 3-column grid
✓ Footer layout appropriate

### 12.3. Desktop (1024px+)

**Browser DevTools**: Set viewport to 1920px width

✓ Content max-width prevents excessive stretching
✓ Hero text centered and readable
✓ Language cards in 3-column grid
✓ All hover effects work

---

## Step 13: Accessibility Audit

### 13.1. Keyboard Navigation

**Test**:
- Tab through header: Logo → Language dropdown → Login button
- Open language dropdown with Enter/Space
- Navigate dropdown with Arrow keys
- Select with Enter
- Tab to footer links

✓ All interactive elements reachable
✓ Visible focus indicators
✓ Logical tab order

### 13.2. Screen Reader

**Test** (with NVDA/JAWS/VoiceOver):
- Page title announced
- Header structure clear
- Logo has appropriate label
- Language selector announced correctly
- Modal title announced when opened
- Footer navigation announced

### 13.3. Color Contrast

**Tool**: Use browser extension (WAVE, axe DevTools)

✓ Text on white background meets 4.5:1 ratio
✓ Primary color text meets contrast requirements
✓ Hero text over image readable (with overlay)
✓ Button text readable

### 13.4. Lighthouse Audit

**Run Audit**:
```bash
# In browser DevTools > Lighthouse
# Run audit for Desktop and Mobile
```

**Target Scores**:
- Accessibility: ≥90
- Performance: ≥80
- Best Practices: ≥90
- SEO: ≥90

---

## Troubleshooting

### Issue: Colors Not Showing

**Problem**: `bg-primary` not applying color

**Solution**:
1. Verify `tailwind.config.js` updated correctly
2. Restart Vite dev server: `npm run dev`
3. Clear browser cache
4. Check browser console for CSS errors

### Issue: Images Not Loading

**Problem**: Hero image shows broken or blank

**Solution**:
1. Verify image exists: `ls resources/js/images/top.jpg`
2. Check import path in TopPage.tsx
3. Verify Vite config handles image imports
4. Restart Vite dev server

### Issue: Modal Not Opening

**Problem**: Click login button, nothing happens

**Solution**:
1. Check browser console for errors
2. Verify Dialog component installed: `ls resources/js/Components/ui/dialog.tsx`
3. Check useState import in Header.tsx
4. Verify LoginModal import path correct

### Issue: Navigation Not Working

**Problem**: Click language card, page doesn't change

**Solution**:
1. Check routes defined: `php artisan route:list`
2. Verify TopController methods exist
3. Check InertiaJS Link import
4. Check router.visit() syntax
5. Verify Laravel dev server running

### Issue: TypeScript Errors

**Problem**: IDE shows TypeScript errors

**Solution**:
1. Run type generation: `npm run generate-types`
2. Restart TypeScript server in VS Code
3. Check `@/` path alias in tsconfig.json
4. Verify PageProps interface exists

---

## Verification Commands

```bash
# Check routes
php artisan route:list

# Check files exist
ls -la resources/js/Pages/TopPage.tsx
ls -la resources/js/Components/Header.tsx
ls -la resources/js/Components/Footer.tsx
ls -la resources/js/Components/LoginModal.tsx

# Check Tailwind config
cat tailwind.config.js | grep primary

# Run type generation
npm run generate-types

# Build for production (optional)
npm run build
```

---

## Next Steps

After completing implementation:

1. **Add Hero Image** (if not exists):
   - Place optimized image at `resources/js/images/top.jpg`
   - Recommended: 1920x1080, compressed, <500KB

2. **Update Dashboard** (optional):
   - Add Header/Footer to Dashboard.tsx for consistency
   - Update dashboard content

3. **Create Privacy Policy Page** (future):
   - Implement `/privacy-policy` route
   - Create PrivacyPolicy.tsx page component

4. **Add Content to Language Pages** (future feature):
   - Implement vocabulary lists
   - Add practice exercises
   - Create lesson structures

5. **Testing** (recommended):
   - Write Feature tests for routes
   - Add Component tests for Header/Footer
   - Test OAuth flow end-to-end

---

## Success Criteria

✅ All pages render without errors
✅ Navigation works (logo, cards, dropdown)
✅ Login modal opens and closes correctly
✅ OAuth flow functions (redirects to Google)
✅ Responsive on mobile, tablet, desktop
✅ Colors match specification
✅ Japanese text displays correctly
✅ Accessibility: keyboard nav, screen readers
✅ No console errors
✅ Lighthouse score ≥90 for accessibility

---

## Estimated Timeline

- **Setup** (Steps 1-4): 30 minutes
- **Components** (Steps 5-7): 1 hour
- **Pages** (Steps 8-9): 1 hour
- **Testing** (Steps 11-13): 1 hour
- **Fixes & Polish**: 30 minutes

**Total**: 3-4 hours for experienced developer

---

## Support Resources

- **Tailwind Docs**: https://tailwindcss.com/docs
- **Shadcn/ui Docs**: https://ui.shadcn.com
- **InertiaJS Docs**: https://inertiajs.com
- **Laravel Docs**: https://laravel.com/docs
- **React Docs**: https://react.dev

---

**Implementation Date**: 2026-02-15
**Last Updated**: 2026-02-15
**Status**: Ready for implementation
