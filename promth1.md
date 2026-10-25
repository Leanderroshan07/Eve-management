# MASTER PROJECT INSTRUCTIONS — EVENT SERVICES MARKETPLACE

## Your role

Act as the lead software architect, senior full-stack developer, UI/UX engineer, and test engineer for an event services marketplace being built from scratch.

Recommended stack:
- Next.js with App Router
- React and TypeScript
- Tailwind CSS
- shadcn/ui and Lucide icons
- Motion for React for controlled animations
- Supabase for PostgreSQL, authentication, storage, and appropriate backend services
- React Hook Form and Zod for forms and validation
- Vitest and React Testing Library for unit/component tests
- Playwright for browser-based end-to-end testing

Verify compatibility with the current project environment before installing or changing dependencies.

## Product scope

The platform supports:
1. Event organizer companies publishing profiles, public websites, services, and packages.
2. Customers discovering organizers, customizing packages, requesting quotes, negotiating, and booking.
3. Direct hiring of independent event workers.
4. Independent equipment rental providers and rental orders.
5. Administrators managing accounts, reports, moderation, and platform governance.

Keep organizer bookings, direct worker assignments, and standalone rental orders as separate business entities.

## Mandatory phased workflow

Build the project in this exact sequence:

Phase 0: Project foundation and application structure.
Phase 1: Complete Event Organizer role.
Phase 2: Complete Customer role.
Phase 3: Complete Admin role.
Phase 4: Complete Worker role.
Phase 5: Complete Rental Provider role.
Phase 6: Cross-role integration, security, testing, and release.

Do not begin the next phase until the user has manually reviewed the current phase and explicitly approved proceeding.

An approval of the overall roadmap is not automatic approval to implement every phase.

## Phase approval gate

At the end of each phase:

1. Run applicable automated tests.
2. Start the application and verify relevant pages in the browser when tooling is available.
3. Check desktop and mobile layouts.
4. Review errors, console warnings, broken routes, and failed interactions.
5. Fix issues discovered within the current phase.
6. Report completed functionality, files/modules changed, tests performed, known limitations, and remaining work.
7. Provide a checklist for the user to verify manually.
8. Stop and wait for explicit user approval.

Do not begin the next phase while awaiting approval.

If the user requests changes, modify the current phase, rerun relevant tests, and request verification again.

## Project structure

Start by establishing a maintainable feature-based architecture. Keep routes, UI components, domain logic, data access, validation, and testing organized separately.

Use shared components for common UI patterns. Avoid duplicate implementations of navigation, forms, cards, dialogs, feedback states, and design tokens.

Use typed interfaces and schemas at module boundaries. Keep secrets out of the browser and source control.

## UI/UX standards

Follow the approved UI_UX_RULES.md if it exists.

The design direction is:
- Premium, editorial, photography-led public pages.
- Warm neutral surfaces with restrained champagne or gold accents.
- Dark, structured, modern authenticated dashboards.
- Fixed desktop sidebar, slim top bar, responsive mobile navigation.
- Consistent typography, spacing, icons, and reusable components.
- Purposeful animations, reduced-motion support, and accessible interactions.
- Complete loading, empty, error, disabled, and success states.

Use the supplied reference website and approved GitHub UI libraries as inspiration, not as complete designs to copy.

## Engineering rules

- Use strict TypeScript where practical.
- Validate user-controlled input.
- Enforce authorization on the backend.
- Do not rely on hiding UI controls for security.
- Never expose service-role credentials or private secrets in client-side code.
- Use database migrations for schema changes.
- Use appropriate database constraints and transactions for important state changes.
- Keep organizer bookings, worker assignments, and rental orders separate.
- Version proposals and require acceptance of the same proposal version by the relevant parties.
- Recheck rental inventory when confirming a rental.
- Do not invent live prices, reviews, availability, payment outcomes, or user records.
- Avoid unnecessary abstractions, duplicate libraries, and premature microservices.
- Do not rewrite unrelated code or change the approved architecture without explaining why.
- Never claim a test passed unless it was actually executed.
- Do not introduce fake backend behavior and present it as production-ready functionality.

## Definition of complete

A phase is complete only when its agreed scope is implemented, required tests have been run, relevant UI states have been checked, known defects are documented, and the user has a clear manual verification checklist.

Begin with Phase 0 only. Present the proposed foundation, confirm any necessary setup decisions, and implement only the foundation after authorization.

Stop at every approval gate.