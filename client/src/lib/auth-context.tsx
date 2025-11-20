import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { User, Organization } from '@shared/schema';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, organizationName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserData(session.user);
      } else {
        setUser(null);
        setOrganization(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserData(supabaseUser: SupabaseUser) {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (userError) throw userError;

      if (userData) {
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          organizationId: userData.organization_id,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        };
        setUser(user);

        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', user.organizationId)
          .single();

        if (orgError) throw orgError;
        
        const org: Organization = {
          id: orgData.id,
          name: orgData.name,
          isApproved: orgData.is_approved,
          createdAt: orgData.created_at,
          updatedAt: orgData.updated_at,
        };
        setOrganization(org);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function signUp(email: string, password: string, name: string, organizationName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');

    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationName,
        is_approved: false,
      })
      .select()
      .single();

    if (orgError) throw orgError;

    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: 'OWNER',
        organization_id: orgData.id,
      });

    if (userError) throw userError;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const value = {
    session,
    user,
    organization,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
