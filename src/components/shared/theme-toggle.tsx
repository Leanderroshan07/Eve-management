"use client";

import * as React from "react";

export function ThemeToggle() {
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
    try {
      localStorage.setItem("veluxe_theme", "dark");
    } catch {
      // Ignore storage errors
    }
  }, []);

  return null;
}

