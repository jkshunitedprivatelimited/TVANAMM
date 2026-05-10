'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase/auth';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user to our AuthUser shape
  const resolveUser = useCallback((supaUser: User | null): AuthUser | null => {
    if (!supaUser) return null;
    return {
      id: supaUser.id,
      email: supaUser.email || '',
      fullName:
        supaUser.user_metadata?.full_name ||
        supaUser.user_metadata?.name ||
        supaUser.email?.split('@')[0] ||
        'Customer',
      phone: supaUser.user_metadata?.phone || '',
      avatarUrl: supaUser.user_metadata?.avatar_url,
    };
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(resolveUser(initialSession?.user ?? null));
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(resolveUser(newSession?.user ?? null));
      setIsLoading(false);

      // Auto-sync profile when user signs in (handles OAuth automatically)
      if (event === 'SIGNED_IN' && newSession?.access_token) {
        fetch('/api/auth/profile/sync', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${newSession.access_token}`
          }
        }).catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, [resolveUser]);

  // ── Google OAuth ────────────────────────────────────────────
  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    // Redirect directly to the requested page (Supabase JS will automatically parse the hash)
    const callbackUrl = `${window.location.origin}${redirectTo || '/store'}`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
      },
    });
  }, []);

  // ── Email/Password Sign In ──────────────────────────────────
  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: error.message };
      }
      return {};
    },
    []
  );

  // ── Manual Sign Up ──────────────────────────────────────────
  const signUp = useCallback(
    async (data: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    }): Promise<{ error?: string; needsEmailConfirmation?: boolean }> => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          return { error: result.error || 'Signup failed' };
        }

        if (result.needsEmailConfirmation) {
          return { needsEmailConfirmation: true };
        }

        // Auto sign-in after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          return { error: 'Account created but auto-login failed. Please sign in manually.' };
        }

        return {};
      } catch {
        return { error: 'Network error. Please try again.' };
      }
    },
    []
  );

  // ── Sign Out ────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Redirect to store after sign out
    window.location.href = '/store';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
