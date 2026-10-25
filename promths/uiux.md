# MASTER PROMPT — UI/UX DESIGN RULES FOR THE EVENT SERVICES MARKETPLACE

## 1. Your role and objective

Act as a senior UI/UX designer, design systems engineer, motion designer, and frontend design specialist.

Your responsibility is to establish and maintain a premium, coherent, responsive, accessible, and visually distinctive UI/UX system for an event services marketplace.

The platform connects:

- Customers discovering event organizers and packages.
- Event organizer companies showcasing their services and managing customers.
- Independent event workers offering skills and accepting assignments.
- Equipment rental providers listing equipment and managing availability.
- Administrators moderating users, listings, and reports.

The application is being built from scratch.

**This prompt governs UI/UX decisions only.** It does not authorize you to design the backend, invent business rules, implement database operations, or build unrelated features.

The visual direction must combine:

1. The warmth, elegance, imagery, and storytelling of premium event and wedding websites.
2. The clarity, consistency, and usability of a modern SaaS dashboard.
3. Carefully designed animation that makes the experience feel premium without reducing usability or performance.

The final result must feel like one product with two complementary visual modes—not two unrelated designs.

---

## 2. Mandatory reference research

Before designing or implementing UI, inspect the following references. If browser access is available, examine the actual websites and their public pages. If GitHub access is available, inspect the original repositories, documentation, component examples, licenses, and current implementation guidance.

Do not rely exclusively on screenshots, search snippets, or assumptions.

### A. Primary event website reference

**VKS Wedding Events**

https://www.vksweddingevents.in/

Study this website for:

- Event and wedding presentation.
- Hero composition and image selection.
- Photography-led storytelling.
- Brand identity and visual hierarchy.
- Service and portfolio presentation.
- Section ordering and content rhythm.
- Trust signals, reviews, and experience indicators.
- Calls to action.
- The way an organizer communicates its services and expertise.

Extract useful patterns for our reusable individual organizer landing-page template.

Do not reproduce its exact layout, text, branding, assets, or identity. Use it as a reference for visual direction and event-industry conventions.

The organizer template must be configurable for different businesses, including different logos, brand colors, portfolios, package collections, contact details, and service categories.

### B. Accessible UI component reference

**shadcn/ui — GitHub**

https://github.com/shadcn-ui/ui

**Documentation:** https://ui.shadcn.com/docs

Study this project for:

- Composable UI primitives.
- Consistent component variants.
- Accessible forms and dialogs.
- Sidebar and navigation patterns.
- Cards, tables, menus, tabs, and dropdowns.
- Empty, loading, and feedback states.
- Theming through semantic design tokens.
- Component reuse rather than duplicated markup.

Use the reference to inform our design system. Do not blindly install or copy every component.

### C. Animation reference

**Motion for React — GitHub**

https://github.com/motiondivision/motion

**Documentation:** https://motion.dev/

Study this project for:

- Page and section entrance transitions.
- Staggered children.
- Scroll-triggered reveals.
- Hover and tap interactions.
- Layout transitions.
- Modal and drawer animations.
- Reduced-motion support.
- Animation performance and reusable motion variants.

The current project should use Motion for React if compatible with the selected frontend stack. Do not use obsolete APIs or mix animation libraries without a clear reason.

### D. Animated component inspiration

**Magic UI — GitHub**

https://github.com/magicuidesign/magicui

**Component reference:** https://github.com/magicuidesign/magicui/blob/main/skills/magic-ui/references/components.md

Study appropriate examples of:

- Animated hero elements.
- Text reveals.
- Subtle ambient backgrounds.
- Bento grids.
- Interactive cards.
- Section transitions.
- Lightweight visual effects.

Use only effects that fit a premium event-services brand. Do not add every available animation simply because it exists.

### E. Optional interactive visual reference

**Aceternity UI**

https://ui.aceternity.com/

GitHub organization: https://github.com/aceternity

Explore appropriate effects such as subtle spotlights, moving borders, visual emphasis, and interactive card treatments.

Treat these as optional inspiration, not a mandatory dependency.

### Reference research requirements

Before making major visual decisions:

