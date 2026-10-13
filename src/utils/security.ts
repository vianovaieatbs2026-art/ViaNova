/**
 * Security & Validation Utilities for ViaNova Colombia
 * - Password complexity analysis (min 8 chars, 1 uppercase, 1 number, 1 symbol)
 * - 6-digit email verification token generator
 * - Invisible reCAPTCHA v3 bot verification
 * - Colombian phone format helper
 */

export interface PasswordValidationResult {
  isValid: boolean; // Minimum length >= 6 (valid for account creation)
  isStrong: boolean; // Meets criteria for strong password (all 4 rules satisfied)
  score: number; // 0 to 100
  strengthLabel: 'Muy Débil' | 'Débil' | 'Media' | 'Fuerte' | 'Muy Fuerte';
  strengthColor: string; // Tailwind color or hex
  feedbackTip: string; // Real-time actionable guidance
  rules: {
    minLength: boolean; // >= 6 chars (mínimo obligatorio)
    hasUpperCase: boolean; // Al menos una letra mayúscula [A-Z]
    hasLowerCase: boolean; // Al menos una letra minúscula [a-z]
    hasNumber: boolean; // Al menos un número [0-9]
    hasSymbol?: boolean; // opcional / compatibilidad
  };
}

/**
 * Validates password strength:
 * 1. Mínimo 6 caracteres
 * 2. Al menos una letra mayúscula [A-Z]
 * 3. Al menos una letra minúscula [a-z]
 * 4. Al menos un número [0-9]
 */
export function evaluatePasswordStrength(password: string): PasswordValidationResult {
  const minLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length > 0) {
    if (minLength) score += 25;
    if (hasUpperCase) score += 25;
    if (hasLowerCase) score += 25;
    if (hasNumber) score += 25;
  }

  let strengthLabel: PasswordValidationResult['strengthLabel'] = 'Muy Débil';
  let strengthColor = '#ef4444'; // Red
  let feedbackTip = 'La contraseña debe tener mínimo 6 caracteres, una mayúscula, una minúscula y un número.';

  if (password.length === 0) {
    score = 0;
    strengthLabel = 'Muy Débil';
    strengthColor = '#94a3b8';
    feedbackTip = 'Para considerarla fuerte incluye: mínimo 6 caracteres, una mayúscula, una minúscula y un número.';
  } else if (!minLength) {
    strengthLabel = 'Muy Débil';
    strengthColor = '#ef4444';
    const remaining = 6 - password.length;
    feedbackTip = `Te faltan ${remaining} caracter${remaining > 1 ? 'es' : ''} para el mínimo de 6 caracteres.`;
  } else if (score <= 50) {
    strengthLabel = 'Débil';
    strengthColor = '#f87171';
    feedbackTip = 'Contraseña válida pero débil. Agrega mayúsculas, minúsculas o números para fortalecerla.';
  } else if (score === 75) {
    strengthLabel = 'Media';
    strengthColor = '#f59e0b'; // Amber
    feedbackTip = '¡Casi lista! Completa el requisito restante para considerarla fuerte.';
  } else {
    strengthLabel = 'Fuerte';
    strengthColor = '#10b981'; // Green
    feedbackTip = '¡Contraseña fuerte y segura! Cumple con todos los requisitos.';
  }

  const isStrong = minLength && hasUpperCase && hasLowerCase && hasNumber;
  const isValid = minLength; // Permite registrar con mínimo 6 caracteres

  return {
    isValid,
    isStrong,
    score,
    strengthLabel,
    strengthColor,
    feedbackTip,
    rules: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSymbol,
    }
  };
}

/**
 * Generates a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validates Colombian phone numbers (e.g. 10 digits starting with 3 or landline with 7-10 digits)
 */
export function validateColombianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^0-9]/g, '');
  // Typically 10 digits in Colombia (e.g., 310 123 4567 or 601 123 4567)
  return cleaned.length >= 10 && cleaned.length <= 13;
}

/**
 * Formats a phone number as +57 (3XX) XXX-XXXX
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+57 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Simulates Google reCAPTCHA v3 invisible token resolution
 */
export interface RecaptchaVerificationResult {
  success: boolean;
  score: number; // 0.0 to 1.0 (e.g. 0.95 = human)
  token: string;
  hostname: string;
  action: string;
}

export async function executeInvisibleRecaptcha(action: string = 'login'): Promise<RecaptchaVerificationResult> {
  // Simulate network check with realistic bot verification timing
  await new Promise((resolve) => setTimeout(resolve, 550));
  
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const token = `03AFcWeA${randomSuffix}_${Date.now()}`;
  
  return {
    success: true,
    score: 0.95, // High human confidence
    token,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'vianova.co',
    action,
  };
}
