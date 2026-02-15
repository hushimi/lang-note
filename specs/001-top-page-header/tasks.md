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

- [ ] T001 [P] [Config] Update tailwind.config.js to add custom color palette (primary: #B2E09D, secondary: #4EBDFF, accent: #FF9D71, neutral: #2F4858, success: #68EDCB, error: #FF869A, page-bg: #F8FFF8)
- [ ] T002 [P] Install Shadcn/ui Dialog component via `npx shadcn@latest add dialog`
- [ ] T003 [P] Install Shadcn/ui DropdownMenu component via `npx shadcn@latest add dropdown-menu`
- [ ] T004 Restart Vite dev server to apply Tailwind configuration changes

**Checkpoint**: Configuration complete - component development can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [Controller] Create TopController in app/Http/Controllers/TopController.php with top(), english(), thai(), korean() methods
- [ ] T006 [Routes] Update routes/web.php to replace Welcome route with top page route (GET /) and add language page routes (GET /lang-note/english, /lang-note/thai, /lang-note/korean)

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

- [ ] T007 [US1] [Page] Create TopPage component in resources/js/Pages/TopPage.tsx with hero section, Japanese motivational text overlay, and language selection cards using Shadcn/ui Card components
- [ ] T008 [US1] [Page] Verify hero image at resources/js/images/top.jpg exists and is imported correctly in TopPage component
- [ ] T009 [US1] [Page] Implement language card click handlers using router.visit() to navigate to /lang-note/english, /lang-note/thai, /lang-note/korean
- [ ] T010 [US1] [Page] Add responsive grid layout for language cards (1 column mobile, 3 columns desktop)
- [ ] T011 [US1] Verify TopPage renders at http://localhost:8000/ with all visual elements and interactions working

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

- [ ] T012 [P] [US2] [Component] Create LoginModal component in resources/js/Components/LoginModal.tsx using Shadcn/ui Dialog with Japanese welcome text "Lang Noteへようこそ", privacy policy text "ログインすることでプライバシーポリシーに同意したことになります", and Google OAuth button "Googleで続ける" linking to /auth/google
- [ ] T013 [P] [US2] [Component] Create Footer component in resources/js/Components/Footer.tsx with "LangNote" brand text and links to Home and Privacy Policy
- [ ] T014 [US2] [Component] Create Header component in resources/js/Components/Header.tsx with logo (L in primary, n in secondary), language selector using Shadcn/ui DropdownMenu (English/Thai/Korean options calling router.visit()), and conditional auth UI (Login button when user is null, user name + logout when authenticated)
- [ ] T015 [US2] [Component] Add useState hook in Header component to control LoginModal open/close state
- [ ] T016 [US2] [Component] Implement language selector dropdown handler to call router.visit(`/lang-note/${language}`) for English, Thai, Korean options
- [ ] T017 [US2] Update TopPage component to use Header and Footer components (import and render at top/bottom)
- [ ] T018 [US2] Test header navigation: verify logo links to /, language selector navigates to correct pages, login button opens modal, logout link works when authenticated

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - visitors see landing page AND can navigate via persistent header/footer

---

## Phase 5: User Story 4 - User Selects Learning Target Language (Priority: P2)

**Goal**: Create placeholder language learning pages (English, Thai, Korean) so users can navigate to dedicated learning areas via the language selector

**Independent Test**: From any page, use language selector dropdown to navigate to each language page and verify:
- URL changes to /lang-note/english, /lang-note/thai, or /lang-note/korean
- Page displays with Header and Footer
- Page shows Japanese title ("英語学習", "タイ語学習", "韓国語学習")
- Page shows placeholder content "Coming soon" message
- Header remains functional on language pages
- Interface text remains in Japanese

### Implementation for User Story 4

- [ ] T019 [P] [US4] [Page] Create English page in resources/js/Pages/English.tsx with Header, Footer, Japanese title "英語学習", and placeholder content
- [ ] T020 [P] [US4] [Page] Create Thai page in resources/js/Pages/Thai.tsx with Header, Footer, Japanese title "タイ語学習", and placeholder content
- [ ] T021 [P] [US4] [Page] Create Korean page in resources/js/Pages/Korean.tsx with Header, Footer, Japanese title "韓国語学習", and placeholder content
- [ ] T022 [US4] Test language page navigation from top page and header dropdown: verify all three language pages load correctly with proper titles and interface in Japanese
- [ ] T023 [US4] Verify language pages maintain consistent header/footer across all pages

**Checkpoint**: All language pages accessible and functional with consistent navigation

---

## Phase 6: User Story 3 - User Accesses Application Across Devices (Priority: P2)

**Goal**: Ensure responsive design works across mobile (320-480px), tablet (481-1024px), and desktop (1024px+) devices

**Independent Test**: Use browser DevTools to test at different viewport widths:
- 375px (mobile): Hero text readable, language cards stack vertically, header/footer visible, no horizontal scroll
- 768px (tablet): Language cards in 2-3 column grid, header horizontal layout
- 1920px (desktop): Language cards in 3 column grid, content max-width prevents excessive stretching

### Implementation for User Story 3

- [ ] T024 [US3] Add responsive Tailwind classes to TopPage hero section (text sizing: text-4xl md:text-5xl lg:text-6xl)
- [ ] T025 [US3] Add responsive Tailwind classes to language card grid (grid-cols-1 md:grid-cols-3)
- [ ] T026 [US3] Add responsive Tailwind classes to Header component for mobile layout (flex-col md:flex-row or consider hamburger menu for very small screens)
- [ ] T027 [US3] Test mobile viewport (320px): verify no horizontal scroll, text readable, touch targets >= 44px, cards stack vertically
- [ ] T028 [US3] Test tablet viewport (768px): verify efficient space usage, readable text, appropriate card layout
- [ ] T029 [US3] Test desktop viewport (1920px): verify content max-width prevents excessive stretching, proper use of space
- [ ] T030 [US3] Test device rotation: verify layout adapts correctly from portrait to landscape on mobile/tablet sizes

**Checkpoint**: All user stories should now work independently across all device sizes

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, validation, and improvements across all user stories

- [ ] T031 [Cleanup] Delete obsolete Welcome.tsx file from resources/js/Pages/Welcome.tsx
- [ ] T032 [P] Test all pages for accessibility: keyboard navigation (Tab through header elements), screen reader compatibility, ARIA labels
- [ ] T033 [P] Run Lighthouse audit on landing page: target Accessibility >= 90, Performance >= 80
- [ ] T034 [P] Verify color contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
- [ ] T035 [P] Test OAuth login flow end-to-end: click Login button, authenticate with Google, verify redirect back to dashboard
- [ ] T036 [P] Test edge case: direct URL access to language pages (bookmark /lang-note/english and access directly)
- [ ] T037 [P] Test edge case: slow connection simulation (verify progressive loading)
- [ ] T038 [P] Verify all components use Tailwind utility classes exclusively (no inline styles except hero background image)
- [ ] T039 [P] Verify all components use Shadcn/ui primitives (no custom Button/Dialog/DropdownMenu implementations)
- [ ] T040 Run quickstart.md validation: follow steps 11-13 to verify all test scenarios pass

**Final Checkpoint**: Feature complete, tested, and ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User Story 1 (Phase 3): Can start after Foundational - independent
  - User Story 2 (Phase 4): Can start after Foundational - integrates with US1 but testable independently
  - User Story 4 (Phase 5): Depends on User Story 2 (needs Header component) - integrates but testable independently
  - User Story 3 (Phase 6): Can start after any page exists - applies responsive styles across all existing pages
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Landing Page**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2) - Navigation**: Can start after Foundational (Phase 2) - Integrates with US1 by adding Header/Footer to TopPage
- **User Story 4 (P2) - Language Pages**: Depends on User Story 2 (needs Header component) - Can proceed once US2 complete
- **User Story 3 (P2) - Responsive**: Can start after any page exists - Adds responsive classes to existing components

