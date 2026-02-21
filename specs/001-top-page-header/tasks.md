# Tasks: Top Page and Header Component with Theme System

**Feature Branch**: `001-top-page-header`
**Input**: Design documents from `/specs/001-top-page-header/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested in specification - manual testing via browser is sufficient for this UI-focused feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] [Type] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- **[Type]**: Task category aligned with constitution principles

## Task Types (Constitution-Aligned)

Based on [Constitution v1.0.0](../.specify/memory/constitution.md) principles:

- **[Controller]**: Thin HTTP controller (Principle III)
- **[Page]**: InertiaJS page component (Principle IV, V)
- **[Component]**: Reusable React component (Principle V)
- **[Config]**: Configuration file updates
- **[Routes]**: Route definitions
- **[Cleanup]**: Remove obsolete files

## Path Conventions

**Laravel/React Monolith** (this project):

- **Backend**: `app/Http/Controllers/`
- **Frontend**: `resources/js/Pages/`, `resources/js/Components/`, `resources/js/Components/ui/`
- **Config**: `tailwind.config.js`, `routes/web.php`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and configuration

**Constitution Compliance**: Tasks must align with [v1.0.0](../.specify/memory/constitution.md)

- [x] T001 [P] [Config] Update tailwind.config.js to add custom color palette (primary: #B2E09D, secondary: #4EBDFF, accent: #FF9D71, neutral: #2F4858, success: #68EDCB, error: #FF869A, page-bg: #F8FFF8)
- [x] T002 [P] Install Shadcn/ui Dialog component via `npx shadcn@latest add dialog`
- [x] T003 Restart Vite dev server to apply Tailwind configuration changes

**Checkpoint**: Configuration complete - component development can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [Controller] Create TopController in app/Http/Controllers/TopController.php with top() method only
- [x] T005 [Routes] Update routes/web.php to replace Welcome route with top page route (GET /)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First-Time Visitor Discovers Lang Note's Purpose (Priority: P1) 🎯 MVP

**Goal**: Create landing page with hero image, Japanese motivational text, and language selection cards so first-time visitors understand Lang Note's purpose immediately

**Independent Test**: Load http://localhost:8000/ and verify:

- Hero image displays from resources/js/images/top.jpg
- Japanese text "学んだ表現を保存。いつでも見返せる。何度も復習して自分のものにしよう。" is visible over hero image
- Three language selection cards (English, Thai, Korean) are visible and clickable
- Clicking any language card navigates to appropriate /lang-note/{language} URL

### Implementation for User Story 1

- [x] T006 [US1] [Page] Create TopPage component in resources/js/Pages/TopPage.tsx with hero section, Japanese motivational text overlay, and language selection cards using Shadcn/ui Card components
- [x] T007 [US1] [Page] Verify hero image at resources/js/images/top.jpg exists and is imported correctly in TopPage component
- [x] T008 [US1] [Page] Implement language cards as visual elements (navigation functionality will be added in future when language pages are created)
- [x] T009 [US1] [Page] Add responsive grid layout for language cards (1 column mobile, 3 columns desktop)
- [x] T010 [US1] Verify TopPage renders at http://localhost:8000/ with all visual elements and interactions working

**Checkpoint**: At this point, User Story 1 should be fully functional - visitors can see the value proposition and select a language to learn

---

## Phase 4: User Story 2 - User Navigates Between Application Sections (Priority: P2)

**Goal**: Create persistent header component with logo, language selector dropdown, and authentication controls so users can navigate consistently across all pages

**Independent Test**: Navigate to any page (/, /dashboard, /lang-note/english) and verify:

- Header appears at top of page with logo "Ln" (L in primary green, n in secondary blue)
- Language dropdown shows English, Thai, Korean options
- When not logged in: "Login" button displays
- When logged in: User name and "Logout" link display
- Clicking language option navigates to correct page
- Clicking Login button opens modal with Japanese welcome text and Google OAuth option

### Implementation for User Story 2

- [x] T011 [P] [US2] [Component] Create LoginModal component in resources/js/Components/LoginModal.tsx using Shadcn/ui Dialog with Japanese welcome text "Lang Noteへようこそ", privacy policy text "ログインすることでプライバシーポリシーに同意したことになります", and Google OAuth button "Googleで続ける" linking to /auth/google
- [x] T012 [P] [US2] [Component] Create Footer component in resources/js/Components/Footer.tsx with "LangNote" brand text and links to Home and Privacy Policy
- [x] T013 [US2] [Component] Create Header component in resources/js/Components/Header.tsx with logo (L in primary, n in secondary) and conditional auth UI (Login button when user is null, user name + logout when authenticated) - language selector will be added later
- [x] T014 [US2] [Component] Add useState hook in Header component to control LoginModal open/close state
- [x] T015 [US2] Update TopPage component to use Header and Footer components (import and render at top/bottom)
- [x] T016 [US2] Test header navigation: verify logo links to /, login button opens modal, logout link works when authenticated

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - visitors see landing page AND can navigate via persistent header/footer

---

## Phase 5: User Story 3 - User Accesses Application Across Devices (Priority: P2)

**Goal**: Ensure responsive design works across mobile (320-480px), tablet (481-1024px), and desktop (1024px+) devices

**Independent Test**: Use browser DevTools to test at different viewport widths:

- 375px (mobile): Hero text readable, language cards stack vertically, header/footer visible, no horizontal scroll
- 768px (tablet): Language cards in 2-3 column grid, header horizontal layout
- 1920px (desktop): Language cards in 3 column grid, content max-width prevents excessive stretching

### Implementation for User Story 3

- [x] T017 [US3] Add responsive Tailwind classes to TopPage hero section (text sizing: text-4xl md:text-5xl lg:text-6xl)
- [x] T018 [US3] Add responsive Tailwind classes to language card grid (grid-cols-1 md:grid-cols-3)
- [x] T019 [US3] Add responsive Tailwind classes to Header component for mobile layout (flex-col md:flex-row or consider hamburger menu for very small screens)
- [x] T020 [US3] Test mobile viewport (320px): verify no horizontal scroll, text readable, touch targets >= 44px, cards stack vertically
- [x] T021 [US3] Test tablet viewport (768px): verify efficient space usage, readable text, appropriate card layout
- [x] T022 [US3] Test desktop viewport (1920px): verify content max-width prevents excessive stretching, proper use of space
- [x] T023 [US3] Test device rotation: verify layout adapts correctly from portrait to landscape on mobile/tablet sizes

**Checkpoint**: All user stories should now work independently across all device sizes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, validation, and improvements across all user stories

- [x] T024 [Cleanup] Delete obsolete Welcome.tsx file from resources/js/Pages/Welcome.tsx
- [x] T025 [P] Test all pages for accessibility: keyboard navigation (Tab through header elements), screen reader compatibility, ARIA labels
- [x] T026 [P] Run Lighthouse audit on landing page: target Accessibility >= 90, Performance >= 80
- [x] T027 [P] Verify color contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
- [x] T028 [P] Test OAuth login flow end-to-end: click Login button, authenticate with Google, verify redirect back to dashboard
- [x] T029 [P] Verify all components use Tailwind utility classes exclusively (no inline styles except hero background image)
- [x] T030 Run quickstart.md validation: follow steps 11-13 to verify all test scenarios pass

**Final Checkpoint**: Feature complete, tested, and ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational phase completion
  - User Story 1 (Phase 3): Can start after Foundational - independent
  - User Story 2 (Phase 4): Can start after Foundational - integrates with US1 but testable independently
  - User Story 3 (Phase 5): Can start after any page exists - applies responsive styles across all existing pages
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Landing Page**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2) - Navigation**: Can start after Foundational (Phase 2) - Integrates with US1 by adding Header/Footer to TopPage
- **User Story 3 (P2) - Responsive**: Can start after any page exists - Adds responsive classes to existing components

### Suggested Implementation Order

1. **MVP Focus**: Setup → Foundational → US1 → US2 → Test → Deploy
2. **Incremental**: After MVP, add US3 (Responsive) → Test → Deploy
3. **Parallel (if team available)**: After Foundational, US1 and US2 can proceed in parallel with coordination

### Within Each User Story

- Components can be built in parallel when they don't depend on each other
- Controllers and routes before pages (backend before frontend)
- Pages before testing
- Story complete before moving to next priority

### Parallel Opportunities

**Within Phase 1 (Setup)**:

- T001 (Tailwind config) and T002 (Dialog install) can run in parallel

**Within Phase 2 (Foundational)**:

- T004 (Controller) and T005 (Routes) must run sequentially (routes reference controller)

**Within Phase 4 (User Story 2)**:

- T011 (LoginModal), T012 (Footer), T013 (Header) can run in parallel - different files

**Within Phase 6 (Polish)**:

- Most polish tasks (T025-T029) can run in parallel - different validation activities

---

## Parallel Example: User Story 2 Components

```bash
# Launch all component creation for User Story 2 together:
Task T011: "Create LoginModal component in resources/js/Components/LoginModal.tsx"
Task T012: "Create Footer component in resources/js/Components/Footer.tsx"  
Task T013: "Create Header component in resources/js/Components/Header.tsx"