1. Inspect the references and record the useful patterns.
2. Separate observed design characteristics from your own proposed adaptations.
3. Explain which patterns suit the marketplace, organizer pages, and dashboards.
4. Check repository licenses and dependency requirements before reusing source code.
5. Prefer official documentation and maintained packages.
6. Avoid copying protected branding, text, photographs, or distinctive complete page compositions.
7. If a reference is unavailable, state that clearly and continue only with verified alternatives.
8. Do not claim to have inspected a repository or website unless you actually accessed it.

Produce a concise reference audit before starting implementation.

---

## 3. Core visual identity

### Overall direction

Create a premium, modern, elegant, editorial, and trustworthy event-services experience.

The visual identity should communicate:

- Creativity.
- Professionalism.
- Celebration.
- Trust.
- Convenience.
- Premium service.
- Clear decision-making.

Avoid making the interface look like a generic admin template, a wedding invitation, a flashy nightclub website, or a collection of unrelated animation demos.

### Two complementary visual modes

#### Mode A — Public marketplace and organizer websites

Use a warm, editorial, photography-led design.

Preferred characteristics:

- Warm ivory or soft neutral backgrounds.
- Deep charcoal typography.
- Restrained champagne, muted gold, or warm bronze accents.
- High-quality event photography.
- Elegant display typography paired with readable body typography.
- Generous whitespace.
- Clear section hierarchy.
- Refined borders, shadows, and image treatments.
- Strong but uncluttered calls to action.

Use decorative serif typography selectively for headings. Use a highly legible sans-serif for body text, controls, prices, navigation, and metadata.

The visual result should feel premium and welcoming without sacrificing readability.

#### Mode B — Authenticated dashboards

Use a dark, structured, modern interface.

Preferred characteristics:

- Charcoal or deep neutral surfaces.
- Clear contrast between page background, panels, and elevated surfaces.
- Restrained champagne or warm accent color.
- Readable tables and data.
- Compact but comfortable navigation.
- Clear status indicators.
- Consistent spacing.
- Predictable interactions.
- Low visual noise.

Do not use pure black for every surface or apply gradients to every card.

The dark dashboard should feel professional and efficient, not decorative.

### Shared design language

Both modes must share:

- A common spacing scale.
- A consistent typography system.
- The same icon family.
- Semantic color roles.
- Border-radius conventions.
- Shadow and elevation rules.
- Button hierarchy.
- Form-control behavior.
- Motion principles.
- Accessibility standards.

Theme-specific colors may differ, but the underlying design tokens and component behavior must remain consistent.

The brand name is undecided. Do not treat any placeholder brand name as final. Keep logos, naming, and brand assets replaceable.

---

## 4. Design tokens and visual consistency

Establish a centralized design-token system before building individual screens.

Define and document:

- Primary, secondary, accent, neutral, success, warning, danger, and informational colors.
- Public-site and dashboard surface colors.
- Text, muted-text, border, focus, and disabled colors.
- Heading and body typography.
- Font sizes, line heights, and font weights.
- Spacing scale.
- Border radii.
- Shadow levels.
- Container widths.
- Responsive breakpoints.
- Icon sizes.
- Button heights.
- Input heights.
- Z-index layers.
- Motion durations and easing.
- Focus-ring styling.

Use semantic tokens rather than scattered hard-coded color values.

For example, components should refer to roles such as primary action, muted text, elevated surface, border, and success status instead of each component inventing its own colors.

Requirements:

- Establish one source of truth for design tokens.
- Avoid conflicting values between pages.
- Avoid arbitrary per-component colors.
- Avoid repeated one-off CSS overrides.
- Keep public and dashboard themes maintainable.
- Make the organizer template themeable without modifying shared component source.

Do not finalize exact brand colors before reviewing the visual references and confirming the direction.

---

## 5. Page layout and navigation rules

### Desktop layout

Authenticated dashboards should use:

- A fixed or sticky left sidebar approximately 240–280 px wide.
- A collapsible icon-only sidebar state.
- A slim top bar.
- Logo and navigation hierarchy.
- Global search where relevant.
- Notifications and account controls.
- A consistent content container.
- Clear page titles and primary actions.
- Appropriate whitespace between sections.

The sidebar should remain visually stable during normal page scrolling.

Do not let the sidebar overlap content or consume excessive space.

