# VELUXE — Event Services, Catering Workforce & Rental Marketplace

A digital multi-sided platform uniting luxury event organizers, specialized catering workforce, and event equipment rentals.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` configuration)
- **Icons:** Lucide React
- **Motion System:** Motion for React (`motion/react`) with hardware acceleration and reduced-motion compliance
- **Backend Services:** Supabase (Auth, PostgreSQL, SSR integration)
- **Validation:** Zod schemas & React Hook Form primitives

---

## Getting Started

### 1. Prerequisites
- Node.js v20+ or v24+
- `pnpm` (recommended) or `npm`

### 2. Environment Setup
Copy the example environment file and supply your Supabase project credentials when available:

```bash
cp .env.example .env.local
```

### 3. Development Server
Run the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Verification
```bash
# Type check
pnpm tsc --noEmit

# Production bundle build
pnpm build
```

---

## Phase 0 Foundation Highlights
- **Dual Visual Modes:**
  - **Mode A (Public Editorial Luxury):** Warm ivory `#FAF8F5`, champagne gold accents `#D4AF37`, Playfair Display serif headlines.
  - **Mode B (Authenticated Dark Dashboard):** Deep slate `#0C0E12`, elevated surfaces `#14171F`, gold highlights.
- **Motion Architecture (`src/lib/motion.ts`):**
  - **Cinematic Organizer Presets:** Tailored for public portfolio showcases and hero reveals.
  - **Restrained Dashboard Presets:** 150–250ms snappy transitions for dense operational workflows.
  - **GPU Accelerated:** Strictly animates `transform` (x, y, scale) and `opacity`.
- **Accessible Primitives:** Button, Card, Badge, Input, and Dialog modal.
