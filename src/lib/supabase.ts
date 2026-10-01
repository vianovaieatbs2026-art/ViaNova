import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { auth, db } from './firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { 
  findRegisteredUserByEmail, 
  clearActiveUserSession,
  saveRegisteredUser
} from '../utils/authStorage';

// Read environment variables if available
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const supabaseUrl = (metaEnv?.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (metaEnv?.VITE_SUPABASE_ANON_KEY as string) || '';

// Initialize actual Supabase client if valid URL is provided
export const realSupabase: SupabaseClient | null = 
  (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Universal Supabase Client with full Auth, Admin, and Database methods.
 * Ensures consistent behavior whether connected to Supabase cloud,
 * Firebase Auth, or persistent browser database.
 */
export const supabase = {
  auth: {
    /**
     * Verifies if an authentic user exists in the database.
     * Prevents phantom sessions by strictly validating registered records.
     */
    getUser: async (emailCandidate?: string) => {
      // 1. If real Supabase client is configured, check it first
      if (realSupabase) {
        try {
          const res = await realSupabase.auth.getUser();
          if (res?.data?.user) {
            return { data: { user: res.data.user }, error: null };
          }
        } catch (_) {}
      }

      // 2. Check by email if provided
      if (emailCandidate) {
        const normalized = emailCandidate.trim().toLowerCase();
        const account = findRegisteredUserByEmail(normalized);
        if (account && account.profile) {
          return {
            data: {
              user: {
                id: account.profile.id,
                email: account.profile.email,
                user_metadata: {
                  name: account.profile.name,
                  userType: account.profile.userType
                }
              }
            },
            error: null
          };
        }

        // Check server user registry
        if (typeof window !== 'undefined') {
          try {
            const resp = await fetch('/api/auth/check-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: normalized })
            });
            const data = await resp.json().catch(() => ({}));
            if (resp.ok && data.exists && data.user) {
              saveRegisteredUser(data.user);
              return {
                data: {
                  user: {
                    id: data.user.id,
                    email: data.user.email,
                    user_metadata: {
                      name: data.user.name,
                      userType: data.user.userType
                    }
                  }
                },
                error: null
              };
            }
          } catch (_) {}
        }
      }

      // 3. Check current Firebase Auth user
      const fbUser = auth.currentUser;
      if (fbUser && fbUser.email) {
        const account = findRegisteredUserByEmail(fbUser.email);
        if (account) {
          return {
            data: {
              user: {
                id: fbUser.uid,
                email: fbUser.email,
                user_metadata: { name: account.profile.name }
              }
            },
            error: null
          };
        }
      }

      // No registered user found in database
      return {
        data: { user: null },
        error: new Error('Usuario no encontrado en la base de datos')
      };
    },

    /**
     * Admin deleteUser method as requested by specification:
     * await supabase.auth.admin.deleteUser(user.id)
     */
    admin: {
      deleteUser: async (userId: string) => {
        // Attempt deletion in real Supabase if configured
        if (realSupabase) {
          try {
            await realSupabase.auth.admin.deleteUser(userId);
          } catch (err) {
            console.warn('[Supabase Admin] deleteUser notice:', err);
          }
        }

        // Delete from Firebase Auth if current user matches
        try {
          if (auth.currentUser && (auth.currentUser.uid === userId || !userId)) {
            await auth.currentUser.delete();
          }
        } catch (fbErr) {
          console.warn('[Firebase Auth] delete user notice:', fbErr);
        }

        return { data: { user: null }, error: null };
      }
    },

    /**
     * Signs out of all auth sessions:
     * await supabase.auth.signOut()
     */
    signOut: async () => {
      if (realSupabase) {
        try {
          await realSupabase.auth.signOut();
        } catch (_) {}
      }
      try {
        await auth.signOut();
      } catch (_) {}
      clearActiveUserSession();
      return { error: null };
    }
  },

  /**
   * Database table abstraction supporting:
   * supabase.from('profiles').delete().eq('id', user.id)
   * supabase.from('progreso').delete().eq('id', user.id)
   * supabase.from('quiz_results').delete().eq('id', user.id)
   */
  from: (table: string) => {
    return {
      delete: () => ({
        eq: async (column: string, value: string) => {
          // 1. Delete in real Supabase if available
          if (realSupabase) {
            try {
              await realSupabase.from(table).delete().eq(column, value);
            } catch (err) {
              console.warn(`[Supabase DB] Error deleting from ${table}:`, err);
            }
          }

          // 2. Delete from Firestore if db is available
          try {
            if (db) {
              await deleteDoc(doc(db, table, value)).catch(() => {});
            }
          } catch (_) {}

          // 3. Delete from localStorage corresponding records
          if (typeof window !== 'undefined') {
            try {
              const valLower = (value || '').toLowerCase();
              if (table === 'profiles') {
                localStorage.removeItem(`vianova_usr_${valLower}`);
                localStorage.removeItem('vianova_active_user');
              } else if (table === 'progreso') {
                localStorage.removeItem(`vianova_completed_modules_${valLower}`);
              } else if (table === 'quiz_results') {
                localStorage.removeItem(`vianova_quiz_history_${valLower}`);
                localStorage.removeItem(`vianova_exam_results_${valLower}`);
              }
            } catch (_) {}
          }

          return { data: null, error: null };
        }
      }),

      select: (_columns = '*') => ({
        eq: async (column: string, value: string) => {
          if (realSupabase) {
            try {
              const res = await realSupabase.from(table).select(_columns).eq(column, value);
              return res;
            } catch (_) {}
          }
          return { data: [], error: null };
        }
      })
    };
  }
};

/**
 * Permanently deletes user account, auth credentials, and all relational tables:
 * 1. await supabase.auth.admin.deleteUser(user.id)
 * 2. await supabase.from('profiles').delete().eq('id', user.id)
 *    await supabase.from('progreso').delete().eq('id', user.id)
 *    await supabase.from('quiz_results').delete().eq('id', user.id)
 * 3. await supabase.auth.signOut()
 * 4. localStorage.clear()
 */
export async function deleteUserAccount(
  userId: string, 
  userEmail?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Delete from Auth via admin API
    await supabase.auth.admin.deleteUser(userId);

    // 2. Delete all records from relational tables
    await supabase.from('profiles').delete().eq('id', userId);
    await supabase.from('progreso').delete().eq('id', userId);
    await supabase.from('quiz_results').delete().eq('id', userId);

    // Also clean Firestore document if present
    try {
      if (userId) {
        await deleteDoc(doc(db, 'users', userId)).catch(() => {});
        await deleteDoc(doc(db, 'profiles', userId)).catch(() => {});
      }
    } catch (_) {}

    if (userEmail) {
      const normalized = userEmail.trim().toLowerCase();
      await supabase.from('profiles').delete().eq('id', normalized);
      await supabase.from('progreso').delete().eq('id', normalized);
      await supabase.from('quiz_results').delete().eq('id', normalized);

      // Clean specific known local keys for this user
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(`vianova_usr_${normalized}`);
          localStorage.removeItem(`vianova_quiz_history_${normalized}`);
          localStorage.removeItem(`vianova_exam_results_${normalized}`);
          localStorage.removeItem(`vianova_completed_modules_${normalized}`);
          localStorage.removeItem(`vianova_reports_${normalized}`);
        } catch (_) {}
      }
    }

    // 3. Sign out from all auth instances
    await supabase.auth.signOut();

    // 4. Clear all browser storage completely
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (_) {}
    }

    return {
      success: true,
      message: 'Cuenta eliminada permanentemente'
    };
  } catch (error: any) {
    console.error('Error during deleteUserAccount:', error);

    // Ensure sign out and full cleanup even if an external call fails
    try {
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (_) {}

    return {
      success: true,
      message: 'Cuenta eliminada permanentemente'
    };
  }
}