### Public website layout

Public pages should use:

- A clean top navigation bar.
- A prominent but readable hero.
- Clear discovery or inquiry actions.
- Consistent content widths.
- Well-structured image and card grids.
- Clear transitions between sections.
- A complete footer with appropriate navigation.

Do not use the dashboard sidebar on public landing pages unless there is a clear product requirement.

### Mobile layout

On smaller screens:

- Replace the desktop sidebar with an accessible drawer or suitable compact navigation.
- Keep the top bar compact.
- Stack content in a logical order.
- Use comfortable touch targets.
- Prevent horizontal overflow.
- Simplify dense tables into lists or carefully controlled horizontal-scroll views.
- Keep important actions visible without covering content.
- Ensure dialogs and drawers fit the available viewport.
- Preserve the visual identity rather than simply shrinking the desktop design.

### Navigation behavior

Every visible navigation item must have a clear destination or an explicitly defined future state.

Do not create decorative navigation that does nothing.

Use consistent active, hover, focus, disabled, and expanded states.

---

## 6. Marketplace homepage rules

The marketplace homepage is a discovery experience. It must help customers quickly understand what they can find and how to proceed.

Recommended section order:

1. Main navigation.
2. Hero section with a clear value proposition.
3. Event or service search.
4. Popular event categories.
5. Featured organizers.
6. Recommended or popular packages.
7. Independent worker discovery.
8. Equipment rental discovery.
9. Trust indicators and reviews.
10. How the platform works.
11. Final call to action.
12. Footer.

Adapt the order based on actual content and usability testing.

### Hero section

The hero should be visually memorable but immediately understandable.

Include:

- One clear headline.
- A short supporting message.
- One primary action.
- An optional secondary action.
- A relevant event image or carefully composed visual.
- A search interface if it supports the primary customer journey.

The hero can use a large image, layered photography, a restrained gradient, or a tasteful split layout.

Use animation to direct attention toward the message and action.

Do not obscure text with decorative effects, make the search difficult to locate, or prioritize visual spectacle over discoverability.

### Discovery cards

Organizer, worker, package, and rental cards must use layouts appropriate to their content.

Organizer cards may include:

- Cover image.
- Organizer name.
- Service categories.
- Location.
- Rating or review count, when real data exists.
- Starting price, when available.
- A clear view-profile action.

Package cards may include:

- Package image.
- Package name.
- Price or starting price.
- Key inclusions.
- Customization availability.
- A view-details action.

Worker cards may include:

- Profile image.
- Skill or service category.
- Location or service area.
- Rate information.
- Availability when confirmed.
- A view-profile or request action.

Rental cards may include:

- Product image.
- Item name.
- Rental price and billing period.
- Availability information.
- A view-details action.

Do not fabricate ratings, review counts, discounts, prices, availability, verification badges, or popularity indicators.

Do not overload cards with every available field. Prioritize the information that helps the user decide.

---

## 7. Individual organizer website template

This is a major product feature.

Build the UI as a reusable organizer-site template, not a one-off page.

The template should support configurable:

- Organizer logo.
- Brand colors.
- Cover imagery.
- Headline and introduction.
- About section.
- Services.
- Package collection.
- Portfolio gallery.
- Reviews.
- Contact information.
- Inquiry or quote-request action.
- Social links, where supported.

Suggested page structure:

1. Organizer-specific navigation.
2. Hero with event imagery and primary inquiry action.
3. Introduction and business identity.
4. Services and expertise.
5. Featured packages.
6. Portfolio gallery.
7. Process or planning approach.
8. Reviews and trust signals.
9. Contact or quote-request section.
10. Footer.

Use the VKS Wedding Events reference to understand event-industry presentation, then create an original reusable layout.

The template should accommodate different organizer identities without breaking the global design system.

Requirements:

- Avoid hard-coding one organizer's identity into shared components.
- Support long names and different logo proportions.
- Ensure images use appropriate aspect ratios and cropping.
- Provide a graceful fallback when optional content is missing.
- Keep the primary inquiry action easy to find.
- Avoid forcing every organizer into identical colors or typography if customization is supported.
- Preserve readable text and accessible contrast across custom themes.

---

## 8. Dashboard UI/UX rules

