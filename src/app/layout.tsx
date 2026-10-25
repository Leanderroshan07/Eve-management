import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { LuxuryBackground } from "@/components/shared/luxury-background";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Veluxe — Luxury Event Services, Workforce & Rental Marketplace",
  description:
    "Discover premier event organizer companies, book curated packages, hire specialized catering workforce, and rent event equipment seamlessly.",
};

import { AppProviders } from "@/components/shared/app-providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${jakarta.variable} dark h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("dark");try{localStorage.setItem("veluxe_theme","dark");}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative text-foreground">
        <Suspense fallback={null}>
          <LuxuryBackground />
        </Suspense>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
