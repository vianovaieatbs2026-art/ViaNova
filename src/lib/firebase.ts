import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  sendPasswordResetEmail, 
  verifyPasswordResetCode, 
  confirmPasswordReset,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Read potential Vercel / environment overrides
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;

const resolvedConfig = {
  apiKey: (metaEnv?.VITE_FIREBASE_API_KEY as string) || firebaseConfig.apiKey,
  authDomain: (metaEnv?.VITE_FIREBASE_AUTH_DOMAIN as string) || firebaseConfig.authDomain,
  projectId: (metaEnv?.VITE_FIREBASE_PROJECT_ID as string) || firebaseConfig.projectId,
  storageBucket: (metaEnv?.VITE_FIREBASE_STORAGE_BUCKET as string) || firebaseConfig.storageBucket,
  messagingSenderId: (metaEnv?.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || firebaseConfig.messagingSenderId,
  appId: (metaEnv?.VITE_FIREBASE_APP_ID as string) || firebaseConfig.appId,
};

// Initialize Firebase once with production configuration (strictly no emulator)
const app = getApps().length > 0 ? getApp() : initializeApp(resolvedConfig);

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export function getLastResetEmail(): string {
  if (typeof window === 'undefined') return '';
  try {
    return sessionStorage.getItem('vn_last_reset_email') || '';
  } catch (_) {
    return '';
  }
}

/**
 * Sends a real password reset email containing a secure recovery link.
 * 1. Attempts Firebase Authentication sendPasswordResetEmail.
 * 2. If user is in local database or Firebase requires backend delivery, dispatches via backend email service.
 */
export async function sendPasswordReset(email: string, recipientName?: string): Promise<{ 
  success: boolean; 
  message: string; 
  code?: string;
}> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, message: 'Por favor ingresa una dirección de correo electrónico válida.' };
  }

  // Save last reset email in session for reference
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('vn_last_reset_email', trimmedEmail);
    } catch (_) {}
  }

  // Set Firebase Auth email template language to Spanish
  try {
    auth.languageCode = 'es';
  } catch (_) {}

  // 1. First, attempt Firebase Authentication directly
  try {
    console.log(`[Firebase Auth] Solicitando restablecimiento para: ${trimmedEmail}`);
    await sendPasswordResetEmail(auth, trimmedEmail);
    console.log(`[Firebase Auth] Firebase procesó y envió correo a ${trimmedEmail}`);
    return {
      success: true,
      message: `Hemos enviado el enlace de restablecimiento a ${trimmedEmail}. Por favor revisa tu bandeja de entrada y la carpeta de spam.`
    };
  } catch (fbError: any) {
    console.warn('[Firebase Auth] sendPasswordResetEmail requiere fallback de envío directo:', fbError?.code, fbError?.message);
  }

  // 2. Dispatch real recovery link via backend Express endpoint
  try {
    const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const res = await fetch('/api/send-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: trimmedEmail,
        recipientName: recipientName || '',
        originUrl
      })
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return {
        success: true,
        message: data.message || `Hemos enviado el enlace de restablecimiento a ${trimmedEmail}. Revisa tu bandeja de entrada y la carpeta de spam.`
      };
    } else {
      return {
        success: false,
        message: data.message || 'Error al enviar el correo de recuperación. Por favor verifica las credenciales de correo o intenta más tarde.',
        code: data.code || 'EMAIL_FAILED'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Error de conexión con el servidor. Por favor verifica tu conexión a internet e inténtalo de nuevo.',
      code: 'NETWORK_ERROR'
    };
  }
}

/**
 * Verifies the validity of an action code or recovery link token.
 */
export async function verifyResetCode(code: string, emailCandidate?: string): Promise<{ success: boolean; email?: string; message?: string }> {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return { success: false, message: 'Código o enlace de recuperación no proporcionado.' };
  }

  // 1. First check with backend (handles tokens from the recovery link)
  try {
    const res = await fetch('/api/verify-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: trimmedCode,
        email: emailCandidate || ''
      })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return { success: true, email: data.email || emailCandidate };
    }
  } catch (_) {}

  // 2. Otherwise verify Firebase Auth action code (oobCode from Firebase default emails)
  try {
    const email = await verifyPasswordResetCode(auth, trimmedCode);
    return { success: true, email };
  } catch (error: any) {
    console.error('Firebase verifyPasswordResetCode error:', error);
    let message = 'El enlace de recuperación no es válido o ya fue utilizado.';
    if (error?.code === 'auth/expired-action-code') {
      message = 'Este enlace de recuperación ha expirado. Por favor solicita uno nuevo desde la pantalla de inicio de sesión.';
    } else if (error?.code === 'auth/invalid-action-code') {
      message = 'El enlace de recuperación es inválido o ya ha sido utilizado para cambiar la contraseña.';
    }
    return { success: false, message };
  }
}

/**
 * Confirms and updates the user's password using the verified code or token.
 */
export async function confirmNewPassword(
  code: string, 
  newPassword: string,
  emailCandidate?: string
): Promise<{ success: boolean; message: string }> {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return { success: false, message: 'Código de recuperación ausente.' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' };
  }

  // 1. First try backend
  try {
    const res = await fetch('/api/confirm-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: trimmedCode,
        email: emailCandidate || '',
        newPassword
      })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return {
        success: true,
        message: '¡Tu contraseña ha sido restablecida exitosamente!'
      };
    }
  } catch (_) {}

  // 2. Otherwise confirm via Firebase Auth action code
  try {
    await confirmPasswordReset(auth, trimmedCode, newPassword);
    return {
      success: true,
      message: '¡Tu contraseña ha sido restablecida exitosamente en Firebase Auth!'
    };
  } catch (error: any) {
    console.error('Firebase confirmPasswordReset error:', error);
    let message = 'Error al actualizar la contraseña.';
    if (error?.code === 'auth/weak-password') {
      message = 'La nueva contraseña es demasiado débil. Ingresa al menos 6 caracteres.';
    } else if (error?.code === 'auth/expired-action-code') {
      message = 'El enlace de recuperación ha expirado durante el proceso. Por favor solicita uno nuevo.';
    } else if (error?.code === 'auth/invalid-action-code') {
      message = 'El código de recuperación es inválido o ya fue utilizado.';
    }
    return { success: false, message };
  }
}

/**
 * Attempts authentication with Firebase Auth.
 */
export async function firebaseLogin(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string; code?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    return { success: true, user: cred.user };
  } catch (error: any) {
    return { success: false, error: error?.message, code: error?.code };
  }
}

/**
 * Attempts to register a user account in Firebase Auth.
 */
export async function firebaseRegister(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    return { success: true, user: cred.user };
  } catch (error: any) {
    return { success: false, error: error?.code || error?.message };
  }
}

export default app;