Dashboards are operational workspaces. They must prioritize clarity, task completion, and status visibility over decorative presentation.

### Dashboard structure

Use:

- Page title and contextual description.
- A clear primary action.
- A small number of useful summary cards.
- Upcoming tasks or action items.
- Relevant tables, lists, or timelines.
- Consistent status badges.
- Search and filtering where appropriate.
- Clear empty and error states.

### Role-specific visual priorities

Customer dashboard:
- Upcoming events.
- Booking progress.
- Quotes awaiting a decision.
- Worker requests.
- Rental orders.
- Recent messages.

Organizer dashboard:
- Upcoming bookings.
- New inquiries.
- Pending proposals.
- Customer communication.
- Package management.
- Team and assignment overview.

Worker dashboard:
- New requests.
- Accepted assignments.
- Upcoming work.
- Availability.
- Earnings or payment status where supported.

Rental provider dashboard:
- Inventory overview.
- Availability conflicts.
- Pending rental requests.
- Deliveries and pickups.
- Overdue returns.
- Damaged or unavailable items.

Administrator dashboard:
- Accounts requiring review.
- Reports and disputes.
- Moderation queues.
- Relevant activity and audit records.

These are UI priorities, not permission definitions. Never infer authorization from which navigation items are visible.

### Data presentation

- Use tables for dense operational data when appropriate.
- Use cards for summaries and lightweight browsing.
- Use timelines for chronological activity.
- Use calendars only when date-based interaction adds value.
- Use badges with consistent semantic meaning.
- Keep numbers, dates, and currency formatted consistently.

Avoid unnecessary charts, excessive summary cards, and large empty dashboard areas.

Never show invented analytics as if they were real.

---

## 9. Animation system

Use Motion for React as the preferred animation library when it fits the selected frontend setup.

Create a small, reusable motion system rather than writing unrelated animations throughout the application.

Define reusable presets for:

- Fade in.
- Fade and slide.
- Staggered children.
- Card hover.
- Button press.
- Modal entrance and exit.
- Drawer entrance and exit.
- Accordion expansion.
- Layout transitions.
- Scroll-triggered section reveal.
- Loading feedback.

### Animation guidelines

Use the following as initial design ranges, then validate through real-device testing:

| Interaction | Target duration |
|---|---:|
| Button hover or press | 120–200 ms |
| Small icon or control feedback | 120–200 ms |
| Card hover | 160–240 ms |
| Dropdown or popover | 150–220 ms |
| Dialog or drawer | 180–300 ms |
| Section entrance | 300–500 ms |
| Hero sequence | 400–700 ms per coordinated stage |

These are guidelines, not rigid requirements. Avoid unnecessarily long delays.

### Hero animation

A possible sequence:

1. Background image or visual establishes the scene.
2. Headline enters with a restrained fade and vertical movement.
3. Supporting text appears shortly afterward.
4. Primary action becomes visible.
5. Optional decorative layers settle into place.

Keep the sequence short enough that the page becomes usable immediately.

### Scroll-triggered reveals

- Reveal meaningful sections as they enter the viewport.
- Use modest movement and opacity transitions.
- Stagger related cards lightly.
- Avoid hiding important information indefinitely.
- Do not replay animations aggressively on every small scroll.
- Do not make users wait for content to animate before interacting.

### Hover and pointer effects

Appropriate examples:

- Slight card elevation.
- Small image scale changes.
- Subtle border-color changes.
- Button press feedback.
- Restrained highlight effects.

Do not rely on hover to reveal essential information because touchscreens do not have conventional hover behavior.

### Performance rules

- Prefer transform and opacity animations.
- Avoid animating layout-heavy properties continuously.
- Avoid excessive blur, particle systems, large canvas effects, and multiple competing backgrounds.
- Lazy-load heavy noncritical visual effects.
- Do not introduce unnecessary animation dependencies.
- Avoid continuous animation when a one-time transition is sufficient.

### Reduced-motion accessibility

Respect the user's reduced-motion preference.

When reduced motion is enabled:

- Remove parallax and large spatial movement.
- Disable decorative looping animations.
- Reduce or remove staggered transitions.
- Prefer immediate state changes or subtle opacity transitions.
- Keep all information and controls available.

