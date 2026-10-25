"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "./client";

export type UserRole = "customer" | "organizer" | "worker" | "rental_provider" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  businessName?: string;
  isDemo?: boolean;
}

export const DEMO_PROFILES: Record<UserRole, AuthUser> = {
  customer: {
    id: "demo-cust-001",
    email: "sarah.kapoor@example.com",
    name: "Sarah Kapoor",
    role: "customer",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80",
    isDemo: true,
  },
  organizer: {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    email: "concierge@auraevents.com",
    name: "Aura Concierge",
    businessName: "Aura Events & Co.",
    role: "organizer",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    isDemo: true,
  },
  worker: {
    id: "w1eebc99-9c0b-4ef8-bb6d-6bb9bd380001",
    email: "vikram.mehta@staff.veluxe.com",
    name: "Vikram Mehta",
    businessName: "Senior Sommelier & Mixologist",
    role: "worker",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
    isDemo: true,
  },
  rental_provider: {
    id: "r1eebc99-9c0b-4ef8-bb6d-6bb9bd380111",
    email: "ops@soundlightpro.in",
    name: "Sound & Light Pro",
    businessName: "Sound & Light Pro Audio-Visuals",
    role: "rental_provider",
    avatarUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=160&auto=format&fit=crop&q=80",
    isDemo: true,
  },
  admin: {
    id: "adm-001-master",
    email: "admin@veluxe.luxury",
    name: "Alexander Vance",
    businessName: "Veluxe Executive Platform Director",
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80",
    isDemo: true,
  },
};

export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/customer/dashboard";
    case "organizer":
      return "/organizer/dashboard";
    case "worker":
      return "/worker/dashboard";
    case "rental_provider":
      return "/rental/dashboard";
    case "admin":
      return "/admin/dashboard";
  }
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, role: UserRole, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  getDashboardUrl: (role: UserRole) => string;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "veluxe_active_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize session from Supabase or localStorage demo profile
  React.useEffect(() => {
    async function initAuth() {
      try {
        const supabase = createClient();
        if (supabase) {
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            const role = (data.user.user_metadata?.role as UserRole) || "customer";
            setUser({
              id: data.user.id,
              email: data.user.email || "",
              name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
              role,
              avatarUrl: data.user.user_metadata?.avatar_url,
              businessName: data.user.user_metadata?.business_name,
              isDemo: false,
            });
            setIsLoading(false);
            return;
          }
        }

        // Check local storage demo session
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          // Default to Customer demo for effortless first preview
          setUser(DEMO_PROFILES.customer);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PROFILES.customer));
        }
      } catch (err) {
        console.warn("Auth initialization fallback to demo profile:", err);
        setUser(DEMO_PROFILES.customer);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const role = (data.user.user_metadata?.role as UserRole) || "customer";
          const newUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || email.split("@")[0],
            role,
            avatarUrl: data.user.user_metadata?.avatar_url,
            businessName: data.user.user_metadata?.business_name,
            isDemo: false,
          };
          setUser(newUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
          setIsLoading(false);
          return { success: true };
        }
      }

      // Check if matches any demo profile
      const matchedRole = (Object.keys(DEMO_PROFILES) as UserRole[]).find(
        (r) => DEMO_PROFILES[r].email.toLowerCase() === email.toLowerCase()
      );
      if (matchedRole) {
        const demo = DEMO_PROFILES[matchedRole];
        setUser(demo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: "Invalid credentials. Try using one-click demo login below." };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Failed to sign in";
      return { success: false, error: message };
    }
  };

  const signUp = async (email: string, pass: string, role: UserRole, name: string) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              full_name: name,
              role,
            },
          },
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const newUser: AuthUser = {
            id: data.user.id,
            email,
            name,
            role,
            isDemo: false,
          };
          setUser(newUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
          setIsLoading(false);
          return { success: true };
        }
      }

      // Offline mock account creation
      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        email,
        name,
        role,
        isDemo: true,
      };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Failed to sign up";
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Sign out remote warning:", err);
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    router.push("/auth/login");
  };

  const switchDemoRole = (role: UserRole) => {
    const profile = DEMO_PROFILES[role];
    setUser(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    router.push(getDashboardUrl(role));
  };

  const activeRole: UserRole = user?.role || "customer";

  return (
    <AuthContext.Provider
      value={{
        user,
        role: activeRole,
        isLoading,
        signIn,
        signUp,
        signOut,
        switchDemoRole,
        getDashboardUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