### Suggested Implementation Order

1. **MVP Focus**: Setup → Foundational → US1 → US2 → Test → Deploy
2. **Incremental**: After MVP, add US4 → Test → Deploy, then US3 → Test → Deploy
3. **Parallel (if team available)**: After Foundational, US1 and US2 can proceed in parallel with coordination

### Within Each User Story

- Components can be built in parallel when they don't depend on each other
- Controllers and routes before pages (backend before frontend)
- Pages before testing
- Story complete before moving to next priority

### Parallel Opportunities

**Within Phase 1 (Setup)**:
- T001 (Tailwind config), T002 (Dialog install), T003 (DropdownMenu install) can run in parallel

**Within Phase 2 (Foundational)**:
- T005 (Controller) and T006 (Routes) must run sequentially (routes reference controller)

**Within Phase 4 (User Story 2)**:
- T012 (LoginModal), T013 (Footer), T014 (Header) can run in parallel - different files

**Within Phase 5 (User Story 4)**:
- T019 (English), T020 (Thai), T021 (Korean) can run in parallel - different files

**Within Phase 7 (Polish)**:
- Most polish tasks (T032-T039) can run in parallel - different validation activities

---

## Parallel Example: User Story 2 Components

```bash
# Launch all component creation for User Story 2 together:
Task T012: "Create LoginModal component in resources/js/Components/LoginModal.tsx"
Task T013: "Create Footer component in resources/js/Components/Footer.tsx"  
Task T014: "Create Header component in resources/js/Components/Header.tsx"

# After all complete, integrate:
Task T017: "Update TopPage to use Header and Footer components"
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
2. **Increment 2** (US4): Add language pages → Test → Deploy
3. **Increment 3** (US3): Add responsive design → Test → Deploy
4. **Final Polish** (Phase 7): Cleanup and validation → Test → Deploy

Each increment adds value without breaking previous increments.

### Parallel Team Strategy

With 2 developers after Foundational phase completes:
- **Developer A**: User Story 1 (Landing page) - 5 tasks
- **Developer B**: User Story 2 (Navigation components) - Tasks T012, T013, T014 in parallel

Once US2 completes:
- **Developer A**: User Story 4 (Language pages) - 3 pages in parallel
- **Developer B**: User Story 3 (Responsive design) - Add responsive classes

---

## Task Summary

**Total Tasks**: 40
- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 2 tasks
- **Phase 3 (User Story 1)**: 5 tasks
- **Phase 4 (User Story 2)**: 7 tasks
- **Phase 5 (User Story 4)**: 5 tasks
- **Phase 6 (User Story 3)**: 7 tasks
- **Phase 7 (Polish)**: 10 tasks

**Parallel Tasks**: 16 tasks marked [P] can run in parallel with others in same phase
**Story Distribution**:
- US1: 5 tasks (~60 min)
- US2: 7 tasks (~90 min)
- US3: 7 tasks (~45 min)
- US4: 5 tasks (~30 min)

**Estimated Total Time**: 3-4 hours (per quickstart.md estimate)

**MVP Time**: ~2.5 hours (Setup + Foundational + US1 + US2)

---

## Success Criteria

**User Story 1 Complete When**:
✅ Landing page displays at http://localhost:8000/
✅ Hero image with Japanese text overlay visible
✅ Three language cards clickable and navigate to correct URLs
✅ Visual design matches specification (colors, layout)

**User Story 2 Complete When**:
✅ Header appears on all pages with logo, language selector, login button
✅ Footer appears on all pages with brand and links
✅ Language selector dropdown navigates to correct pages
✅ Login button opens modal with Japanese text and Google OAuth option
✅ Authenticated users see name and logout link instead of login button

**User Story 4 Complete When**:
✅ All three language pages (/lang-note/english, /thai, /korean) accessible
✅ Each page displays Japanese title and placeholder content
✅ Header and footer consistent across all language pages
✅ Interface remains in Japanese on all language pages

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
- [Story] label (US1, US2, US3, US4) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are manual via browser - no automated test suite required for this feature
- Follow quickstart.md for detailed implementation guidance
- Avoid: same file conflicts, cross-story dependencies that break independence
