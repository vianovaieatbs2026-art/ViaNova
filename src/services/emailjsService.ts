import emailjs from '@emailjs/browser';

/**
 * ViaNova Colombia - EmailJS Password Recovery Service
 * Implements client-side dispatch of 6-digit verification codes using EmailJS.
 */

export interface EmailJSConfig {
  publicKey: string;
  serviceId: string;
  templateId: string;
}

// Retrieve configured keys from Vite environment variables or localStorage
export function getEmailJSConfig(): EmailJSConfig {
  const envPublicKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY) || '';
  const envServiceId = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID) || '';
  const envTemplateId = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID) || '';

  const storedPublicKey = typeof window !== 'undefined' ? localStorage.getItem('emailjs_public_key') || '' : '';
  const storedServiceId = typeof window !== 'undefined' ? localStorage.getItem('emailjs_service_id') || '' : '';
  const storedTemplateId = typeof window !== 'undefined' ? localStorage.getItem('emailjs_template_id') || '' : '';

  return {
    publicKey: (storedPublicKey || envPublicKey || 'TU_PUBLIC_KEY_AQUI').trim(),
    serviceId: (storedServiceId || envServiceId || 'TU_SERVICE_ID').trim(),
    templateId: (storedTemplateId || envTemplateId || 'TU_TEMPLATE_ID').trim()
  };
}

export function saveEmailJSConfig(config: Partial<EmailJSConfig>): void {
  if (typeof window === 'undefined') return;
  if (config.publicKey !== undefined) {
    localStorage.setItem('emailjs_public_key', config.publicKey.trim());
  }
  if (config.serviceId !== undefined) {
    localStorage.setItem('emailjs_service_id', config.serviceId.trim());
  }
  if (config.templateId !== undefined) {
    localStorage.setItem('emailjs_template_id', config.templateId.trim());
  }
}

export function isEmailJSConfigured(): boolean {
  const config = getEmailJSConfig();
  return Boolean(
    config.publicKey && 
    config.publicKey !== 'TU_PUBLIC_KEY_AQUI' &&
    config.serviceId && 
    config.serviceId !== 'TU_SERVICE_ID' &&
    config.templateId && 
    config.templateId !== 'TU_TEMPLATE_ID'
  );
}

/**
 * Sends a 6-digit recovery code to the specified user email using EmailJS.
 * Persists `codigo_real` and `correo_real` in localStorage exactly as specified.
 */
export async function sendRecoveryCodeViaEmailJS(
  userEmail: string
): Promise<{ success: boolean; code: number; message: string; isRealEmailSent: boolean; error?: string }> {
  const cleanEmail = userEmail.trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Escribe un correo válido.');
  }

  // 1. Genera el código numérico de 6 dígitos
  const codigo = Math.floor(100000 + Math.random() * 900000);

  // 2. Guarda el código y correo en localStorage para verificación posterior
  if (typeof window !== 'undefined') {
    localStorage.setItem('codigo_real', String(codigo));
    localStorage.setItem('correo_real', cleanEmail);
    // Guarda fecha de expiración (15 minutos)
    localStorage.setItem('codigo_real_expira', String(Date.now() + 15 * 60 * 1000));
    localStorage.setItem('codigo_real_usado', 'false');
  }

  const config = getEmailJSConfig();
  const isConfigured = isEmailJSConfigured();

  if (!isConfigured) {
    console.warn('[EmailJS] Llaves pendientes de configurar (TU_PUBLIC_KEY_AQUI / TU_SERVICE_ID / TU_TEMPLATE_ID).');
    return {
      success: true,
      code: codigo,
      isRealEmailSent: false,
      message: `Código ${codigo} generado y listo para verificar. (Configura tus credenciales de EmailJS para el envío a la bandeja de entrada real).`
    };
  }

  try {
    // Inicializar EmailJS con la Public Key
    emailjs.init(config.publicKey);

    // Enviar el correo con los parámetros { to_email, code }
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      {
        to_email: cleanEmail,
        code: codigo
      }
    );

    console.log('[EmailJS] Correo enviado exitosamente:', response);

    return {
      success: true,
      code: codigo,
      isRealEmailSent: true,
      message: `¡Listo! Código ${codigo} enviado a ${cleanEmail}.`
    };
  } catch (error: any) {
    console.error('[EmailJS] Error al enviar:', error);
    // Aunque falle el envío externo de EmailJS (por ejemplo plantilla no publicada), el código está guardado en localStorage
    return {
      success: true,
      code: codigo,
      isRealEmailSent: false,
      error: error?.text || error?.message || 'Error al conectar con EmailJS',
      message: `Código ${codigo} generado. Ocurrió un detalle con EmailJS: ${error?.text || error?.message || 'verifica tus IDs'}.`
    };
  }
}

/**
 * Validates the entered code against the stored `codigo_real` and `correo_real` in localStorage.
 */
export function verifyRecoveryCodeInStorage(
  candidateEmail: string,
  candidateCode: string
): { success: boolean; message: string } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Entorno no soportado.' };
  }

  const storedCode = localStorage.getItem('codigo_real');
  const storedEmail = localStorage.getItem('correo_real');
  const storedExpiry = localStorage.getItem('codigo_real_expira');
  const storedUsed = localStorage.getItem('codigo_real_usado');

  if (storedUsed === 'true') {
    return {
      success: false,
      message: 'Este código de recuperación ya fue utilizado previamente y no puede volver a usarse.'
    };
  }

  if (!storedCode || !storedEmail) {
    return {
      success: false,
      message: 'No hay ningún código activo en espera. Por favor solicita un nuevo código.'
    };
  }

  if (storedExpiry && Date.now() > Number(storedExpiry)) {
    localStorage.removeItem('codigo_real');
    localStorage.removeItem('correo_real');
    localStorage.removeItem('codigo_real_expira');
    return {
      success: false,
      message: 'El código ha expirado (validez de 15 minutos). Por favor solicita uno nuevo.'
    };
  }

  const cleanInputCode = candidateCode.trim().replace(/\D/g, '');
  const cleanCandidateEmail = candidateEmail.trim().toLowerCase();
  const cleanStoredEmail = storedEmail.trim().toLowerCase();

  if (cleanCandidateEmail && cleanStoredEmail && cleanCandidateEmail !== cleanStoredEmail) {
    return {
      success: false,
      message: `El código no corresponde al correo ${candidateEmail}. Fue emitido para ${storedEmail}.`
    };
  }

  if (cleanInputCode !== storedCode.trim()) {
    return {
      success: false,
      message: 'El código de 6 dígitos ingresado es incorrecto.'
    };
  }

  return {
    success: true,
    message: 'Código verificado con éxito.'
  };
}

/**
 * Clears the stored recovery code upon successful password reset.
 */
export function clearRecoveryCodeFromStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('codigo_real_usado', 'true');
  localStorage.removeItem('codigo_real');
  localStorage.removeItem('correo_real');
  localStorage.removeItem('codigo_real_expira');
}
