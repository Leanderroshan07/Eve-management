"use client";

import * as React from "react";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { RealtimeNotifier } from "./realtime-notifier";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <RealtimeNotifier />
    </AuthProvider>
  );
}
