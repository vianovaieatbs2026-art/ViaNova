import { UserProfile, UserType } from '../types';

const ACTIVE_USER_STORAGE_KEY = 'vianova_active_user';
const USER_KEY_PREFIX = 'vianova_usr_';

export interface StoredUserAccount {
  profile: UserProfile;
  password?: string;
  createdAt: string;
}

export const DEFAULT_USER_ISABELLA: StoredUserAccount = {
  profile: {
    id: 'usr-isabella-narvaez',
    name: 'Isabella Narváez Petro',
    email: 'narvaezpetroisa@gmail.com',
    phone: '3124567890',
    userType: 'conductor',
    licenseCategory: 'Licencia B1 Particular',
    licenseNumber: 'VN-2026-ISA88',
    safetyScore: 95,
    completedHours: 24,
    passedExams: 4,
    activeReports: 1,
    city: 'Bogotá D.C.',
    primer_ingreso: false,
    emailVerified: true,
    termsAccepted: true
  },
  password: 'Isabella#Narvaez2026!',
  createdAt: '2026-01-15T10:00:00.000Z'
};

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

export const SYSTEM_ACCOUNTS_MAP: Record<string, StoredUserAccount> = {
  'narvaezpetroisa@gmail.com': DEFAULT_USER_ISABELLA,
  'munoznaz12@gmail.com': {
    profile: DEFAULT_USER_NAZ,
    password: 'Naz#Munoz2026!',
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  'vianovaieatbs.2026@gmail.com': {
    profile: {
      id: 'usr-vianova-admin',
      name: 'ViaNova Colombia',
      email: 'vianovaieatbs.2026@gmail.com',
      userType: 'conductor',
      licenseCategory: 'Instructor / Especial',
      safetyScore: 100,
      completedHours: 120,
      passedExams: 10,
      activeReports: 0,
      city: 'Bogotá D.C.',
      primer_ingreso: false,
      emailVerified: true,
      termsAccepted: true
    },
    password: 'ViaNova#2026!',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  'conductor.demo@vianova.edu.co': {
    profile: {
      id: 'usr-demo-01',
      name: 'Carlos Conductor Demo',
      email: 'conductor.demo@vianova.edu.co',
      phone: '3109876543',
      userType: 'conductor',
      licenseCategory: 'Licencia B1 Particular',
      licenseNumber: 'VN-DEMO-2026',
      safetyScore: 90,
      completedHours: 15,
      passedExams: 2,
      activeReports: 1,
      city: 'Bogotá D.C.',
      primer_ingreso: false,
      emailVerified: true,
      termsAccepted: true
    },
    password: 'Demo#ViaNova2026!',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
};

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
 * Persists password for credentials validation.
 */
export function saveRegisteredUser(profile: UserProfile, password?: string): StoredUserAccount {
  const normalizedEmail = profile.email.trim().toLowerCase();
  const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;

  let existingData: StoredUserAccount | null = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) existingData = JSON.parse(raw);
    } catch (_) {}
  }

  const isFirstTime = profile.primer_ingreso !== undefined 
    ? profile.primer_ingreso 
    : (existingData ? existingData.profile.primer_ingreso : false);

  const finalPassword = password || existingData?.password || SYSTEM_ACCOUNTS_MAP[normalizedEmail]?.password;

  const storedAccount: StoredUserAccount = {
    profile: {
      ...(existingData?.profile || {}),
      ...profile,
      primer_ingreso: isFirstTime,
    },
    password: finalPassword,
    createdAt: existingData?.createdAt || new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(storedAccount));
      localStorage.removeItem('vianova_registered_users');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  return storedAccount;
}

/**
 * Updates the stored profile and password for an account after password reset.
 */
export function updateRegisteredUserPassword(email: string, newPassword?: string): boolean {
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
      const systemSeed = SYSTEM_ACCOUNTS_MAP[normalizedEmail];
      if (systemSeed) {
        account = { ...systemSeed };
      } else {
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
            city: 'Bogotá D.C.'
          },
          createdAt: new Date().toISOString()
        };
      }
    }

    if (newPassword && newPassword.trim()) {
      account.password = newPassword.trim();
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
 * Finds a registered user by email for private authentication validation.
 * Initializes official system accounts (such as Isabella Narváez Petro) automatically.
 */
export function findRegisteredUserByEmail(email: string): StoredUserAccount | null {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.profile) {
          // If system account, ensure expected password is preserved
          if (!parsed.password && SYSTEM_ACCOUNTS_MAP[normalizedEmail]) {
            parsed.password = SYSTEM_ACCOUNTS_MAP[normalizedEmail].password;
            try {
              localStorage.setItem(storageKey, JSON.stringify(parsed));
            } catch (_) {}
          }
          return parsed;
        }
      }
    } catch (_) {}
  }

  // Check known system accounts (e.g. Isabella Narváez Petro)
  if (SYSTEM_ACCOUNTS_MAP[normalizedEmail]) {
    const defaultAcc = SYSTEM_ACCOUNTS_MAP[normalizedEmail];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(defaultAcc));
      } catch (_) {}
    }
    return defaultAcc;
  }

  return null;
}

/**
 * Validates a user's password securely against stored credentials.
 */
export function verifyUserPassword(email: string, candidatePassword: string): {
  valid: boolean;
  user?: UserProfile;
  message?: string;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const account = findRegisteredUserByEmail(normalizedEmail);

  if (!account || !account.profile) {
    return {
      valid: false,
      message: 'Debes crear una cuenta primero'
    };
  }

  const expectedPassword = account.password || SYSTEM_ACCOUNTS_MAP[normalizedEmail]?.password;
  const cleanCandidate = (candidatePassword || '').trim();

  if (expectedPassword) {
    if (cleanCandidate === expectedPassword) {
      return {
        valid: true,
        user: account.profile
      };
    } else {
      return {
        valid: false,
        message: 'Contraseña incorrecta. Por favor verifica tus credenciales o solicita restablecer tu contraseña.'
      };
    }
  }

  // Fallback if no password set on account
  return {
    valid: true,
    user: account.profile
  };
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

      // Check if user is actually registered in storage or known system accounts
      const normalizedEmail = parsed.email.trim().toLowerCase();
      const storageKey = `${USER_KEY_PREFIX}${normalizedEmail}`;
      let accountRaw = localStorage.getItem(storageKey);
      
      // If not present in localStorage but is a default system account, seed it
      if (!accountRaw && SYSTEM_ACCOUNTS_MAP[normalizedEmail]) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(SYSTEM_ACCOUNTS_MAP[normalizedEmail]));
          accountRaw = JSON.stringify(SYSTEM_ACCOUNTS_MAP[normalizedEmail]);
        } catch (_) {}
      }

      if (!accountRaw && !SYSTEM_ACCOUNTS_MAP[normalizedEmail]) {
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
