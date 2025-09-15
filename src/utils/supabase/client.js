import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create Supabase client with error handling
let supabase;
try {
  supabase = createClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a fallback client that won't break the app
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not available') }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Supabase not available') }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      updateUser: () => Promise.resolve({ error: new Error('Supabase not available') }),
      setSession: () => Promise.resolve({ data: null, error: null })
    }
  };
}

export { supabase };

// Helper function to get the current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Helper function to get auth headers for API calls
export const getAuthHeaders = async () => {
  const session = await getCurrentSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
  };
};

// Helper function to make authenticated API calls
export const makeAPICall = async (endpoint, options = {}) => {
  const headers = await getAuthHeaders();
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server`;
  
  const response = await fetch(`${serverUrl}${endpoint}`, {
    headers,
    ...options
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};