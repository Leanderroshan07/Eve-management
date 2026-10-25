"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";

interface LuxuryBackgroundProps {
  className?: string;
}

export function LuxuryBackground({ className = "" }: LuxuryBackgroundProps) {
  const pathname = usePathname();
  const isDashboardRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/customer") ||
    pathname?.startsWith("/organizer") ||
    pathname?.startsWith("/worker");

  // 1. Scroll-based depth parallax
  const { scrollY } = useScroll();
  const zenithParallaxY = useTransform(scrollY, [0, 1600], [0, 130]);
  const patternParallaxY = useTransform(scrollY, [0, 1600], [0, 70]);
  const ambientParallaxY = useTransform(scrollY, [0, 1600], [0, 90]);

  // 2. Interactive Smooth 2D Mouse Drift for 3D Stereoscopic Parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 28, stiffness: 85, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const lightLeft = useTransform(smoothMouseX, [0, 1], ["10%", "90%"]);
  const lightTop = useTransform(smoothMouseY, [0, 1], ["5%", "85%"]);

  const patternDriftX = useTransform(smoothMouseX, [0, 1], [16, -16]);
  const patternDriftY = useTransform(smoothMouseY, [0, 1], [12, -12]);

  const lightDriftX = useTransform(smoothMouseX, [0, 1], [22, -22]);
  const lightDriftY = useTransform(smoothMouseY, [0, 1], [16, -16]);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth > 0 && innerHeight > 0) {
        mouseX.set(e.clientX / innerWidth);
        mouseY.set(e.clientY / innerHeight);
      }
    },
    [mouseX, mouseY]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none transition-colors duration-500 ${className}`}
    >
      {/* ======================================================== */}
      {/* 1. BASE ATMOSPHERIC DEPTH FOUNDATION                     */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(180deg, #190903 0%, #120601 35%, #080301 100%)",
        }}
      />

      {/* ======================================================== */}
      {/* 2. 3D EMBOSSED ROYAL MANDALA & DAMASK FILIGREE PATTERN  */}
      {/* ======================================================== */}
      <motion.div
        style={{
          x: patternDriftX,
          y: patternParallaxY,
        }}
        className={`absolute inset-0 w-full h-[140%] -top-[15%] transition-opacity duration-700 pointer-events-none ${
          isDashboardRoute
            ? "opacity-42 mix-blend-luminosity"
            : "opacity-55 mix-blend-luminosity"
        }`}
      >
        <motion.div style={{ y: patternDriftY }} className="w-full h-full">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/images/royal-gold-mandala-3d.jpg')`,
              backgroundRepeat: "repeat",
              backgroundSize: "500px 500px",
              backgroundPosition: "center top",
              filter: "contrast(1.3) brightness(0.92)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* ======================================================== */}
      {/* 3. VOLUMETRIC MOLTEN GOLD & AMBER ILLUMINATION SWELLS    */}
      {/* ======================================================== */}
      <motion.div
        style={{
          x: lightDriftX,
          y: ambientParallaxY,
        }}
        className={`absolute inset-0 w-full h-[130%] -top-[10%] transition-opacity duration-500 pointer-events-none ${
          isDashboardRoute ? "opacity-85" : "opacity-95"
        }`}
      >
        <motion.div style={{ y: lightDriftY }} className="w-full h-full relative">
          {/* Luminous Zenith Sunfire Center (Golden burst highlighting 3D carvings) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 50% -8%, rgba(254, 240, 138, 0.40) 0%, rgba(252, 211, 77, 0.32) 22%, rgba(245, 158, 11, 0.22) 45%, transparent 75%),
                radial-gradient(circle 850px at 12% 20%, rgba(217, 119, 6, 0.26) 0%, rgba(180, 83, 9, 0.16) 45%, transparent 70%),
                radial-gradient(circle 900px at 88% 25%, rgba(245, 158, 11, 0.24) 0%, rgba(146, 64, 14, 0.18) 50%, transparent 72%),
                radial-gradient(ellipse 85% 55% at 50% 60%, rgba(180, 83, 9, 0.18) 0%, rgba(120, 53, 15, 0.10) 50%, transparent 80%)
              `,
            }}
          />

          {/* Deep Cloud Vignette (Roasted Umber & Obsidian Shadows framing the 3D relief) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse 120% 80% at 50% 120%, #060201 0%, transparent 65%),
                radial-gradient(circle 600px at 0% 100%, rgba(20, 7, 2, 0.75) 0%, transparent 70%),
                radial-gradient(circle 600px at 100% 100%, rgba(20, 7, 2, 0.75) 0%, transparent 70%)
              `,
            }}
          />
        </motion.div>
      </motion.div>

      {/* ======================================================== */}
      {/* 4. INTERACTIVE CURSOR-TRACKED SPECULAR WARMTH            */}
      {/* ======================================================== */}
      <motion.div
        style={{
          left: lightLeft,
          top: lightTop,
          y: zenithParallaxY,
        }}
        className="absolute w-[620px] h-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none blur-3xl transition-opacity duration-300"
        animate={{
          opacity: isDashboardRoute ? 0.38 : 0.45,
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(254, 240, 138, 0.30) 0%, rgba(245, 158, 11, 0.24) 32%, rgba(217, 119, 6, 0.12) 55%, transparent 75%)",
          }}
        />
      </motion.div>

      {/* ======================================================== */}
      {/* 5. SOFT GOLD EMBOSS SHEEN VIGNETTE                       */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 60%, rgba(10, 3, 1, 0.8) 100%)",
        }}
      />
    </div>
  );
}

