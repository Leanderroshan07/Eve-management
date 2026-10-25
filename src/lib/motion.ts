import type { Variants, Transition } from "motion/react";

/**
 * Professional Motion System for Event Services Marketplace
 *
 * Core Tenets:
 * 1. Hardware acceleration: Only animate `transform` (x, y, scale) and `opacity`.
 * 2. Purposeful hierarchy: Restrained & crisp for SaaS/dashboards; dramatic & cinematic for public event organizers.
 * 3. Accessibility first: Respect `prefers-reduced-motion` at all levels.
 */

// ==========================================
// 1. TIMING & EASING CONSTANTS (CONTROLLED & MEASURED)
// ==========================================

export const TRANSITION_DURATION = {
  instant: 0.15,
  fast: 0.3,
  base: 0.5,
  smooth: 0.8,
  cinematic: 1.25,
  heroSequence: 1.8,
} as const;

export const EASING = {
  // Ultra-smooth decelerated curve (Apple/editorial style)
  luxuryDecelerate: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Snappy responsive curve for interactive controls
  snappyOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
  // Standard natural curve
  smoothEase: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
} as const;

export const SPRINGS = {
  // Controlled tactile feedback for buttons and pills
  snappy: { type: "spring", stiffness: 350, damping: 28 } as Transition,
  // Gentle smooth glide for dialogs, popovers, and tooltips
  gentle: { type: "spring", stiffness: 200, damping: 26 } as Transition,
  // Heavy, liquid luxury motion for event organizer cards and hero visuals
  luxury: { type: "spring", stiffness: 90, damping: 24, mass: 1.2 } as Transition,
} as const;

// ==========================================
// 2. REUSABLE VARIANTS (CLEAN & RESTRAINED)
// ==========================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: TRANSITION_DURATION.base, ease: EASING.smoothEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: TRANSITION_DURATION.fast, ease: EASING.smoothEase },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TRANSITION_DURATION.smooth, ease: EASING.luxuryDecelerate },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: { duration: TRANSITION_DURATION.fast, ease: EASING.smoothEase },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TRANSITION_DURATION.smooth, ease: EASING.luxuryDecelerate },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: TRANSITION_DURATION.fast, ease: EASING.smoothEase },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: TRANSITION_DURATION.base, ease: EASING.snappyOut },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: TRANSITION_DURATION.fast, ease: EASING.smoothEase },
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Interactive button feedback variant
export const buttonInteractive = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: SPRINGS.snappy },
  tap: { scale: 0.98, transition: SPRINGS.snappy },
};

// Subtle card hover with slight elevation & scale
export const cardHover = {
  rest: { y: 0, boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" },
  hover: {
    y: -4,
    boxShadow: "0px 14px 28px -6px rgba(0,0,0,0.1), 0px 6px 12px -4px rgba(0,0,0,0.06)",
    transition: { duration: TRANSITION_DURATION.base, ease: EASING.luxuryDecelerate },
  },
};

// ==========================================
// 3. CINEMATIC VARIANTS (EVENT ORGANIZER PAGES)
// ==========================================

export const dramaticHeroHeadline: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: TRANSITION_DURATION.cinematic,
      ease: EASING.luxuryDecelerate,
    },
  },
};

export const dramaticHeroSub: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TRANSITION_DURATION.cinematic,
      ease: EASING.luxuryDecelerate,
      delay: 0.2,
    },
  },
};

export const dramaticImageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: TRANSITION_DURATION.heroSequence,
      ease: EASING.luxuryDecelerate,
    },
  },
};

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: TRANSITION_DURATION.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: TRANSITION_DURATION.fast },
  },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRINGS.gentle,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: { duration: TRANSITION_DURATION.instant },
  },
};