# After all complete, integrate:
Task T015: "Update TopPage to use Header and Footer components"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (4 tasks, ~10 minutes)
2. Complete Phase 2: Foundational (2 tasks, ~15 minutes)
3. Complete Phase 3: User Story 1 (5 tasks, ~60 minutes)
4. Complete Phase 4: User Story 2 (7 tasks, ~90 minutes)
5. **STOP and VALIDATE**: Test US1 and US2 independently
6. Deploy/demo if ready - MVP complete!

**MVP Delivers**:

- Landing page with hero image and value proposition (US1)
- Persistent navigation with header, login, and language selector (US2)
- Visitors can understand the product and navigate between sections

### Incremental Delivery

1. **MVP** (US1 + US2): Complete foundation → Landing page with navigation → Test → Deploy
2. **Increment 2** (US3): Add responsive design → Test → Deploy
3. **Final Polish** (Phase 6): Cleanup and validation → Test → Deploy

Each increment adds value without breaking previous increments.

### Parallel Team Strategy

With 2 developers after Foundational phase completes:

- **Developer A**: User Story 1 (Landing page) - 5 tasks
- **Developer B**: User Story 2 (Navigation components) - Tasks T012, T013, T014 in parallel

Once US1 and US2 complete:

- Either developer: User Story 3 (Responsive design) - Add responsive classes to existing components

