# Feature Specification: Top Page and Header Component with Theme System

**Feature Branch**: `001-top-page-header`  
**Created**: 2026-02-15  
**Status**: Draft  
**Input**: User description: "create top page and header component. Define base color code. top page url is /lang-note/"

## Clarifications

### Session 2026-02-15

- **Q1: Navigation Structure and Header Elements** → A: Header includes logo with "Ln" branding (L in #B2E09D, n in #4EBDFF), language selector dropdown (English, Thai, Korean), and login button that opens a modal. Login modal displays Japanese welcome text "Lang Noteへようこそ" with privacy policy acknowledgment text "ログインすることでプライバシーポリシーに同意したことになります" and Google authentication option "Googleで続ける". Header must use Shadcn/ui components and appear on all pages.

- **Q2: Brand Color Mood and Personality** → A: Calm and focused colors for concentration. Defined color palette: Primary #B2E09D (soft green), Secondary #4EBDFF (bright blue), Accent #FF9D71 (warm orange), Neutral #2F4858 (dark blue-gray), Success #68EDCB (teal), Error #FF869A (coral pink), Page Background #F8FFF8 (very light green). This palette conveys a learning-focused, comfortable environment suitable for extended study sessions.

- **Q3: Language Selector Purpose** → A: Language selector navigates to language-specific learning pages (English: /lang-note/english, Thai: /lang-note/thai, Korean: /lang-note/korean). Application interface remains in Japanese regardless of selection. The dropdown controls which target language the user wants to learn, not the application's interface language. No functionality required initially beyond navigation.

- **Q4: Theme Support** → A: Application supports light mode only. Dark mode is not required or supported.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time Visitor Discovers Lang Note's Purpose (Priority: P1)

A first-time visitor arrives at the landing page and needs to immediately understand what Lang Note is and how it can help them learn languages.

**Why this priority**: If visitors cannot quickly understand the app's value proposition, they will leave before engaging with the product. This is the foundation for user acquisition and retention.

**Independent Test**: Can be fully tested by loading the landing page and measuring time-to-comprehension. Delivers immediate value by communicating the core product offering without requiring any other features to be complete.

**Acceptance Scenarios**:

1. **Given** a first-time visitor arrives at the landing page, **When** they view the page for 5 seconds, **Then** they can articulate what Lang Note does (language learning application)
2. **Given** a visitor is considering using the app, **When** they scan the landing page, **Then** they see clear value propositions about the learning benefits
3. **Given** a visitor wants to get started, **When** they look for entry points, **Then** they find an obvious call-to-action to begin using the app
4. **Given** an existing user returns to the site, **When** they view the landing page, **Then** they can proceed directly to their learning dashboard

---

### User Story 2 - User Navigates Between Application Sections (Priority: P2)

Users need consistent, always-available navigation to move between different sections of the application such as lessons, dashboard, profile, and settings.

**Why this priority**: Efficient navigation is critical for user retention and engagement. Without clear navigation paths, users become frustrated and abandon the platform. This enables all future features to be accessible.

**Independent Test**: Can be fully tested by verifying navigation accessibility from multiple pages and measuring click-to-destination time. Delivers value by connecting existing and future features through consistent navigation patterns.

**Acceptance Scenarios**:

1. **Given** a user is on any page of the application, **When** they look for navigation options, **Then** they see a consistent navigation menu in the same location across all pages
2. **Given** a user wants to access different language learning sections, **When** they open the language selector dropdown, **Then** they can choose between English, Thai, and Korean learning pages
3. **Given** an unauthenticated user wants to log in, **When** they click the login button, **Then** a login modal opens with Google authentication option
4. **Given** an authenticated user wants to manage their account, **When** they access user-specific menu options, **Then** they can view profile information, access settings, and log out
5. **Given** a user is viewing the app on a mobile device, **When** the screen width is small, **Then** the navigation remains accessible and usable without requiring horizontal scrolling
6. **Given** a user wants to understand their current location in the app, **When** they view the navigation, **Then** the current section is visually indicated

---

### User Story 3 - User Accesses Application Across Devices (Priority: P2)

Users study languages on various devices throughout their day - phones during commutes, tablets for reading, and computers for intensive practice. The interface must adapt seamlessly to different screen sizes.

**Why this priority**: Multi-device support is essential for modern web applications and directly impacts accessibility. A mobile-unfriendly interface excludes a large portion of potential users and reduces engagement opportunities.

**Independent Test**: Can be fully tested by accessing the application on devices with different screen sizes and verifying layout adaptation. Delivers value by ensuring accessibility regardless of device choice.

**Acceptance Scenarios**:

1. **Given** a user accesses the app on a smartphone, **When** the viewport is 320-480 pixels wide, **Then** all content is readable and interactive elements are touch-friendly without horizontal scrolling
2. **Given** a user accesses the app on a tablet, **When** the viewport is 481-1024 pixels wide, **Then** the layout efficiently uses available space while maintaining readability
3. **Given** a user accesses the app on a desktop computer, **When** the viewport is wider than 1024 pixels, **Then** the layout takes advantage of the wider screen without excessive line lengths that harm readability
4. **Given** a user rotates their mobile device, **When** the orientation changes from portrait to landscape, **Then** the interface adapts appropriately to the new dimensions
5. **Given** a user interacts with touch-based navigation on mobile, **When** they tap navigation elements, **Then** the hit targets are large enough for comfortable interaction without mis-taps

---

### User Story 4 - User Selects Learning Target Language (Priority: P2)

Users want to choose which foreign language they wish to learn. The language selector allows users to navigate to dedicated learning pages for English, Thai, or Korean.

**Why this priority**: Providing clear navigation to different language learning sections is essential for users to access the content they want to study. This enables the core value proposition of multi-language learning without complex navigation structures.

**Independent Test**: Can be fully tested by selecting each language option and verifying navigation to the correct learning page. Delivers value by providing clear entry points to language-specific content without requiring the content itself to be implemented.

**Acceptance Scenarios**:

1. **Given** a user wants to learn English, **When** they select "English" from the language dropdown, **Then** they are navigated to /lang-note/english
2. **Given** a user wants to learn Thai, **When** they select "Thai" from the language dropdown, **Then** they are navigated to /lang-note/thai
3. **Given** a user wants to learn Korean, **When** they select "Korean" from the language dropdown, **Then** they are navigated to /lang-note/korean
4. **Given** a user is on any language learning page, **When** they view the page content, **Then** all application interface text (navigation, buttons, labels) remains in Japanese
5. **Given** a user selects a language from the dropdown, **When** navigation occurs, **Then** the page transition completes smoothly without errors

---

### Edge Cases

- What happens when the user has JavaScript disabled in their browser and attempts to navigate?
- How does the system handle users on extremely slow connections where the landing page takes more than 10 seconds to load?
- How does the navigation behave when displayed in a browser window narrower than 320 pixels?
- What happens when a user's authentication session expires while they are viewing a page?
- How does the landing page adapt for users with screen readers or other assistive technologies?
- What happens when the user accesses the application through an embedded iframe?
- What happens when a user navigates to a language learning page URL directly (e.g., /lang-note/english) without going through the dropdown?
- How does the login modal behave when opened on a very small screen or when the user has zoomed to 200%?
- What happens when a user tries to close the login modal using the Escape key or clicking outside the modal?
- How does the system handle the login flow when Google OAuth service is temporarily unavailable?
- What happens when a user changes language selection while the login modal is open?
- What happens when a user accesses an invalid language page URL (e.g., /lang-note/spanish)?
- How does the application handle users who don't read Japanese but accidentally access the site?
- What happens when a user bookmarks a language learning page and returns to it weeks later?

## Architecture Compliance

**Constitution Reference**: [v1.0.0](../.specify/memory/constitution.md)

**Backend Requirements** (Laravel):
- Data flow MUST follow: Controller → Action → Service/Repository → Model
- All data transfer MUST use Laravel Data classes with `#[TypeScript]` attribute
- Controllers MUST be thin (<15 lines typical)
- Actions MUST be invokable, single-purpose classes

**Frontend Requirements** (React/InertiaJS):
- All navigation MUST use InertiaJS router (no fetch/axios)
- Components MUST use generated TypeScript types from PHP
- All styling MUST use Tailwind utilities (no inline styles)
- UI primitives MUST use Shadcn/ui components

**Type Safety Requirements**:
- NO `any` type in TypeScript (document exceptions)
- NO plain arrays for DTOs (use Data classes)
- ALL PHP methods MUST declare parameter/return types

## Requirements *(mandatory)*

### Functional Requirements

**Landing Page Content Requirements:**

- **FR-001**: Landing page MUST communicate the primary purpose of Lang Note as a language learning platform within the first viewport
- **FR-002**: Landing page MUST display a clear value proposition explaining the benefits of using the application
- **FR-003**: Landing page MUST provide an entry point for new users to begin using the application
- **FR-004**: Landing page MUST provide an entry point for existing authenticated users to access their learning dashboard
- **FR-005**: Landing page content MUST remain accessible and readable across all supported device sizes

**Navigation Requirements:**

- **FR-006**: Navigation MUST be accessible from all pages within the application
- **FR-007**: Navigation MUST maintain consistent position and appearance across all pages
- **FR-008**: Navigation MUST provide a logo (serving as home link), language selector dropdown with English, Thai, and Korean options, and authentication controls (login button for unauthenticated users)
- **FR-009**: Navigation MUST visually indicate the current page or section the user is viewing
- **FR-010**: Navigation MUST differentiate between authenticated and unauthenticated user states
- **FR-011**: For authenticated users, navigation MUST provide access to user account functions including profile and logout
- **FR-012**: Navigation MUST adapt to small screen sizes without horizontal scrolling
- **FR-013**: Interactive navigation elements MUST have minimum touch target sizes of 44x44 pixels for mobile accessibility
- **FR-014**: Navigation MUST include a language selector allowing users to navigate to English, Thai, and Korean language learning pages
- **FR-015**: Language selection MUST be accessible via a dropdown menu that navigates to /lang-note/english, /lang-note/thai, or /lang-note/korean respectively
- **FR-016**: For unauthenticated users, navigation MUST provide a login button that triggers an authentication modal
- **FR-017**: Login modal MUST display a welcome message in Japanese ("Lang Noteへようこそ")
- **FR-018**: Login modal MUST include privacy policy acknowledgment text in Japanese ("ログインすることでプライバシーポリシーに同意したことになります")
- **FR-019**: Login modal MUST provide Google authentication option with text "Googleで続ける"
- **FR-020**: Logo MUST display "Ln" branding with distinguishable visual styling for each letter
- **FR-021**: Application interface MUST display all navigation, buttons, labels, and instructional text in Japanese regardless of which language learning page the user is viewing
- **FR-022**: Language selector MUST NOT change the application's interface language, only navigate to different language learning content pages

**Visual Design Requirements:**

- **FR-023**: System MUST support light mode only (dark mode is not required)
- **FR-024**: System MUST define a consistent color palette for brand identity including primary, secondary, and accent colors
- **FR-025**: System MUST define semantic color mappings for UI elements including text, backgrounds, borders, success states, error states, and warning states
- **FR-026**: Color contrast ratios MUST meet WCAG 2.1 Level AA standards (4.5:1 for normal text, 3:1 for large text) in light mode
- **FR-027**: System MUST implement a calm and focused color palette suitable for concentration and extended study sessions, with defined colors for Primary (soft green #B2E09D), Secondary (bright blue #4EBDFF), Accent (warm orange #FF9D71), Neutral (dark blue-gray #2F4858), Success (teal #68EDCB), Error (coral pink #FF869A), and Page Background (very light green #F8FFF8)

**Responsive Design Requirements:**

- **FR-028**: Application MUST be functional on viewport widths from 320 pixels and above
- **FR-029**: Layout MUST adapt appropriately for mobile (320-480px), tablet (481-1024px), and desktop (1024px+) screen sizes
- **FR-030**: Text MUST remain readable without horizontal scrolling on all supported screen sizes
- **FR-031**: Interactive elements MUST be accessible via touch on mobile and tablet devices
- **FR-032**: Layout MUST respond to device orientation changes without loss of functionality

**Accessibility Requirements:**

- **FR-033**: All navigation elements MUST be keyboard accessible with logical tab order
- **FR-034**: Current page indication MUST be communicated to screen readers
- **FR-035**: All interactive elements MUST have appropriate ARIA labels for screen reader users
- **FR-036**: Language selector MUST be accessible via keyboard navigation
- **FR-037**: Login modal MUST trap focus within the modal when open and restore focus to trigger element when closed
- **FR-038**: Language learning page URLs MUST be bookmarkable and shareable

**Performance Requirements:**

- **FR-039**: Landing page MUST display primary content within 3 seconds on standard broadband connections
- **FR-040**: Navigation interactions MUST respond within 100 milliseconds of user input
- **FR-041**: Language page navigation MUST complete within 1 second on standard broadband connections
- **FR-042**: Login modal MUST open within 200 milliseconds of button click

### Key Entities

- **Language Learning Page**: Represents a dedicated page for learning a specific target language (English, Thai, or Korean), accessed via specific URL paths (/lang-note/english, /lang-note/thai, /lang-note/korean)
- **Navigation Item**: Represents a destination within the application, includes label, destination path, authentication requirement, and visibility rules
- **Color Palette**: Defines the visual identity of the application with specific hex values - Primary: #B2E09D (soft green), Secondary: #4EBDFF (bright blue), Accent: #FF9D71 (warm orange), Neutral: #2F4858 (dark blue-gray), Success: #68EDCB (teal), Error: #FF869A (coral pink), Page Background: #F8FFF8 (very light green). Designed for light mode only.
- **Viewport Breakpoint**: Defines screen size ranges that trigger different responsive layout behaviors, includes minimum and maximum widths
- **Authentication Modal**: Overlay component for login flow, includes Japanese welcome text, privacy acknowledgment, and authentication provider options

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Comprehension and Clarity:**

- **SC-001**: 90% of first-time visitors can correctly identify that Lang Note is a language learning application within 5 seconds of viewing the landing page
- **SC-002**: Users can articulate at least one key benefit or feature of Lang Note after viewing the landing page for 10 seconds

**Navigation Efficiency:**

- **SC-003**: Users can navigate to any main section of the application within 1 click from any other page
- **SC-004**: Average time to locate and click a navigation item is less than 2 seconds
- **SC-005**: 95% of users successfully find the navigation menu on their first visit without instruction

**Visual Quality and Accessibility:**

- **SC-006**: All text maintains a contrast ratio of at least 4.5:1 (normal text) and 3:1 (large text) in light mode, meeting WCAG 2.1 Level AA standards
- **SC-007**: Landing page achieves a Lighthouse accessibility score of 90 or above
- **SC-008**: Color palette creates a calm, focused environment suitable for extended learning sessions

**Multi-Device Support:**

- **SC-009**: Application is fully functional without horizontal scrolling on devices with viewport widths of 320 pixels and above
- **SC-010**: Mobile users (screen width under 480px) can successfully access all navigation items with touch targets measuring at least 44x44 pixels
- **SC-011**: 95% of users on mobile devices successfully complete navigation tasks on first attempt without errors or mis-taps

**Navigation and Page Access:**

- **SC-012**: Users can navigate to any language learning page within 1 second
- **SC-013**: Language learning page URLs are directly accessible and bookmarkable
- **SC-014**: 100% of language selector clicks successfully navigate to the correct language page

**Performance Benchmarks:**

- **SC-015**: Landing page displays primary content within 3 seconds on connections with 5 Mbps or faster
- **SC-016**: Navigation interactions provide visual feedback within 100 milliseconds
- **SC-017**: Page transitions between sections complete within 1 second on standard broadband connections

**Language Learning Page Navigation:**

- **SC-018**: Users can successfully navigate to their chosen language learning page within 2 seconds
- **SC-019**: Application interface remains in Japanese on all language learning pages
- **SC-020**: 95% of users correctly understand that language selector chooses learning target, not interface language

**Authentication Flow:**

- **SC-021**: Users can open the login modal within 200 milliseconds of clicking the login button
- **SC-022**: 95% of users successfully complete Google OAuth login on their first attempt
- **SC-023**: Login modal is keyboard accessible and can be navigated entirely without a mouse

**User Satisfaction:**

- **SC-024**: Post-launch user testing shows 85% or higher satisfaction with visual design and color palette
- **SC-025**: User feedback indicates zero reported issues with navigation accessibility on mobile devices
- **SC-026**: Reduction in support inquiries related to "how to navigate" or "how to find features" by 70% compared to previous version
- **SC-027**: Japanese-speaking users can navigate to all language learning pages without confusion or errors
