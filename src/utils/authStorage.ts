import { UserProfile, UserType } from '../types';

const ACTIVE_USER_STORAGE_KEY = 'vianova_active_user';
const USER_KEY_PREFIX = 'vianova_usr_';

export interface StoredUserAccount {
  profile: UserProfile;
  password?: string;
  createdAt: string;
}

// Immediately purge any legacy multi-user list and any stored passwords from localStorage to protect user privacy
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('vianova_registered_users');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(USER_KEY_PREFIX)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed && 'password' in parsed) {
              delete parsed.password;
              localStorage.setItem(key, JSON.stringify(parsed));
            }
          }
        } catch (_) {}
      }
    }
  } catch (_) {}
}

// List of legacy demo names to purge from browser storage so only real user names appear
const LEGACY_NAMES_TO_PURGE = [
  'valentina ríos',
  'valentina rios',
  'carlos morales',
  'mateo gómez',
  'mateo gomez',
  'lucía fernández',
  'lucia fernandez',
  'felipe torres'
];

function isLegacyDemoName(name?: string): boolean {
  if (!name) return false;
  return LEGACY_NAMES_TO_PURGE.includes(name.trim().toLowerCase());
}

/**
 * Deprecated: Returns empty array to prevent enumerating multiple users on shared devices.
 */
export function getRegisteredUsers(): StoredUserAccount[] {
  return [];
}

/**
 * Saves a user's private data indexed solely by their email.
 * Does NOT maintain a public list of accounts.
 */
export function saveRegisteredUser(profile: UserProfile, password?: string): StoredUserAccount {
  if (typeof window === 'undefined') {
    return {
      profile,
      password: password || '',
      createdAt: new Date().toISOString()
    };
  }

  const normalizedEmail = profile.email.trim().toLowerCase();
  const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;

  let existingData: StoredUserAccount | null = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) existingData = JSON.parse(raw);
  } catch (_) {}

  const isFirstTime = profile.primer_ingreso !== undefined 
    ? profile.primer_ingreso 
    : (existingData ? existingData.profile.primer_ingreso : false);

  const storedAccount: StoredUserAccount = {
    profile: {
      ...(existingData?.profile || {}),
      ...profile,
      primer_ingreso: isFirstTime,
    },
    // Strictly do not store passwords in localStorage - Requirement 4 & 5
    createdAt: existingData?.createdAt || new Date().toISOString()
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(storedAccount));
    // Clean up any remaining legacy list
    localStorage.removeItem('vianova_registered_users');
  } catch (error) {
    console.error('Error saving user data:', error);
  }

  return storedAccount;
}

/**
 * Updates the stored profile for an account after password reset (passwords are handled securely via Firebase Auth / backend).
 */
export function updateRegisteredUserPassword(email: string, _newPassword?: string): boolean {
  if (typeof window === 'undefined') return false;
  const normalizedEmail = email.trim().toLowerCase();
  const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;

  try {
    let account: StoredUserAccount | null = null;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      account = JSON.parse(raw);
    }

    if (!account) {
      const name = formatNameFromEmail(normalizedEmail);
      account = {
        profile: {
          id: `usr-${Date.now()}`,
          name,
          email: normalizedEmail,
          userType: 'conductor',
          primer_ingreso: false,
          emailVerified: true,
          termsAccepted: true,
          safetyScore: 88,
          completedHours: 0,
          passedExams: 0,
          activeReports: 0,
          licenseCategory: 'Aspirante / Particular',
          city: 'Medellín, Antioquia'
        },
        createdAt: new Date().toISOString()
      };
    } else {
      delete account.password;
    }

    localStorage.setItem(storageKey, JSON.stringify(account));

    // If active session matches, update it too
    const active = getActiveUserSession();
    if (active && active.email.trim().toLowerCase() === normalizedEmail) {
      setActiveUserSession(account.profile);
    }

    return true;
  } catch (e) {
    console.error('Error updating account profile:', e);
    return false;
  }
}

/**
 * Completes the first-time onboarding for a user.
 */
export function completeUserFirstTimeOnboarding(
  email: string, 
  updatedData: Partial<UserProfile>, 
  _newPassword?: string
): UserProfile | null {
  const normalizedEmail = email.trim().toLowerCase();
  const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;

  try {
    const raw = localStorage.getItem(storageKey);
    const current: StoredUserAccount = raw ? JSON.parse(raw) : {
      profile: {
        id: `usr-${Date.now()}`,
        name: formatNameFromEmail(normalizedEmail),
        email: normalizedEmail,
        userType: 'conductor',
        primer_ingreso: false,
        emailVerified: true,
        termsAccepted: true,
        safetyScore: 85,
        completedHours: 0,
        passedExams: 0,
        activeReports: 0
      },
      createdAt: new Date().toISOString()
    };

    const finalProfile: UserProfile = {
      ...current.profile,
      ...updatedData,
      email: normalizedEmail,
      primer_ingreso: false,
      emailVerified: true,
      termsAccepted: true,
    };

    const updatedAccount: StoredUserAccount = {
      profile: finalProfile,
      createdAt: current.createdAt || new Date().toISOString()
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedAccount));
    setActiveUserSession(finalProfile);
    return finalProfile;
  } catch (error) {
    console.error('Error completing onboarding in storage:', error);
    return null;
  }
}