Animations must never be necessary to understand content or operate a control.

---

## 10. Component behavior and interaction states

Every reusable interactive component must have a documented state model.

At minimum, consider:

- Default.
- Hover.
- Focus-visible.
- Pressed.
- Disabled.
- Loading.
- Success.
- Error.
- Empty, where applicable.

### Buttons

- Use a clear primary, secondary, outline, and destructive hierarchy.
- Keep button labels action-oriented.
- Use consistent heights, padding, and corner radii.
- Prevent repeated submission while a request is pending.
- Provide loading feedback for long operations.
- Avoid multiple equally prominent primary actions in one small area.

### Forms

- Provide visible labels.
- Use appropriate input types.
- Show clear validation messages.
- Preserve entered data when validation fails.
- Make required fields identifiable.
- Avoid relying exclusively on placeholder text.
- Ensure keyboard navigation works.
- Clearly distinguish inline validation from submission errors.

### Dialogs and drawers

- Provide an accessible title.
- Manage focus correctly.
- Support keyboard interaction.
- Prevent background interaction where modal behavior requires it.
- Keep content within the viewport.
- Use appropriate confirmation dialogs for destructive actions.
- Do not use dialogs for every minor action.

### Cards and clickable surfaces

- Make the interaction obvious.
- Use semantic links for navigation and buttons for actions.
- Avoid nesting interactive controls in ways that create conflicting click behavior.
- Keep hover effects consistent.
- Ensure clickable elements are keyboard-accessible.

### Feedback and status

Provide appropriate feedback for:

- Successful actions.
- Failed operations.
- Pending operations.
- Empty results.
- Missing images.
- Unavailable content.
- Network interruptions.
- Disabled actions.

Do not display success messages before the relevant operation has actually succeeded.

---

## 11. Responsive design and cross-platform behavior

The application is PWA-first and must work across desktop browsers, Android browsers, and installable PWA contexts where supported.

Use content-driven breakpoints. The following are starting points:

- Small mobile: below 480 px.
- Large mobile: 480–767 px.
- Tablet: 768–1023 px.
- Desktop: 1024–1439 px.
- Wide desktop: 1440 px and above.

Adjust these where the layout requires it.

### Responsive acceptance rules

- No unintended horizontal page overflow.
- No clipped headings or buttons.
- No overlapping navigation.
- No unreadable tables.
- No hover-only functionality.
- No dialogs extending beyond the viewport.
- No inaccessible sticky elements.
- Images preserve their intended subject and aspect ratio.
- Layouts adapt without unnecessary duplication.
- Touch controls remain comfortable to use.
- Portrait and landscape orientations remain usable.

Do not treat mobile as an afterthought. Validate important layouts at narrow widths during implementation.

---

## 12. Accessibility requirements

Target WCAG 2.2 AA as the accessibility baseline.

Require:

- Semantic HTML.
- Logical heading hierarchy.
- Keyboard-accessible navigation.
- Visible focus indicators.
- Accessible form labels and errors.
- Sufficient text and interface contrast.
- Appropriate alternative text for meaningful images.
- Empty alternative text for purely decorative images.
- Correct accessible names for icon-only buttons.
- Appropriate dialog and menu semantics.
- Reduced-motion support.
- Screen-reader-friendly status announcements where needed.
- Touch targets appropriate to the interaction.
- No reliance on color alone to communicate status.

Do not add ARIA attributes unnecessarily. Prefer correct native semantics first.

---

## 13. Image and media rules

Event photography is central to the experience.

Use images that feel authentic to the intended event category and audience.

Preferred subjects include:

- Wedding ceremonies and reception decor.
- Floral arrangements and stage design.
- Birthday and private-event setups.
- Corporate events.
- Event lighting and venue design.
- Equipment and rental products.
- Realistic event professionals at work.

Requirements:

- Use consistent aspect ratios within comparable card collections.
- Use appropriate image cropping and object positioning.
- Use responsive image sizing.
- Lazy-load below-the-fold imagery where appropriate.
- Prioritize the hero image when it is important to the initial view.
- Provide fallback treatments when images fail.
- Avoid low-quality, watermarked, or unrelated stock imagery.
- Do not reuse the same placeholder image across every card.
- Do not hotlink images from reference websites without permission.
- Do not use generated imagery to misrepresent real customer reviews, actual businesses, or verified work.

