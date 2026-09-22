import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  sendPasswordResetEmail, 
  verifyPasswordResetCode, 
  confirmPasswordReset,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  ActionCodeSettings
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase once
const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

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
 * Sends a real password reset email via Firebase Authentication:
 * uses sendPasswordResetEmail(auth, email) without invisible reCAPTCHA or fake OTPs.
 * Sets the email template language to Spanish and translates Firebase error codes.
 */
export async function sendPasswordReset(email: string): Promise<{ 
  success: boolean; 
  message: string; 
}> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, message: 'Correo inválido' };
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

  try {
    // Attempt with ActionCodeSettings so the link directs to the application
    let sent = false;
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    if (currentOrigin) {
      try {
        await sendPasswordResetEmail(auth, trimmedEmail, {
          url: currentOrigin,
          handleCodeInApp: true,
        });
        sent = true;
      } catch (acsError) {
        console.warn('[Firebase Auth] sendPasswordResetEmail with ActionCodeSettings fallback:', acsError);
      }
    }

    // Fallback to standard Firebase Auth reset email if ActionCodeSettings is not permitted
    if (!sent) {
      await sendPasswordResetEmail(auth, trimmedEmail);
    }

    return {
      success: true,
      message: 'Revisa tu correo, te enviamos un enlace para restablecer tu contraseña. Revisa también spam.'
    };
  } catch (error: any) {
    console.error('[Firebase Auth] sendPasswordResetEmail error:', error);
    const errorCode = error?.code || '';

    let message = 'Ocurrió un error al enviar el correo. Inténtalo de nuevo.';
    if (errorCode === 'auth/user-not-found') {
      message = 'No existe una cuenta con ese correo';
    } else if (errorCode === 'auth/invalid-email') {
      message = 'Correo inválido';
    } else if (errorCode === 'auth/too-many-requests') {
      message = 'Demasiados intentos, espera unos minutos';
    } else if (errorCode === 'auth/network-request-failed') {
      message = 'Error de red. Verifica tu conexión a internet.';
    } else if (error?.message) {
      message = error.message;
    }

    return {
      success: false,
      message
    };
  }
}

/**
 * Verifies the validity of an action code (oobCode) from a Firebase password reset email link.
 */
export async function verifyResetCode(code: string, _emailCandidate?: string): Promise<{ success: boolean; email?: string; message?: string }> {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return { success: false, message: 'Código o enlace de recuperación no proporcionado.' };
  }

  // Verify Firebase Auth action code (oobCode)
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
 * Confirms and updates the user's password in Firebase Auth using the verified action code (oobCode).
 */
export async function confirmNewPassword(
  code: string, 
  newPassword: string,
  _emailCandidate?: string
): Promise<{ success: boolean; message: string }> {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return { success: false, message: 'Código de recuperación ausente.' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' };
  }

  // Confirm via Firebase Auth action code
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