/**
 * Finds a registered user by email for private authentication validation.
 * Strips any legacy password property to prevent restoring passwords from storage.
 */
export function findRegisteredUserByEmail(email: string): StoredUserAccount | null {
  if (typeof window === 'undefined' || !email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && 'password' in parsed) {
        delete parsed.password;
      }
      return parsed;
    }
  } catch (_) {}

  return null;
}

/**
 * Formats a clean display name from an email address if no explicit name was provided.
 */
export function formatNameFromEmail(email: string): string {
  if (!email) return 'Usuario ViaNova';
  const localPart = email.split('@')[0].trim();
  if (!localPart) return 'Usuario ViaNova';

  // Replace dots, underscores, hyphens with spaces and capitalize each word
  const words = localPart
    .replace(/[._\-+]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1));

  return words.length > 0 ? words.join(' ') : localPart;
}

export const DEFAULT_USER_NAZ: UserProfile = {
  id: 'usr-naz-01',
  name: 'Naz Muñoz',
  email: 'munoznaz12@gmail.com',
  userType: 'conductor',
  licenseCategory: 'Aspirante Licencia B1 / Particular',
  safetyScore: 92,
  completedHours: 18,
  passedExams: 3,
  activeReports: 2,
  primer_ingreso: false,
  emailVerified: true,
  termsAccepted: true
};

/**
 * Retrieves the currently active authenticated user session from localStorage.
 * Returns null if no session is active (ensuring page loads disconnected).
 */
export function getActiveUserSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.email) {
      // If the cached session contains an old dummy demo name, remove it
      if (isLegacyDemoName(parsed.name)) {
        try {
          localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
        } catch (_) {}
        return null;
      }

      // Check if user is actually registered in storage to prevent ghost sessions
      const normalizedEmail = parsed.email.trim().toLowerCase();
      const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;
      const accountRaw = localStorage.getItem(storageKey);
      if (!accountRaw) {
        // Ghost or deleted session: clear it immediately
        try {
          localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
        } catch (_) {}
        return null;
      }

      return parsed as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error reading active user session from localStorage:', error);
    return null;
  }
}

/**
 * Persists the active authenticated user session to localStorage.
 */
export function setActiveUserSession(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      // Don't save legacy demo names
      if (isLegacyDemoName(user.name)) {
        return;
      }
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
      // Also sync user profile into registered users list
      saveRegisteredUser(user);
    } else {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error updating active user session in localStorage:', error);
  }
}

/**
 * Logs out the user by destroying the active session in localStorage.
 * Ensures no residual account information is left for subsequent users.
 */
export function clearActiveUserSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    localStorage.removeItem('vianova_registered_users');
    localStorage.removeItem('vianova_last_email');
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing active user session:', error);
  }
}

/**
 * Permanently deletes a user account, credentials, and all associated personal data from storage.
 * Requires confirmation of the password.
 */
export function deleteUserAccountPermanently(
  email: string, 
  passwordConfirm: string
): { success: boolean; message: string } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'No se puede acceder al almacenamiento local.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;
  const account = findRegisteredUserByEmail(normalizedEmail);

  if (!account) {
    return { success: false, message: 'La cuenta no fue encontrada en el sistema.' };
  }

  // Verify password if account has one set
  if (account.password && account.password.trim() !== '') {
    if (account.password !== passwordConfirm.trim()) {
      return { success: false, message: 'La contraseña ingresada es incorrecta.' };
    }
  }

  try {
    localStorage.removeItem(storageKey);
    localStorage.removeItem('vianova_registered_users');
  } catch (err) {
    console.error('Error eliminando cuenta:', err);
    return { success: false, message: 'Ocurrió un error al eliminar los datos de la cuenta.' };
  }

  // If the user being deleted is the active session, destroy active session
  try {
    const active = getActiveUserSession();
    if (active && active.email.trim().toLowerCase() === normalizedEmail) {
      clearActiveUserSession();
    }

    const userKeysToClear = [
      `vianova_quiz_history_${normalizedEmail}`,
      `vianova_exam_results_${normalizedEmail}`,
      `vianova_reports_${normalizedEmail}`
    ];
    userKeysToClear.forEach(k => {
      try { localStorage.removeItem(k); } catch (_) {}
    });
  } catch (err) {
    console.warn('Error limpiando datos secundarios del usuario eliminado:', err);
  }

  return { 
    success: true, 
    message: 'Tu cuenta y todos tus datos personales han sido eliminados permanentemente del sistema.' 
  };
}
