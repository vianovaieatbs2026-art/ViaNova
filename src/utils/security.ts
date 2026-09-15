/**
 * Security & Validation Utilities for ViaNova Colombia
 * - Password complexity analysis (min 8 chars, 1 uppercase, 1 number, 1 symbol)
 * - 6-digit email verification token generator
 * - Invisible reCAPTCHA v3 bot verification
 * - Colombian phone format helper
 */

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 100
  strengthLabel: 'Muy Débil' | 'Débil' | 'Media' | 'Fuerte' | 'Muy Fuerte';
  strengthColor: string; // Tailwind color class or hex
  rules: {
    minLength: boolean; // >= 8 chars
    hasUpperCase: boolean; // At least one uppercase letter [A-Z]
    hasNumber: boolean; // At least one number [0-9]
    hasSymbol: boolean; // At least one special symbol
  };
}

/**
 * Validates password strength according to strict security rules:
 * 1. Mínimo 8 caracteres
 * 2. Una letra mayúscula
 * 3. Un número
 * 4. Un símbolo / carácter especial
 */
export function evaluatePasswordStrength(password: string): PasswordValidationResult {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const passedRulesCount = [minLength, hasUpperCase, hasNumber, hasSymbol].filter(Boolean).length;
  
  let score = 0;
  let strengthLabel: PasswordValidationResult['strengthLabel'] = 'Muy Débil';
  let strengthColor = '#ef4444'; // Red

  if (password.length === 0) {
    score = 0;
    strengthLabel = 'Muy Débil';
    strengthColor = '#94a3b8';
  } else if (passedRulesCount === 1) {
    score = 25;
    strengthLabel = 'Débil';
    strengthColor = '#ef4444'; // Red
  } else if (passedRulesCount === 2) {
    score = 50;
    strengthLabel = 'Media';
    strengthColor = '#f59e0b'; // Amber
  } else if (passedRulesCount === 3) {
    score = 75;
    strengthLabel = 'Fuerte';
    strengthColor = '#3b82f6'; // Blue
  } else if (passedRulesCount === 4) {
    score = 100;
    strengthLabel = 'Muy Fuerte';
    strengthColor = '#10b981'; // Emerald Green
  }

  const isValid = minLength && hasUpperCase && hasNumber && hasSymbol;

  return {
    isValid,
    score,
    strengthLabel,
    strengthColor,
    rules: {
      minLength,
      hasUpperCase,
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
