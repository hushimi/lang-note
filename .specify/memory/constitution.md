<!--
SYNC IMPACT REPORT
==================
Version: 0.0.0 → 1.0.0
Change Type: MAJOR (Initial constitution creation)

Modified Principles:
- NEW: I. Clean Architecture with DDD Layers
- NEW: II. Type Safety & Code Generation
- NEW: III. Thin Controllers / Single-Purpose Actions
- NEW: IV. InertiaJS Monolith Pattern
- NEW: V. Component Architecture & Composition
- NEW: VI. Utility-First Styling
- NEW: VII. Dependency Injection & Testability

Added Sections:
- Technology Stack Requirements
- Development Workflow & Standards
- Governance

Templates Requiring Updates:
✅ .specify/templates/plan-template.md - Needs constitution check section
✅ .specify/templates/spec-template.md - Needs architecture compliance requirements
✅ .specify/templates/tasks-template.md - Needs task categorization aligned with principles

Follow-up TODOs:
- Create plan-template.md if not exists
- Create spec-template.md if not exists
- Create tasks-template.md if not exists
- Update any existing runtime guidance docs with constitution references

Generated: 2026-02-14
-->

# Lang Note Project Constitution

## Core Principles

### I. Clean Architecture with DDD Layers

**MUST** separate concerns into four distinct architectural layers:

- **Domain Layer** (`app/Models/`, `app/Data/`): Business entities and immutable DTOs
- **Application Layer** (`app/Actions/`): Single-purpose business logic classes (invokable)
- **Infrastructure Layer** (`app/Services/`, `app/Repositories/`): External integrations and data access
- **Presentation Layer** (`app/Http/`): Thin controllers, middleware, form validation

**Rationale**: Clear separation prevents business logic leakage into controllers or models, making the codebase maintainable, testable, and allowing independent evolution of each layer.

**Non-Negotiable Rules**:
- Controllers MUST delegate to Actions (no business logic in controllers)
- Models MUST NOT contain business logic (data representation only)
- Actions MUST be invokable classes with single responsibility
- Each layer MUST only depend on layers below it (no circular dependencies)

### II. Type Safety & Code Generation

**MUST** use strongly-typed Data Transfer Objects with automatic TypeScript generation:

- All data passed between layers MUST use Laravel Data classes
- All Data classes exposed to frontend MUST have `#[TypeScript]` attribute
- PHP types MUST be declared for all method parameters and return values
- TypeScript `any` type is **FORBIDDEN** except for legitimate third-party library types

**Rationale**: Type safety prevents runtime errors, enables better IDE support, and ensures frontend-backend contract compliance. Auto-generation eliminates type drift between PHP and TypeScript.

**Non-Negotiable Rules**:
- NO plain arrays for DTOs - use Laravel Data classes
- NO missing type declarations in PHP (parameters, returns, properties)
- NO `any` type in TypeScript without documented justification
- MUST run `npm run generate-types` after modifying Data classes

### III. Thin Controllers / Single-Purpose Actions

**MUST** keep controllers minimal and delegate all business logic to Actions:

- Controllers receive requests, call Actions, return responses (max ~15 lines)
- Actions MUST be invokable classes (`__invoke` method)
- Actions MUST have single responsibility (one business operation)
- Actions MUST use constructor injection for dependencies

**Rationale**: Thin controllers improve testability, reusability, and make business logic discoverable. Single-purpose Actions follow SOLID principles and are easier to maintain.

**Non-Negotiable Rules**:
- NO business logic in controllers (database queries, calculations, validations)
- NO static methods in Actions (use dependency injection)
- Actions MUST return Data objects, not arrays or raw models
- Actions MUST have clear, verb-based names (`CreateUserFromOAuth`, `UpdatePost`)

### IV. InertiaJS Monolith Pattern

**MUST** use InertiaJS for all frontend-backend communication (no separate REST API):

- All navigation MUST use InertiaJS router (`router.visit`, `<Link>`)
- All data mutations MUST use InertiaJS methods (`router.post`, `router.delete`)
- All server data MUST come via InertiaJS props (no `useEffect` data fetching)
- All form handling MUST use `useForm` hook from `@inertiajs/react`

**Rationale**: InertiaJS provides SPA experience without API complexity, eliminates CORS issues, and keeps frontend-backend tightly integrated while maintaining clean separation.

**Non-Negotiable Rules**:
- NO `fetch`, `axios`, or direct HTTP requests from React components
- NO `useEffect` for server data fetching
- NO regular `<a>` tags for navigation (use InertiaJS `<Link>`)
- Controllers MUST return `Inertia::render()` responses with Data objects

