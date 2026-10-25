# PHASE 0 — PROJECT FOUNDATION

Implement Phase 0 only. Do not implement the Event Organizer, Customer, Admin, Worker, or Rental Provider features yet.

## Objective

Create a stable project foundation for a multi-role event services marketplace.

## Step 1: Inspect the environment

- Check whether the repository is empty or already contains files.
- Inspect the current package manager, runtime, and installed tools.
- Identify any existing conventions that should be preserved.
- If the repository is empty, propose the appropriate initial setup.
- Do not overwrite user files or reset the repository without permission.

## Step 2: Establish the architecture

Prepare a feature-based project structure covering:
- Application routes and layouts.
- Shared UI components.
- Navigation.
- Design tokens and theme configuration.
- Feature modules.
- Form validation.
- Backend integration.
- Database migrations.
- Authentication and authorization boundaries.
- Utilities and types.
- Automated tests.

Keep future role modules clearly separated. Do not implement their complete functionality.

## Step 3: Configure the foundation

Set up the approved stack and:
- TypeScript and linting.
- Environment-variable validation.
- Development and production build scripts.
- Shared layout and responsive page container.
- Design tokens.
- Accessible button, input, card, badge, dialog, and feedback primitives as needed.
- Consistent icon usage.
- A small reusable motion system.
- Basic application error handling.
- A clear README with setup and development instructions.

Create a sample page or foundation preview for reviewing typography, colors, spacing, buttons, cards, and navigation.

## Step 4: Backend foundation

Prepare the managed backend integration strategy.

If Supabase credentials are unavailable, keep configuration clearly separated and document how credentials will be supplied. Do not invent credentials or claim the live backend is connected.

Do not expose private keys in client code.

Do not create an unnecessarily large database schema before role workflows have been approved.

## Step 5: Validation

Run the available checks:
- Dependency installation.
- Linting.
- Type checking.
- Unit tests, if configured.
- Production build.
- Browser verification where available.

Fix foundation-level issues before reporting completion.

## Deliverables

Provide:
1. Actual project folder structure.
2. Dependencies added and why.
3. Environment variables required, without secrets.
4. Commands to run the project.
5. Foundation preview instructions.
6. Test results.
7. Manual review checklist.
8. Known limitations.

Stop after Phase 0. Wait for my explicit approval before implementing Phase 1.