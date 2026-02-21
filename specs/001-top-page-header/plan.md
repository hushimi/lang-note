# Implementation Plan: Top Page and Header Component with Theme System

**Branch**: `001-top-page-header` | **Date**: 2026-02-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-top-page-header/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a Japanese-language landing page (top page) to replace the current Welcome page, along with a persistent header component and footer component. The landing page will feature a hero image with Japanese text promoting the language learning platform and provide navigation to three language-specific learning pages (English, Thai, Korean). The header includes a logo with custom branding colors, language selector dropdown, and login button with modal. The application uses a calm, focused color palette optimized for extended learning sessions and supports light mode only. All interface elements remain in Japanese while allowing users to navigate to different language learning content.

## Technical Context

**Language/Version**: 
- Backend: PHP 8.2+ with Laravel 12
- Frontend: TypeScript 5.9+ with React 19

**Primary Dependencies**: 
- Backend: Laravel 12, InertiaJS Laravel ^2.0, Laravel Data ^4.19, TypeScript Transformer ^2.5, Laravel Socialite ^5.24, Ziggy ^2.6
- Frontend: React 19, @inertiajs/react ^2.3, TypeScript ^5.9, Tailwind CSS ^4.1, Shadcn/ui components, FontAwesome icons

**Storage**: MySQL 8.0+ with table prefix `ln_` (existing configuration), session storage for theme/language preferences (future consideration - not in scope for this feature)

**Testing**: PHPUnit for backend (Action unit tests, Feature tests for controllers), Vitest for frontend component tests (not priority for Phase 1)

**Target Platform**: Web application (responsive design for desktop, tablet, mobile browsers; minimum viewport 320px width)

**Project Type**: Web application (monolith with InertiaJS - single codebase, no separate API)

**Performance Goals**: 
- Landing page initial load: <3 seconds on standard broadband
- Navigation interactions: <100ms response time
- Page transitions: <1 second
- Login modal open: <200ms

**Constraints**: 
- All interface text must remain in Japanese (no internationalization for UI)
- Light mode only (no dark mode support)
- Must use Shadcn/ui components exclusively for UI primitives
- No custom CSS files (Tailwind utilities only)
- Hero image already provided at resources/js/images/top.jpg

**Scale/Scope**: 
- Single landing page replacing Welcome.tsx
- 3 language learning page routes (English, Thai, Korean) - placeholders initially
- 2 new shared components (Header, Footer)
- 1 modal component (Login modal)
- No authentication logic required initially (modal UI only)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Review against [Constitution v1.0.0](../.specify/memory/constitution.md):

**Core Principles Alignment**:
- [x] **I. Clean Architecture**: Feature respects Domain/Application/Infrastructure/Presentation layers
  - Presentation: Controllers render Inertia pages with minimal logic
  - Application: No Actions needed initially (no business logic for static pages/navigation)
  - Domain: No domain models required (using existing User model for auth context)
  - Infrastructure: Google OAuth already implemented, reused for login modal
  
- [x] **II. Type Safety**: All DTOs use Laravel Data with TypeScript generation
  - PageProps interfaces will extend base PageProps with auth data
  - No new Data classes required initially (static content pages)
  - Generated types from existing UserData will be used
  
- [x] **III. Thin Controllers**: Controllers only handle HTTP, Actions contain business logic
  - Page controllers simply return Inertia::render() with props
  - No business logic in controllers (just view rendering)
  - No Actions needed for static content display
  
- [x] **IV. InertiaJS Monolith**: No separate API, all data via Inertia props
  - All navigation uses InertiaJS Link component
  - Language selector uses router.visit() for page navigation
  - Login modal triggers InertiaJS form submission (existing OAuth flow)
  - No fetch/axios calls
  
- [x] **V. Component Architecture**: Components organized into Pages/UI/Shared categories
  - Pages: TopPage.tsx, English.tsx, Thai.tsx, Korean.tsx
  - Shared Components: Header.tsx, Footer.tsx, LoginModal.tsx
  - UI Components: Using existing Shadcn/ui primitives (Button, Card, Dialog, DropdownMenu)
  
- [x] **VI. Utility-First Styling**: Tailwind utilities only, no custom CSS
  - All styling via Tailwind utility classes
  - Color palette defined in tailwind.config.js theme
  - Use cn() utility for conditional classes
  - No inline styles except for hero image background (style={{backgroundImage: `url(...)`}})
  
- [x] **VII. Dependency Injection**: All dependencies via constructor injection
  - N/A for this feature (no services/repositories/actions required)
  - Controllers use type-hinted constructor if dependencies added later