### V. Component Architecture & Composition

**MUST** organize React components into three categories with clear purposes:

- **Page Components** (`resources/js/Pages/`): Top-level Inertia pages, extend `PageProps`
- **UI Components** (`resources/js/Components/ui/`): Shadcn/ui primitives (Button, Card, etc.)
- **Shared Components** (`resources/js/Components/`): App-specific reusable components

**Rationale**: Clear organization improves discoverability, prevents duplication, and encourages composition. Using Shadcn/ui ensures consistent design system.

**Non-Negotiable Rules**:
- Page components MUST extend `PageProps` interface
- MUST use Shadcn/ui components instead of custom UI primitives
- NO custom buttons, cards, inputs when Shadcn/ui equivalents exist
- Components MUST have explicit TypeScript interfaces for props
- MUST use functional components only (no class components)

### VI. Utility-First Styling

**MUST** use Tailwind CSS utility classes for all styling:

- NO inline styles (`style={{}}` forbidden except for dynamic calculations)
- NO custom CSS files (use Tailwind utilities or theme extension)
- MUST use `cn()` utility for conditional class composition
- MUST follow mobile-first responsive design patterns

**Rationale**: Utility-first CSS reduces bundle size, eliminates naming conflicts, and keeps styles co-located with components. Tailwind provides comprehensive design tokens.

**Non-Negotiable Rules**:
- NO `style={{}}` inline styles
- NO custom CSS modules or styled-components
- MUST use `cn()` from `@/lib/utils` for conditional classes
- NO string concatenation or template literals for class names
- MUST use Tailwind's responsive prefixes (`md:`, `lg:`) for breakpoints

### VII. Dependency Injection & Testability

**MUST** use constructor injection for all dependencies:

- Controllers MUST inject Actions via constructor
- Actions MUST inject Services/Repositories via constructor
- NO direct instantiation with `new` keyword (use Laravel's container)
- NO global state or singletons (except framework-provided)

**Rationale**: Dependency injection enables testing with mocks, reduces coupling, and makes dependencies explicit. Laravel's service container handles instantiation automatically.

**Non-Negotiable Rules**:
- NO `new ClassName()` for application classes
- NO static methods for business logic
- Constructor parameters MUST use type hints
- Services MUST define interfaces when multiple implementations possible

## Technology Stack Requirements

### Backend Stack (Laravel 12)

**Required Packages**:
- `laravel/framework ^12.0` - Core framework
- `inertiajs/inertia-laravel ^2.0` - Frontend integration
- `spatie/laravel-data ^4.19` - Type-safe DTOs
- `spatie/laravel-typescript-transformer ^2.5` - TypeScript generation
- `laravel/socialite ^5.24` - OAuth authentication
- `tightenco/ziggy ^2.6` - Route generation for JavaScript

**Database Configuration**:
- MySQL 8.0+ required
- Table prefix: `ln_` (enforced via `DB_PREFIX` in `.env`)
- MUST use Eloquent ORM (no raw queries without prefix helper)

**Forbidden Patterns**:
- NO API routes (`routes/api.php` should be minimal or empty)
- NO resource controllers without Actions
- NO model observers for business logic (use Actions)

### Frontend Stack (React 19)

**Required Packages**:
- `react ^19.2` & `react-dom ^19.2` - UI library
- `@inertiajs/react ^2.3` - InertiaJS React adapter
- `typescript ^5.9` - Type safety
- `tailwindcss ^4.1` - Utility-first CSS
- `@tailwindcss/vite ^4.0` - Tailwind v4 Vite integration
- `ziggy-js` - Route helper for frontend
- Shadcn/ui components (via CLI installation)
- `@fortawesome/react-fontawesome` - Icons

**Code Formatting**:
- Indentation: 2 spaces
- Line width: 100 characters max
- Quotes: Single quotes
- Semicolons: Required
- MUST use Prettier with `prettier-plugin-tailwindcss`

**Forbidden Patterns**:
- NO class components (functional only)
- NO PropTypes (use TypeScript interfaces)
- NO CSS-in-JS libraries (styled-components, emotion, etc.)
- NO global state libraries (Redux, Zustand) unless absolutely justified

## Development Workflow & Standards

### File Organization

**Backend Structure**:
```
app/
├── Actions/              # Business logic (grouped by domain)
│   ├── Auth/
│   └── Posts/
├── Data/                 # DTOs with #[TypeScript] attribute
├── Http/
│   ├── Controllers/      # Thin controllers
│   ├── Middleware/
│   └── Requests/         # Form validation
├── Models/               # Eloquent models
└── Services/             # External integrations
```

**Frontend Structure**:
```
resources/js/
├── Pages/                # InertiaJS page components
├── Components/
│   ├── ui/               # Shadcn/ui primitives
│   └── *.tsx             # App-specific components
├── lib/                  # Utilities (cn, etc.)
├── types/
│   ├── generated.d.ts    # Auto-generated from PHP
│   └── index.d.ts        # Manual type definitions
├── app.tsx               # InertiaJS entry point
└── bootstrap.ts          # Global setup
```

### Naming Conventions

**PHP (PSR-12 + Laravel conventions)**:
- Classes: `PascalCase` (e.g., `CreateUserFromOAuth`)
- Methods: `camelCase` (e.g., `handleCallback`)
- Actions: Verb-based names (e.g., `UpdatePost`, `DeleteComment`)
- Data classes: Noun + `Data` suffix (e.g., `UserData`, `PostData`)

**TypeScript/React**:
- Components: `PascalCase` (e.g., `UserAvatar`, `PostCard`)
- Hooks: `camelCase` with `use` prefix (e.g., `useAuth`, `useModal`)
- Utilities: `camelCase` (e.g., `cn`, `formatDate`)
- Interfaces: `PascalCase` with descriptive names (e.g., `UserAvatarProps`)

### Type Generation Workflow

**MUST** follow this sequence when modifying Data classes:

1. Create/modify PHP Data class with `#[TypeScript]` attribute
2. Run `npm run generate-types`
3. Import generated types in React components
4. Verify TypeScript compilation passes
5. Commit both PHP and generated TypeScript files together

**FORBIDDEN**:
- Manually editing `resources/js/types/generated.d.ts`
- Skipping type generation before committing
- Using stale types (generation timestamp mismatch)

### Code Review Checklist

**MUST verify before approval**:
- [ ] Controllers delegate to Actions (no business logic)
- [ ] Actions use constructor injection
- [ ] Data classes have `#[TypeScript]` attribute
- [ ] All PHP types declared (parameters, returns, properties)
- [ ] No `any` type in TypeScript
- [ ] InertiaJS used for navigation/mutations (no fetch/axios)
- [ ] Page components extend `PageProps`
- [ ] Tailwind utilities used (no inline styles)
- [ ] Shadcn/ui components used (no custom primitives)
- [ ] Type generation run (`resources/js/types/generated.d.ts` updated)

### Testing Standards

**MUST provide tests for**:
- All Actions (unit tests with mocked dependencies)
- Critical business logic paths
- Form validation logic
- Data transformations

**Testing approach**:
- Use PHPUnit for backend tests
- Use Feature tests for controller integration
- Mock external services (OAuth, APIs)
- Test Data class transformations

## Governance

### Amendment Process

This constitution is the **highest authority** for technical decisions in the Lang Note project.

**To amend this constitution**:
1. Propose changes via documented RFC (issue or discussion)
2. Demonstrate alignment with project goals or show existing rule deficiency
3. Gain consensus from maintainers (minimum 2 approvals)
4. Update constitution with version bump (see Versioning below)
5. Update affected cursor rules (`.cursor/rules/*.mdc`)
6. Update dependent templates in `.specify/templates/`
7. Document migration path if breaking changes affect existing code

### Versioning Policy

Constitution follows semantic versioning:
- **MAJOR**: Backward-incompatible principle changes, governance structure changes
- **MINOR**: New principles added, expanded guidance, new sections
- **PATCH**: Clarifications, typo fixes, non-semantic improvements

### Compliance & Enforcement

**All pull requests MUST**:
- Pass automated checks (linting, type checking, tests)
- Be verified against Core Principles checklist
- Include justification for any principle deviations (rare exceptions only)

**Cursor Rules synchronization**:
- `.cursor/rules/laravel-clean-architecture.mdc` MUST align with Backend principles (I-III, VII)
- `.cursor/rules/react-typescript-patterns.mdc` MUST align with Frontend principles (IV-VI)
- Constitution changes MUST trigger cursor rules review

**Runtime Guidance**:
- AI agents (Claude via Cursor) MUST reference this constitution for architectural decisions
- Ambiguous situations MUST be escalated rather than assumed
- Document new patterns in cursor rules when recurring decisions emerge

**Violation Handling**:
- Minor violations (style, naming): Fix in same PR or follow-up
- Major violations (architecture, type safety): Block merge until resolved
- Repeated violations: Trigger constitution amendment discussion (maybe rule unclear)

---

**Version**: 1.0.0 | **Ratified**: 2026-02-14 | **Last Amended**: 2026-02-14
