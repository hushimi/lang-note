# Phase 0: Research & Design Decisions

**Feature**: Top Page and Header Component with Theme System
**Date**: 2026-02-15
**Status**: Complete

## Research Questions

### 1. Shadcn/ui Component Selection

**Question**: Which Shadcn/ui components are needed for this feature?

**Research Findings**:
- **Button**: Already installed, needed for language buttons and login button
- **Card**: Already installed, may be useful for content sections
- **Dialog**: Needed for login modal (if not installed, add via `npx shadcn@latest add dialog`)
- **Dropdown Menu**: Needed for language selector (if not installed, add via `npx shadcn@latest add dropdown-menu`)

**Decision**: Use Dialog for login modal, DropdownMenu for language selector

**Rationale**: 
- Dialog provides accessible modal with focus trap, escape key handling, and backdrop
- DropdownMenu provides accessible dropdown with keyboard navigation
- Both components follow WAI-ARIA guidelines for accessibility
- Consistent with Shadcn/ui design system already in use

**Alternatives Considered**:
- Custom modal/dropdown: Rejected because it violates constitution (must use Shadcn/ui)
- Popover for language selector: Rejected because DropdownMenu is more semantic for navigation

---

### 2. Hero Image Implementation Pattern

**Question**: What's the best way to implement a hero section with background image in React + Tailwind?

**Research Findings**:
- Background image via inline style: `style={{backgroundImage: \`url(\${image})\`}}`
- Background image via Tailwind classes: Not suitable for dynamic paths
- Image component with absolute positioning: More complex, less performant

**Decision**: Use inline style with backgroundImage for hero section

**Rationale**:
- Standard React pattern for dynamic background images
- Allows using imported image path from resources/js/images/
- Minimal deviation from utility-first styling (only for dynamic content)
- Better performance than loading separate <img> element

**Implementation**:
```typescript
import topImage from '@/images/top.jpg';

<div style={{backgroundImage: `url(${topImage})`}} className="...">
```

---

### 3. Language Selector Navigation Pattern

**Question**: How should the language dropdown trigger navigation in InertiaJS?

**Research Findings**:
- InertiaJS Link component: For anchor tags, requires href
- router.visit(): For programmatic navigation from event handlers
- router.get(): Alias for router.visit() with GET method

**Decision**: Use router.visit() in dropdown onSelect handler

**Rationale**:
- DropdownMenu uses onSelect callback, not href
- router.visit() preserves SPA experience (no full page reload)
- Maintains scroll position and allows transition effects
- Follows InertiaJS monolith pattern (no fetch/axios)

**Implementation**:
```typescript
import { router } from '@inertiajs/react';

<DropdownMenuItem onSelect={() => router.visit('/lang-note/english')}>
  English
</DropdownMenuItem>
```

---

### 4. Color Palette Implementation

**Question**: How to implement custom color palette in Tailwind v4?

**Research Findings**:
- Tailwind v4 uses CSS variables in theme configuration
- Custom colors defined in tailwind.config.js under theme.extend.colors
- Can use hex values directly or CSS custom properties
- Colors must meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text)

**Decision**: Extend Tailwind theme in tailwind.config.js with hex values

**Rationale**:
- Direct hex values are simpler than CSS variables for static palette
- Provides IntelliSense support in VS Code
- Accessible via Tailwind classes like `bg-primary`, `text-secondary`
- Easy to verify and maintain

**Implementation**:
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#B2E09D',    // Soft green
      secondary: '#4EBDFF',  // Bright blue  
      accent: '#FF9D71',     // Warm orange
      neutral: '#2F4858',    // Dark blue-gray
      success: '#68EDCB',    // Teal
      error: '#FF869A',      // Coral pink
      'page-bg': '#F8FFF8',  // Very light green
    }
  }
}
```

---

### 5. Footer Component Structure

**Question**: What's the best semantic HTML structure for a footer with multiple sections?

**Research Findings**:
- HTML5 `<footer>` element for semantic meaning
- Flexbox or Grid for layout (mobile-first approach)
- Navigation links should use `<nav>` within footer
- InertiaJS Link for internal navigation

**Decision**: Use semantic HTML5 footer with flexbox layout

**Rationale**:
- Semantic HTML improves accessibility and SEO
- Flexbox provides flexible responsive layout
- Mobile-first approach ensures usability on small screens
- InertiaJS Link maintains SPA behavior

**Implementation Structure**:
```typescript
<footer className="border-t border-gray-200 py-6">
  <div className="container mx-auto px-4">
    <div className="mb-4">
      <span className="text-lg font-semibold">LangNote</span>
    </div>
    <nav className="flex gap-4">
      <Link href="/">Home</Link>
      <Link href="/privacy-policy">Privacy Policy</Link>
    </nav>
  </div>
