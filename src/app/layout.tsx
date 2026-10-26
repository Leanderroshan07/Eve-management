import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LuxuryBackground } from "@/components/shared/luxury-background";
import { AppProviders } from "@/components/shared/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veluxe — Luxury Event Services, Workforce & Rental Marketplace",
  description:
    "Discover premier event organizer companies, book curated packages, hire specialized catering workforce, and rent event equipment seamlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark h-full antialiased font-sans"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
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
