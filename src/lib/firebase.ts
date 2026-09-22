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
 * Sends a real password reset email via production Firebase Authentication:
 * uses sendPasswordResetEmail(auth, email) without emulators or mock delays.
 * Sets the email template language to Spanish and accurately handles Firebase error codes.
 */
export async function sendPasswordReset(email: string): Promise<{ 
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

  try {
    console.log(`[Firebase Auth Production] Despachando correo de restablecimiento real para: ${trimmedEmail}`);

    // Call real Firebase Authentication sendPasswordResetEmail directly to Google Cloud Identity Platform
    await sendPasswordResetEmail(auth, trimmedEmail);

    console.log(`[Firebase Auth Production] Confirmado: Firebase procesó la solicitud para ${trimmedEmail}`);

    return {
      success: true,
      message: `Firebase Authentication ha procesado y enviado el enlace de restablecimiento a ${trimmedEmail}.`
    };
  } catch (error: any) {
    console.error('[Firebase Auth Production] Error en sendPasswordResetEmail:', error);
    const errorCode = error?.code || '';

    let message = 'Ocurrió un error al contactar Firebase Authentication. Inténtalo de nuevo.';
    if (errorCode === 'auth/user-not-found') {
      message = 'No existe ninguna cuenta registrada con este correo electrónico en Firebase Authentication.';
    } else if (errorCode === 'auth/invalid-email') {
      message = 'El correo electrónico ingresado no tiene un formato válido.';
    } else if (errorCode === 'auth/too-many-requests') {
      message = 'Demasiados intentos de restablecimiento en poco tiempo. Por seguridad, Firebase ha bloqueado temporalmente los envíos a este correo. Espera unos minutos e inténtalo de nuevo.';
    } else if (errorCode === 'auth/operation-not-allowed') {
      message = 'El método de acceso por correo y contraseña no está habilitado en la consola de Firebase. Debes activarlo en Authentication > Sign-in method.';
    } else if (errorCode === 'auth/network-request-failed') {
      message = 'Error de conexión de red al conectar con los servidores de Firebase. Verifica tu conexión a internet.';
    } else if (errorCode === 'auth/unauthorized-continue-uri') {
      message = 'El dominio de la aplicación no está en la lista de dominios autorizados de Firebase Console.';
    } else if (errorCode === 'auth/missing-email') {
      message = 'Por favor ingresa un correo electrónico.';
    } else if (error?.message) {
      message = error.message;
    }

    return {
      success: false,
      message,
      code: errorCode
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
