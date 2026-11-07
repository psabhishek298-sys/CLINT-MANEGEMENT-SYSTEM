import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User } from '../types';
import { isSupabaseConfigured, supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.removeItem('truqen-user');
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data, error }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { uid: sessionUser.id, email: sessionUser.email || '', displayName: sessionUser.user_metadata.display_name || sessionUser.email?.split('@')[0] || 'User' } : null);
      if (error) setError(error.message);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      setUser(sessionUser ? { uid: sessionUser.id, email: sessionUser.email || '', displayName: sessionUser.user_metadata.display_name || sessionUser.email?.split('@')[0] || 'User' } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured. Add the project URL and publishable key to .env.local.');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    void supabase?.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!email) throw new Error('Please enter your email address');
      if (!supabase) throw new Error('Supabase is not configured.');
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, resetPassword, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