</footer>
```

---

### 6. Login Modal Google OAuth Integration

**Question**: How to integrate existing Google OAuth with new login modal?

**Research Findings**:
- Existing OAuth implementation in OAuthController
- Route: POST /auth/google (redirects to Google)
- Callback: GET /auth/google/callback
- Current Welcome page uses direct navigation

**Decision**: Use Inertia Link to trigger OAuth flow from modal

**Rationale**:
- Existing OAuth infrastructure works correctly
- No need to modify backend code
- Link preserves InertiaJS navigation pattern
- Modal can close or stay open during redirect

**Implementation**:
```typescript
<Dialog>
  <DialogContent>
    <DialogTitle>Lang Noteへようこそ</DialogTitle>
    <p>ログインすることでプライバシーポリシーに同意したことになります</p>
    <Link 
      href="/auth/google" 
      className="..."
    >
      Googleで続ける
    </Link>
  </DialogContent>
</Dialog>
```

---

### 7. Page Component Props Pattern

**Question**: What props should the new page components receive?

**Research Findings**:
- All Inertia pages receive base PageProps (auth, errors, flash)
- Custom props passed via controller Inertia::render() second argument
- TypeScript interfaces should extend PageProps
- Shared props (auth) available on all pages

**Decision**: Use minimal props - rely on PageProps for auth context

**Rationale**:
- Static pages don't need additional props initially
- Auth context from PageProps sufficient for header state
- Keeps controllers thin (no prop preparation logic)
- Easy to extend later if dynamic content needed

**Implementation**:
```typescript
// TypeScript interface
interface TopPageProps extends PageProps {
  // No additional props needed initially
}

// Controller
public function top()
{
    return Inertia::render('TopPage');
}
```

---

### 8. Responsive Design Breakpoints

**Question**: What responsive breakpoints should be used for mobile/tablet/desktop?

**Research Findings**:
- Specification requires: 320px minimum, mobile (320-480px), tablet (481-1024px), desktop (1024px+)
- Tailwind default breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- Mobile-first approach: base styles for mobile, override for larger screens

**Decision**: Use Tailwind default breakpoints with mobile-first approach

**Rationale**:
- Tailwind defaults align closely with spec requirements
- md: breakpoint (768px) suitable for tablet optimization
- lg: breakpoint (1024px) for desktop layouts
- Mobile-first ensures base experience works on all devices
- No need to customize breakpoints

**Implementation Pattern**:
```typescript
// Mobile-first classes
<div className="flex flex-col md:flex-row lg:gap-8">
  {/* Stacks vertically on mobile, horizontal on tablet+ */}
</div>
```

---

### 9. Route Structure for Language Pages

**Question**: Should language pages use separate routes or route parameters?

**Research Findings**:
- Option A: Separate routes (/lang-note/english, /lang-note/thai, /lang-note/korean)
- Option B: Single route with parameter (/lang-note/{language})
- Specification explicitly defines: "English: /lang-note/english", etc.

**Decision**: Use separate routes as specified

**Rationale**:
- Specification explicitly defines separate URLs
- Bookmarkable, shareable URLs for each language
- Clearer intent in route definitions
- Easier to add language-specific logic later if needed
- No routing complexity with parameter validation

**Implementation**:
```php
// routes/web.php
Route::get('/lang-note/english', [TopController::class, 'english'])->name('language.english');
Route::get('/lang-note/thai', [TopController::class, 'thai'])->name('language.thai');
Route::get('/lang-note/korean', [TopController::class, 'korean'])->name('language.korean');
```

---

### 10. Header Component State Management

**Question**: How should header component manage login modal state?

**Research Findings**:
- React useState for local component state
- No global state needed (modal used only in header)
- Dialog component from Shadcn/ui uses controlled open state
- No persistence needed (modal state resets on navigation)

**Decision**: Use React useState in Header component

**Rationale**:
- Simple, local state solution
- No global state library needed (follows constitution)
- Dialog open/close controlled by local state
- Follows React best practices

**Implementation**:
```typescript
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

<Button onClick={() => setIsLoginModalOpen(true)}>Login</Button>
<LoginModal 
  open={isLoginModalOpen} 
  onOpenChange={setIsLoginModalOpen} 
/>
```

---

## Summary of Key Decisions

| Decision | Choice | Impact |
|----------|--------|--------|
| Modal Component | Shadcn/ui Dialog | Accessible, follows design system |
| Dropdown Component | Shadcn/ui DropdownMenu | Keyboard accessible, semantic |
| Hero Background | Inline style backgroundImage | Standard React pattern for dynamic images |
| Language Navigation | router.visit() | Maintains SPA experience |
| Color Palette | Tailwind theme extension | Provides utility classes |
| Footer Structure | Semantic HTML5 footer | Improves accessibility |
| OAuth Integration | Existing flow, Inertia Link | No backend changes needed |
| Page Props | Minimal (PageProps only) | Keeps controllers thin |
| Responsive Breakpoints | Tailwind defaults | Mobile-first, spec-aligned |
| Routes | Separate per language | Bookmarkable, clear intent |
| Modal State | Local useState | Simple, no global state |

**Next Phase**: Proceed to Phase 1 (Design & Contracts)
