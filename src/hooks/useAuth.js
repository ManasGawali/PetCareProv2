// Authentication hook with Supabase backend integration
import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI, storage } from '../utils/api';
import { supabase } from '../utils/supabase/client';

// Create Auth Context
const AuthContext = createContext({});

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
    
    // Listen for auth state changes
    let subscription;
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata?.full_name || '',
              avatar: session.user.user_metadata?.avatar_url || null,
              provider: session.user.app_metadata?.provider || 'email'
            };
            
            setUser(userData);
            setIsSignedIn(true);
            storage.setUser(userData);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setIsSignedIn(false);
            storage.clear();
          }
          setIsLoading(false);
        }
      );
      subscription = authSubscription;
    } catch (error) {
      console.error('Auth state change listener error:', error);
      setIsLoading(false);
    }

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check for existing Supabase session
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult?.data?.session;
      
      if (session) {
        try {
          const result = await authAPI.getCurrentUser();
          if (result.success) {
            const userData = {
              id: result.data.user.id,
              email: result.data.user.email,
              fullName: result.data.user.full_name,
              avatar: result.data.user.avatar_url,
              provider: result.data.user.provider || 'email'
            };
            
            setUser(userData);
            setIsSignedIn(true);
            storage.setUser(userData);
          } else {
            // Clear invalid session
            await supabase.auth.signOut();
            storage.clear();
          }
        } catch (error) {
          console.warn('Session validation failed:', error);
          try {
            await supabase.auth.signOut();
          } catch (signOutError) {
            console.warn('Sign out failed:', signOutError);
          }
          storage.clear();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth with Supabase
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        return { 
          success: false, 
          error: 'Google sign-in is not configured yet. Please use email/password for now.' 
        };
      }
      
      // OAuth redirect will handle the rest
      return { success: true };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setIsLoading(true);
      const result = await authAPI.login(email, password);
      
      if (result?.success && result.data?.user) {
        const userData = {
          id: result.data.user.id,
          email: result.data.user.email,
          fullName: result.data.user.full_name || '',
          avatar: result.data.user.avatar_url || null,
          provider: result.data.user.provider || 'email'
        };
        
        setUser(userData);
        setIsSignedIn(true);
        
        // Store in localStorage for consistency
        storage.setUser(userData);
        
        return { success: true };
      } else {
        throw new Error(result?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Email sign-in error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      setIsLoading(true);
      const result = await authAPI.register({
        email,
        password,
        full_name: fullName
      });
      
      if (result.success) {
        // Note: With Supabase, we need to sign in after registration
        const signInResult = await authAPI.login(email, password);
        
        if (signInResult.success) {
          const userData = {
            id: signInResult.data.user.id,
            email: signInResult.data.user.email,
            fullName: signInResult.data.user.full_name,
            avatar: signInResult.data.user.avatar_url,
            provider: 'email'
          };
          
          setUser(userData);
          setIsSignedIn(true);
          
          // Store in localStorage
          storage.setUser(userData);
          
          return { success: true };
        }
      }
      
      throw new Error(result.message || 'Registration failed');
    } catch (error) {
      console.error('Sign-up error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Supabase
      await authAPI.logout();
      
      // State will be updated by the auth state change listener
      return { success: true };
    } catch (error) {
      console.error('Sign-out error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const result = await authAPI.updateProfile(profileData);
      
      if (result.success) {
        const updatedUser = {
          ...user,
          fullName: result.data.user.full_name,
          avatar: result.data.user.avatar_url
        };
        
        setUser(updatedUser);
        storage.setUser(updatedUser);
        
        return { success: true };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isSignedIn,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}