---

## Task Summary

**Total Tasks**: 30

- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 2 tasks
- **Phase 3 (User Story 1)**: 5 tasks
- **Phase 4 (User Story 2)**: 6 tasks
- **Phase 5 (User Story 3)**: 7 tasks
- **Phase 6 (Polish)**: 7 tasks

**Parallel Tasks**: 10 tasks marked [P] can run in parallel with others in same phase
**Story Distribution**:

- US1: 5 tasks (~60 min)
- US2: 6 tasks (~75 min)
- US3: 7 tasks (~45 min)

**Estimated Total Time**: 2.5-3 hours (reduced - no language pages yet)

**MVP Time**: ~2 hours (Setup + Foundational + US1 + US2)

---

## Success Criteria

**User Story 1 Complete When**:
✅ Landing page displays at http://localhost:8000/
✅ Hero image with Japanese text overlay visible
✅ Three language cards visible (navigation will be added later)
✅ Visual design matches specification (colors, layout)

**User Story 2 Complete When**:
✅ Header appears on all pages with logo and login button
✅ Footer appears on all pages with brand and links
✅ Login button opens modal with Japanese text and Google OAuth option
✅ Authenticated users see name and logout link instead of login button
✅ Logo links back to home page

**User Story 3 Complete When**:
✅ All pages functional and readable on mobile (320px+)
✅ Layout adapts appropriately for tablet (768px)
✅ Layout uses space efficiently on desktop (1920px)
✅ No horizontal scrolling on any viewport size
✅ Touch targets >= 44px on mobile devices

**Feature Complete When**:
✅ All user stories pass their independent tests
✅ No console errors on any page
✅ Lighthouse accessibility score >= 90
✅ Color contrast meets WCAG 2.1 AA
✅ All constitution principles followed
✅ No blocking issues in manual testing

---

## Notes

- [P] tasks = different files, no dependencies within same phase
- [Story] label (US1, US2, US3) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are manual via browser - no automated test suite required for this feature
- Follow quickstart.md for detailed implementation guidance
- Avoid: same file conflicts, cross-story dependencies that break independence