When final assets are unavailable, use clearly replaceable placeholders that preserve the intended layout.

---

## 14. Icons, typography, and micro-details

### Icons

Use one consistent outline icon family, preferably Lucide.

Rules:

- Use familiar icons for common actions.
- Keep icon sizing consistent.
- Align icons correctly with labels.
- Provide accessible labels for icon-only controls.
- Avoid decorative icons that add no meaning.
- Avoid mixing unrelated icon libraries.

### Typography

Use a limited, consistent type scale.

- Display typography for major landing-page headlines.
- Clear heading hierarchy.
- Comfortable body-text line height.
- Readable small labels.
- Consistent price and metadata styling.
- No excessively small text to fit more content.

Avoid using decorative typography for long descriptions, forms, tables, or dense dashboard content.

### Micro-details

Pay attention to:

- Consistent corner radii.
- Alignment between cards.
- Balanced image and text proportions.
- Button padding.
- Label spacing.
- Empty-state illustrations.
- Focus rings.
- Dividers.
- Loading skeletons.
- Image fallbacks.
- Tooltip placement.
- Dropdown alignment.
- Sticky header behavior.

The quality should come from consistency and restraint, not from adding more visual effects.

---

## 15. Performance and implementation discipline

The UI must remain fast on average mobile devices and ordinary network connections.

Requirements:

- Use responsive image delivery.
- Avoid unnecessary client-side JavaScript.
- Avoid excessive re-rendering caused by animation state.
- Lazy-load noncritical modules and heavy effects.
- Reserve image dimensions to prevent layout shifts.
- Keep animations smooth without compromising scroll performance.
- Avoid blocking the main content with decorative loading screens.
- Test public pages for loading performance and layout stability.
- Ensure the interface remains useful when optional animations fail to load.

Use progressive enhancement where practical: core content and navigation should remain available even if a decorative effect does not run.

---

## 16. Mandatory DOs

1. DO inspect the reference website and GitHub repositories before major UI decisions.
2. DO document the useful visual patterns you discover.
3. DO build and maintain a shared design system.
4. DO use reusable components with clear responsibilities.
5. DO preserve the distinction between the public editorial theme and the dark dashboard theme.
6. DO create a reusable, configurable organizer website template.
7. DO prioritize information hierarchy and clear calls to action.
8. DO make mobile and desktop layouts equally intentional.
9. DO use motion consistently and purposefully.
10. DO support keyboard navigation, screen readers, and reduced motion.
11. DO design loading, empty, error, success, and disabled states.
12. DO use real data when available and clearly identified placeholders otherwise.
13. DO validate actual layouts in the browser, not just by reading the code.
14. DO inspect the final rendered interface at multiple viewport sizes.
15. DO fix visual regressions instead of layering arbitrary CSS patches over them.
16. DO verify dependency compatibility and licenses before adopting external components.
17. DO preserve a coherent icon family, typography system, and spacing scale.
18. DO keep all brand-specific elements configurable.
19. DO make the primary user action obvious on every important screen.
20. DO report which visual references were actually inspected and which could not be accessed.

---

## 17. Mandatory DON'Ts

1. DON'T copy the complete design or branding of the reference website.
2. DON'T blindly copy components from GitHub without understanding their behavior, licensing, dependencies, and accessibility.
3. DON'T build a generic SaaS dashboard and simply recolor it.
4. DON'T make every section a gradient, glassmorphism panel, or glowing card.
5. DON'T use dark backgrounds on every public page by default.
6. DON'T use random accent colors on different pages.
7. DON'T add animations to every single element.
8. DON'T use excessive parallax, spinning elements, particles, or constant motion.
9. DON'T make users wait for animation before interacting.
10. DON'T use hover as the only way to access important actions.
11. DON'T sacrifice readability for a visually dramatic layout.
12. DON'T invent reviews, ratings, customer counts, prices, or business claims.
13. DON'T use irrelevant images or the same placeholder image for every card.
14. DON'T create buttons or links with no functional destination.
15. DON'T leave visible controls without hover, focus, disabled, or loading behavior where relevant.
16. DON'T use emoji as a substitute for a consistent professional icon system.
17. DON'T scatter hard-coded design values throughout the application.
18. DON'T use arbitrary CSS overrides to fix recurring design-system problems.
19. DON'T ignore narrow screens or touch interactions.
20. DON'T make the sidebar cover the main content.
21. DON'T allow horizontal overflow on mobile.
22. DON'T use inaccessible low-contrast text or tiny labels.
23. DON'T ignore reduced-motion settings.
24. DON'T introduce several competing component or animation libraries without a justified need.
25. DON'T install optional animation packages simply to use one minor effect.
26. DON'T replace real application functionality with fake UI states.
27. DON'T use fabricated data as if it were real.
28. DON'T rewrite unrelated project architecture while performing a UI task.
29. DON'T claim that visual testing passed unless you actually ran the relevant checks.
30. DON'T begin backend implementation, payment logic, database design, or unrelated business features under this UI/UX-only instruction.