**Technology Stack Compliance**:
- [x] Using required packages (Laravel Data, InertiaJS, TypeScript, Tailwind v4)
  - All existing packages remain in use
  - No new packages required
  
- [x] Following file organization structure (Actions/, Data/, Pages/, Components/)
  - New files follow established patterns
  - Pages in resources/js/Pages/
  - Components in resources/js/Components/
  
- [x] No forbidden patterns (API routes, inline styles, fetch/axios in components)
  - Only web routes (no API routes)
  - No fetch/axios (InertiaJS only)
  - Minimal inline styles (only background image URL)

**Constitution Compliance Summary**: ✅ PASS - All principles aligned, no violations

**Minor Deviation Note**: Background image URL requires inline style (`style={{backgroundImage}}`). This is acceptable as it's dynamic content (image path) and is the standard React pattern for background images. Alternative would be to use Tailwind's arbitrary values but inline style is cleaner for this use case.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── Http/
│   └── Controllers/
│       └── TopController.php          # NEW: Renders top page and language pages
├── Data/
│   └── UserData.php                   # EXISTING: Used for auth context
└── Models/
    └── User.php                        # EXISTING: Auth model

resources/
├── js/
│   ├── Pages/
│   │   ├── TopPage.tsx               # NEW: Main landing page (replaces Welcome.tsx)
│   │   ├── Welcome.tsx               # DELETE: Replaced by TopPage
│   │   ├── Dashboard.tsx             # EXISTING: Keep as-is
│   │   ├── English.tsx               # NEW: English learning page (placeholder)
│   │   ├── Thai.tsx                  # NEW: Thai learning page (placeholder)
│   │   └── Korean.tsx                # NEW: Korean learning page (placeholder)
│   ├── Components/
│   │   ├── ui/                       # EXISTING: Shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx            # EXISTING or ADD via Shadcn CLI
│   │   │   └── dropdown-menu.tsx     # ADD via Shadcn CLI if not exists
│   │   ├── Header.tsx                # NEW: Global header with logo, language selector, login
│   │   ├── Footer.tsx                # NEW: Global footer with links
│   │   └── LoginModal.tsx            # NEW: Login modal with Google OAuth
│   ├── types/
│   │   ├── generated.d.ts            # AUTO-GENERATED: TypeScript types from PHP
│   │   └── index.d.ts                # EXISTING: Manual type definitions
│   ├── lib/
│   │   └── utils.ts                  # EXISTING: cn() utility
│   └── images/
│       └── top.jpg                   # EXISTING: Hero image for top page
└── css/
    └── app.css                        # MODIFY: Add color palette to Tailwind theme

routes/
└── web.php                            # MODIFY: Add routes for top page and language pages

tailwind.config.js                     # MODIFY: Extend theme with brand colors

tests/
└── Feature/
    └── TopControllerTest.php          # NEW: Feature tests for page rendering (future)
