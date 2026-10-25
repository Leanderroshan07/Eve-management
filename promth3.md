# PHASE 1 — EVENT ORGANIZER ROLE

Implement the Event Organizer role only after Phase 0 has been reviewed and approved.

Do not begin Customer or Admin functionality during this phase.

## Objective

Build a complete organizer experience that allows an event organizer company to present its services professionally and manage its packages, inquiries, proposals, bookings, and customer communication.

## A. Organizer authentication and profile

Build the UI and required integration for:
- Organizer registration and sign-in.
- Organizer company profile.
- Business name, logo, cover image, description, service categories, service area, and contact details.
- Profile completion state.
- Public visibility or publication state.
- Organization members and their permitted access, where supported by the agreed scope.

Use validated forms, helpful errors, loading states, and confirmation feedback.

Do not invent business verification or approval status.

## B. Public organizer website template

Build a reusable, configurable organizer landing-page template.

Include:
1. Organizer navigation and branding.
2. Hero with event photography, headline, introduction, and inquiry action.
3. About section.
4. Services.
5. Packages.
6. Portfolio gallery.
7. Reviews when real data exists.
8. Contact and quote-request section.
9. Footer.

Support different organizer identities without duplicating the page implementation.

Use the approved event-industry design references and shared design system.

Ensure the template works on mobile, tablet, and desktop.

## C. Organizer dashboard

Build:
- Overview.
- Public profile and website management.
- Services management.
- Package management.
- Inquiries and quotes.
- Bookings.
- Messages.
- Basic activity and settings.

Use the approved dashboard shell with a fixed/collapsible desktop sidebar and responsive mobile navigation.

## D. Package management

Organizers must be able to create and manage packages.

Package fields should support:
- Package name.
- Description.
- Event category.
- Images.
- Base price and currency.
- Included services.
- Optional add-ons.
- Customization options.
- Package publication status.

Validate package information and prevent incomplete or invalid records from being published.

Do not hard-code a currency before the launch market is confirmed.

## E. Inquiries and proposal workflow

Implement:
- Receiving a quote inquiry.
- Viewing the customer's stated requirements.
- Preparing a proposal.
- Revising and versioning a proposal.
- Sending a proposal to the customer.
- Viewing acceptance or rejection.
- Tracking pending and confirmed bookings.

The final proposal must preserve the agreed scope, price, event date, and relevant terms.

A chat message must not silently modify an accepted proposal.

Require the relevant parties to accept the same proposal version before treating it as mutually accepted.

If customer-side functionality is not yet built, use a clearly labeled development fixture or test account to validate organizer-side workflows. Do not present fixtures as live customer records.

## F. Booking management

Provide a clear booking list and detail view.

Show only fields that exist in the approved model, such as:
- Booking reference.
- Customer details permitted for the organizer.
- Event date.
- Package.
- Agreed proposal.
- Booking status.
- Relevant timeline.
- Next available action.

Use explicit, consistent status badges.

Do not invent unsupported booking states or allow arbitrary status changes.

## G. Messaging

Build the organizer messaging interface with:
- Conversation list.
- Message history.
- Message composer.
- Sending and delivery feedback where supported.
- Empty, loading, error, and offline states.

Enforce access through the backend.

Messages are communication records; they do not themselves change contractual booking terms.

## H. Visual quality

Follow UI_UX_RULES.md.

Use:
- Premium event photography.
- Warm public-site styling.
- Dark operational dashboard styling.
- Consistent cards, typography, and spacing.
- Purposeful Motion for React animations.
- Accessible controls and reduced-motion support.
- Responsive layouts.

Do not over-animate forms, tables, or operational actions.

## I. Testing

Verify:
- Organizer registration/sign-in where configured.
- Profile creation and editing.
- Public organizer page rendering.
- Package create/edit/publish behavior.
- Inquiry viewing.
- Proposal creation and versioning.
- Mutual acceptance behavior.
- Booking display and supported transitions.
- Message access boundaries.
- Validation errors.
- Loading and empty states.
- Desktop, tablet, and mobile layouts.
- Authorization for organizer-owned records.

Use test fixtures for deterministic test cases.

## Completion gate

Before stopping, provide:
1. Completed organizer features.
2. Screens and routes implemented.
3. Database and backend integrations actually connected.
4. Automated test results.
5. Screenshots or browser preview instructions when available.
6. Manual verification checklist.
7. Remaining defects and limitations.

Do not start the Customer role.

Stop and wait for my explicit approval to proceed to Phase 2.