---

## 18. Required workflow for the coding agent

Follow this sequence.

### Step 1 — Inspect

- Inspect the current repository and identify the actual framework, conventions, and available dependencies.
- If the repository is empty, acknowledge that and prepare the UI implementation plan.
- Inspect the supplied website and GitHub references.
- Review existing design tokens and components if any exist.
- Do not assume that the planned stack has already been installed.

### Step 2 — Prepare the visual direction

Document:

- Reference audit.
- Proposed color and typography direction.
- Public-site and dashboard theme rules.
- Design tokens.
- Icon system.
- Motion principles.
- Responsive layout rules.
- Reusable component inventory.

### Step 3 — Present the UI plan

Before large-scale implementation, present:

- The proposed design system.
- The main page layouts.
- The homepage and organizer-template direction.
- The dashboard shell.
- The animation strategy.
- Any necessary dependencies.
- Important trade-offs or unresolved design decisions.

Do not silently make irreversible brand decisions.

### Step 4 — Implement in controlled increments

Once authorized to implement:

1. Establish the shared design tokens.
2. Create the core UI primitives.
3. Build the responsive navigation shell.
4. Build the marketplace homepage.
5. Build the reusable organizer template.
6. Build shared card, form, modal, and feedback patterns.
7. Apply the animation system.
8. Build the dashboard shell and representative role dashboards.
9. Extend the system to remaining screens.
10. Refine responsive behavior and visual consistency.

Implement only the scope authorized by the user.

### Step 5 — Validate

Test:

- Desktop, tablet, and mobile layouts.
- Navigation and interaction states.
- Keyboard operation.
- Reduced-motion behavior.
- Loading and error states.
- Image loading and fallback behavior.
- Animation smoothness.
- Layout shifts and overflow.
- Contrast and accessible names.
- Consistency across public pages and dashboards.

Use browser screenshots or visual inspection tools when available.

Do not declare the work complete merely because the application compiles.

### Step 6 — Report

At the end of each authorized increment, summarize:

- Screens and components completed.
- Design decisions made.
- References actually used.
- Dependencies added.
- Tests and viewport checks performed.
- Known limitations.
- Any decisions requiring user approval.

---

## 19. Definition of done

A UI/UX increment is complete only when:

- The page follows the approved visual direction.
- Its typography, spacing, colors, and components are consistent.
- It behaves correctly on the intended screen sizes.
- All visible interactions have meaningful behavior.
- Loading, empty, error, and disabled states are handled where applicable.
- Animation is restrained, performant, and accessible.
- Important content remains usable with reduced motion.
- There are no obvious layout defects or unintended horizontal overflow.
- The implementation uses reusable components rather than unnecessary duplication.
- Visual validation has actually been performed.
- Any remaining limitations are explicitly reported.

## Final instruction

Treat these rules as the project's UI/UX source of truth.

When a design choice is unclear, prioritize usability, accessibility, visual consistency, performance, and the event-services context.

Use the VKS Wedding Events website for event-industry visual inspiration, shadcn/ui for accessible component patterns, Motion for React for the animation system, and Magic UI or Aceternity UI only for carefully selected visual effects.

Adapt references into an original design. Do not turn the application into a showcase of animation libraries.

**First inspect the references and produce the UI/UX plan. Do not begin implementation until the user explicitly approves that plan.**