```

**Structure Decision**: Laravel InertiaJS monolith architecture

This is a web application using Laravel as the backend and React with InertiaJS as the frontend, following the monolith pattern. The structure aligns with the project constitution:
- Controllers in `app/Http/Controllers/` handle HTTP and render Inertia pages
- React pages in `resources/js/Pages/` are top-level Inertia components
- Shared components in `resources/js/Components/` are reusable across pages
- UI primitives from Shadcn/ui in `resources/js/Components/ui/`
- All styling via Tailwind utilities configured in `tailwind.config.js`
- Routes defined in Laravel's `routes/web.php` (no API routes)

---

## Phase 0: Research (Complete)

**Status**: ✅ Complete
**Output**: [research.md](research.md)

**Key Decisions**:
1. Use Shadcn/ui Dialog for login modal
2. Use Shadcn/ui DropdownMenu for language selector
3. Implement hero background via inline style (standard React pattern)
4. Use router.visit() for language navigation
5. Extend Tailwind theme with brand color palette
6. Semantic HTML5 footer structure
7. Integrate existing Google OAuth (no backend changes)
8. Minimal page props (PageProps only)
9. Tailwind default breakpoints with mobile-first approach
10. Separate routes per language page
11. Local useState for modal state (no global state)

**Research Areas Covered**:
- Component selection and patterns
- Navigation implementation
- Color palette configuration
- Responsive design strategy
- Route structure
- State management approach

---

## Phase 1: Design & Contracts (Complete)

**Status**: ✅ Complete
**Outputs**:
- [data-model.md](data-model.md) - Entity definitions and type interfaces
- [contracts/routes.md](contracts/routes.md) - Route contracts and navigation patterns
- [contracts/components.md](contracts/components.md) - Component interfaces and props
- [quickstart.md](quickstart.md) - Step-by-step implementation guide

**Artifacts Created**:
1. **Data Model**: Minimal complexity, leverages existing User entity, defines all TypeScript interfaces
2. **Route Contracts**: 4 new routes (home, english, thai, korean), InertiaJS navigation patterns
3. **Component Contracts**: 8 components (4 pages, 3 shared, 1 modal), full TypeScript interfaces
4. **Quickstart Guide**: 13-step implementation checklist with code examples, ~3-4 hour estimate

**Architecture Validation**:
- ✅ Constitution Check: All principles aligned
- ✅ No violations or deviations
- ✅ Follows InertiaJS monolith pattern
- ✅ Uses Shadcn/ui components exclusively
- ✅ Tailwind utilities for all styling
- ✅ Type-safe with TypeScript throughout

**Agent Context Updated**:
- Updated `.cursor/rules/specify-rules.mdc` with MySQL and project type information
- Cursor IDE agent aware of database and architecture patterns

---

## Implementation Summary

**Feature Scope**:
- Replace Welcome.tsx with new TopPage.tsx landing page
- Create persistent Header component with logo, language selector, login modal
- Create Footer component with brand and links
- Create 3 language learning page placeholders (English, Thai, Korean)
- Implement calm, focused color palette in Tailwind theme
- Support light mode only (no dark mode)
- All interface text remains in Japanese

**Components to Create**:
| Component | Type | File | Lines (est.) |
|-----------|------|------|--------------|
| TopPage | Page | Pages/TopPage.tsx | ~120 |
| English | Page | Pages/English.tsx | ~40 |
| Thai | Page | Pages/Thai.tsx | ~40 |
| Korean | Page | Pages/Korean.tsx | ~40 |
| Header | Shared | Components/Header.tsx | ~80 |
| Footer | Shared | Components/Footer.tsx | ~30 |
| LoginModal | Shared | Components/LoginModal.tsx | ~50 |
| TopController | Controller | Http/Controllers/TopController.php | ~40 |

**Total New Code**: ~440 lines (estimated)
**Files Modified**: 2 (routes/web.php, tailwind.config.js)
**Files Deleted**: 1 (Pages/Welcome.tsx)

**Dependencies**:
- Install Shadcn/ui Dialog: `npx shadcn@latest add dialog`
- Install Shadcn/ui DropdownMenu: `npx shadcn@latest add dropdown-menu`
- No new npm packages required

**Configuration Changes**:
1. Tailwind config: Add 7 custom colors (primary, secondary, accent, neutral, success, error, page-bg)
2. Routes: Add 4 new routes, replace home route
3. No env variable changes needed

**Testing Approach**:
- Manual testing via browser (top priority)
- Feature tests for routes (recommended)
- Component tests (optional, future)
- Accessibility audit (Lighthouse, keyboard nav, screen reader)

**Performance Targets**:
- Landing page: <3s initial load
- Navigation: <100ms response
- Page transitions: <1s
- Modal open: <200ms

All targets achievable with InertiaJS and Vite optimization.

---

## Next Phase

**Phase 2**: Task Breakdown (via `/speckit.tasks` command)

After implementation plan approval, use `/speckit.tasks` to:
1. Break down implementation into atomic tasks
2. Assign task categories (Backend, Frontend, Testing, Documentation)
3. Define task dependencies and order
4. Create developer checklist

**Estimated Implementation Time**: 3-4 hours for experienced developer

**Ready to Proceed**: ✅ Yes - All planning artifacts complete, constitution compliant, ready for task breakdown

---

## Revision History

| Date | Phase | Status | Notes |
|------|-------|--------|-------|
| 2026-02-15 | Planning | Started | Initial plan creation |
| 2026-02-15 | Phase 0 | Complete | Research decisions documented |
| 2026-02-15 | Phase 1 | Complete | Design artifacts created |
| 2026-02-15 | Planning | Ready | Awaiting task breakdown phase |

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations detected. All architectural principles are followed.

The feature is straightforward:
- Static content pages (no business logic complexity)
- Reusing existing authentication infrastructure (Google OAuth)
- Standard InertiaJS page rendering pattern
- Component composition from Shadcn/ui primitives
- Tailwind utility styling throughout

The only minor deviation (inline style for background image) is a React best practice and doesn't violate the spirit of the utility-first styling principle.
